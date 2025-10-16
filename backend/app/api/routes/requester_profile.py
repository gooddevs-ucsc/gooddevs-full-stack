from typing import Any
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query
from sqlmodel import select

from app.api.deps import CurrentUser, SessionDep
from app.models import (
    RequesterProfile,
    RequesterProfileCreate,
    RequesterProfileUpdate,
    RequesterProfilePublic,
    RequesterProfileResponse,
    RequesterProfilesPublic,
    UserRole
)
import app.crud as crud

router = APIRouter()


@router.get("/", response_model=RequesterProfileResponse)
def get_my_requester_profile(
    session: SessionDep, current_user: CurrentUser
) -> Any:
    """
    Get current user's requester profile.
    """
    if current_user.role != UserRole.REQUESTER:
        raise HTTPException(
            status_code=403,
            detail="Only users with REQUESTER role can access requester profile"
        )
    
    profile = crud.get_requester_profile_by_user_id(
        session=session, user_id=current_user.id
    )
    
    if not profile:
        # Create default profile if doesn't exist
        profile_create = RequesterProfileCreate(
            about=f"Welcome to {current_user.firstname} {current_user.lastname}'s profile.",
            tagline=f"{current_user.firstname} {current_user.lastname}",
            location="Add your location here",
        )
        profile = crud.create_requester_profile(
            session=session, 
            profile_in=profile_create,
            user_id=current_user.id
        )
    
    return RequesterProfileResponse(data=profile)


@router.put("/", response_model=RequesterProfileResponse)
def update_my_requester_profile(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    profile_in: RequesterProfileUpdate
) -> Any:
    """
    Update current user's requester profile.
    """
    if current_user.role != UserRole.REQUESTER:
        raise HTTPException(
            status_code=403,
            detail="Only users with REQUESTER role can update requester profile"
        )
    
    # Get existing profile
    existing_profile = crud.get_requester_profile_by_user_id(
        session=session, user_id=current_user.id
    )
    
    if not existing_profile:
        # Create profile if doesn't exist
        profile_create = RequesterProfileCreate(**profile_in.model_dump(exclude_unset=True))
        profile = crud.create_requester_profile(
            session=session,
            profile_in=profile_create,
            user_id=current_user.id
        )
    else:
        # Get the database object for update
        db_profile = session.get(RequesterProfile, existing_profile.id)
        if not db_profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        profile = crud.update_requester_profile(
            session=session,
            db_profile=db_profile,
            profile_in=profile_in
        )
    
    return RequesterProfileResponse(data=profile)


@router.get("/{profile_id}", response_model=RequesterProfileResponse)
def get_requester_profile_by_id(
    profile_id: UUID, session: SessionDep
) -> Any:
    """
    Get requester profile by ID (public view).
    """
    profile = crud.get_requester_profile(session=session, profile_id=profile_id)
    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Requester profile not found"
        )
    
    return RequesterProfileResponse(data=profile)


@router.get("/user/{user_id}", response_model=RequesterProfileResponse)
def get_requester_profile_by_user_id_public(
    user_id: UUID, session: SessionDep
) -> Any:
    """
    Get requester profile by user ID (public view).
    """
    profile = crud.get_requester_profile_by_user_id(
        session=session, user_id=user_id
    )
    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Requester profile not found"
        )
    
    return RequesterProfileResponse(data=profile)


@router.get("/", response_model=RequesterProfilesPublic)
def get_all_requester_profiles(
    session: SessionDep,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
) -> Any:
    """
    Get all requester profiles (public view with pagination).
    """
    skip = (page - 1) * limit
    profiles, count = crud.get_requester_profiles(
        session=session, skip=skip, limit=limit
    )
    
    return RequesterProfilesPublic(data=profiles, count=count)


@router.get("/search/", response_model=RequesterProfilesPublic)
def search_requester_profiles(
    session: SessionDep,
    q: str | None = Query(None, description="Search query"),
    location: str | None = Query(None, description="Filter by location"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
) -> Any:
    """
    Search requester profiles by query and filters.
    """
    skip = (page - 1) * limit
    profiles, count = crud.search_requester_profiles(
        session=session,
        search_query=q,
        location=location,
        skip=skip,
        limit=limit
    )
    
    return RequesterProfilesPublic(data=profiles, count=count)


@router.get("/stats")
def get_my_organization_stats(
    session: SessionDep, current_user: CurrentUser
) -> Any:
    """
    Get Requester statistics for dashboard.
    """
    if current_user.role != UserRole.REQUESTER:
        raise HTTPException(
            status_code=403,
            detail="Only users with REQUESTER role can access Requester stats"
        )
    
    stats = crud.get_requester_profile_stats(session=session, user_id=current_user.id)
    
    # Add user info
    stats.update({
        "organization_name": f"{current_user.firstname} {current_user.lastname}",
        "member_since": current_user.created_at.strftime("%B %Y") if hasattr(current_user, 'created_at') else "Recently"
    })
    
    return stats


@router.post("/", response_model=RequesterProfileResponse)
def create_requester_profile(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    profile_in: RequesterProfileCreate
) -> Any:
    """
    Create requester profile.
    """
    if current_user.role != UserRole.REQUESTER:
        raise HTTPException(
            status_code=403,
            detail="Only users with REQUESTER role can create requester profile"
        )
    
    # Check if profile already exists
    existing_profile = crud.get_requester_profile_by_user_id(
        session=session, user_id=current_user.id
    )
    if existing_profile:
        raise HTTPException(
            status_code=400,
            detail="Requester profile already exists for this user"
        )
    
    profile = crud.create_requester_profile(
        session=session,
        profile_in=profile_in,
        user_id=current_user.id
    )
    
    return RequesterProfileResponse(data=profile)


@router.delete("/")
def delete_my_requester_profile(
    session: SessionDep, current_user: CurrentUser
) -> Any:
    """
    Delete current user's requester profile.
    """
    if current_user.role != UserRole.REQUESTER:
        raise HTTPException(
            status_code=403,
            detail="Only users with REQUESTER role can delete requester profile"
        )
    
    profile = crud.get_requester_profile_by_user_id(
        session=session, user_id=current_user.id
    )
    
    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Requester profile not found"
        )
    
    success = crud.delete_requester_profile(session=session, profile_id=profile.id)
    
    if not success:
        raise HTTPException(
            status_code=500,
            detail="Failed to delete requester profile"
        )
    
    return {"message": "Requester profile deleted successfully"}