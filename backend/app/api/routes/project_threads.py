from typing import Any
import uuid

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select

from app import crud
from app.api.deps import CurrentUser, SessionDep
from app.models import (
    CommentCreate,
    CommentPublic,
    CommentsPublic,
    CommentUpdate,
    Message,
    Meta,
    ProjectThreadCreate,
    ProjectThreadPublic,
    ProjectThreadsPublic,
)

router = APIRouter()

@router.get("/{project_id}/threads", response_model=ProjectThreadsPublic)
def read_project_threads(
    *,
    session: SessionDep,
    project_id: uuid.UUID,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve threads for a project.
    """
    project = crud.get_project_by_id(session=session, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    threads, count = crud.get_project_threads_by_project_id(
        session=session, project_id=project_id, skip=skip, limit=limit
    )
    return ProjectThreadsPublic(
        data=threads,
        meta=Meta(total=count, page=skip // limit + 1, totalPages=(count + limit - 1) // limit),
    )


@router.post("/{project_id}/threads", response_model=ProjectThreadPublic)
def create_project_thread(
    *,
    session: SessionDep,
    project_id: uuid.UUID,
    thread_in: ProjectThreadCreate,
    current_user: CurrentUser,
) -> Any:
    """
    Create new thread for a project.
    """
    project = crud.get_project_by_id(session=session, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    thread = crud.create_project_thread(
        session=session,
        thread_in=thread_in,
        author_id=current_user.id,
        project_id=project_id,
    )
    return thread


@router.get("/threads/{thread_id}", response_model=ProjectThreadPublic)
def read_project_thread(
    *, session: SessionDep, thread_id: uuid.UUID
) -> Any:
    """
    Get a specific thread by ID.
    """
    thread = crud.get_project_thread_by_id(session=session, thread_id=thread_id)
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")
    return thread


@router.get("/threads/{thread_id}/comments", response_model=CommentsPublic)
def read_comments(
    *,
    session: SessionDep,
    thread_id: uuid.UUID,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve comments for a thread.
    """
    thread = crud.get_project_thread_by_id(session=session, thread_id=thread_id)
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")

    comments, count = crud.get_comments_by_thread_id(
        session=session, thread_id=thread_id, skip=skip, limit=limit
    )
    return CommentsPublic(
        data=comments,
        meta=Meta(total=count, page=skip // limit + 1, totalPages=(count + limit - 1) // limit),
    )


@router.post("/threads/{thread_id}/comments", response_model=CommentPublic)
def create_comment(
    *,
    session: SessionDep,
    thread_id: uuid.UUID,
    comment_in: CommentCreate,
    current_user: CurrentUser,
) -> Any:
    """
    Create a new comment for a thread.
    """
    thread = crud.get_project_thread_by_id(session=session, thread_id=thread_id)
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")

    comment = crud.create_comment(
        session=session,
        comment_in=comment_in,
        thread_id=thread_id,
        author_id=current_user.id,
    )
    return comment


@router.patch("/threads/{thread_id}/comments/{comment_id}", response_model=CommentPublic)
def update_comment(
    *,
    session: SessionDep,
    thread_id: uuid.UUID,
    comment_id: uuid.UUID,
    comment_in: CommentUpdate,
    current_user: CurrentUser,
) -> Any:
    """
    Update a comment.
    """
    comment = crud.get_comment_by_id(session=session, comment_id=comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if comment.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    comment = crud.update_comment(
        session=session, db_comment=comment, comment_in=comment_in
    )
    return comment


@router.delete("/threads/{thread_id}/comments/{comment_id}", response_model=Message)
def delete_comment(
    *, session: SessionDep, comment_id: uuid.UUID, current_user: CurrentUser, thread_id: uuid.UUID
) -> Any:
    """
    Delete a comment.
    """
    comment = crud.get_comment_by_id(session=session, comment_id=comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if comment.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    crud.delete_comment(session=session, db_comment=comment)
    return Message(message="Comment deleted successfully")