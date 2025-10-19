"""
Sponsorship API Routes

Endpoints for managing sponsorships in the system.
All endpoints require user authentication.

Flow:
1. User calls POST /sponsorships/initiate with recipient_id, amount and optional message
2. Backend creates payment record AND sponsorship record
3. PayHere payment details returned to user
4. User completes payment on PayHere
5. Webhook updates payment status
6. Sponsorship is linked to successful payment via order_id
"""

import logging

from fastapi import APIRouter, HTTPException

from app import crud
from app.api.deps import CurrentUser, SessionDep, PayHereServiceDep
from app.models import (
    SponsorshipCreate,
    PaymentInitiationResponse,
    PaymentCreate,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/sponsorships", tags=["sponsorships"])


@router.post("/initiate", response_model=PaymentInitiationResponse, status_code=201)
def initiate_sponsorship(
    *,
    session: SessionDep,
    payhere_service: PayHereServiceDep,
    current_user: CurrentUser,
    sponsorship_in: SponsorshipCreate
) -> PaymentInitiationResponse:
    """
    Initiate a sponsorship by creating both payment and sponsorship records.

    This endpoint:
    1. Creates a payment record with the sponsorship amount
    2. Creates a sponsorship record linked to the payment (with both sponsor and recipient)
    3. Returns PayHere payment details for user to complete payment

    Requires authentication. User must be logged in to sponsor someone.

    Args:
        sponsorship_in: Sponsorship data including recipient_id, amount and optional message

    Returns:
        PayHere payment initiation details (hash, URLs, order_id, etc.)

    Raises:
        HTTPException 401: User not authenticated
        HTTPException 400: Invalid sponsorship data (e.g., trying to sponsor yourself)
        HTTPException 404: Recipient user not found
    """
    try:
        # Validate recipient exists
        recipient = crud.get_user_by_id(
            session=session, id=sponsorship_in.recipient_id)
        if not recipient:
            raise HTTPException(
                status_code=404,
                detail=f"Recipient user with id {sponsorship_in.recipient_id} not found"
            )

        # Create payment record using user's info and frontend data
        payment_in = PaymentCreate(
            first_name=current_user.firstname or "Sponsor",
            last_name=current_user.lastname or "",
            email=current_user.email,
            phone=sponsorship_in.phone,
            address=sponsorship_in.address,
            city=sponsorship_in.city,
            country=sponsorship_in.country,
            amount=sponsorship_in.amount
        )

        # Initiate payment through PayHere service
        payment_response = payhere_service.initiate_payment(payment_in)

        # Create sponsorship record linked to the payment
        crud.create_sponsorship(
            session=session,
            order_id=payment_response.data.order_id,
            sponsor_id=current_user.id,
            recipient_id=sponsorship_in.recipient_id,
            message=sponsorship_in.message
        )

        logger.info(
            f"Sponsorship initiated: order_id={payment_response.data.order_id} "
            f"by sponsor {current_user.id} for recipient {sponsorship_in.recipient_id}, "
            f"amount={sponsorship_in.amount}"
        )

        return payment_response

    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Failed to initiate sponsorship: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error initiating sponsorship: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Failed to initiate sponsorship")
