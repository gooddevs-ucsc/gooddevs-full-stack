"""
PayHere Retrieval API Service

This service handles OAuth authentication and payment retrieval from PayHere.
Implements token caching to minimize API calls.
"""

import base64
import hashlib
import httpx
import logging
from datetime import datetime, timedelta
from typing import Optional
from fastapi import HTTPException
from sqlmodel import Session

from app import crud
from app.core.config import settings
from app.models import PayHereRetrievalResponse, PaymentCreate, PaymentInitiationResponse, PaymentInitiationPublic

logger = logging.getLogger(__name__)


class PayHereTokenCache:
    """Simple in-memory token cache"""
    _token: Optional[str] = None
    _expires_at: Optional[datetime] = None

    @classmethod
    def get_token(cls) -> Optional[str]:
        """Get cached token if not expired"""
        if cls._token and cls._expires_at and datetime.utcnow() < cls._expires_at:
            return cls._token
        return None

    @classmethod
    def set_token(cls, token: str, expires_in: int):
        """Cache token with expiration time (in seconds)"""
        cls._token = token
        # Subtract 60 seconds as safety margin
        cls._expires_at = datetime.utcnow() + timedelta(seconds=expires_in - 60)


class PayHereService:
    """Service for interacting with PayHere Retrieval API"""

    def __init__(self, session: Session):
        self.app_id = settings.PAYHERE_APP_ID
        self.app_secret = settings.PAYHERE_APP_SECRET
        self.token_url = settings.PAYHERE_TOKEN_URL
        self.retrieval_url = settings.PAYHERE_RETRIEVAL_URL
        self.merchant_id = settings.PAYHERE_MERCHANT_ID
        self.merchant_secret = settings.PAYHERE_MERCHANT_SECRET
        self.session = session

        if not self.app_id or not self.app_secret:
            logger.warning("PayHere API credentials not configured")

    def _generate_authorization_code(self) -> str:
        """
        Generate Base64 encoded authorization code from App ID and App Secret.
        Format: base64(app_id:app_secret)

        Returns:
            Base64 encoded authorization code
        """
        credentials = f"{self.app_id}:{self.app_secret}"
        encoded = base64.b64encode(credentials.encode()).decode()
        return encoded

    async def _get_access_token(self) -> str:
        """
        Retrieve OAuth access token from PayHere.
        Uses cached token if available and not expired.

        Returns:
            Access token string

        Raises:
            HTTPException: If token retrieval fails
        """
        # Check cache first
        cached_token = PayHereTokenCache.get_token()
        if cached_token:
            logger.info("Using cached PayHere access token")
            return cached_token

        # Generate authorization code
        auth_code = self._generate_authorization_code()

        headers = {
            "Authorization": f"Basic {auth_code}",
            "Content-Type": "application/x-www-form-urlencoded"
        }

        data = {
            "grant_type": "client_credentials"
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.token_url,
                    headers=headers,
                    data=data,
                    timeout=30.0
                )

                if response.status_code != 200:
                    logger.error(
                        f"Failed to get PayHere access token: {response.text}")
                    raise HTTPException(
                        status_code=response.status_code,
                        detail=f"Failed to retrieve PayHere access token: {response.text}"
                    )

                token_data = response.json()
                access_token = token_data.get("access_token")
                expires_in = token_data.get("expires_in", 599)

                if not access_token:
                    logger.error("No access token in PayHere response")
                    raise HTTPException(
                        status_code=500,
                        detail="Something went wrong while verifying payments"
                    )

                # Cache the token
                PayHereTokenCache.set_token(access_token, expires_in)
                logger.info(
                    "Successfully retrieved and cached PayHere access token")

                return access_token

        except httpx.RequestError as e:
            logger.error(
                f"Network error while getting PayHere token: {str(e)}")
            raise HTTPException(
                status_code=503,
                detail="Service temporarily unavailable"
            )

    async def _retrieve_payment_details(self, order_id: str) -> PayHereRetrievalResponse:
        """
        Retrieve payment details from PayHere Retrieval API.

        Args:
            order_id: The order ID to search for

        Returns:
            PayHereRetrievalResponse object with payment details

        Raises:
            HTTPException: If retrieval fails or payment not found
        """
        if not self.app_id or not self.app_secret:
            logger.error("PayHere API credentials not configured")
            raise HTTPException(
                status_code=503,
                detail="Payment verification service temporarily unavailable"
            )

        # Get access token
        access_token = await self._get_access_token()

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }

        params = {
            "order_id": order_id
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    self.retrieval_url,
                    headers=headers,
                    params=params,
                    timeout=30.0
                )

                if response.status_code != 200:
                    logger.error(
                        f"PayHere retrieval API error: {response.text}")
                    raise HTTPException(
                        status_code=response.status_code,
                        detail=f"Failed to retrieve payment details"
                    )

                data = response.json()

                # Check response status
                status = data.get("status")

                if status == -1:
                    # No payments found
                    raise HTTPException(
                        status_code=404,
                        detail=f"No payments found for order ID: {order_id}"
                    )
                elif status == -2:
                    # Authentication error
                    logger.error("Authentication error with PayHere API")
                    raise HTTPException(
                        status_code=503,
                        detail="Payment verification service temporarily unavailable"
                    )
                elif status == 1:
                    # Payment found successfully
                    logger.info(
                        f"Successfully retrieved payment details for order {order_id}")
                    # Parse response into PayHereRetrievalResponse object
                    payhere_response = PayHereRetrievalResponse(**data)
                    return payhere_response
                else:
                    # Unknown status
                    raise HTTPException(
                        status_code=500,
                        detail=f"Something went wrong while verifying payments"
                    )

        except httpx.RequestError as e:
            logger.error(f"Network error while retrieving payment: {str(e)}")
            raise HTTPException(
                status_code=503,
                detail="Payment verification service temporarily unavailable"
            )
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Something went wrong while verifying payments"
            )

    async def get_payment_by_order_id(self, order_id: int) -> Optional[crud.Payment]:
        # Step 1: Check database for payment
        payment = crud.get_payment_by_order_id(
            session=self.session, order_id=order_id)

        if not payment:
            return None

        # Step 2: If status is PENDING, verify with PayHere API
        if payment.status == crud.PaymentStatus.PENDING:
            try:
                payhere_response = await self._retrieve_payment_details(str(order_id))
                if payhere_response.data and len(payhere_response.data) > 0:
                    payment_data = payhere_response.data[0]
                    payhere_status = payment_data.status

                    local_status = self._map_payhere_retrieval_status_to_local(
                        payhere_status)
                    local_payment_status = crud.PaymentStatus(local_status)

                    # Step 3: Update payment status in database if changed
                    if local_payment_status != payment.status:
                        updated_payment = crud.update_payment_status(
                            session=self.session,
                            order_id=order_id,
                            status=local_payment_status
                        )
                        if updated_payment:
                            payment = updated_payment
                            logger.info(
                                f"updated payment: {payment}")

                else:
                    logger.warning(
                        f"No payment data returned from PayHere for order {order_id}")

            except HTTPException as e:
                # If payment not found in PayHere (404), keep current status
                if e.status_code == 404:
                    logger.warning(
                        f"Payment with order_id {order_id} not found in PayHere")
                else:
                    # For other errors, log and return None
                    logger.error(
                        f"Error retrieving payment from PayHere: {e.detail}")
                    return None
            except Exception as e:
                logger.error(
                    f"Unexpected error checking PayHere API: {str(e)}")

                return None
        # Step 4: Return payment details
        return payment

    def _map_payhere_retrieval_status_to_local(self, payhere_status: str) -> int:
        """
        Map PayHere payment status to local PaymentStatus enum.

        PayHere statuses:
        - RECEIVED: Payment successfully received
        - REFUND REQUESTED: Refund request received
        - REFUND PROCESSING: Refund being processed
        - REFUNDED: Refund completed
        - CHARGEBACKED: Payment chargebacked

        Local PaymentStatus:
        - PENDING = 0
        - CANCELLED = -1
        - FAILED = -2
        - CHARGEDBACK = -3
        - SUCCESS = 2

        Args:
            payhere_status: Status string from PayHere API

        Returns:
            Local PaymentStatus enum value
        """
        status_mapping = {
            "RECEIVED": 2,  # SUCCESS
            "REFUND REQUESTED": -1,  # CANCELLED
            "REFUND PROCESSING": -1,  # CANCELLED
            "REFUNDED": -1,  # CANCELLED
            "CHARGEBACKED": -3,  # CHARGEDBACK
        }

        # Default to PENDING
        return status_mapping.get(payhere_status.upper(), 0)

    def _generate_payhere_hash(
        self,
        merchant_id: str,
        order_id: str,
        amount: float,
        currency: str
    ) -> str:
        """
        Generate MD5 hash for PayHere payment gateway verification.

        Args:
            merchant_id: Merchant ID
            order_id: Order ID
            amount: Payment amount
            currency: Currency code

        Returns:
            Uppercase MD5 hash string
        """
        if not self.merchant_secret:
            raise HTTPException(
                status_code=500,
                detail="PayHere merchant secret not configured"
            )

        # Inner hash (uppercase MD5 of merchant_secret)
        inner_hash = hashlib.md5(
            self.merchant_secret.encode()).hexdigest().upper()

        # Concatenate string
        data = f"{merchant_id}{order_id}{amount:.2f}{currency}{inner_hash}"

        # Outer hash (uppercase MD5 of the whole string)
        final_hash = hashlib.md5(data.encode()).hexdigest().upper()

        return final_hash

    def _verify_payhere_hash(
        self,
        merchant_id: str,
        order_id: str,
        amount: float,
        currency: str,
        status_code: str,
        received_hash: str
    ) -> bool:
        """
        Verify the received MD5 hash from PayHere against the expected hash.

        Args:
            merchant_id: Merchant ID
            order_id: Order ID
            amount: Payment amount
            currency: Currency code
            status_code: Payment status code
            received_hash: Hash received from PayHere

        Returns:
            True if hashes match, False otherwise
        """
        if not self.merchant_secret:
            logger.error("PayHere merchant secret not configured")
            return False

        inner_hash = hashlib.md5(
            self.merchant_secret.encode()).hexdigest().upper()

        expected_hash = hashlib.md5(
            f"{merchant_id}{order_id}{amount}{currency}{status_code}{inner_hash}".encode()
        ).hexdigest().upper()

        return expected_hash == received_hash

    def initiate_payment(self, payment_in: PaymentCreate) -> PaymentInitiationResponse:
        """
        Initiate a new payment request for PayHere gateway.
        Creates a payment record with PENDING status and returns the payment details
        along with PayHere URLs and hash for frontend to process the payment.

        Args:
            payment_in: Payment creation data from frontend

        Returns:
            PaymentInitiationResponse with payment details and PayHere configuration

        Raises:
            HTTPException: If merchant credentials are not configured
        """
        # Validate PayHere configuration
        if not self.merchant_id:
            logger.warning("PayHere merchant ID not configured")
            raise HTTPException(
                status_code=503,
                detail="Payment service temporarily unavailable"
            )

        # Create the payment using CRUD with merchant_id from config
        payment = crud.create_payment(
            session=self.session,
            payment_in=payment_in,
            merchant_id=self.merchant_id
        )

        # Generate PayHere hash
        payment_hash = self._generate_payhere_hash(
            merchant_id=self.merchant_id,
            order_id=str(payment.order_id),
            amount=payment.amount,
            currency=payment.currency.value
        )

        return PaymentInitiationResponse(
            data=PaymentInitiationPublic(
                **payment.model_dump(exclude={"id", "status", "created_at", "updated_at"}),
                return_url=settings.PAYHERE_DEFAULT_RETURN_URL or "",
                cancel_url=settings.PAYHERE_DEFAULT_CANCEL_URL or "",
                notify_url=settings.PAYHERE_DEFAULT_NOTIFY_URL or "",
                hash=payment_hash
            )
        )

    def verify_webhook(
        self,
        merchant_id: str,
        order_id: str,
        amount: str,
        currency: str,
        status_code: str,
        received_hash: str
    ) -> bool:
        """
        Handle PayHere webhook notifications.
        Verifies the hash and updates payment status in the database.

        Args:
            merchant_id: Merchant ID from webhook
            order_id: Order ID from webhook
            amount: Payment amount from webhook
            currency: Currency code from webhook
            status_code: Payment status code from webhook
            received_hash: MD5 hash received from PayHere

        Returns:
            True if verification and update successful

        Raises:
            HTTPException: If verification fails or update fails
        """
        # Verify the hash
        is_verified = self._verify_payhere_hash(
            merchant_id=merchant_id,
            order_id=order_id,
            amount=float(amount),
            currency=currency,
            status_code=status_code,
            received_hash=received_hash
        )

        if not is_verified:
            logger.error(
                f"PayHere webhook hash verification failed for order {order_id}")
            raise HTTPException(
                status_code=400,
                detail="Hash verification failed"
            )

        if not order_id or not status_code:
            logger.error("Missing required fields in webhook data")
            raise HTTPException(
                status_code=400,
                detail="Missing required fields"
            )

        # Map PayHere status_code to PaymentStatus enum
        try:
            status_code_int = int(status_code)
            payment_status = crud.PaymentStatus(status_code_int)

            # Update payment status in database
            order_id_int = int(order_id)
            updated_payment = crud.update_payment_status(
                session=self.session,
                order_id=order_id_int,
                status=payment_status
            )

            if not updated_payment:
                logger.error(
                    f"Failed to update payment status for order {order_id}")
                raise HTTPException(
                    status_code=400,
                    detail="Failed to update payment status"
                )

            logger.info(
                f"Successfully updated payment status for order {order_id} to {payment_status}")
            return True

        except ValueError as e:
            logger.error(f"Invalid status code or order ID: {e}")
            raise HTTPException(
                status_code=400,
                detail="Invalid status code or order ID"
            )
