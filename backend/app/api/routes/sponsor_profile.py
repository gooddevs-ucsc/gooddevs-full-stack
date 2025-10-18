from typing import Any
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, UploadFile, File
from sqlmodel import select

from app.api.deps import CurrentUser, SessionDep
from app.models import (
    SponsorProfile,
    SponsorProfileCreate,
    SponsorProfileUpdate,
    SponsorProfilePublic,
    SponsorProfileResponse,
    SponsorProfilesPublic,
    UserRole
)
import app.crud as crud
from app.core.cloudinary_utils import upload_image_to_cloudinary

router = APIRouter()

@router.get("/", response_model=SponsorProfileResponse)
def get_my_sponsor_profile(
    session: SessionDep, current_user: CurrentUser
) -> Any:
    """
    Get current user's sponsor profile.
    """
    if current_user.role != UserRole.SPONSOR:
        raise HTTPException(
            status_code=403,
            detail="Only users with SPONSOR role can access sponsor profile"
        )
    
    profile = crud.get_sponsor_profile_by_user_id(
        session=session, user_id=current_user.id
    )
    
    if not profile:
        profile_create = SponsorProfileCreate(
            about=f"Welcome to {current_user.firstname} {current_user.lastname}'s profile.",
            tagline=f"{current_user.firstname} {current_user.lastname}",
            location="Add your location here",
        )
        profile = crud.create_sponsor_profile(
            session=session, 
            profile_in=profile_create,
            user_id=current_user.id
        )
    
    return SponsorProfileResponse(data=profile)

@router.put("/", response_model=SponsorProfileResponse)
def update_my_sponsor_profile(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    profile_in: SponsorProfileUpdate
) -> Any:
    """
    Update current user's sponsor profile.
    """
    if current_user.role != UserRole.SPONSOR:
        raise HTTPException(
            status_code=403,
            detail="Only users with SPONSOR role can update sponsor profile"
        )
    
    existing_profile = crud.get_sponsor_profile_by_user_id(
        session=session, user_id=current_user.id
    )
    
    if not existing_profile:
        profile_create = SponsorProfileCreate(**profile_in.model_dump(exclude_unset=True))
        profile = crud.create_sponsor_profile(
            session=session,
            profile_in=profile_create,
            user_id=current_user.id
        )
    else:
        db_profile = session.get(SponsorProfile, existing_profile.id)
        if not db_profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        profile = crud.update_sponsor_profile(
            session=session,
            db_profile=db_profile,
            profile_in=profile_in
        )
    
    return SponsorProfileResponse(data=profile)

@router.get("/{profile_id}", response_model=SponsorProfileResponse)
def get_sponsor_profile_by_id(
    profile_id: UUID, session: SessionDep
) -> Any:
    """
    Get sponsor profile by ID (public view).
    """
    profile = crud.get_sponsor_profile(session=session, profile_id=profile_id)
    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Sponsor profile not found"
        )
    
    return SponsorProfileResponse(data=profile)

@router.get("/user/{user_id}", response_model=SponsorProfileResponse)
def get_sponsor_profile_by_user_id_public(
    user_id: UUID, session: SessionDep
) -> Any:
    """
    Get sponsor profile by user ID (public view).
    """
    profile = crud.get_sponsor_profile_by_user_id(
        session=session, user_id=user_id
    )
    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Sponsor profile not found"
        )
    
    return SponsorProfileResponse(data=profile)

@router.get("/", response_model=SponsorProfilesPublic)
def get_all_sponsor_profiles(
    session: SessionDep,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
) -> Any:
    """
    Get all sponsor profiles (public view with pagination).
    """
    skip = (page - 1) * limit
    profiles, count = crud.get_sponsor_profiles(
        session=session, skip=skip, limit=limit
    )
    
    return SponsorProfilesPublic(data=profiles, count=count)

@router.get("/search/", response_model=SponsorProfilesPublic)
def search_sponsor_profiles(
    session: SessionDep,
    q: str | None = Query(None, description="Search query"),
    location: str | None = Query(None, description="Filter by location"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
) -> Any:
    """
    Search sponsor profiles by query and filters.
    """
    skip = (page - 1) * limit
    profiles, count = crud.search_sponsor_profiles(
        session=session,
        search_query=q,
        location=location,
        skip=skip,
        limit=limit
    )
    
    return SponsorProfilesPublic(data=profiles, count=count)

@router.get("/stats")
def get_my_organization_stats(
    session: SessionDep, current_user: CurrentUser
) -> Any:
    """
    Get Sponsor statistics for dashboard.
    """
    if current_user.role != UserRole.SPONSOR:
        raise HTTPException(
            status_code=403,
            detail="Only users with SPONSOR role can access Sponsor stats"
        )
    
    stats = crud.get_sponsor_profile_stats(session=session, user_id=current_user.id)
    
    stats.update({
        "organization_name": f"{current_user.firstname} {current_user.lastname}",
        "member_since": current_user.created_at.strftime("%B %Y") if hasattr(current_user, 'created_at') else "Recently"
    })
    
    return stats

@router.post("/", response_model=SponsorProfileResponse)
def create_sponsor_profile(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    profile_in: SponsorProfileCreate
) -> Any:
    """
    Create sponsor profile.
    """
    if current_user.role != UserRole.SPONSOR:
        raise HTTPException(
            status_code=403,
            detail="Only users with SPONSOR role can create sponsor profile"
        )
    
    existing_profile = crud.get_sponsor_profile_by_user_id(
        session=session, user_id=current_user.id
    )
    if existing_profile:
        raise HTTPException(
            status_code=400,
            detail="Sponsor profile already exists for this user"
        )
    
    profile = crud.create_sponsor_profile(
        session=session,
        profile_in=profile_in,
        user_id=current_user.id
    )
    
    return SponsorProfileResponse(data=profile)

@router.delete("/")
def delete_my_sponsor_profile(
    session: SessionDep, current_user: CurrentUser
) -> Any:
    """
    Delete current user's sponsor profile.
    """
    if current_user.role != UserRole.SPONSOR:
        raise HTTPException(
            status_code=403,
            detail="Only users with SPONSOR role can delete sponsor profile"
        )
    
    profile = crud.get_sponsor_profile_by_user_id(
        session=session, user_id=current_user.id
    )
    
    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Sponsor profile not found"
        )
    
    success = crud.delete_sponsor_profile(session=session, profile_id=profile.id)
    
    if not success:
        raise HTTPException(
            status_code=500,
            detail="Failed to delete sponsor profile"
        )
    
    return {"message": "Sponsor profile deleted successfully"}

@router.put("/upload-logo", response_model=SponsorProfileResponse)
async def upload_sponsor_logo(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    file: UploadFile = File(...)
) -> Any:
    """
    Upload logo image for sponsor profile.
    """
    if current_user.role != UserRole.SPONSOR:
        raise HTTPException(
            status_code=403,
            detail="Only users with SPONSOR role can upload logo"
        )
    
    profile = crud.get_sponsor_profile_by_user_id(
        session=session, user_id=current_user.id
    )
    
    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Sponsor profile not found"
        )
    
    try:
        logo_url = await upload_image_to_cloudinary(file, folder="profile_logos")
        
        db_profile = session.get(SponsorProfile, profile.id)
        if not db_profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        profile_update = SponsorProfileUpdate(logo_url=logo_url)
        updated_profile = crud.update_sponsor_profile(
            session=session,
            db_profile=db_profile,
            profile_in=profile_update
        )
        
        return SponsorProfileResponse(data=updated_profile)
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload logo: {str(e)}"
        )

@router.put("/upload-cover", response_model=SponsorProfileResponse)
async def upload_sponsor_cover(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    file: UploadFile = File(...)
) -> Any:
    """
    Upload cover image for sponsor profile.
    """
    if current_user.role != UserRole.SPONSOR:
        raise HTTPException(
            status_code=403,
            detail="Only users with SPONSOR role can upload cover"
        )
    
    profile = crud.get_sponsor_profile_by_user_id(
        session=session, user_id=current_user.id
    )
    
    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Sponsor profile not found"
        )
    
    try:
        cover_url = await upload_image_to_cloudinary(file, folder="cover_images")
        
        db_profile = session.get(SponsorProfile, profile.id)
        if not db_profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        profile_update = SponsorProfileUpdate(cover_image_url=cover_url)
        updated_profile = crud.update_sponsor_profile(
            session=session,
            db_profile=db_profile,
            profile_in=profile_update
        )
        
        return SponsorProfileResponse(data=updated_profile)
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload cover image: {str(e)}"
        )