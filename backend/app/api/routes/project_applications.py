import uuid
from typing import Any

from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep, OptionalCurrentUser
from app.models import (
    ProjectApplication,
    ProjectApplicationCreate,
    ProjectApplicationPublic,
    ProjectApplicationsPublic,
    ProjectApplicationUpdate,
    ProjectApplicationResponse,
    Message,
    UserRole,
    ApplicationStatus,
    Meta
)
from app import crud
from app.utils import calculate_pagination_meta_from_page, page_to_skip

router = APIRouter(prefix="/project-applications", tags=["project-applications"])


@router.post("/projects/{project_id}/apply", response_model=ProjectApplicationResponse)
def apply_to_project(
    *,
    session: SessionDep,
    optional_current_user: OptionalCurrentUser,
    project_id: uuid.UUID,
    application_in: ProjectApplicationCreate
) -> Any:
    """
    Apply to a project.
    Can be done by authenticated users or anonymously.
    """
    # Check if project exists and is approved
    project = crud.get_project_by_id(session=session, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Only allow applications to approved projects
    if project.status != "APPROVED":
        raise HTTPException(
            status_code=400, 
            detail="Applications are only accepted for approved projects"
        )
    
    # Check if user already applied with this email
    existing_application = crud.check_existing_application(
        session=session, 
        project_id=project_id, 
        email=application_in.email
    )
    if existing_application:
        raise HTTPException(
            status_code=400,
            detail="You have already applied to this project with this email"
        )
    
    # Get applicant ID if user is authenticated
    applicant_id = optional_current_user.id if optional_current_user else None
    
    application = crud.create_project_application(
        session=session,
        application_in=application_in,
        project_id=project_id,
        applicant_id=applicant_id
    )
    return ProjectApplicationResponse(data=application)


@router.get("/projects/{project_id}/applications", response_model=ProjectApplicationsPublic)
def get_project_applications(
    session: SessionDep,
    current_user: CurrentUser,
    project_id: uuid.UUID,
    page: int = 1,
    limit: int = 100
) -> Any:
    """
    Get applications for a specific project.
    Only project owners and admins can view applications.
    """
    # Check if project exists
    project = crud.get_project_by_id(session=session, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check permissions
    if current_user.role != UserRole.ADMIN and project.requester_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to view applications for this project"
        )
    
    # Get total count
    total = crud.count_project_applications_by_project(
        session=session, project_id=project_id
    )
    
    # Get applications with pagination
    skip = page_to_skip(page, limit)
    applications = crud.get_project_applications_by_project(
        session=session, project_id=project_id, skip=skip, limit=limit
    )
    
    # Calculate pagination metadata
    meta = calculate_pagination_meta_from_page(
        total=total, page=page, limit=limit
    )
    
    return ProjectApplicationsPublic(data=applications, meta=meta)


@router.get("/my-applications", response_model=ProjectApplicationsPublic)
def get_my_applications(
    session: SessionDep,
    current_user: CurrentUser,
    page: int = 1,
    limit: int = 100
) -> Any:
    """
    Get current user's project applications.
    """
    # Get total count
    total = crud.count_project_applications_by_user(
        session=session, applicant_id=current_user.id
    )
    
    # Get applications with pagination
    skip = page_to_skip(page, limit)
    applications = crud.get_project_applications_by_user(
        session=session, applicant_id=current_user.id, skip=skip, limit=limit
    )
    
    # Calculate pagination metadata
    meta = calculate_pagination_meta_from_page(
        total=total, page=page, limit=limit
    )
    
    return ProjectApplicationsPublic(data=applications, meta=meta)


@router.get("/{application_id}", response_model=ProjectApplicationResponse)
def get_application(
    session: SessionDep,
    current_user: CurrentUser,
    application_id: uuid.UUID
) -> Any:
    """
    Get a specific application.
    Only application owner, project owner, and admins can view.
    """
    application = crud.get_project_application_by_id(
        session=session, application_id=application_id
    )
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Get project to check permissions
    project = crud.get_project_by_id(session=session, project_id=application.project_id)
    
    # Check permissions
    can_view = (
        current_user.role == UserRole.ADMIN or
        application.applicant_id == current_user.id or
        (project and project.requester_id == current_user.id)
    )
    
    if not can_view:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to view this application"
        )
    
    return ProjectApplicationResponse(data=application)


@router.put("/{application_id}", response_model=ProjectApplicationResponse)
def update_application(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    application_id: uuid.UUID,
    application_in: ProjectApplicationUpdate
) -> Any:
    """
    Update an application.
    Only application owner can update (except status changes).
    Only project owners and admins can change status.
    """
    application = crud.get_project_application_by_id(
        session=session, application_id=application_id
    )
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Get project to check permissions
    project = crud.get_project_by_id(session=session, project_id=application.project_id)
    
    # Check if user can update the application
    is_applicant = application.applicant_id == current_user.id
    is_project_owner = project and project.requester_id == current_user.id
    is_admin = current_user.role == UserRole.ADMIN
    
    # Status changes can only be made by project owners or admins
    if application_in.status is not None:
        if not (is_project_owner or is_admin):
            raise HTTPException(
                status_code=403,
                detail="Only project owners and admins can change application status"
            )
    
    # Other fields can only be updated by the applicant (if status is still PENDING)
    if not is_applicant and application_in.status is None:
        raise HTTPException(
            status_code=403,
            detail="Only the applicant can update application details"
        )
    
    # Don't allow updates to non-pending applications (except status)
    if application.status != ApplicationStatus.PENDING and application_in.status is None:
        raise HTTPException(
            status_code=400,
            detail="Cannot update application details after it has been processed"
        )
    
    updated_application = crud.update_project_application(
        session=session, db_application=application, application_in=application_in
    )
    
    return ProjectApplicationResponse(data=updated_application)


@router.put("/{application_id}/approve", response_model=ProjectApplicationResponse)
def approve_application(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    application_id: uuid.UUID
) -> Any:
    """
    Approve an application.
    Only project owners and admins can approve.
    """
    application = crud.get_project_application_by_id(
        session=session, application_id=application_id
    )
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Get project to check permissions
    project = crud.get_project_by_id(session=session, project_id=application.project_id)
    
    # Check permissions
    is_project_owner = project and project.requester_id == current_user.id
    is_admin = current_user.role == UserRole.ADMIN
    
    if not (is_project_owner or is_admin):
        raise HTTPException(
            status_code=403,
            detail="Only project owners and admins can approve applications"
        )
    
    # Can only approve pending applications
    if application.status != ApplicationStatus.PENDING:
        raise HTTPException(
            status_code=400,
            detail="Can only approve pending applications"
        )
    
    application_update = ProjectApplicationUpdate(status=ApplicationStatus.APPROVED)
    updated_application = crud.update_project_application(
        session=session, db_application=application, application_in=application_update
    )
    
    return ProjectApplicationResponse(data=updated_application)


@router.put("/{application_id}/reject", response_model=ProjectApplicationResponse)
def reject_application(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    application_id: uuid.UUID
) -> Any:
    """
    Reject an application.
    Only project owners and admins can reject.
    """
    application = crud.get_project_application_by_id(
        session=session, application_id=application_id
    )
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Get project to check permissions
    project = crud.get_project_by_id(session=session, project_id=application.project_id)
    
    # Check permissions
    is_project_owner = project and project.requester_id == current_user.id
    is_admin = current_user.role == UserRole.ADMIN
    
    if not (is_project_owner or is_admin):
        raise HTTPException(
            status_code=403,
            detail="Only project owners and admins can reject applications"
        )
    
    # Can only reject pending applications
    if application.status != ApplicationStatus.PENDING:
        raise HTTPException(
            status_code=400,
            detail="Can only reject pending applications"
        )
    
    application_update = ProjectApplicationUpdate(status=ApplicationStatus.REJECTED)
    updated_application = crud.update_project_application(
        session=session, db_application=application, application_in=application_update
    )
    
    return ProjectApplicationResponse(data=updated_application)


@router.put("/{application_id}/withdraw", response_model=ProjectApplicationResponse)
def withdraw_application(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    application_id: uuid.UUID
) -> Any:
    """
    Withdraw an application.
    Only the applicant can withdraw their application.
    """
    application = crud.get_project_application_by_id(
        session=session, application_id=application_id
    )
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Check permissions - only applicant can withdraw
    if application.applicant_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Only the applicant can withdraw their application"
        )
    
    # Can only withdraw pending applications
    if application.status != ApplicationStatus.PENDING:
        raise HTTPException(
            status_code=400,
            detail="Can only withdraw pending applications"
        )
    
    application_update = ProjectApplicationUpdate(status=ApplicationStatus.WITHDRAWN)
    updated_application = crud.update_project_application(
        session=session, db_application=application, application_in=application_update
    )
    
    return ProjectApplicationResponse(data=updated_application)


@router.delete("/{application_id}")
def delete_application(
    session: SessionDep,
    current_user: CurrentUser,
    application_id: uuid.UUID
) -> Message:
    """
    Delete an application.
    Only admins can delete applications.
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Only admins can delete applications"
        )
    
    application = crud.get_project_application_by_id(
        session=session, application_id=application_id
    )
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    success = crud.delete_project_application(
        session=session, application_id=application_id
    )
    if not success:
        raise HTTPException(status_code=404, detail="Application not found")
    
    return Message(message="Application deleted successfully")


@router.get("/", response_model=ProjectApplicationsPublic)
def get_all_applications(
    session: SessionDep,
    current_user: CurrentUser,
    page: int = 1,
    limit: int = 100
) -> Any:
    """
    Get all applications (admin only).
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Only admins can view all applications"
        )
    
    # Get total count
    count_statement = select(func.count()).select_from(ProjectApplication)
    total = session.exec(count_statement).one()
    
    # Get applications with pagination
    skip = page_to_skip(page, limit)
    applications = crud.get_all_project_applications(
        session=session, skip=skip, limit=limit
    )
    
    # Calculate pagination metadata
    meta = calculate_pagination_meta_from_page(
        total=total, page=page, limit=limit
    )
    
    return ProjectApplicationsPublic(data=applications, meta=meta)
