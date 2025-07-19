from typing import Any
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app import crud
from app.api.deps import CurrentUser, SessionDep
from app.models import (
    ProjectCommentCreate,
    ProjectCommentUpdate,
    ProjectCommentPublic,
    ProjectThreadPublic,
    UserPublic,
    Message,
)

# Remove the path parameter from the prefix
router = APIRouter(tags=["project-threads"])

@router.get("/{project_id}/thread", response_model=ProjectThreadPublic)
def get_project_thread(
    project_id: uuid.UUID, 
    session: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """Get project thread with comments."""
    # Your existing implementation
    project = crud.get_project_by_id(session=session, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Get or create thread
    thread = crud.get_project_thread(session=session, project_id=project_id)
    if not thread:
        thread = crud.create_project_thread(session=session, project_id=project_id)
    
    # Get comments with authors
    comments = crud.get_project_comments(session=session, project_id=project_id)
    comments_with_authors = []
    
    for comment in comments:
        author = crud.get_user_by_id(session=session, user_id=comment.author_id)
        if author:
            comment_public = ProjectCommentPublic(
                id=comment.id,
                content=comment.content,
                project_id=comment.project_id,
                author=UserPublic(
                    id=author.id,
                    email=author.email,
                    is_active=author.is_active,
                    is_superuser=author.is_superuser,
                    firstname=author.firstname,
                    lastname=author.lastname,
                    role=author.role
                ),
                created_at=comment.created_at,
                updated_at=comment.updated_at,
            )
            comments_with_authors.append(comment_public)
    
    return ProjectThreadPublic(
        id=thread.id,
        project_id=thread.project_id,
        comments=comments_with_authors,
        created_at=thread.created_at,
        updated_at=thread.updated_at,
    )

@router.post("/{project_id}/thread/comments", response_model=ProjectCommentPublic)
def create_project_comment(
    project_id: uuid.UUID,
    comment_data: ProjectCommentCreate,
    session: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """Create a new comment in project thread."""
    # Your existing implementation
    project = crud.get_project_by_id(session=session, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    thread = crud.get_project_thread(session=session, project_id=project_id)
    if not thread:
        thread = crud.create_project_thread(session=session, project_id=project_id)
    
    comment = crud.create_project_comment(
        session=session,
        comment_in=comment_data,
        project_id=project_id,
        author_id=current_user.id,
    )
    
    return ProjectCommentPublic(
        id=comment.id,
        content=comment.content,
        project_id=comment.project_id,
        author=UserPublic(
            id=current_user.id,
            email=current_user.email,
            is_active=current_user.is_active,
            is_superuser=current_user.is_superuser,
            firstname=current_user.firstname,
            lastname=current_user.lastname,
            role=current_user.role
        ),
        created_at=comment.created_at,
        updated_at=comment.updated_at,
    )

@router.patch("/{project_id}/thread/comments/{comment_id}", response_model=ProjectCommentPublic)
def update_project_comment(
    project_id: uuid.UUID,  # Add project_id parameter
    comment_id: uuid.UUID,
    comment_data: ProjectCommentUpdate,
    session: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """Update a project comment."""
    comment = crud.get_project_comment_by_id(session=session, comment_id=comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    # Verify the comment belongs to the specified project
    if comment.project_id != project_id:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    # Check if user owns the comment or is admin
    if comment.author_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    # Update comment in database
    updated_comment = crud.update_project_comment(
        session=session, db_comment=comment, comment_in=comment_data
    )
    
    author = crud.get_user_by_id(session=session, user_id=updated_comment.author_id)
    
    return ProjectCommentPublic(
        id=updated_comment.id,
        content=updated_comment.content,
        project_id=updated_comment.project_id,
        author=UserPublic(
            id=author.id,
            email=author.email,
            is_active=author.is_active,
            is_superuser=author.is_superuser,
            firstname=author.firstname,
            lastname=author.lastname,
            role=author.role
        ),
        created_at=updated_comment.created_at,
        updated_at=updated_comment.updated_at,
    )

@router.delete("/{project_id}/thread/comments/{comment_id}", response_model=Message)
def delete_project_comment(
    project_id: uuid.UUID,  # Add project_id parameter
    comment_id: uuid.UUID,
    session: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """Delete a project comment."""
    comment = crud.get_project_comment_by_id(session=session, comment_id=comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    # Verify the comment belongs to the specified project
    if comment.project_id != project_id:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    # Check if user owns the comment or is admin
    if comment.author_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    success = crud.delete_project_comment(session=session, comment_id=comment_id)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to delete comment")
    
    return Message(message="Comment deleted successfully")