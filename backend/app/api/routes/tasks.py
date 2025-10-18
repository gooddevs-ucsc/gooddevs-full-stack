import logging
import uuid
import json
from typing import Any

from fastapi import APIRouter, HTTPException, Depends, Path
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import Task, TaskCreate, TaskPublic, TasksPublic, TaskUpdate, TaskResponse, UserRole, Meta, NotificationType, ApplicationStatus, CanCreateTaskResponse
from app import crud
from app.utils import calculate_pagination_meta_from_page

router = APIRouter(prefix="/projects/{project_id}/tasks", tags=["tasks"])


def check_user_can_create_task(session: SessionDep, project_id: uuid.UUID, user_id: uuid.UUID) -> bool:
    """
    Check if the user can create a task for the project.
    Returns True if user is either:
    - The project owner (requester)
    - An approved applicant for the project
    """
    # Get the project
    project = crud.get_project_by_id(session=session, project_id=project_id)
    if not project:
        return False

    # Check if user is the project owner
    if project.requester_id == user_id:
        return True

    # Check if user is an approved applicant
    application = crud.get_application_by_project_and_volunteer(
        session=session,
        project_id=project_id,
        volunteer_id=user_id
    )

    if application and application.status == ApplicationStatus.APPROVED:
        return True

    return False


def validate_assignee_is_approved_applicant(session: SessionDep, project_id: uuid.UUID, assignee_id: uuid.UUID) -> None:
    """
    Validate that the assignee is an approved applicant for the project.
    Raises HTTPException if validation fails.
    """
    application = crud.get_application_by_project_and_volunteer(
        session=session,
        project_id=project_id,
        volunteer_id=assignee_id
    )

    if not application:
        raise HTTPException(
            status_code=400,
            detail="Cannot assign task. User has not applied to this project."
        )

    if application.status != ApplicationStatus.APPROVED:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot assign task. User's application status is {application.status}. Only approved applicants can be assigned tasks."
        )


@router.get("/can-create", response_model=CanCreateTaskResponse)
def can_create_task(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    project_id: uuid.UUID = Path(...)
) -> Any:
    """Check if the current user can create tasks for this project."""
    can_create = check_user_can_create_task(
        session=session,
        project_id=project_id,
        user_id=current_user.id
    )
    return CanCreateTaskResponse(can_create=can_create)


@router.post("/", response_model=TaskResponse)
async def create_task(  # Make this async
    *,
    session: SessionDep,
    current_user: CurrentUser,
    project_id: uuid.UUID,
    task_in: TaskCreate
) -> Any:
    """Create a new task for a project. Only project owner or approved applicants can create tasks."""
    # Check if project exists
    project = crud.get_project_by_id(session=session, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Check if user can create task (must be project owner or approved applicant)
    if not check_user_can_create_task(session=session, project_id=project_id, user_id=current_user.id):
        raise HTTPException(
            status_code=403,
            detail="Only project owner or approved applicants can create tasks for this project"
        )

    # Validate assignee if provided
    if task_in.assignee_id:
        validate_assignee_is_approved_applicant(
            session=session,
            project_id=project_id,
            assignee_id=task_in.assignee_id
        )

    task = crud.create_task(
        session=session, task_in=task_in, project_id=project_id)

    # Send notification if task is assigned
    if getattr(task, "assignee_id", None):
        try:
            await crud.create_notification(
                session=session,
                user_id=task.assignee_id,
                type=NotificationType.TASK_ASSIGNED,
                title="New Task Assigned",
                message=f"A new task has been assigned to you: {task.title}",
                related_entity_id=task.id,
                related_entity_type="task",
                action_url=f"/projects/{project_id}/tasks/{task.id}"
            )
        except Exception as e:
            logging.warning(f"Could not send notification: {e}")

    return TaskResponse(data=task)


@router.get("/", response_model=TasksPublic)
def read_tasks(
    session: SessionDep,
    current_user: CurrentUser,
    project_id: uuid.UUID,
    page: int = 1,
    limit: int = 10
) -> Any:
    """Get all tasks for a project."""
    # Check if project exists and user has permission
    project = crud.get_project_by_id(session=session, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    skip = (page - 1) * limit
    tasks = crud.get_tasks_by_project_id(
        session=session, project_id=project_id, skip=skip, limit=limit)
    total = crud.count_tasks_by_project(session=session, project_id=project_id)

    meta = calculate_pagination_meta_from_page(
        page=page, limit=limit, total=total)
    return TasksPublic(data=tasks, meta=meta)


@router.get("/{task_id}", response_model=TaskResponse)
def read_task(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    project_id: uuid.UUID,
    task_id: uuid.UUID
) -> Any:
    """Get a specific task."""
    task = crud.get_task_by_id(session=session, task_id=task_id)
    if not task or task.project_id != project_id:
        raise HTTPException(status_code=404, detail="Task not found")

    return TaskResponse(data=task)


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    project_id: uuid.UUID,
    task_id: uuid.UUID,
    task_in: TaskUpdate
) -> Any:
    """Update a task."""
    task = crud.get_task_by_id(session=session, task_id=task_id)
    if not task or task.project_id != project_id:
        raise HTTPException(status_code=404, detail="Task not found")

    # Check permissions (similar to project permissions)
    if current_user.role not in [UserRole.ADMIN, UserRole.VOLUNTEER]:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    # Validate assignee if being changed
    if task_in.assignee_id:
        validate_assignee_is_approved_applicant(
            session=session,
            project_id=project_id,
            assignee_id=task_in.assignee_id
        )

    task = crud.update_task(session=session, db_task=task, task_in=task_in)
    return TaskResponse(data=task)


@router.delete("/{task_id}")
def delete_task(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    project_id: uuid.UUID,
    task_id: uuid.UUID
) -> Any:
    """Delete a task."""
    task = crud.get_task_by_id(session=session, task_id=task_id)
    if not task or task.project_id != project_id:
        raise HTTPException(status_code=404, detail="Task not found")

    # Check permissions
    if current_user.role not in [UserRole.VOLUNTEER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    success = crud.delete_task(session=session, task_id=task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")

    return {"message": "Task deleted successfully"}


@router.put("/{task_id}/assign", response_model=TaskResponse)
def assign_task(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    project_id: uuid.UUID,
    task_id: uuid.UUID,
    volunteer_id: uuid.UUID
) -> Any:
    """Assign a task to an approved applicant."""
    # Check if project exists and user has permission
    project = crud.get_project_by_id(session=session, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Check permissions
    if current_user.role not in [UserRole.VOLUNTEER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    # Validate that the volunteer is an approved applicant
    validate_assignee_is_approved_applicant(
        session=session,
        project_id=project_id,
        assignee_id=volunteer_id
    )

    task = crud.assign_task_to_volunteer(
        session=session, task_id=task_id, volunteer_id=volunteer_id)
    return TaskResponse(data=task)
