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
    PaymentCreate,
    DonationsPublic,
    DonationPublic,
    UserPublic,
    PaymentPublic,
    Meta
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


@router.get("/my-donations", response_model=DonationsPublic, status_code=200)
async def get_my_donations(
    *,
    session: SessionDep,
    payhere_service: PayHereServiceDep,
    current_user: CurrentUser,
    skip: int = 0,
    limit: int = 100
) -> DonationsPublic:
    """
    Get all donations made by the current user, ordered by ID (most recent first).

    This endpoint:
    1. Fetches all donations made by the current user, ordered by order_id descending
    2. For each donation, retrieves payment details from PayHere service
    3. Returns donation data with updated payment status from PayHere

    The payment status is fetched in real-time from PayHere API to ensure accuracy.

    Requires authentication.

    Args:
        skip: Number of records to skip (for pagination)
        limit: Maximum number of records to return

    Returns:
        DonationsPublic: List of donations with payment details and pagination metadata

    Raises:
        HTTPException 401: User not authenticated
        HTTPException 500: Server error while fetching donations
    """
    try:
        # Get donations from database ordered by order_id
        donations = crud.get_donations_by_donor_id(
            session=session,
            donor_id=current_user.id,
            skip=skip,
            limit=limit
        )

        # Get total count for pagination
        total = crud.count_donations_by_donor_id(
            session=session,
            donor_id=current_user.id
        )

        # Fetch payment details for each donation using PayHere service
        # Note: donations are already filtered by SUCCESS/PENDING status at database level
        donations_with_payments = []
        for donation in donations:
            # Use PayHere service to get payment details
            # This will check PayHere API if payment status is PENDING
            payment = await payhere_service.get_payment_by_order_id(donation.order_id)

            if payment:
                # Create DonationPublic with payment and donor info
                donation_public = DonationPublic(
                    id=donation.id,
                    donor_id=donation.donor_id,
                    order_id=donation.order_id,
                    created_at=donation.created_at,
                    message=donation.message,
                    donor=UserPublic(
                        id=current_user.id,
                        email=current_user.email,
                        is_active=current_user.is_active,
                        is_superuser=current_user.is_superuser,
                        firstname=current_user.firstname,
                        lastname=current_user.lastname,
                        role=current_user.role
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
                donations_with_payments.append(donation_public)
            else:
                # If payment not found, log warning and skip
                logger.warning(
                    f"Payment not found for donation {donation.id} with order_id {donation.order_id}"
                )

        # Calculate pagination metadata
        # Total is already filtered by payment status at database level
        total_pages = (total + limit - 1) // limit if limit > 0 else 1
        current_page = (skip // limit) + 1 if limit > 0 else 1

        meta = Meta(
            page=current_page,
            total=total,
            totalPages=total_pages
        )

        logger.info(
            f"Retrieved {len(donations_with_payments)} successful/pending donations for user {current_user.id}"
        )

        return DonationsPublic(
            data=donations_with_payments,
            meta=meta
        )

    except Exception as e:
        logger.error(
            f"Error fetching donations for user {current_user.id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve donations"
        )
