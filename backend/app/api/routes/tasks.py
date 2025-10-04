import logging
import uuid
import json
from typing import Any

from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import Task, TaskCreate, TaskPublic, TasksPublic, TaskUpdate, TaskResponse, UserRole, Meta, NotificationType
from app import crud
from app.utils import calculate_pagination_meta_from_page

router = APIRouter(prefix="/projects/{project_id}/tasks", tags=["tasks"])

@router.post("/", response_model=TaskResponse)
async def create_task(  # Make this async
    *,
    session: SessionDep,
    current_user: CurrentUser,
    project_id: uuid.UUID,
    task_in: TaskCreate
) -> Any: 
    """Create a new task for a project."""
    # Check if project exists and user has permission
    project = crud.get_project_by_id(session=session, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check permissions
    if current_user.role not in [UserRole.VOLUNTEER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    task = crud.create_task(session=session, task_in=task_in, project_id=project_id)
    
    # Send notification if task is assigned
    if getattr(task, "assignee_id", None):
        try:
            await crud.create_notification(
                session=session,
                user_id=task.assignee_id,
                notification_type=NotificationType.TASK_ASSIGNED,
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
    tasks = crud.get_tasks_by_project_id(session=session, project_id=project_id, skip=skip, limit=limit)
    total = crud.count_tasks_by_project(session=session, project_id=project_id)
    
    meta = calculate_pagination_meta_from_page(page=page, limit=limit, total=total)
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
    """Assign a task to a volunteer."""
    # Check if project exists and user has permission
    project = crud.get_project_by_id(session=session, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Check permissions
    if current_user.role not in [UserRole.VOLUNTEER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    task = crud.assign_task_to_volunteer(session=session, task_id=task_id, volunteer_id=volunteer_id)
    return TaskResponse(data=task)