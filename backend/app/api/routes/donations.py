"""
Donation API Routes

Endpoints for managing donations in the system.
All endpoints require user authentication.

Flow:
1. User calls POST /donations/initiate with amount and optional message
2. Backend creates payment record AND donation record
3. PayHere payment details returned to user
4. User completes payment on PayHere
5. Webhook updates payment status
6. Donation is linked to successful payment via order_id
"""

import logging

from fastapi import APIRouter, HTTPException

from app import crud
from app.api.deps import CurrentUser, SessionDep, PayHereServiceDep
from app.models import (
    DonationCreate,
    PaymentInitiationResponse,
    PaymentCreate
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/donations", tags=["donations"])


@router.post("/initiate", response_model=PaymentInitiationResponse, status_code=201)
def initiate_donation(
    *,
    session: SessionDep,
    payhere_service: PayHereServiceDep,
    current_user: CurrentUser,
    donation_in: DonationCreate
) -> PaymentInitiationResponse:
    """
    Initiate a donation by creating both payment and donation records.

    This endpoint:
    1. Creates a payment record with the donation amount
    2. Creates a donation record linked to the payment
    3. Returns PayHere payment details for user to complete payment

    Requires authentication. User must be logged in to make a donation.

    Args:
        donation_in: Donation data including amount and optional message

    Returns:
        PayHere payment initiation details (hash, URLs, order_id, etc.)

    Raises:
        HTTPException 401: User not authenticated
        HTTPException 400: Invalid donation data
    """
    try:
        # Create payment record using user's info and frontend data
        payment_in = PaymentCreate(
            first_name=current_user.firstname or "Donor",
            last_name=current_user.lastname or "",
            email=current_user.email,
            phone=donation_in.phone,
            address=donation_in.address,
            city=donation_in.city,
            country=donation_in.country,
            amount=donation_in.amount
        )

        # Initiate payment through PayHere service
        payment_response = payhere_service.initiate_payment(payment_in)

        # Create donation record linked to the payment
        crud.create_donation(
            session=session,
            order_id=payment_response.data.order_id,
            donor_id=current_user.id,
            message=donation_in.message
        )

        logger.info(
            f"Donation initiated: order_id={payment_response.data.order_id} "
            f"by user {current_user.id}, amount={donation_in.amount}"
        )

        return payment_response

    except ValueError as e:
        logger.error(f"Failed to initiate donation: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error initiating donation: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Failed to initiate donation")
