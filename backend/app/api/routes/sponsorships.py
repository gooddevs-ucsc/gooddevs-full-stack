"""
Sponsorship API Routes

Endpoints for managing sponsorships in the system.
All endpoints require user authentication.

Flow:
1. User calls POST /sponsorships/{recipient_id}/initiate with amount and optional message
2. Backend creates payment record AND sponsorship record
3. PayHere payment details returned to user
4. User completes payment on PayHere
5. Webhook updates payment status
6. Sponsorship is linked to successful payment via order_id
"""

import logging
import uuid

from fastapi import APIRouter, HTTPException

from app import crud
from app.api.deps import CurrentUser, SessionDep, PayHereServiceDep
from app.models import (
    SponsorshipCreate,
    PaymentInitiationResponse,
    PaymentCreate,
    UserRole,
    SponsorshipsPublic,
    SponsorshipPublic,
    UserPublic,
    PaymentPublic,
    Meta,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/sponsorships", tags=["sponsorships"])


@router.post("/{recipient_id}/initiate", response_model=PaymentInitiationResponse, status_code=201)
def initiate_sponsorship(
    *,
    session: SessionDep,
    payhere_service: PayHereServiceDep,
    current_user: CurrentUser,
    recipient_id: uuid.UUID,
    sponsorship_in: SponsorshipCreate
) -> PaymentInitiationResponse:
    """
    Initiate a sponsorship by creating both payment and sponsorship records.

    This endpoint:
    1. Validates that the recipient has VOLUNTEER role
    2. Creates a payment record with the sponsorship amount
    3. Creates a sponsorship record linked to the payment (with both sponsor and recipient)
    4. Returns PayHere payment details for user to complete payment

    Requires authentication. User must be logged in to sponsor someone.

    Args:
        recipient_id: UUID of the volunteer to sponsor (path parameter)
        sponsorship_in: Sponsorship data including amount, phone, address, and optional message

    Returns:
        PayHere payment initiation details (hash, URLs, order_id, etc.)

    Raises:
        HTTPException 401: User not authenticated
        HTTPException 400: Invalid sponsorship data (e.g., trying to sponsor yourself, recipient is not a volunteer)
        HTTPException 404: Recipient user not found
    """
    try:
        # Validate recipient exists
        recipient = crud.get_user_by_id(
            session=session, user_id=recipient_id)
        if not recipient:
            raise HTTPException(
                status_code=404,
                detail=f"Recipient user with id {recipient_id} not found"
            )

        # Validate recipient has VOLUNTEER role
        if recipient.role != UserRole.VOLUNTEER:
            raise HTTPException(
                status_code=400,
                detail="Sponsorships can only be made to users with VOLUNTEER role"
            )

        # Validate sponsor is not sponsoring themselves
        if current_user.id == recipient_id:
            raise HTTPException(
                status_code=400,
                detail="Cannot sponsor yourself"
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
            recipient_id=recipient_id,
            message=sponsorship_in.message
        )

        logger.info(
            f"Sponsorship initiated: order_id={payment_response.data.order_id} "
            f"by sponsor {current_user.id} for recipient {recipient_id}, "
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


@router.get("/my-sponsorships", response_model=SponsorshipsPublic, status_code=200)
async def get_my_sponsorships(
    *,
    session: SessionDep,
    payhere_service: PayHereServiceDep,
    current_user: CurrentUser,
    skip: int = 0,
    limit: int = 100
) -> SponsorshipsPublic:
    """
    Get all sponsorships made by the current user, ordered by ID (most recent first).

    This endpoint:
    1. Fetches all sponsorships made by the current user, ordered by order_id descending
    2. For each sponsorship, retrieves payment details from PayHere service
    3. Returns sponsorship data with updated payment status from PayHere

    The payment status is fetched in real-time from PayHere API to ensure accuracy.

    Requires authentication.

    Args:
        skip: Number of records to skip (for pagination)
        limit: Maximum number of records to return

    Returns:
        SponsorshipsPublic: List of sponsorships with payment details and pagination metadata

    Raises:
        HTTPException 401: User not authenticated
        HTTPException 500: Server error while fetching sponsorships
    """
    try:
        # Get sponsorships from database ordered by order_id
        sponsorships = crud.get_sponsorships_by_sponsor_id(
            session=session,
            sponsor_id=current_user.id,
            skip=skip,
            limit=limit
        )

        # Get total count for pagination
        total = crud.count_sponsorships_by_sponsor_id(
            session=session,
            sponsor_id=current_user.id
        )

        # Fetch payment details for each sponsorship using PayHere service
        sponsorships_with_payments = []
        for sponsorship in sponsorships:
            # Use PayHere service to get payment details
            payment = await payhere_service.get_payment_by_order_id(sponsorship.order_id)

            if payment and sponsorship.sponsor and sponsorship.recipient:
                # Create SponsorshipPublic with payment and user info
                sponsorship_public = SponsorshipPublic(
                    id=sponsorship.id,
                    sponsor_id=sponsorship.sponsor_id,
                    recipient_id=sponsorship.recipient_id,
                    order_id=sponsorship.order_id,
                    created_at=sponsorship.created_at,
                    message=sponsorship.message,
                    sponsor=UserPublic(
                        id=sponsorship.sponsor.id,
                        email=sponsorship.sponsor.email,
                        is_active=sponsorship.sponsor.is_active,
                        is_superuser=sponsorship.sponsor.is_superuser,
                        firstname=sponsorship.sponsor.firstname,
                        lastname=sponsorship.sponsor.lastname,
                        role=sponsorship.sponsor.role
                    ),
                    recipient=UserPublic(
                        id=sponsorship.recipient.id,
                        email=sponsorship.recipient.email,
                        is_active=sponsorship.recipient.is_active,
                        is_superuser=sponsorship.recipient.is_superuser,
                        firstname=sponsorship.recipient.firstname,
                        lastname=sponsorship.recipient.lastname,
                        role=sponsorship.recipient.role
                    ),
                    payment=PaymentPublic(
                        id=payment.id,
                        merchant_id=payment.merchant_id,
                        first_name=payment.first_name,
                        last_name=payment.last_name,
                        email=payment.email,
                        phone=payment.phone,
                        address=payment.address,
                        city=payment.city,
                        country=payment.country,
                        order_id=payment.order_id,
                        items=payment.items,
                        currency=payment.currency,
                        amount=payment.amount,
                        status=payment.status,
                        created_at=payment.created_at,
                        updated_at=payment.updated_at
                    )
                )
                sponsorships_with_payments.append(sponsorship_public)
            else:
                # If payment or users not found, log warning and skip
                logger.warning(
                    f"Payment or users not found for sponsorship {sponsorship.id} with order_id {sponsorship.order_id}"
                )

        # Calculate pagination metadata
        total_pages = (total + limit - 1) // limit if limit > 0 else 1
        current_page = (skip // limit) + 1 if limit > 0 else 1

        meta = Meta(
            page=current_page,
            total=total,
            totalPages=total_pages
        )

        logger.info(
            f"Retrieved {len(sponsorships_with_payments)} successful/pending sponsorships for user {current_user.id}"
        )

        return SponsorshipsPublic(
            data=sponsorships_with_payments,
            meta=meta
        )

    except Exception as e:
        logger.error(
            f"Error fetching sponsorships for user {current_user.id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve sponsorships"
        )
