"""
Withdrawal API Routes

Endpoints for managing sponsorship withdrawals.
Volunteers can withdraw funds from their received sponsorships.
A 6% fee is deducted from all withdrawals.
"""

import logging
import uuid

from fastapi import APIRouter, HTTPException

from app import crud
from app.api.deps import CurrentUser, SessionDep
from app.models import (
    WithdrawalRequest,
    WithdrawalPublic,
    WithdrawalsPublic,
    WithdrawalBalance,
    UserPublic,
    Meta,
    UserRole,
    PaymentStatus,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/withdrawals", tags=["withdrawals"])


@router.get("/balance", response_model=WithdrawalBalance, status_code=200)
def get_withdrawal_balance(
    *,
    session: SessionDep,
    current_user: CurrentUser
) -> WithdrawalBalance:
    """
    Get withdrawal balance information for the current user.

    Returns:
    - total_received: Total successfully received sponsorships
    - total_withdrawn: Total amount already withdrawn (completed)
    - pending_withdrawals: Total amount in pending withdrawals
    - available_balance: Available balance for withdrawal

    Requires authentication.
    """
    try:
        balance_data = crud.get_withdrawal_balance(
            session=session,
            recipient_id=current_user.id
        )

        return WithdrawalBalance(**balance_data)

    except Exception as e:
        logger.error(
            f"Error fetching withdrawal balance for user {current_user.id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve withdrawal balance"
        )


@router.post("/request", response_model=WithdrawalPublic, status_code=201)
def request_withdrawal(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    withdrawal_request: WithdrawalRequest
) -> WithdrawalPublic:
    """
    Request a withdrawal of sponsorship funds.

    A 6% fee will be deducted from the requested amount.
    The withdrawal must not exceed the available balance.

    Args:
        withdrawal_request: Withdrawal details including amount and bank information

    Returns:
        WithdrawalPublic: Created withdrawal with fee calculation

    Raises:
        HTTPException 400: Invalid withdrawal request (e.g., insufficient balance, invalid amount)
        HTTPException 500: Server error
    """
    try:
        # Validate amount is positive
        if withdrawal_request.amount <= 0:
            raise HTTPException(
                status_code=400,
                detail="Withdrawal amount must be greater than 0"
            )

        # Check available balance
        balance_data = crud.get_withdrawal_balance(
            session=session,
            recipient_id=current_user.id
        )

        available_balance = balance_data["available_balance"]

        if withdrawal_request.amount > available_balance:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient balance. Available: {available_balance:.2f}, Requested: {withdrawal_request.amount:.2f}"
            )

        # Create withdrawal
        withdrawal = crud.create_withdrawal(
            session=session,
            recipient_id=current_user.id,
            amount_requested=withdrawal_request.amount,
            bank_account_number=withdrawal_request.bank_account_number,
            bank_name=withdrawal_request.bank_name,
            account_holder_name=withdrawal_request.account_holder_name,
            fee_percentage=6.0
        )

        logger.info(
            f"Withdrawal requested: id={withdrawal.id}, user={current_user.id}, "
            f"amount={withdrawal_request.amount}, fee={withdrawal.fee_amount}, "
            f"transfer={withdrawal.amount_to_transfer}"
        )

        # Convert to public model with user info
        return WithdrawalPublic(
            id=withdrawal.id,
            recipient_id=withdrawal.recipient_id,
            amount_requested=withdrawal.amount_requested,
            fee_percentage=withdrawal.fee_percentage,
            fee_amount=withdrawal.fee_amount,
            amount_to_transfer=withdrawal.amount_to_transfer,
            bank_account_number=withdrawal.bank_account_number,
            bank_name=withdrawal.bank_name,
            account_holder_name=withdrawal.account_holder_name,
            status=withdrawal.status,
            requested_at=withdrawal.requested_at,
            completed_at=withdrawal.completed_at,
            recipient=UserPublic(
                id=current_user.id,
                email=current_user.email,
                is_active=current_user.is_active,
                is_superuser=current_user.is_superuser,
                firstname=current_user.firstname,
                lastname=current_user.lastname,
                role=current_user.role
            )
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(
            f"Error creating withdrawal for user {current_user.id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to create withdrawal request"
        )


@router.get("/my-withdrawals", response_model=WithdrawalsPublic, status_code=200)
def get_my_withdrawals(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = 0,
    limit: int = 100
) -> WithdrawalsPublic:
    """
    Get all withdrawal requests by the current user.

    Returns withdrawals ordered by requested_at (most recent first).

    Args:
        skip: Number of records to skip (for pagination)
        limit: Maximum number of records to return

    Returns:
        WithdrawalsPublic: List of withdrawals with pagination metadata

    Requires authentication.
    """
    try:
        # Get withdrawals from database
        withdrawals = crud.get_withdrawals_by_recipient(
            session=session,
            recipient_id=current_user.id,
            skip=skip,
            limit=limit
        )

        # Get total count for pagination
        total = crud.count_withdrawals_by_recipient(
            session=session,
            recipient_id=current_user.id
        )

        # Convert to public models
        withdrawals_public = []
        for withdrawal in withdrawals:
            withdrawal_public = WithdrawalPublic(
                id=withdrawal.id,
                recipient_id=withdrawal.recipient_id,
                amount_requested=withdrawal.amount_requested,
                fee_percentage=withdrawal.fee_percentage,
                fee_amount=withdrawal.fee_amount,
                amount_to_transfer=withdrawal.amount_to_transfer,
                bank_account_number=withdrawal.bank_account_number,
                bank_name=withdrawal.bank_name,
                account_holder_name=withdrawal.account_holder_name,
                status=withdrawal.status,
                requested_at=withdrawal.requested_at,
                completed_at=withdrawal.completed_at,
                recipient=UserPublic(
                    id=current_user.id,
                    email=current_user.email,
                    is_active=current_user.is_active,
                    is_superuser=current_user.is_superuser,
                    firstname=current_user.firstname,
                    lastname=current_user.lastname,
                    role=current_user.role
                )
            )
            withdrawals_public.append(withdrawal_public)

        # Calculate pagination metadata
        total_pages = (total + limit - 1) // limit if limit > 0 else 1
        current_page = (skip // limit) + 1 if limit > 0 else 1

        meta = Meta(
            page=current_page,
            total=total,
            totalPages=total_pages
        )

        logger.info(
            f"Retrieved {len(withdrawals_public)} withdrawals for user {current_user.id}")

        return WithdrawalsPublic(
            data=withdrawals_public,
            meta=meta
        )

    except Exception as e:
        logger.error(
            f"Error fetching withdrawals for user {current_user.id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve withdrawals"
        )


@router.post("/{withdrawal_id}/complete", response_model=WithdrawalPublic, status_code=200)
def complete_withdrawal(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    withdrawal_id: uuid.UUID
) -> WithdrawalPublic:
    """
    Mark a withdrawal as completed (ADMIN only or for testing).

    In production, this would be called automatically after processing the bank transfer.
    For now, it's a mock endpoint to simulate completion.

    Args:
        withdrawal_id: UUID of the withdrawal to complete

    Returns:
        WithdrawalPublic: Updated withdrawal

    Raises:
        HTTPException 403: User is not admin
        HTTPException 404: Withdrawal not found
        HTTPException 500: Server error
    """
    try:
        # Only admins can complete withdrawals (or we could allow users for testing)
        if not current_user.is_superuser and current_user.role != UserRole.ADMIN:
            raise HTTPException(
                status_code=403,
                detail="Only administrators can complete withdrawals"
            )

        # Get withdrawal
        withdrawal = crud.get_withdrawal_by_id(
            session=session,
            withdrawal_id=withdrawal_id
        )

        if not withdrawal:
            raise HTTPException(
                status_code=404,
                detail=f"Withdrawal with id {withdrawal_id} not found"
            )

        # Complete the withdrawal
        completed_withdrawal = crud.complete_withdrawal(
            session=session,
            withdrawal_id=withdrawal_id
        )

        logger.info(
            f"Withdrawal {withdrawal_id} marked as completed by admin {current_user.id}")

        # Get recipient user info
        recipient = crud.get_user_by_id(
            session=session, user_id=completed_withdrawal.recipient_id)

        return WithdrawalPublic(
            id=completed_withdrawal.id,
            recipient_id=completed_withdrawal.recipient_id,
            amount_requested=completed_withdrawal.amount_requested,
            fee_percentage=completed_withdrawal.fee_percentage,
            fee_amount=completed_withdrawal.fee_amount,
            amount_to_transfer=completed_withdrawal.amount_to_transfer,
            bank_account_number=completed_withdrawal.bank_account_number,
            bank_name=completed_withdrawal.bank_name,
            account_holder_name=completed_withdrawal.account_holder_name,
            status=completed_withdrawal.status,
            requested_at=completed_withdrawal.requested_at,
            completed_at=completed_withdrawal.completed_at,
            recipient=UserPublic(
                id=recipient.id,
                email=recipient.email,
                is_active=recipient.is_active,
                is_superuser=recipient.is_superuser,
                firstname=recipient.firstname,
                lastname=recipient.lastname,
                role=recipient.role
            ) if recipient else None
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error completing withdrawal {withdrawal_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to complete withdrawal"
        )
