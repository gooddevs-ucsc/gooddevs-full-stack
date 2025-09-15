from sqlalchemy.orm import selectinload
from app.models import (
    Item, ItemCreate, User, UserCreate, UserUpdate, Project, ProjectCreate, ProjectUpdate, ProjectStatus, Task, TaskCreate, TaskUpdate, ProjectThread,
    ProjectThreadCreate, Comment, CommentCreate, CommentUpdate, CommentPublic, Reply, ReplyCreate, ReplyUpdate, ReplyPublic, Payment, PaymentCreate,
    PaymentCurrency,  ProjectApplication, ProjectApplicationCreate, ProjectApplicationUpdate, ApplicationStatus
)

import uuid
from typing import Any
from datetime import datetime, timezone

from sqlmodel import Session, select, func

from app.core.security import get_password_hash, verify_password


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
def create_task(*, session: Session, task_in: TaskCreate, project_id: uuid.UUID) -> Task:
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


def delete_task(*, session: Session, task_id: uuid.UUID) -> bool:
    task = session.get(Task, task_id)

    if task:
        session.delete(task)
        session.commit()
        return True
    return False


def get_task_by_id(*, session: Session, task_id: uuid.UUID) -> Task | None:
    return session.get(Task, task_id)


def get_tasks_by_project_id(*, session: Session, project_id: uuid.UUID, skip: int = 0, limit: int = 100) -> list[Task]:
    statement = select(Task).where(Task.project_id ==
                                   project_id).offset(skip).limit(limit)
    return session.exec(statement).all()


def count_tasks_by_project(*, session: Session, project_id: uuid.UUID) -> int:
    statement = select(func.count(Task.id)).where(
        Task.project_id == project_id)
    return session.exec(statement).one() or 0


def assign_task_to_volunteer(*, session: Session, task_id: uuid.UUID, volunteer_id: uuid.UUID) -> Task:
    db_task = session.get(Task, task_id)
    if not db_task:
        raise ValueError("Task not found")

    db_task.assignee_id = volunteer_id
    db_task.updated_at = datetime.now(timezone.utc)

    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task


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
    # Step 1: Fetch the thread itself.
    thread = session.get(ProjectThread, thread_id)
    if not thread:
        return None

    # Step 2: Fetch all comments for this thread, with their authors and replies.
    all_comments = session.exec(
        select(Comment)
        .where(Comment.thread_id == thread_id)
        .options(selectinload(Comment.author), selectinload(Comment.replies).selectinload(Reply.author))
    ).all()

    # Step 3: Sort comments by creation date for correct order.
    all_comments.sort(key=lambda c: c.created_at)

    # Step 4: Sort replies within each comment by creation date.
    for comment in all_comments:
        comment.replies.sort(key=lambda r: r.created_at)

    # Step 5: Assign the correctly structured list of comments back to the thread.
    thread.comments = all_comments

    return thread


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
    print(f"Creating comment for thread: {thread_id}")
    db_comment = Comment(
        body=comment_in.body,
        thread_id=thread_id,
        author_id=author_id,
    )
    session.add(db_comment)
    session.commit()
    session.refresh(db_comment)
    print(f"Created comment with ID: {db_comment.id}")
    return db_comment


# Reply CRUD operations
def get_reply_by_id(*, session: Session, reply_id: uuid.UUID) -> Reply | None:
    return session.get(Reply, reply_id)


def get_replies_by_comment_id(
    *, session: Session, comment_id: uuid.UUID, skip: int = 0, limit: int = 10
) -> tuple[list[Reply], int]:
    statement = (
        select(Reply)
        .where(Reply.parent_id == comment_id)
        .offset(skip)
        .limit(limit)
        .order_by(Reply.created_at.asc())
    )
    replies = session.exec(statement).all()
    count_statement = select(func.count(Reply.id)).where(
        Reply.parent_id == comment_id
    )
    count = session.exec(count_statement).one()
    return replies, count


def create_reply(
    *,
    session: Session,
    reply_in: ReplyCreate,
    author_id: uuid.UUID,
) -> Reply:
    print(f"Creating reply for comment: {reply_in.parent_id}")
    # Verify the parent comment exists
    parent_comment = session.get(Comment, reply_in.parent_id)
    if not parent_comment:
        raise ValueError("Parent comment not found")

    db_reply = Reply(
        body=reply_in.body,
        parent_id=reply_in.parent_id,
        author_id=author_id,
    )
    session.add(db_reply)
    session.commit()
    session.refresh(db_reply)
    print(f"Created reply with ID: {db_reply.id}")
    return db_reply


def update_reply(
    *, session: Session, db_reply: Reply, reply_in: ReplyUpdate
) -> Reply:
    reply_data = reply_in.model_dump(exclude_unset=True)
    db_reply.sqlmodel_update(reply_data)
    session.add(db_reply)
    session.commit()
    session.refresh(db_reply)
    return db_reply


def delete_reply(*, session: Session, db_reply: Reply) -> None:
    session.delete(db_reply)
    session.commit()


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


# Project Application CRUD operations
def create_application(
    *,
    session: Session,
    application_in: ProjectApplicationCreate,
    project_id: uuid.UUID,
    volunteer_id: uuid.UUID
) -> ProjectApplication:
    """Create a new project application"""
    db_application = ProjectApplication.model_validate(
        application_in,
        update={
            "project_id": project_id,
            "volunteer_id": volunteer_id
        }
    )
    session.add(db_application)
    session.commit()
    session.refresh(db_application)
    return db_application


def get_application_by_id(*, session: Session, application_id: uuid.UUID) -> ProjectApplication | None:
    """Get application by ID"""
    return session.get(ProjectApplication, application_id)


def get_application_by_project_and_volunteer(
    *,
    session: Session,
    project_id: uuid.UUID,
    volunteer_id: uuid.UUID
) -> ProjectApplication | None:
    """Check if volunteer has already applied to this project"""
    statement = select(ProjectApplication).where(
        ProjectApplication.project_id == project_id,
        ProjectApplication.volunteer_id == volunteer_id
    )
    return session.exec(statement).first()


def get_applications_by_project_id(
    *,
    session: Session,
    project_id: uuid.UUID,
    skip: int = 0,
    limit: int = 100
) -> tuple[list[ProjectApplication], int]:
    """Get all applications for a specific project"""
    statement = (
        select(ProjectApplication)
        .where(ProjectApplication.project_id == project_id)
        .options(selectinload(ProjectApplication.volunteer))
        .offset(skip)
        .limit(limit)
        .order_by(ProjectApplication.created_at.desc())
    )
    applications = session.exec(statement).all()

    count_statement = select(func.count(ProjectApplication.id)).where(
        ProjectApplication.project_id == project_id
    )
    count = session.exec(count_statement).one()

    return applications, count


def get_applications_by_volunteer_id(
    *,
    session: Session,
    volunteer_id: uuid.UUID,
    skip: int = 0,
    limit: int = 100
) -> tuple[list[ProjectApplication], int]:
    """Get all applications by a specific volunteer"""
    statement = (
        select(ProjectApplication)
        .where(ProjectApplication.volunteer_id == volunteer_id)
        .options(selectinload(ProjectApplication.project))
        .offset(skip)
        .limit(limit)
        .order_by(ProjectApplication.created_at.desc())
    )
    applications = session.exec(statement).all()

    count_statement = select(func.count(ProjectApplication.id)).where(
        ProjectApplication.volunteer_id == volunteer_id
    )
    count = session.exec(count_statement).one()

    return applications, count


def get_applications_by_status(
    *,
    session: Session,
    status: ApplicationStatus,
    skip: int = 0,
    limit: int = 100
) -> tuple[list[ProjectApplication], int]:
    """Get applications by status"""
    statement = (
        select(ProjectApplication)
        .where(ProjectApplication.status == status)
        .options(
            selectinload(ProjectApplication.volunteer),
            selectinload(ProjectApplication.project)
        )
        .offset(skip)
        .limit(limit)
        .order_by(ProjectApplication.created_at.desc())
    )
    applications = session.exec(statement).all()

    count_statement = select(func.count(ProjectApplication.id)).where(
        ProjectApplication.status == status
    )
    count = session.exec(count_statement).one()

    return applications, count


def update_application(
    *,
    session: Session,
    db_application: ProjectApplication,
    application_in: ProjectApplicationUpdate
) -> ProjectApplication:
    """Update an existing application"""
    application_data = application_in.model_dump(exclude_unset=True)
    application_data["updated_at"] = datetime.now(timezone.utc)

    db_application.sqlmodel_update(application_data)
    session.add(db_application)
    session.commit()
    session.refresh(db_application)
    return db_application


def delete_application(*, session: Session, application_id: uuid.UUID) -> bool:
    """Delete an application"""
    application = session.get(ProjectApplication, application_id)
    if application:
        session.delete(application)
        session.commit()
        return True
    return False


def get_all_applications(
    *,
    session: Session,
    skip: int = 0,
    limit: int = 100
) -> tuple[list[ProjectApplication], int]:
    """Get all applications (admin only)"""
    statement = (
        select(ProjectApplication)
        .options(
            selectinload(ProjectApplication.volunteer),
            selectinload(ProjectApplication.project)
        )
        .offset(skip)
        .limit(limit)
        .order_by(ProjectApplication.created_at.desc())
    )
    applications = session.exec(statement).all()

    count_statement = select(func.count(ProjectApplication.id))
    count = session.exec(count_statement).one()

    return applications, count


# Payment CRUD operations
def create_payment(*, session: Session, payment_in: PaymentCreate, merchant_id: str) -> Payment:

    # Convert PaymentCreate to dict and ensure all required fields have values
    payment_data = payment_in.model_dump()

    # Add merchant_id from config
    payment_data["merchant_id"] = merchant_id

    # Remove order_id from payment_data since it will be auto-generated
    # Don't include order_id in the initial data

    # Set default items description (will be updated after order_id is generated)
    payment_data["items"] = "Payment Processing"

    # Set default currency (you can modify this logic as needed)
    # Default to LKR, can be made configurable
    payment_data["currency"] = PaymentCurrency.LKR

    # Create Payment object (order_id will be auto-generated)
    db_payment = Payment(**payment_data)
    session.add(db_payment)
    session.flush()  # This generates the auto-increment order_id

    # Now update items description with the actual order_id
    db_payment.items = f"Payment for Order {db_payment.order_id}"

    session.commit()
    session.refresh(db_payment)
    return db_payment
