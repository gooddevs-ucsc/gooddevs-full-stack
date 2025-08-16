import uuid
from typing import Any
from datetime import datetime, timezone

from sqlmodel import Session, select, func

from app.core.security import get_password_hash, verify_password
from app.models import Item, ItemCreate, User, UserCreate, UserUpdate, Project, ProjectCreate, ProjectUpdate, ProjectStatus, Task, TaskCreate, TaskUpdate, ProjectThread, ProjectThreadCreate, Comment, CommentCreate, CommentUpdate


def create_user(*, session: Session, user_create: UserCreate) -> User:
    db_obj = User.model_validate(
        user_create, update={
            "hashed_password": get_password_hash(user_create.password)}
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def update_user(*, session: Session, db_user: User, user_in: UserUpdate) -> Any:
    user_data = user_in.model_dump(exclude_unset=True)
    extra_data = {}
    if "password" in user_data:
        password = user_data["password"]
        hashed_password = get_password_hash(password)
        extra_data["hashed_password"] = hashed_password
    db_user.sqlmodel_update(user_data, update=extra_data)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


def get_user_by_email(*, session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    session_user = session.exec(statement).first()
    return session_user


def authenticate(*, session: Session, email: str, password: str) -> User | None:
    db_user = get_user_by_email(session=session, email=email)
    if not db_user:
        return None
    if not verify_password(password, db_user.hashed_password):
        return None
    return db_user


def create_item(*, session: Session, item_in: ItemCreate, owner_id: uuid.UUID) -> Item:
    db_item = Item.model_validate(item_in, update={"owner_id": owner_id})
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item


# Project CRUD operations
def create_project(*, session: Session, project_in: ProjectCreate, requester_id: uuid.UUID) -> Project:
    db_project = Project.model_validate(
        project_in, update={"requester_id": requester_id})
    session.add(db_project)
    session.commit()
    session.refresh(db_project)
    return db_project


def get_project_by_id(*, session: Session, project_id: uuid.UUID) -> Project | None:
    return session.get(Project, project_id)


def get_approved_projects(*, session: Session, skip: int = 0, limit: int = 100) -> list[Project]:
    statement = select(Project).where(
        Project.status == ProjectStatus.APPROVED).offset(skip).limit(limit)
    return session.exec(statement).all()


def get_pending_projects(*, session: Session, skip: int = 0, limit: int = 100) -> list[Project]:
    statement = select(Project).where(
        Project.status == ProjectStatus.PENDING).offset(skip).limit(limit)
    return session.exec(statement).all()


def get_all_projects(*, session: Session, skip: int = 0, limit: int = 100) -> list[Project]:
    statement = select(Project).offset(skip).limit(limit)
    return session.exec(statement).all()


def update_project(*, session: Session, db_project: Project, project_in: ProjectUpdate) -> Project:
    project_data = project_in.model_dump(exclude_unset=True)
    project_data["updated_at"] = datetime.now(timezone.utc)

    db_project.sqlmodel_update(project_data)
    session.add(db_project)
    session.commit()
    session.refresh(db_project)
    return db_project


def delete_project(*, session: Session, project_id: uuid.UUID) -> bool:
    project = session.get(Project, project_id)
    if project:
        session.delete(project)
        session.commit()
        return True
    return False

def get_user_by_id(*, session: Session, user_id: uuid.UUID) -> User | None:
    return session.get(User, user_id)


# Task CRUD operations
def create_task(*, session: Session, task_in: TaskCreate, project_id: uuid.UUID)-> Task:
    db_task = Task.model_validate(task_in, update={"project_id": project_id})
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

def update_task(*, session: Session, db_task: Task, task_in: TaskUpdate) -> Task:
    task_data = task_in.model_dump(exclude_unset=True)
    task_data["updated_at"] = datetime.now(timezone.utc)
    
    db_task.sqlmodel_update(task_data)
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

def delete_task(*, session: Session, task_id: uuid.UUID)-> bool:
    task = session.get(Task, task_id)
    
    if task:
        session.delete(task)
        session.commit()
        return True
    return False

def get_task_by_id(*, session: Session, task_id: uuid.UUID)-> Task | None:
    return session.get(Task, task_id)

def get_tasks_by_project_id(*, session: Session, project_id: uuid.UUID, skip: int = 0, limit: int = 100)-> list[Task]:
    statement = select(Task).where(Task.project_id == project_id).offset(skip).limit(limit)
    return session.exec(statement).all()

def count_tasks_by_project(*, session: Session, project_id: uuid.UUID)-> int:
    statement = select(func.count(Task.id)).where(Task.project_id == project_id)
    return session.exec(statement).one() or 0


# Project Thread CRUD operations
def get_project_threads_by_project_id(
    *, session: Session, project_id: uuid.UUID, skip: int = 0, limit: int = 100
) -> tuple[list[ProjectThread], int]:
    statement = (
        select(ProjectThread)
        .where(ProjectThread.project_id == project_id)
        .offset(skip)
        .limit(limit)
        .order_by(ProjectThread.created_at.desc())
    )
    threads = session.exec(statement).all()
    count_statement = select(func.count(ProjectThread.id)).where(
        ProjectThread.project_id == project_id
    )
    count = session.exec(count_statement).one()
    return threads, count


def get_project_thread_by_id(
    *, session: Session, thread_id: uuid.UUID
) -> ProjectThread | None:
    return session.get(ProjectThread, thread_id)


def create_project_thread(
    *,
    session: Session,
    thread_in: ProjectThreadCreate,
    author_id: uuid.UUID,
    project_id: uuid.UUID,
) -> ProjectThread:
    db_thread = ProjectThread.model_validate(
        thread_in, update={"author_id": author_id, "project_id": project_id}
    )
    session.add(db_thread)
    session.commit()
    session.refresh(db_thread)
    return db_thread


# Comment CRUD operations
def get_comment_by_id(*, session: Session, comment_id: uuid.UUID) -> Comment | None:
    return session.get(Comment, comment_id)


def get_comments_by_thread_id(
    *, session: Session, thread_id: uuid.UUID, skip: int = 0, limit: int = 10
) -> tuple[list[Comment], int]:
    statement = (
        select(Comment)
        .where(Comment.thread_id == thread_id)
        .offset(skip)
        .limit(limit)
        .order_by(Comment.created_at.asc())
    )
    comments = session.exec(statement).all()
    count_statement = select(func.count(Comment.id)).where(
        Comment.thread_id == thread_id
    )
    count = session.exec(count_statement).one()
    return comments, count


def create_comment(
    *,
    session: Session,
    comment_in: CommentCreate,
    thread_id: uuid.UUID,
    author_id: uuid.UUID,
) -> Comment:
    db_comment = Comment.model_validate(
        comment_in, update={"thread_id": thread_id, "author_id": author_id}
    )
    session.add(db_comment)
    session.commit()
    session.refresh(db_comment)
    return db_comment


def update_comment(
    *, session: Session, db_comment: Comment, comment_in: CommentUpdate
) -> Comment:
    comment_data = comment_in.model_dump(exclude_unset=True)
    db_comment.sqlmodel_update(comment_data)
    session.add(db_comment)
    session.commit()
    session.refresh(db_comment)
    return db_comment


def delete_comment(*, session: Session, db_comment: Comment) -> None:
    session.delete(db_comment)
    session.commit()