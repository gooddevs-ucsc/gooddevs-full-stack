from typing import Any
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query
from sqlmodel import select

from app.api.deps import SessionDep
from app.models import (
    User,
    UserPublic,
    RequesterProfile, 
    RequesterProfilePublic,
    Project,
    ProjectPublic,
    ProjectsPublic,
    Meta,
    UserRole
)
import app.crud as crud

router = APIRouter()


# Define models for public profile response
from sqlmodel import SQLModel

class PublicRequesterProfile(SQLModel):
    """Public view of requester profile with field name mapping for frontend compatibility"""
    id: str
    about: str | None = None
    tagline: str | None = None
    location: str | None = None
    website_url: str | None = None  # Maps from 'website' field
    linkedin_url: str | None = None
    twitter_url: str | None = None
    github_url: str | None = None  # Will be None for now, but frontend ready
    facebook_url: str | None = None
    instagram_url: str | None = None
    phone_number: str | None = None  # Maps from 'contact_phone' field
    organization_name: str | None = None
    created_at: str
    updated_at: str

class PublicUserProfile(SQLModel):
    """Public view of user profile with requester profile included"""
    id: str
    firstname: str
    lastname: str
    email: str
    role: str
    created_at: str
    requester_profile: PublicRequesterProfile | None = None

class PublicUserProfileResponse(SQLModel):
    data: PublicUserProfile

class UserProjectsResponse(SQLModel):
    data: list[ProjectPublic]
    meta: Meta


@router.get("/users/{user_id}/public-profile", response_model=PublicUserProfileResponse)
def get_user_public_profile(
    user_id: UUID, session: SessionDep
) -> Any:
    """
    Get user's public profile including requester profile if available.
    This endpoint is accessible to everyone (no authentication required).
    """
    # Get user by ID
    user = crud.get_user_by_id(session=session, user_id=user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    # Get requester profile if user is a requester
    public_requester_profile = None
    if user.role == UserRole.REQUESTER:
        requester_profile = crud.get_requester_profile_by_user_id(
            session=session, user_id=user_id
        )
        
        if requester_profile:
            # Map database fields to frontend expected fields
            public_requester_profile = PublicRequesterProfile(
                id=str(requester_profile.id),
                about=requester_profile.about,
                tagline=requester_profile.tagline,
                location=requester_profile.location,
                website_url=requester_profile.website,  # Map 'website' to 'website_url'
                linkedin_url=requester_profile.linkedin_url,
                twitter_url=requester_profile.twitter_url,
                github_url=None,  # Not in current schema, but frontend ready
                facebook_url=requester_profile.facebook_url,
                instagram_url=requester_profile.instagram_url,
                phone_number=requester_profile.contact_phone,  # Map 'contact_phone' to 'phone_number'
                organization_name=f"{user.firstname} {user.lastname}" if user.firstname and user.lastname else "Organization",
                created_at=requester_profile.created_at.isoformat() if requester_profile.created_at else "",
                updated_at=requester_profile.updated_at.isoformat() if requester_profile.updated_at else ""
            )
    
    # Create public profile response
    # Use requester profile created_at as user join date if available
    user_created_at = ""
    if public_requester_profile and requester_profile and requester_profile.created_at:
        user_created_at = requester_profile.created_at.isoformat()
    elif hasattr(user, 'created_at') and user.created_at:
        user_created_at = user.created_at.isoformat()
    
    public_profile = PublicUserProfile(
        id=str(user.id),
        firstname=user.firstname or "",
        lastname=user.lastname or "",
        email=user.email,
        role=user.role.value,
        created_at=user_created_at,
        requester_profile=public_requester_profile
    )
    
    return PublicUserProfileResponse(data=public_profile)


@router.get("/users/{user_id}/projects", response_model=UserProjectsResponse) 
def get_user_public_projects(
    user_id: UUID,
    session: SessionDep,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
) -> Any:
    """
    Get user's public projects (only approved projects are shown).
    This endpoint is accessible to everyone (no authentication required).
    """
    # Verify user exists
    user = crud.get_user_by_id(session=session, user_id=user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    # Only show projects if user is a requester
    if user.role != UserRole.REQUESTER:
        return UserProjectsResponse(
            data=[],
            meta=Meta(page=page, total=0, totalPages=0)
        )
    
    # Get user's approved projects
    skip = (page - 1) * limit
    projects = crud.get_user_approved_projects(
        session=session, 
        requester_id=user_id,
        skip=skip,
        limit=limit
    )
    
    # Count total approved projects for this user
    total_count = crud.count_user_approved_projects(
        session=session,
        requester_id=user_id
    )
    
    total_pages = (total_count + limit - 1) // limit
    
    return UserProjectsResponse(
        data=projects,
        meta=Meta(page=page, total=total_count, totalPages=total_pages)
    )


@router.get("/users/{user_id}/projects/{project_id}", response_model=dict)
def get_user_project_public(
    user_id: UUID,
    project_id: UUID, 
    session: SessionDep
) -> Any:
    """
    Get a specific public project by user and project ID.
    This endpoint is accessible to everyone (no authentication required).
    """
    # Verify user exists
    user = crud.get_user_by_id(session=session, user_id=user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    # Get project
    project = crud.get_project_by_id(session=session, project_id=project_id)
    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )
    
    # Verify project belongs to user and is approved
    if project.requester_id != user_id:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )
    
    # Only show approved projects publicly
    if project.status.value != "APPROVED":
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )
    
    return {"data": project}


@router.get("/public-profiles", response_model=dict)
def get_all_public_profiles(
    session: SessionDep,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: str | None = Query(None, description="Search by name or tagline"),
    location: str | None = Query(None, description="Filter by location")
) -> Any:
    """
    Get all public requester profiles with search and filtering.
    This endpoint is accessible to everyone (no authentication required).
    """
    skip = (page - 1) * limit
    
    # Get requester profiles with optional search
    if search or location:
        profiles, count = crud.search_requester_profiles(
            session=session,
            search_query=search,
            location=location,
            skip=skip,
            limit=limit
        )
    else:
        profiles, count = crud.get_requester_profiles(
            session=session,
            skip=skip,
            limit=limit
        )
    
    total_pages = (count + limit - 1) // limit
    
    return {
        "data": profiles,
        "meta": {
            "page": page,
            "total": count,
            "totalPages": total_pages
        }
    }