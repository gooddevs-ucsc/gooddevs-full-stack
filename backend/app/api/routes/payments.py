from app.models import (
    PaymentCreate, PaymentInitiationResponse,
    PayhereCheckoutAPIVerificationResponse, PaymentPublic
)
from app.api.deps import PayHereServiceDep
import logging
from typing import Any, Annotated

from fastapi import APIRouter, Form

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


router = APIRouter(prefix="/payments", tags=["payments"])


@router.post("/initiate", response_model=PaymentInitiationResponse)
def initiate_payment(
    *,
    payhere_service: PayHereServiceDep,
    payment_in: PaymentCreate
) -> Any:
    """
    Initiate a new payment request for PayHere gateway.
    Frontend sends customer details and amount. Backend generates order_id, items, and currency.
    Creates a payment record with PENDING status and returns the payment details
    along with PayHere URLs and hash for frontend to process the payment.
    """
    return payhere_service.initiate_payment(payment_in)


@router.post("/payhere-webhook")
def payhere_webhook(
    *,
    payhere_service: PayHereServiceDep,
    verification_data: Annotated[PayhereCheckoutAPIVerificationResponse,
                                 Form(...)]
) -> bool:
    """
    Handle PayHere webhook notifications.
    """
    return payhere_service.verify_webhook(
        merchant_id=verification_data.merchant_id or "",
        order_id=verification_data.order_id or "",
        amount=verification_data.payhere_amount or "",
        currency=verification_data.payhere_currency or "",
        status_code=verification_data.status_code or "",
        received_hash=verification_data.md5sig or ""
    )


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
