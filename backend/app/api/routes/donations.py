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
    Meta,
    UserRole,
    DonationStatistics
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


@router.get("/all", response_model=DonationsPublic, status_code=200)
async def get_all_donations_admin(
    *,
    session: SessionDep,
    payhere_service: PayHereServiceDep,
    current_user: CurrentUser,
    skip: int = 0,
    limit: int = 100
) -> DonationsPublic:
    """
    Get all donations in the system (Admin only).

    This endpoint:
    1. Verifies the user is an admin
    2. Fetches all donations ordered by order_id descending
    3. For each donation, retrieves payment details from PayHere service
    4. Returns donation data with updated payment status from PayHere

    Only accessible to users with ADMIN role.

    Args:
        skip: Number of records to skip (for pagination)
        limit: Maximum number of records to return

    Returns:
        DonationsPublic: List of all donations with payment details and pagination metadata

    Raises:
        HTTPException 401: User not authenticated
        HTTPException 403: User is not an admin
        HTTPException 500: Server error while fetching donations
    """
    # Check if user is admin
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Only administrators can view all donations"
        )

    try:
        # Get all donations from database ordered by order_id
        donations = crud.get_all_donations(
            session=session,
            skip=skip,
            limit=limit
        )

        # Get total count for pagination
        total = crud.count_all_donations(session=session)

        # Fetch payment details for each donation using PayHere service
        donations_with_payments = []
        for donation in donations:
            # Use PayHere service to get payment details
            payment = await payhere_service.get_payment_by_order_id(donation.order_id)

            if payment and donation.donor:
                # Create DonationPublic with payment and donor info
                donation_public = DonationPublic(
                    id=donation.id,
                    donor_id=donation.donor_id,
                    order_id=donation.order_id,
                    created_at=donation.created_at,
                    message=donation.message,
                    donor=UserPublic(
                        id=donation.donor.id,
                        email=donation.donor.email,
                        is_active=donation.donor.is_active,
                        is_superuser=donation.donor.is_superuser,
                        firstname=donation.donor.firstname,
                        lastname=donation.donor.lastname,
                        role=donation.donor.role
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
                # If payment or donor not found, log warning and skip
                logger.warning(
                    f"Payment or donor not found for donation {donation.id} with order_id {donation.order_id}"
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
            f"Admin {current_user.id} retrieved {len(donations_with_payments)} donations"
        )

        return DonationsPublic(
            data=donations_with_payments,
            meta=meta
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(
            f"Error fetching all donations for admin {current_user.id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve donations"
        )


@router.get("/statistics", response_model=DonationStatistics, status_code=200)
def get_donation_statistics(
    *,
    session: SessionDep,
    current_user: CurrentUser
) -> DonationStatistics:
    """
    Get donation statistics and reports (Admin only).

    This endpoint:
    1. Verifies the user is an admin
    2. Calculates various donation statistics:
       - Total number of donations
       - Total donation amount
       - Average donation amount
       - Number of pending donations
       - Number of successful donations
       - Number of unique donors

    Only accessible to users with ADMIN role.

    Returns:
        DonationStatistics: Model containing donation statistics

    Raises:
        HTTPException 401: User not authenticated
        HTTPException 403: User is not an admin
        HTTPException 500: Server error while calculating statistics
    """
    # Check if user is admin
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Only administrators can view donation statistics"
        )

    try:
        statistics = crud.get_donation_statistics(session=session)

        logger.info(
            f"Admin {current_user.id} retrieved donation statistics"
        )

        return statistics

    except Exception as e:
        logger.error(
            f"Error fetching donation statistics for admin {current_user.id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve donation statistics"
        )
