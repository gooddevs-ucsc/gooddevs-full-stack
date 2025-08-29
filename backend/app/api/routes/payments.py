import uuid
import hashlib
from typing import Any

from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import select

from app.api.deps import SessionDep
from app.models import PaymentCreate,  PaymentInitiationResponse, PaymentInitiationPublic
from app.core.config import settings
from app import crud
from app.utils import generate_payhere_hash

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
