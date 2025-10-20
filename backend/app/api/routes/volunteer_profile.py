from typing import Any
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, UploadFile, File

from app.api.deps import CurrentUser, SessionDep
from app.models import (
    VolunteerProfile,
    VolunteerProfileCreate,
    VolunteerProfileUpdate,
    VolunteerProfilePublic,
    VolunteerProfileResponse,
    VolunteerProfilesPublic,
    VolunteerStatsPublic,
    UserRole,
    ProjectPublic,
    ProjectsPublic,
    Meta
)
import app.crud as crud
from app.core.cloudinary_utils import upload_image_to_cloudinary

router = APIRouter()


@router.get("/", response_model=VolunteerProfileResponse)
def get_my_volunteer_profile(
    session: SessionDep, current_user: CurrentUser
) -> Any:
    """
    Get current user's volunteer profile.
    """
    if current_user.role != UserRole.VOLUNTEER:
        raise HTTPException(
            status_code=403,
            detail="Only users with VOLUNTEER role can access volunteer profile"
        )
    
    profile = crud.get_volunteer_profile_by_user_id(
        session=session, user_id=current_user.id
    )
    
    if not profile:
        # Create default profile if doesn't exist
        profile_create = VolunteerProfileCreate(
            bio=f"Hi! I'm {current_user.firstname} {current_user.lastname}. I'm passionate about contributing to meaningful projects.",
            tagline="Volunteer Developer",
            skills=[],
            experience=[]
        )
        profile = crud.create_volunteer_profile(
            session=session, 
            profile_in=profile_create,
            user_id=current_user.id
        )
    
    return VolunteerProfileResponse(data=profile)

@router.get("/user/{user_id}", response_model=VolunteerProfileResponse)
def get_volunteer_profile_by_user_id_public(
    user_id: UUID, session: SessionDep
) -> Any:
    """
    Get volunteer profile by user ID (public view).
    Creates a default profile if user is a volunteer but has no profile.
    """
    # First check if user exists and is a volunteer
    user = crud.get_user_by_id(session=session, user_id=user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    if user.role != UserRole.VOLUNTEER:
        raise HTTPException(
            status_code=404,
            detail="User is not a volunteer"
        )
    
    # Try to get existing profile
    profile = crud.get_volunteer_profile_by_user_id(
        session=session, user_id=user_id
    )
    
    if not profile:
        # Create default profile for existing volunteer users
        profile_create = VolunteerProfileCreate(
            bio=f"Hi! I'm {user.firstname} {user.lastname}. I'm passionate about contributing to meaningful projects.",
            tagline="Volunteer Developer",
            skills=[],
            experience=[]
        )
        profile_db = crud.create_volunteer_profile(
            session=session,
            profile_in=profile_create,
            user_id=user_id
        )
        
        # Convert to public model
        profile = VolunteerProfilePublic.model_validate(profile_db, update={"user": user})
    
    return VolunteerProfileResponse(data=profile)

@router.post("/", response_model=VolunteerProfileResponse)
def create_volunteer_profile(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    profile_in: VolunteerProfileCreate
) -> Any:
    """
    Create volunteer profile.
    """
    if current_user.role != UserRole.VOLUNTEER:
        raise HTTPException(
            status_code=403,
            detail="Only users with VOLUNTEER role can create volunteer profile"
        )
    
    # Check if profile already exists
    existing_profile = crud.get_volunteer_profile_by_user_id(
        session=session, user_id=current_user.id
    )
    if existing_profile:
        raise HTTPException(
            status_code=400,
            detail="Volunteer profile already exists for this user"
        )
    
    profile = crud.create_volunteer_profile(
        session=session,
        profile_in=profile_in,
        user_id=current_user.id
    )
    
    return VolunteerProfileResponse(data=profile)


@router.put("/", response_model=VolunteerProfileResponse)
def update_my_volunteer_profile(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    profile_in: VolunteerProfileUpdate
) -> Any:
    """
    Update current user's volunteer profile.
    """
    if current_user.role != UserRole.VOLUNTEER:
        raise HTTPException(
            status_code=403,
            detail="Only users with VOLUNTEER role can update volunteer profile"
        )
    
    # Get existing profile
    existing_profile = crud.get_volunteer_profile_by_user_id(
        session=session, user_id=current_user.id
    )
    
    if not existing_profile:
        # Create profile if doesn't exist
        profile_create = VolunteerProfileCreate(**profile_in.model_dump(exclude_unset=True))
        profile = crud.create_volunteer_profile(
            session=session,
            profile_in=profile_create,
            user_id=current_user.id
        )
    else:
        # Get the database object for update
        db_profile = session.get(VolunteerProfile, existing_profile.id)
        if not db_profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        profile = crud.update_volunteer_profile(
            session=session,
            db_profile=db_profile,
            profile_in=profile_in
        )
    
    return VolunteerProfileResponse(data=profile)


@router.delete("/")
def delete_my_volunteer_profile(
    session: SessionDep, current_user: CurrentUser
) -> Any:
    """
    Delete current user's volunteer profile.
    """
    if current_user.role != UserRole.VOLUNTEER:
        raise HTTPException(
            status_code=403,
            detail="Only users with VOLUNTEER role can delete volunteer profile"
        )
    
    profile = crud.get_volunteer_profile_by_user_id(
        session=session, user_id=current_user.id
    )
    
    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Volunteer profile not found"
        )
    
    success = crud.delete_volunteer_profile(session=session, profile_id=profile.id)
    
    if not success:
        raise HTTPException(
            status_code=500,
            detail="Failed to delete volunteer profile"
        )
    
    return {"message": "Volunteer profile deleted successfully"}


@router.get("/{profile_id}", response_model=VolunteerProfileResponse)
def get_volunteer_profile_by_id(
    profile_id: UUID, session: SessionDep
) -> Any:
    """
    Get volunteer profile by ID (public view).
    """
    profile = crud.get_volunteer_profile(session=session, profile_id=profile_id)
    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Volunteer profile not found"
        )
    
    return VolunteerProfileResponse(data=profile)


@router.get("/user/{user_id}", response_model=VolunteerProfileResponse)
def get_volunteer_profile_by_user_id_public(
    user_id: UUID, session: SessionDep
) -> Any:
    """
    Get volunteer profile by user ID (public view).
    """
    profile = crud.get_volunteer_profile_by_user_id(
        session=session, user_id=user_id
    )
    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Volunteer profile not found"
        )
    
    return VolunteerProfileResponse(data=profile)


@router.get("/all/profiles", response_model=VolunteerProfilesPublic)
def get_all_volunteer_profiles(
    session: SessionDep,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
) -> Any:
    """
    Get all volunteer profiles (public view with pagination).
    """
    skip = (page - 1) * limit
    profiles, count = crud.get_volunteer_profiles(
        session=session, skip=skip, limit=limit
    )
    
    return VolunteerProfilesPublic(data=profiles, count=count)


@router.get("/search/", response_model=VolunteerProfilesPublic)
def search_volunteer_profiles(
    session: SessionDep,
    q: str | None = Query(None, description="Search query"),
    skills: str | None = Query(None, description="Comma-separated skills"),
    location: str | None = Query(None, description="Filter by location"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
) -> Any:
    """
    Search volunteer profiles by query and filters.
    """
    skip = (page - 1) * limit
    
    # Parse skills string to list
    skills_list = None
    if skills:
        skills_list = [s.strip() for s in skills.split(",") if s.strip()]
    
    profiles, count = crud.search_volunteer_profiles(
        session=session,
        search_query=q,
        skills=skills_list,
        location=location,
        skip=skip,
        limit=limit
    )
    
    return VolunteerProfilesPublic(data=profiles, count=count)


@router.get("/stats/me", response_model=VolunteerStatsPublic)
def get_my_volunteer_stats(
    session: SessionDep, current_user: CurrentUser
) -> Any:
    """
    Get volunteer statistics for dashboard.
    """
    if current_user.role != UserRole.VOLUNTEER:
        raise HTTPException(
            status_code=403,
            detail="Only users with VOLUNTEER role can access volunteer stats"
        )
    
    stats = crud.get_volunteer_profile_stats(session=session, user_id=current_user.id)
    
    # Add user info
    volunteer_name = f"{current_user.firstname} {current_user.lastname}"
    member_since = current_user.created_at.strftime("%B %Y") if hasattr(current_user, 'created_at') else "Recently"
    
    return VolunteerStatsPublic(
        **stats,
        volunteer_name=volunteer_name,
        member_since=member_since
    )


@router.get("/projects/approved", response_model=ProjectsPublic)
def get_my_approved_projects(
    session: SessionDep,
    current_user: CurrentUser,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
) -> Any:
    """
    Get projects that the current volunteer has been approved to contribute to.
    """
    if current_user.role != UserRole.VOLUNTEER:
        raise HTTPException(
            status_code=403,
            detail="Only users with VOLUNTEER role can access this endpoint"
        )
    
    skip = (page - 1) * limit
    projects, count = crud.get_volunteer_approved_projects(
        session=session, user_id=current_user.id, skip=skip, limit=limit
    )
    
    # Convert to ProjectPublic
    public_projects = [ProjectPublic.model_validate(project) for project in projects]
    
    total_pages = (count + limit - 1) // limit
    
    return ProjectsPublic(
        data=public_projects,
        meta=Meta(page=page, total=count, totalPages=total_pages)
    )


@router.put("/upload-profile-image", response_model=VolunteerProfileResponse)
async def upload_volunteer_profile_image(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    file: UploadFile = File(...)
) -> Any:
    """
    Upload profile image for volunteer profile.
    This endpoint uploads to Cloudinary AND updates the database.
    """
    if current_user.role != UserRole.VOLUNTEER:
        raise HTTPException(
            status_code=403,
            detail="Only users with VOLUNTEER role can upload profile image"
        )
    
    # Get existing profile
    profile = crud.get_volunteer_profile_by_user_id(
        session=session, user_id=current_user.id
    )
    
    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Volunteer profile not found"
        )
    
    try:
        # Upload to Cloudinary
        image_url = await upload_image_to_cloudinary(file, folder="volunteer_profiles")
        
        # Get database object
        db_profile = session.get(VolunteerProfile, profile.id)
        if not db_profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        # Update profile with new image URL
        profile_update = VolunteerProfileUpdate(profile_image_url=image_url)
        updated_profile = crud.update_volunteer_profile(
            session=session,
            db_profile=db_profile,
            profile_in=profile_update
        )
        
        return VolunteerProfileResponse(data=updated_profile)
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload profile image: {str(e)}"
        )


@router.put("/upload-cover-image", response_model=VolunteerProfileResponse)
async def upload_volunteer_cover_image(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    file: UploadFile = File(...)
) -> Any:
    """
    Upload cover image for volunteer profile.
    This endpoint uploads to Cloudinary AND updates the database.
    """
    if current_user.role != UserRole.VOLUNTEER:
        raise HTTPException(
            status_code=403,
            detail="Only users with VOLUNTEER role can upload cover image"
        )
    
    # Get existing profile
    profile = crud.get_volunteer_profile_by_user_id(
        session=session, user_id=current_user.id
    )
    
    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Volunteer profile not found"
        )
    
    try:
        # Upload to Cloudinary
        cover_url = await upload_image_to_cloudinary(file, folder="volunteer_covers")
        
        # Get database object
        db_profile = session.get(VolunteerProfile, profile.id)
        if not db_profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        # Update profile with new cover URL
        profile_update = VolunteerProfileUpdate(cover_image_url=cover_url)
        updated_profile = crud.update_volunteer_profile(
            session=session,
            db_profile=db_profile,
            profile_in=profile_update
        )
        
        return VolunteerProfileResponse(data=updated_profile)
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload cover image: {str(e)}"
        )