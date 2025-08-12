import uuid
from typing import Any
from datetime import datetime, timezone

from sqlmodel import Session, select, func

from app.core.security import get_password_hash, verify_password
from app.models import Item, ItemCreate, User, UserCreate, UserUpdate, Project, ProjectCreate, ProjectUpdate, ProjectStatus, Task, TaskCreate, TaskUpdate
from app.models import ProjectThread, ProjectComment, ProjectCommentCreate, ProjectCommentUpdate
from app.models import ProjectApplication, ProjectApplicationCreate, ProjectApplicationUpdate, ApplicationStatus


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


# Project Application CRUD operations
def create_project_application(*, session: Session, application_in: ProjectApplicationCreate, project_id: uuid.UUID, applicant_id: uuid.UUID | None = None) -> ProjectApplication:
    """Create a new project application"""
    db_application = ProjectApplication.model_validate(
        application_in, 
        update={
            "project_id": project_id,
            "applicant_id": applicant_id
        }
    )
    session.add(db_application)
    session.commit()
    session.refresh(db_application)
    return db_application


def get_project_application_by_id(*, session: Session, application_id: uuid.UUID) -> ProjectApplication | None:
    """Get project application by ID"""
    return session.get(ProjectApplication, application_id)


def get_project_applications_by_project(*, session: Session, project_id: uuid.UUID, skip: int = 0, limit: int = 100) -> list[ProjectApplication]:
    """Get all applications for a specific project"""
    statement = select(ProjectApplication).where(
        ProjectApplication.project_id == project_id
    ).offset(skip).limit(limit).order_by(ProjectApplication.created_at.desc())
    return session.exec(statement).all()


def get_project_applications_by_user(*, session: Session, applicant_id: uuid.UUID, skip: int = 0, limit: int = 100) -> list[ProjectApplication]:
    """Get all applications by a specific user"""
    statement = select(ProjectApplication).where(
        ProjectApplication.applicant_id == applicant_id
    ).offset(skip).limit(limit).order_by(ProjectApplication.created_at.desc())
    return session.exec(statement).all()


def get_all_project_applications(*, session: Session, skip: int = 0, limit: int = 100) -> list[ProjectApplication]:
    """Get all project applications (admin only)"""
    statement = select(ProjectApplication).offset(skip).limit(limit).order_by(ProjectApplication.created_at.desc())
    return session.exec(statement).all()


def update_project_application(*, session: Session, db_application: ProjectApplication, application_in: ProjectApplicationUpdate) -> ProjectApplication:
    """Update a project application"""
    application_data = application_in.model_dump(exclude_unset=True)
    application_data["updated_at"] = datetime.now(timezone.utc)
    
    db_application.sqlmodel_update(application_data)
    session.add(db_application)
    session.commit()
    session.refresh(db_application)
    return db_application


def delete_project_application(*, session: Session, application_id: uuid.UUID) -> bool:
    """Delete a project application"""
    application = session.get(ProjectApplication, application_id)
    if application:
        session.delete(application)
        session.commit()
        return True
    return False


def count_project_applications_by_project(*, session: Session, project_id: uuid.UUID) -> int:
    """Count applications for a specific project"""
    statement = select(func.count(ProjectApplication.id)).where(ProjectApplication.project_id == project_id)
    return session.exec(statement).one() or 0


def count_project_applications_by_user(*, session: Session, applicant_id: uuid.UUID) -> int:
    """Count applications by a specific user"""
    statement = select(func.count(ProjectApplication.id)).where(ProjectApplication.applicant_id == applicant_id)
    return session.exec(statement).one() or 0


def check_existing_application(*, session: Session, project_id: uuid.UUID, email: str) -> ProjectApplication | None:
    """Check if user already applied to the project using email"""
    statement = select(ProjectApplication).where(
        ProjectApplication.project_id == project_id,
        ProjectApplication.email == email
    )
    return session.exec(statement).first()