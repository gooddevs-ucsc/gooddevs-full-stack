import uuid
from typing import Any, Optional, Annotated

from fastapi import APIRouter, HTTPException, Depends, Request, Cookie
from sqlmodel import func, select
import jwt
from jwt.exceptions import InvalidTokenError
from pydantic import ValidationError

from app.api.deps import CurrentUser, SessionDep, OptionalCurrentUser
from app.models import NotificationType, Project, ProjectCreate, ProjectPublic, ProjectsPublic, ProjectUpdate, Message, UserRole, ProjectStatus, User, TokenPayload, Meta, ProjectResponse
from app.core import groq_utils, security
from app.core.config import settings
from app import crud
from app.utils import calculate_pagination_meta, page_to_skip, calculate_pagination_meta_from_page

router = APIRouter(prefix="/projects", tags=["projects"])


@router.post("/", response_model=ProjectResponse)
def create_project(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    project_in: ProjectCreate
) -> Any:
    """
    Create new project request.
    Only REQUESTER users can create project requests.
    """
    if current_user.role != UserRole.REQUESTER:
        raise HTTPException(
            status_code=403,
            detail="Only users with REQUESTER role can create project requests"
        )

    project = crud.create_project(
        session=session, project_in=project_in, requester_id=current_user.id
    )
    return ProjectResponse(data=project)


@router.get("/", response_model=ProjectsPublic)
def read_projects(
    session: SessionDep,
    current_user: CurrentUser,
    page: int = 1,
    limit: int = 100
) -> Any:
    """
    Retrieve projects.
    - Only ADMIN users can see all projects
    """

    if current_user.role == UserRole.ADMIN:
        # Admins can see all projects
        count_statement = select(func.count()).select_from(Project)
        total = session.exec(count_statement).one()

        # Convert page to skip
        skip = page_to_skip(page, limit)
        projects = crud.get_all_projects(
            session=session, skip=skip, limit=limit)

        # Calculate pagination metadata
        meta = calculate_pagination_meta_from_page(
            total=total, page=page, limit=limit)
        return ProjectsPublic(data=projects, meta=meta)
    raise HTTPException(status_code=403, detail="Insufficient permissions")

@router.get("/my-projects", response_model=ProjectsPublic)
def read_user_projects(
    session: SessionDep,
    current_user: CurrentUser,
    page: int = 1,
    limit: int = 100
) -> Any:
    """
    Retrieve projects created by the current user.
    """
    count_statement = (
        select(func.count())
        .select_from(Project)
        .where(Project.requester_id == current_user.id)
    )
    total = session.exec(count_statement).one()

    # Convert page to skip
    skip = page_to_skip(page, limit)
    
    statement = (
        select(Project)
        .where(Project.requester_id == current_user.id)
        .offset(skip)
        .limit(limit)
    )
    projects = session.exec(statement).all()

    # Calculate pagination metadata
    meta = calculate_pagination_meta_from_page(
        total=total, page=page, limit=limit)
    return ProjectsPublic(data=projects, meta=meta)

@router.get("/approved", response_model=ProjectsPublic)
def read_approved_projects(
    session: SessionDep,
    page: int = 1,
    limit: int = 100
) -> Any:
    """
    Retrieve approved projects.
    """
    count_statement = (
        select(func.count())
        .select_from(Project)
        .where(Project.status == ProjectStatus.APPROVED)
    )
    total = session.exec(count_statement).one()

    # Convert page to skip
    skip = page_to_skip(page, limit)
    projects = crud.get_approved_projects(
        session=session, skip=skip, limit=limit
    )

    # Calculate pagination metadata
    meta = calculate_pagination_meta_from_page(
        total=total, page=page, limit=limit)
    return ProjectsPublic(data=projects, meta=meta)


@router.get("/pending", response_model=ProjectsPublic)
def read_pending_projects(
    session: SessionDep,
    current_user: CurrentUser,
    page: int = 1,
    limit: int = 100
) -> Any:
    """
    Retrieve pending projects.
    - Only ADMIN users can see pending projects
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    count_statement = (
        select(func.count())
        .select_from(Project)
        .where(Project.status == ProjectStatus.PENDING)
    )
    total = session.exec(count_statement).one()

    # Convert page to skip
    skip = page_to_skip(page, limit)
    projects = crud.get_pending_projects(
        session=session, skip=skip, limit=limit
    )

    # Calculate pagination metadata
    meta = calculate_pagination_meta_from_page(
        total=total, page=page, limit=limit)
    return ProjectsPublic(data=projects, meta=meta)


@router.get("/{id}", response_model=ProjectResponse)
def read_project(
    session: SessionDep,
    optional_current_user: OptionalCurrentUser,
    id: uuid.UUID
) -> Any:
    """
    Get project by ID.
    - Non-authenticated users can view approved projects
    - Authenticated users: 
      - Admins can view any project
      - Requesters can view their own projects (any status) or approved projects
      - Volunteers can view approved projects
    """
    project = crud.get_project_by_id(session=session, project_id=id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # If project is approved, anyone can view it
    if project.status == ProjectStatus.APPROVED:
        return ProjectResponse(data=project)

    # For non-approved projects, check authentication and permissions
    if not optional_current_user:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )

    # Check permissions for authenticated users
    if optional_current_user.role == UserRole.ADMIN:
        # Admins can view any project
        return ProjectResponse(data=project)
    elif optional_current_user.role == UserRole.REQUESTER:
        # Requesters can only view their own projects
        if project.requester_id != optional_current_user.id:
            raise HTTPException(
                status_code=403, detail="Not enough permissions")
        return ProjectResponse(data=project)
    else:
        # Other roles (VOLUNTEER, SPONSOR) can only view approved projects
        raise HTTPException(
            status_code=403, detail="Project not available")


@router.put("/{id}", response_model=ProjectResponse)
def update_project(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
    project_in: ProjectUpdate
) -> Any:
    """
    Update a project.
    - ADMIN users can update any project (including status changes)
    - REQUESTER users can only update their own projects (excluding status)
    """
    project = crud.get_project_by_id(session=session, project_id=id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if current_user.role == UserRole.ADMIN:
        # Admins can update any project
        pass
    elif current_user.role == UserRole.REQUESTER:
        # Requesters can only update their own projects
        if project.requester_id != current_user.id:
            raise HTTPException(
                status_code=403, detail="Not enough permissions")
        # Requesters cannot change status
        if project_in.status is not None:
            raise HTTPException(
                status_code=403,
                detail="Requesters cannot change project status"
            )
    else:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    project = crud.update_project(
        session=session, db_project=project, project_in=project_in)
    return ProjectResponse(data=project)


@router.delete("/{id}")
def delete_project(
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID
) -> Message:
    """
    Delete a project.
    - ADMIN users can delete any project
    - REQUESTER users can only delete their own projects
    """
    project = crud.get_project_by_id(session=session, project_id=id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if current_user.role == UserRole.ADMIN:
        # Admins can delete any project
        pass
    elif current_user.role == UserRole.REQUESTER:
        # Requesters can only delete their own projects
        if project.requester_id != current_user.id:
            raise HTTPException(
                status_code=403, detail="Not enough permissions")
    else:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    success = crud.delete_project(session=session, project_id=id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")

    return Message(message="Project deleted successfully")


@router.put("/{id}/approve", response_model=ProjectResponse)
async def approve_project(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID
) -> Any:
    """
    Approve a project.
    Only ADMIN users can approve projects.
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Only admin users can approve projects"
        )

    project = crud.get_project_by_id(session=session, project_id=id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    project_update = ProjectUpdate(status=ProjectStatus.APPROVED)
    project = crud.update_project(
        session=session, db_project=project, project_in=project_update)
    
    try:
        await crud.create_notification(
            session=session,    
            user_id=project.requester_id,
            type=NotificationType.PROJECT_APPROVED,
            title="Project Approved",
            message=f"Your project '{project.title}' has been approved.",
            related_entity_id=project.id,
            related_entity_type="Project",
            action_url=f"/projects/{project.id}"
        )
    except Exception as e:
        # Log the error but do not fail the approval process
        print(f"Failed to create notification: {e}")
    return ProjectResponse(data=project)


@router.put("/{id}/reject", response_model=ProjectResponse)
def reject_project(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID
) -> Any:
    """
    Reject a project.
    Only ADMIN users can reject projects.
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Only admin users can reject projects"
        )

    project = crud.get_project_by_id(session=session, project_id=id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    project_update = ProjectUpdate(status=ProjectStatus.REJECTED)
    project = crud.update_project(
        session=session, db_project=project, project_in=project_update)
    return ProjectResponse(data=project)

@router.post("/generate-details")
async def generate_project_details_endpoint(prompt: str):
    try:
        details = await groq_utils.generate_project_details(prompt)
        return details
    except ValueError as e:
        # Send a 400 Bad Request error to the frontend
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        # Generic server error for other unexpected issues
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")