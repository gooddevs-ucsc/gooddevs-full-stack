import uuid
from typing import Any
from datetime import datetime, timezone

from sqlmodel import Session, select

from app.core.security import get_password_hash, verify_password
from app.models import Item, ItemCreate, User, UserCreate, UserUpdate, Project, ProjectCreate, ProjectUpdate, ProjectStatus
from app.models import ProjectThread, ProjectComment, ProjectCommentCreate, ProjectCommentUpdate


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

# Project Thread CRUD operations
def get_project_thread(*, session: Session, project_id: uuid.UUID) -> ProjectThread | None:
    statement = select(ProjectThread).where(ProjectThread.project_id == project_id)
    return session.exec(statement).first()

def create_project_thread(*, session: Session, project_id: uuid.UUID) -> ProjectThread:
    db_thread = ProjectThread(project_id=project_id)
    session.add(db_thread)
    session.commit()
    session.refresh(db_thread)
    return db_thread

def get_project_comments(*, session: Session, project_id: uuid.UUID, skip: int = 0, limit: int = 100) -> list[ProjectComment]:
    statement = select(ProjectComment).where(
        ProjectComment.project_id == project_id
    ).offset(skip).limit(limit).order_by(ProjectComment.created_at)
    return session.exec(statement).all()

def create_project_comment(*, session: Session, comment_in: ProjectCommentCreate, project_id: uuid.UUID, author_id: uuid.UUID) -> ProjectComment:
    db_comment = ProjectComment.model_validate(
        comment_in, update={"project_id": project_id, "author_id": author_id}
    )
    session.add(db_comment)
    session.commit()
    session.refresh(db_comment)
    return db_comment

def update_project_comment(*, session: Session, db_comment: ProjectComment, comment_in: ProjectCommentUpdate) -> ProjectComment:
    comment_data = comment_in.model_dump(exclude_unset=True)
    comment_data["updated_at"] = datetime.now(timezone.utc)
    
    db_comment.sqlmodel_update(comment_data)
    session.add(db_comment)
    session.commit()
    session.refresh(db_comment)
    return db_comment

def delete_project_comment(*, session: Session, comment_id: uuid.UUID) -> bool:
    comment = session.get(ProjectComment, comment_id)
    if comment:
        session.delete(comment)
        session.commit()
        return True
    return False

def get_project_comment_by_id(*, session: Session, comment_id: uuid.UUID) -> ProjectComment | None:
    return session.get(ProjectComment, comment_id)