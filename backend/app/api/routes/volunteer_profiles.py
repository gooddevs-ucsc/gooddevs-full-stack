import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select

from app import crud
from app.api.deps import CurrentUser, SessionDep
from app.models import (
    Message,
    VolunteerProfile,
    VolunteerProfileCreate,
    VolunteerProfileCreateRequest,
    VolunteerProfilePublic,
    VolunteerProfileResponse,
    VolunteerProfileUpdate,
    User,
    UserRole,
)

router = APIRouter(prefix="/volunteer-profiles", tags=["volunteer-profiles"])


@router.get("/me", response_model=VolunteerProfileResponse)
def read_my_volunteer_profile(
    session: SessionDep, current_user: CurrentUser
) -> Any:
    """
    Get current user's volunteer profile.
    """
    if current_user.role != UserRole.VOLUNTEER:
        raise HTTPException(
            status_code=403, detail="Only volunteers can access this endpoint"
        )
    
    profile = crud.get_volunteer_profile_by_user_id(
        session=session, user_id=current_user.id
    )
    if not profile:
        raise HTTPException(
            status_code=404, detail="Volunteer profile not found"
        )
    
    return VolunteerProfileResponse(data=profile)


@router.post("/me", response_model=VolunteerProfileResponse)
def create_my_volunteer_profile(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    profile_request: VolunteerProfileCreateRequest,
) -> Any:
    """
    Create current user's volunteer profile.
    """
    if current_user.role != UserRole.VOLUNTEER:
        raise HTTPException(
            status_code=403, detail="Only volunteers can access this endpoint"
        )
    
    # Check if profile already exists
    existing_profile = crud.get_volunteer_profile_by_user_id(
        session=session, user_id=current_user.id
    )
    if existing_profile:
        raise HTTPException(
            status_code=400, detail="Volunteer profile already exists"
        )
    
    # Create the profile
    profile = crud.create_volunteer_profile(
        session=session, profile_in=profile_request.profile, user_id=current_user.id
    )
    
    # Add skills
    for skill_name in profile_request.skills:
        crud.create_volunteer_skill(
            session=session, skill_name=skill_name, profile_id=profile.id
        )
    
    # Add experiences
    for experience in profile_request.experiences:
        crud.create_volunteer_experience(
            session=session, experience_in=experience, profile_id=profile.id
        )
    
    # Add projects
    for project in profile_request.projects:
        crud.create_volunteer_project(
            session=session, project_in=project, profile_id=profile.id
        )
    
    # Refresh to get all relationships
    session.refresh(profile)
    return VolunteerProfileResponse(data=profile)


@router.put("/me", response_model=VolunteerProfileResponse)
def update_my_volunteer_profile(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    profile_request: VolunteerProfileCreateRequest,
) -> Any:
    """
    Update current user's volunteer profile.
    """
    if current_user.role != UserRole.VOLUNTEER:
        raise HTTPException(
            status_code=403, detail="Only volunteers can access this endpoint"
        )
    
    # Get existing profile
    profile = crud.get_volunteer_profile_by_user_id(
        session=session, user_id=current_user.id
    )
    if not profile:
        raise HTTPException(
            status_code=404, detail="Volunteer profile not found"
        )
    
    # Update the profile
    profile_update = VolunteerProfileUpdate(**profile_request.profile.model_dump())
    profile = crud.update_volunteer_profile(
        session=session, db_profile=profile, profile_in=profile_update
    )
    
    # Delete existing skills, experiences, and projects
    crud.delete_volunteer_skills_by_profile(session=session, profile_id=profile.id)
    crud.delete_volunteer_experiences_by_profile(session=session, profile_id=profile.id)
    crud.delete_volunteer_projects_by_profile(session=session, profile_id=profile.id)
    
    # Add new skills
    for skill_name in profile_request.skills:
        crud.create_volunteer_skill(
            session=session, skill_name=skill_name, profile_id=profile.id
        )
    
    # Add new experiences
    for experience in profile_request.experiences:
        crud.create_volunteer_experience(
            session=session, experience_in=experience, profile_id=profile.id
        )
    
    # Add new projects
    for project in profile_request.projects:
        crud.create_volunteer_project(
            session=session, project_in=project, profile_id=profile.id
        )
    
    # Refresh to get all relationships
    session.refresh(profile)
    return VolunteerProfileResponse(data=profile)


@router.delete("/me", response_model=Message)
def delete_my_volunteer_profile(
    session: SessionDep, current_user: CurrentUser
) -> Any:
    """
    Delete current user's volunteer profile.
    """
    if current_user.role != UserRole.VOLUNTEER:
        raise HTTPException(
            status_code=403, detail="Only volunteers can access this endpoint"
        )
    
    profile = crud.get_volunteer_profile_by_user_id(
        session=session, user_id=current_user.id
    )
    if not profile:
        raise HTTPException(
            status_code=404, detail="Volunteer profile not found"
        )
    
    crud.delete_volunteer_profile(session=session, profile_id=profile.id)
    return Message(message="Volunteer profile deleted successfully")


@router.get("/{profile_id}", response_model=VolunteerProfileResponse)
def read_volunteer_profile(
    profile_id: uuid.UUID, session: SessionDep
) -> Any:
    """
    Get volunteer profile by ID (public endpoint).
    """
    profile = crud.get_volunteer_profile_by_id(
        session=session, profile_id=profile_id
    )
    if not profile:
        raise HTTPException(
            status_code=404, detail="Volunteer profile not found"
        )
    
    return VolunteerProfileResponse(data=profile)


@router.get("/check/exists")
def check_profile_exists(
    session: SessionDep, current_user: CurrentUser
) -> dict[str, bool]:
    """
    Check if current user has a volunteer profile.
    """
    if current_user.role != UserRole.VOLUNTEER:
        raise HTTPException(
            status_code=403, detail="Only volunteers can access this endpoint"
        )
    
    profile = crud.get_volunteer_profile_by_user_id(
        session=session, user_id=current_user.id
    )
    
    return {"exists": profile is not None}
