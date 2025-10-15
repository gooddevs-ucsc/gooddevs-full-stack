from app import crud
from app.core.config import settings
from app.models import (
    PaymentCreate, PaymentInitiationResponse, PaymentInitiationPublic,
    PayhereCheckoutAPIVerificationResponse, PaymentStatus, PaymentPublic,
    PayHereRetrievalResponse
)
from app.api.deps import SessionDep, PayHereServiceDep
from app.utils import generate_payhere_hash, verify_payhere_hash
import logging
from typing import Any, Annotated

from fastapi import APIRouter, HTTPException, Form

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


router = APIRouter(prefix="/payments", tags=["payments"])


@router.post("/initiate", response_model=PaymentInitiationResponse)
def initiate_payment(
    *,
    session: SessionDep,
    payment_in: PaymentCreate
) -> Any:
    """
    Initiate a new payment request for PayHere gateway.
    Frontend sends customer details and amount. Backend generates order_id, items, and currency.
    Creates a payment record with PENDING status and returns the payment details
    along with PayHere URLs and hash for frontend to process the payment.
    """
    # Get PayHere configuration from environment
    if not settings.PAYHERE_MERCHANT_ID:
        raise HTTPException(
            status_code=500,
            detail="PayHere merchant ID not configured"
        )

    # Create the payment using CRUD with merchant_id from config
    payment = crud.create_payment(
        session=session,
        payment_in=payment_in,
        merchant_id=settings.PAYHERE_MERCHANT_ID
    )

    merchant_secret = settings.PAYHERE_MERCHANT_SECRET

    payment_hash = generate_payhere_hash(
        settings.PAYHERE_MERCHANT_ID,
        payment.order_id,
        payment.amount,
        payment.currency.value,
        merchant_secret
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


@router.post("/payhere-webhook")
def payhere_webhook(
    *,
    session: SessionDep,
    verification_data: Annotated[PayhereCheckoutAPIVerificationResponse,
                                 Form(...)]
) -> bool:
    """
    Handle PayHere webhook notifications.
    """
    isVerified = verify_payhere_hash(
        merchant_id=verification_data.merchant_id,
        order_id=verification_data.order_id,
        amount=verification_data.payhere_amount,
        currency=verification_data.payhere_currency,
        status_code=verification_data.status_code,
        received_hash=verification_data.md5sig,
        merchant_secret=settings.PAYHERE_MERCHANT_SECRET
    )

    if isVerified and verification_data.order_id and verification_data.status_code:
        # Map PayHere status_code to PaymentStatus enum
        try:
            status_code_int = int(verification_data.status_code)
            payment_status = PaymentStatus(status_code_int)

            # Update payment status in database
            order_id = int(verification_data.order_id)
            crud.update_payment_status(
                session=session,
                order_id=order_id,
                status=payment_status
            )

        except:
            raise HTTPException(status_code=400)
    elif not isVerified:
        raise HTTPException(status_code=400)

    return True


@router.get("/{order_id}", response_model=PaymentPublic)
async def get_payment_by_order_id(
    *,
    payhere_service: PayHereServiceDep,
    order_id: int
) -> Any:
    """
    Get payment details by order_id.

    Args:
        order_id: The order ID to retrieve

    Returns:
        Payment details
    """
    payment = await payhere_service.get_payment_by_order_id(
        order_id=order_id)

    return payment
