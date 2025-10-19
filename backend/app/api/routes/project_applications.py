import uuid
from typing import Any

from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import (
    ProjectApplication,
    ProjectApplicationCreate,
    ProjectApplicationPublic,
    ProjectApplicationsPublic,
    ProjectApplicationUpdate,
    ProjectApplicationResponse,
    Message,
    UserRole,
    ProjectStatus,
    ApplicationStatus,
    Meta,
    Project,
    VolunteersPublic,
    ApprovedTeamMembersPublic,
    ApplicationReviewerPermissionCreate,
    ApplicationReviewerPermissionPublic,
    ApplicationReviewerPermissionsPublic,
    CanReviewResponse
)
from app import crud
from app.utils import calculate_pagination_meta_from_page, page_to_skip

router = APIRouter(prefix="/applications", tags=["project_applications"])


@router.post("/projects/{project_id}", response_model=ProjectApplicationResponse)
def create_application(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    project_id: uuid.UUID,
    application_in: ProjectApplicationCreate
) -> Any:
    """
    Create a new project application.
    Only VOLUNTEER users can apply to projects.
    """
    if current_user.role != UserRole.VOLUNTEER:
        raise HTTPException(
            status_code=403,
            detail="Only volunteers can apply to projects"
        )

    # Check if project exists and is approved
    project = crud.get_project_by_id(session=session, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if project.status != ProjectStatus.APPROVED:
        raise HTTPException(
            status_code=400,
            detail="Can only apply to approved projects"
        )

    # Check if volunteer has already applied to this project
    existing_application = crud.get_application_by_project_and_volunteer(
        session=session,
        project_id=project_id,
        volunteer_id=current_user.id
    )
    if existing_application:
        raise HTTPException(
            status_code=400,
            detail="You have already applied to this project"
        )

    application = crud.create_application(
        session=session,
        application_in=application_in,
        project_id=project_id,
        volunteer_id=current_user.id
    )
    return ProjectApplicationResponse(data=application)


@router.get("/", response_model=ProjectApplicationsPublic)
def read_applications(
    session: SessionDep,
    current_user: CurrentUser,
    page: int = 1,
    limit: int = 100
) -> Any:
    """
    Retrieve applications.
    - ADMIN users can see all applications
    - VOLUNTEER users can see only their own applications
    - REQUESTER users can see applications for their own projects
    """
    skip = page_to_skip(page, limit)

    if current_user.role == UserRole.ADMIN:
        # Admins can see all applications
        applications, total = crud.get_all_applications(
            session=session, skip=skip, limit=limit
        )
    elif current_user.role == UserRole.VOLUNTEER:
        # Volunteers can see only their own applications
        applications, total = crud.get_applications_by_volunteer_id(
            session=session, volunteer_id=current_user.id, skip=skip, limit=limit
        )
    elif current_user.role == UserRole.REQUESTER:
        # Requesters can see applications for their own projects
        # First get all projects by this requester
        statement = select(Project.id).where(
            Project.requester_id == current_user.id)
        project_ids = session.exec(statement).all()

        if not project_ids:
            # No projects, no applications
            meta = calculate_pagination_meta_from_page(
                total=0, page=page, limit=limit)
            return ProjectApplicationsPublic(data=[], meta=meta)

        # Get applications for these projects
        statement = (
            select(ProjectApplication)
            .where(ProjectApplication.project_id.in_(project_ids))
            .offset(skip)
            .limit(limit)
            .order_by(ProjectApplication.created_at.desc())
        )
        applications = session.exec(statement).all()

        count_statement = select(func.count(ProjectApplication.id)).where(
            ProjectApplication.project_id.in_(project_ids)
        )
        total = session.exec(count_statement).one()
    else:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    meta = calculate_pagination_meta_from_page(
        total=total, page=page, limit=limit)
    return ProjectApplicationsPublic(data=applications, meta=meta)


@router.get("/projects/{project_id}", response_model=ProjectApplicationsPublic)
def read_project_applications(
    session: SessionDep,
    current_user: CurrentUser,
    project_id: uuid.UUID,
    page: int = 1,
    limit: int = 100
) -> Any:
    """
    Retrieve applications for a specific project.
    - ADMIN users can see applications for any project
    - REQUESTER users can see applications for their own projects
    - VOLUNTEER users with reviewer permission can see applications
    """
    # Check if project exists
    project = crud.get_project_by_id(session=session, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Check permissions
    if current_user.role == UserRole.ADMIN:
        # Admins can see applications for any project
        pass
    elif current_user.role in [UserRole.REQUESTER, UserRole.VOLUNTEER]:
        # Check if user has permission to review applications for this project
        has_permission = crud.check_reviewer_permission(
            session=session,
            project_id=project_id,
            user_id=current_user.id
        )
        if not has_permission:
            raise HTTPException(
                status_code=403,
                detail="You don't have permission to view applications for this project"
            )
    else:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    skip = page_to_skip(page, limit)
    applications, total = crud.get_applications_by_project_id(
        session=session, project_id=project_id, skip=skip, limit=limit
    )

    meta = calculate_pagination_meta_from_page(
        total=total, page=page, limit=limit)
    return ProjectApplicationsPublic(data=applications, meta=meta)


@router.get("/projects/{project_id}/approved-applicants", response_model=ApprovedTeamMembersPublic)
def get_approved_applicants_for_project(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    project_id: uuid.UUID
) -> Any:
    """
    Get all approved applicants (volunteers) for a specific project with their roles.
    This endpoint is public - anyone can see approved team members for any project.
    Filtering is done at database level for efficiency.
    """
    # Check if project exists
    project = crud.get_project_by_id(session=session, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Get approved team members with their volunteer roles
    approved_team_members = crud.get_approved_applicants_for_project(
        session=session,
        project_id=project_id
    )

    return ApprovedTeamMembersPublic(data=approved_team_members, count=len(approved_team_members))


@router.get("/{application_id}", response_model=ProjectApplicationResponse)
def read_application(
    session: SessionDep,
    current_user: CurrentUser,
    application_id: uuid.UUID
) -> Any:
    """
    Get application by ID.
    - ADMIN users can view any application
    - VOLUNTEER users can view their own applications
    - REQUESTER users can view applications for their own projects
    """
    application = crud.get_application_by_id(
        session=session, application_id=application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    # Check permissions
    if current_user.role == UserRole.ADMIN:
        # Admins can view any application
        pass
    elif current_user.role == UserRole.VOLUNTEER:
        # Volunteers can only view their own applications
        if application.volunteer_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You can only view your own applications"
            )
    elif current_user.role == UserRole.REQUESTER:
        # Requesters can view applications for their own projects
        project = crud.get_project_by_id(
            session=session, project_id=application.project_id)
        if not project or project.requester_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You can only view applications for your own projects"
            )
    else:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

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
    - ADMIN users can update any application (including status changes)
    - VOLUNTEER users can update their own applications (excluding status), or update status if they have reviewer permission
    - REQUESTER users can update status of applications for their own projects
    """
    application = crud.get_application_by_id(
        session=session, application_id=application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    if current_user.role == UserRole.ADMIN:
        # Admins can update any application
        pass
    elif current_user.role == UserRole.VOLUNTEER:
        # Check if it's their own application
        is_own_application = application.volunteer_id == current_user.id

        # Check if they have reviewer permission for this project
        has_reviewer_permission = crud.check_reviewer_permission(
            session=session,
            project_id=application.project_id,
            user_id=current_user.id
        )

        if is_own_application:
            # Volunteers can update their own applications but not the status
            if application_in.status is not None and not has_reviewer_permission:
                raise HTTPException(
                    status_code=403,
                    detail="You cannot change application status for your own application"
                )
        elif has_reviewer_permission:
            # Volunteers with reviewer permission can only change status
            if any([
                application_in.volunteer_role is not None,
                application_in.cover_letter is not None,
                application_in.skills is not None,
                application_in.experience_years is not None,
                application_in.portfolio_url is not None,
                application_in.linkedin_url is not None,
                application_in.github_url is not None
            ]):
                raise HTTPException(
                    status_code=403,
                    detail="Reviewers can only change application status"
                )
        else:
            raise HTTPException(
                status_code=403,
                detail="You can only update your own applications or applications you're authorized to review"
            )
    elif current_user.role == UserRole.REQUESTER:
        # Check if user has permission to review applications for this project
        has_permission = crud.check_reviewer_permission(
            session=session,
            project_id=application.project_id,
            user_id=current_user.id
        )
        if not has_permission:
            raise HTTPException(
                status_code=403,
                detail="You can only update applications for your own projects"
            )
        # Requesters can only change status
        if any([
            application_in.volunteer_role is not None,
            application_in.cover_letter is not None,
            application_in.skills is not None,
            application_in.experience_years is not None,
            application_in.portfolio_url is not None,
            application_in.linkedin_url is not None,
            application_in.github_url is not None
        ]):
            raise HTTPException(
                status_code=403,
                detail="Requesters can only change application status"
            )
    else:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    updated_application = crud.update_application(
        session=session, db_application=application, application_in=application_in
    )
    return ProjectApplicationResponse(data=updated_application)


@router.delete("/{application_id}")
def delete_application(
    session: SessionDep,
    current_user: CurrentUser,
    application_id: uuid.UUID
) -> Message:
    """
    Delete/withdraw an application.
    - ADMIN users can delete any application
    - VOLUNTEER users can withdraw their own applications
    """
    application = crud.get_application_by_id(
        session=session, application_id=application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    if current_user.role == UserRole.ADMIN:
        # Admins can delete any application
        pass
    elif current_user.role == UserRole.VOLUNTEER:
        # Volunteers can only withdraw their own applications
        if application.volunteer_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You can only withdraw your own applications"
            )
    else:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    success = crud.delete_application(
        session=session, application_id=application_id)
    if not success:
        raise HTTPException(status_code=404, detail="Application not found")

    return Message(message="Application deleted successfully")


@router.put("/{application_id}/approve", response_model=ProjectApplicationResponse)
def approve_application(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    application_id: uuid.UUID
) -> Any:
    """
    Approve an application.
    - ADMIN users can approve any application
    - REQUESTER users can approve applications for their own projects
    - VOLUNTEER users with reviewer permission can approve applications
    """
    application = crud.get_application_by_id(
        session=session, application_id=application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    if current_user.role == UserRole.ADMIN:
        # Admins can approve any application
        pass
    elif current_user.role in [UserRole.REQUESTER, UserRole.VOLUNTEER]:
        # Check if user has permission to review applications for this project
        has_permission = crud.check_reviewer_permission(
            session=session,
            project_id=application.project_id,
            user_id=current_user.id
        )
        if not has_permission:
            raise HTTPException(
                status_code=403,
                detail="You don't have permission to review applications for this project"
            )
    else:
        raise HTTPException(
            status_code=403,
            detail="Only admins, project owners, and authorized reviewers can approve applications"
        )

    application_update = ProjectApplicationUpdate(
        status=ApplicationStatus.APPROVED)
    updated_application = crud.update_application(
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
    - ADMIN users can reject any application
    - REQUESTER users can reject applications for their own projects
    - VOLUNTEER users with reviewer permission can reject applications
    """
    application = crud.get_application_by_id(
        session=session, application_id=application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    if current_user.role == UserRole.ADMIN:
        # Admins can reject any application
        pass
    elif current_user.role in [UserRole.REQUESTER, UserRole.VOLUNTEER]:
        # Check if user has permission to review applications for this project
        has_permission = crud.check_reviewer_permission(
            session=session,
            project_id=application.project_id,
            user_id=current_user.id
        )
        if not has_permission:
            raise HTTPException(
                status_code=403,
                detail="You don't have permission to review applications for this project"
            )
    else:
        raise HTTPException(
            status_code=403,
            detail="Only admins, project owners, and authorized reviewers can reject applications"
        )

    application_update = ProjectApplicationUpdate(
        status=ApplicationStatus.REJECTED)
    updated_application = crud.update_application(
        session=session, db_application=application, application_in=application_update
    )
    return ProjectApplicationResponse(data=updated_application)


@router.get("/status/{status}", response_model=ProjectApplicationsPublic)
def read_applications_by_status(
    session: SessionDep,
    current_user: CurrentUser,
    status: ApplicationStatus,
    page: int = 1,
    limit: int = 100
) -> Any:
    """
    Retrieve applications by status.
    Only ADMIN users can access this endpoint.
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=403, detail="Only admins can filter applications by status")

    skip = page_to_skip(page, limit)
    applications, total = crud.get_applications_by_status(
        session=session, status=status, skip=skip, limit=limit
    )

    meta = calculate_pagination_meta_from_page(
        total=total, page=page, limit=limit)
    return ProjectApplicationsPublic(data=applications, meta=meta)


# Reviewer Permission Management

@router.post("/projects/{project_id}/reviewers", response_model=ApplicationReviewerPermissionPublic)
def grant_reviewer_permission(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    project_id: uuid.UUID,
    permission_in: ApplicationReviewerPermissionCreate
) -> Any:
    """
    Grant permission to an approved volunteer to review applications.
    Only the project owner (REQUESTER) can grant this permission.
    The volunteer must be an approved team member of the project.
    If permission was previously revoked, it will be reactivated.
    """
    # Check if project exists
    project = crud.get_project_by_id(session=session, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Only project owner can grant permissions
    if project.requester_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Only the project owner can grant reviewer permissions"
        )

    # Check if the reviewer is an approved volunteer for this project
    is_approved = crud.check_user_is_approved_volunteer(
        session=session,
        project_id=project_id,
        user_id=permission_in.reviewer_id
    )
    if not is_approved:
        raise HTTPException(
            status_code=400,
            detail="Only approved volunteers can be granted reviewer permissions"
        )

    # Grant the permission (will reactivate if previously revoked)
    permission = crud.grant_reviewer_permission(
        session=session,
        project_id=project_id,
        reviewer_id=permission_in.reviewer_id,
        granted_by=current_user.id
    )

    return permission


@router.get("/projects/{project_id}/reviewers", response_model=ApplicationReviewerPermissionsPublic)
def get_project_reviewers(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    project_id: uuid.UUID,
    include_revoked: bool = False
) -> Any:
    """
    Get all reviewers who have permission to review applications for a project.
    Only the project owner can view this list.
    By default, only returns active permissions. Set include_revoked=true to see all.
    """
    # Check if project exists
    project = crud.get_project_by_id(session=session, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Only project owner and admins can view reviewers
    if current_user.role != UserRole.ADMIN and project.requester_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Only the project owner can view reviewer permissions"
        )

    permissions = crud.get_reviewer_permissions_for_project(
        session=session,
        project_id=project_id,
        include_revoked=include_revoked
    )

    return ApplicationReviewerPermissionsPublic(data=permissions, count=len(permissions))


@router.delete("/projects/{project_id}/reviewers/{reviewer_id}", response_model=Message)
def revoke_reviewer_permission(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    project_id: uuid.UUID,
    reviewer_id: uuid.UUID
) -> Any:
    """
    Revoke reviewer permission from a volunteer.
    This sets the status to REVOKED instead of deleting the record.
    Only the project owner can revoke permissions.
    """
    # Check if project exists
    project = crud.get_project_by_id(session=session, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Only project owner can revoke permissions
    if project.requester_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Only the project owner can revoke reviewer permissions"
        )

    # Revoke the permission (sets status to REVOKED)
    success = crud.revoke_reviewer_permission_by_ids(
        session=session,
        project_id=project_id,
        reviewer_id=reviewer_id
    )

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Active reviewer permission not found for this volunteer"
        )

    return Message(message="Reviewer permission revoked successfully")


@router.get("/projects/{project_id}/can-review", response_model=CanReviewResponse)
def can_review_applications(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    project_id: uuid.UUID
) -> CanReviewResponse:
    """
    Check if the current user can review applications for this project.
    Returns True if user is the project owner or has active reviewer permissions.
    """
    # Check if project exists
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Check if user can review (owner or has active permission)
    can_review = crud.check_reviewer_permission(
        session=session,
        project_id=project_id,
        user_id=current_user.id
    )

    return CanReviewResponse(can_review=can_review)
