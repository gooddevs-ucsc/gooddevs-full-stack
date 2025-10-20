import uuid
from typing import Any

from fastapi import APIRouter, HTTPException, Depends

from app.api.deps import CurrentUser, SessionDep
from app.models import (
    OpenPositionCreate, OpenPositionUpdate, OpenPositionPublic, 
    OpenPositionsPublic, OpenPositionResponse, Message, UserRole
)
from app import crud

router = router = APIRouter(tags=["open-positions"])


@router.get("/projects/{project_id}/open-positions", response_model=OpenPositionsPublic)
def get_project_open_positions(
    *,
    session: SessionDep,
    project_id: uuid.UUID
) -> Any:
    """
    Get all open positions for a project.
    Public endpoint - anyone can view open positions.
    """
    # Verify project exists
    project = crud.get_project_by_id(session=session, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    positions = crud.get_open_positions_by_project(
        session=session, project_id=project_id
    )
    
    return OpenPositionsPublic(data=positions, count=len(positions))


@router.post("/projects/{project_id}/open-positions", response_model=OpenPositionResponse)
def create_open_position(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    project_id: uuid.UUID,
    position_in: OpenPositionCreate
) -> Any:
    """
    Create a new open position for a project.
    Only users with review permissions can create positions.
    """
    # Verify project exists
    project = crud.get_project_by_id(session=session, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check permissions
    if current_user.role == UserRole.ADMIN:
        # Admins can create positions for any project
        pass
    elif current_user.role == UserRole.REQUESTER and project.requester_id == current_user.id:
        # Project owners can create positions
        pass
    elif crud.check_reviewer_permission(
        session=session, project_id=project_id, user_id=current_user.id
    ):
        # Users with reviewer permissions can create positions
        pass
    else:
        raise HTTPException(
            status_code=403, 
            detail="Not enough permissions to create open positions"
        )
    
    try:
        position = crud.create_open_position(
            session=session, position_in=position_in, project_id=project_id
        )
        return OpenPositionResponse(data=position)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/open-positions/{position_id}", response_model=OpenPositionResponse)
def update_open_position(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    position_id: uuid.UUID,
    position_in: OpenPositionUpdate
) -> Any:
    """
    Update an open position.
    Only users with review permissions can update positions.
    """
    position = crud.get_open_position_by_id(session=session, position_id=position_id)
    if not position:
        raise HTTPException(status_code=404, detail="Open position not found")
    
    # Get project to check permissions
    project = crud.get_project_by_id(session=session, project_id=position.project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check permissions
    if current_user.role == UserRole.ADMIN:
        # Admins can update any position
        pass
    elif current_user.role == UserRole.REQUESTER and project.requester_id == current_user.id:
        # Project owners can update positions
        pass
    elif crud.check_reviewer_permission(
        session=session, project_id=position.project_id, user_id=current_user.id
    ):
        # Users with reviewer permissions can update positions
        pass
    else:
        raise HTTPException(
            status_code=403, 
            detail="Not enough permissions to update open positions"
        )
    
    updated_position = crud.update_open_position(
        session=session, db_position=position, position_in=position_in
    )
    return OpenPositionResponse(data=updated_position)


@router.delete("/open-positions/{position_id}")
def delete_open_position(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    position_id: uuid.UUID
) -> Message:
    """
    Delete an open position.
    Only users with review permissions can delete positions.
    """
    position = crud.get_open_position_by_id(session=session, position_id=position_id)
    if not position:
        raise HTTPException(status_code=404, detail="Open position not found")
    
    # Get project to check permissions
    project = crud.get_project_by_id(session=session, project_id=position.project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check permissions
    if current_user.role == UserRole.ADMIN:
        # Admins can delete any position
        pass
    elif current_user.role == UserRole.REQUESTER and project.requester_id == current_user.id:
        # Project owners can delete positions
        pass
    elif crud.check_reviewer_permission(
        session=session, project_id=position.project_id, user_id=current_user.id
    ):
        # Users with reviewer permissions can delete positions
        pass
    else:
        raise HTTPException(
            status_code=403, 
            detail="Not enough permissions to delete open positions"
        )
    
    success = crud.delete_open_position(session=session, position_id=position_id)
    if not success:
        raise HTTPException(status_code=404, detail="Open position not found")
    
    return Message(message="Open position deleted successfully")


@router.get("/projects/{project_id}/can-manage-positions")
def can_manage_open_positions(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    project_id: uuid.UUID
) -> dict[str, bool]:
    """
    Check if current user can manage open positions for a project.
    """
    # Verify project exists
    project = crud.get_project_by_id(session=session, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    can_manage = False
    
    if current_user.role == UserRole.ADMIN:
        can_manage = True
    elif current_user.role == UserRole.REQUESTER and project.requester_id == current_user.id:
        can_manage = True
    elif crud.check_reviewer_permission(
        session=session, project_id=project_id, user_id=current_user.id
    ):
        can_manage = True
    
    return {"can_manage": can_manage}