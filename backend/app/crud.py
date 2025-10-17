from sqlalchemy.orm import selectinload
from app.models import (
    Item, ItemCreate, User, UserCreate, UserUpdate, Project, ProjectCreate, ProjectUpdate, ProjectStatus, Task, TaskCreate, TaskUpdate, ProjectThread,
    ProjectThreadCreate, Comment, CommentCreate, CommentUpdate, CommentPublic, Reply, ReplyCreate, ReplyUpdate, ReplyPublic, Payment, PaymentCreate,
    PaymentCurrency, PaymentStatus, ProjectApplication, ProjectApplicationCreate, ProjectApplicationUpdate, ApplicationStatus, RequesterProfile, RequesterProfileCreate, RequesterProfileUpdate, RequesterProfilePublic, Donation, DonationCreate, UserVolunteerRole, VolunteerRole
)

import uuid
from typing import Any
from datetime import datetime, timezone

from sqlmodel import Session, select, func

from app.core.security import get_password_hash, verify_password
from app.models import Item, ItemCreate, User, UserCreate, UserUpdate, Project, ProjectCreate, ProjectUpdate, ProjectStatus, Task, TaskCreate, TaskUpdate, ProjectThread, ProjectThreadCreate, ProjectThreadUpdate, Comment, CommentCreate, CommentUpdate, CommentPublic, Reply, ReplyCreate, ReplyUpdate, ReplyPublic, ProjectApplication, ProjectApplicationCreate, ProjectApplicationUpdate, ApplicationStatus, Notification, NotificationType
from app.core.notification_manager import notification_manager
from sqlalchemy.orm import selectinload


def create_user(*, session: Session, user_create: UserCreate) -> User:
    db_obj = User.model_validate(
        user_create, update={
            "hashed_password": get_password_hash(user_create.password)}
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj

def create_volunteer_roles(
    *, session: Session, user_id: uuid.UUID, roles: list[str]
) -> None:
    """Create volunteer roles for a user"""
    if not roles:
        return
    
    volunteer_roles = []
    for role in roles:
        try:
            # Validate that the role is a valid VolunteerRole enum value
            volunteer_role_enum = VolunteerRole(role.upper())
            volunteer_roles.append(UserVolunteerRole(
                user_id=user_id,
                role=volunteer_role_enum
            ))
        except ValueError:
            # Skip invalid roles
            continue
    
    if volunteer_roles:
        session.add_all(volunteer_roles)
        session.commit()

def get_volunteer_roles_by_user_id(
    *, session: Session, user_id: uuid.UUID
) -> list[UserVolunteerRole]:
    """Get volunteer roles for a user"""
    statement = select(UserVolunteerRole).where(
        UserVolunteerRole.user_id == user_id
    )
    return session.exec(statement).all()

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


def update_project_thread(
    *, session: Session, db_thread: ProjectThread, thread_in: ProjectThreadUpdate
) -> ProjectThread:
    """
    Update a project thread with new data.
    """
    thread_data = thread_in.model_dump(exclude_unset=True)
    if thread_data:
        # Update the updated_at timestamp
        thread_data["updated_at"] = datetime.utcnow()
        db_thread.sqlmodel_update(thread_data)
        session.add(db_thread)
        session.commit()
        session.refresh(db_thread)
    return db_thread


def delete_project_thread(*, session: Session, db_thread: ProjectThread) -> None:
    """
    Delete a project thread.
    This will cascade delete all associated comments and replies due to the 
    cascade="all, delete-orphan" relationship defined in the model.
    """
    session.delete(db_thread)
    session.commit()


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


def get_approved_applicants_for_project(
    *,
    session: Session,
    project_id: uuid.UUID
) -> list[User]:
    """
    Get all approved applicants (volunteers) for a specific project.
    Filters at database level for efficiency.
    """
    statement = (
        select(User)
        .join(ProjectApplication, ProjectApplication.volunteer_id == User.id)
        .where(
            ProjectApplication.project_id == project_id,
            ProjectApplication.status == ApplicationStatus.APPROVED
        )
        .order_by(User.firstname, User.lastname)
    )
    volunteers = session.exec(statement).all()
    return volunteers


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


def get_payment_by_order_id(*, session: Session, order_id: int) -> Payment | None:
    """
    Get payment by order_id
    """
    statement = select(Payment).where(Payment.order_id == order_id)
    return session.exec(statement).first()


def update_payment_status(*, session: Session, order_id: int, status: PaymentStatus) -> Payment | None:
    """
    Update payment status by order_id
    """
    statement = select(Payment).where(Payment.order_id == order_id)
    payment = session.exec(statement).first()

    if payment:
        payment.status = status
        payment.updated_at = datetime.now(timezone.utc)
        session.add(payment)
        session.commit()
        session.refresh(payment)

    return payment

# Notification CRUD operations


async def create_notification(
    *,
    session: Session,
    user_id: uuid.UUID,
    type: NotificationType,
    title: str,
    message: str,
    related_entity_id: uuid.UUID | None = None,
    related_entity_type: str | None = None,
    action_url: str | None = None
) -> Notification:
    """Create notification and send via SSE"""
    # Create in database
    notification = Notification(
        user_id=user_id,
        type=type,
        title=title,
        message=message,
        related_entity_id=related_entity_id,
        related_entity_type=related_entity_type,
        action_url=action_url,
        created_at=datetime.now(timezone.utc)
    )
    session.add(notification)
    session.commit()
    session.refresh(notification)

    # 2. TRY TO SEND VIA SSE - Bonus for online users
    try:
        await notification_manager.send_notification(
            user_id=user_id,
            notification_data={
                "id": str(notification.id),
                "type": notification.type,
                "title": notification.title,
                "message": notification.message,
                "action_url": notification.action_url,
                "created_at": notification.created_at.replace(tzinfo=timezone.utc).isoformat(),
                "is_read": notification.is_read
            }
        )
    except Exception as e:
        print(f"Could not send real-time notification (user offline): {e}")

    return notification


def get_user_notifications(
    *, session: Session, user_id: uuid.UUID, skip: int = 0, limit: int = 50
) -> tuple[list[Notification], int]:
    """Get user's notifications (for initial load)"""
    statement = (
        select(Notification)
        .where(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    notifications = session.exec(statement).all()

    count_statement = select(func.count(Notification.id)).where(
        Notification.user_id == user_id
    )
    count = session.exec(count_statement).one()

    return notifications, count


def mark_notification_as_read(
    *, session: Session, notification_id: uuid.UUID
) -> Notification:
    """Mark single notification as read"""
    notification = session.get(Notification, notification_id)
    if notification:
        notification.is_read = True
        session.add(notification)
        session.commit()
        session.refresh(notification)
    return notification


def mark_all_notifications_as_read(
    *, session: Session, user_id: uuid.UUID
) -> int:
    """Mark all user's notifications as read"""
    statement = (
        select(Notification)
        .where(Notification.user_id == user_id, Notification.is_read == False)
    )
    notifications = session.exec(statement).all()

    for notification in notifications:
        notification.is_read = True
        session.add(notification)

    session.commit()
    return len(notifications)


def get_unread_notifications(
    *, session: Session, user_id: uuid.UUID
) -> list[Notification]:
    """Get all unread notifications for a user"""
    statement = (
        select(Notification)
        .where(
            Notification.user_id == user_id,
            Notification.is_read == False
        )
        .order_by(Notification.created_at.desc())
    )
    return session.exec(statement).all()


def get_unread_notifications_count(
    *, session: Session, user_id: uuid.UUID
) -> int:
    """Get count of unread notifications for a user"""
    statement = select(func.count(Notification.id)).where(
        Notification.user_id == user_id,
        Notification.is_read == False
    )
    return session.exec(statement).one()


# Donation CRUD operations


def create_donation(
    *,
    session: Session,
    order_id: int,
    donor_id: uuid.UUID,
    message: str | None = None
) -> Donation:
    """
    Create a new donation record linked to a payment.
    Called during payment initiation, not after payment completion.
    """
    # Check if donation already exists for this order_id
    existing = get_donation_by_order_id(session=session, order_id=order_id)
    if existing:
        raise ValueError("Donation already exists for this payment")

    # Create donation
    db_donation = Donation(
        donor_id=donor_id,
        order_id=order_id,
        message=message
    )
    session.add(db_donation)
    session.commit()
    session.refresh(db_donation)
    return db_donation


def get_donation_by_order_id(
    *,
    session: Session,
    order_id: int
) -> Donation | None:
    """Get donation by payment order_id"""
    statement = select(Donation).where(Donation.order_id == order_id)
    return session.exec(statement).first()


def get_donations_by_donor_id(
    *,
    session: Session,
    donor_id: uuid.UUID,
    skip: int = 0,
    limit: int = 100
) -> list[Donation]:
    """
    Get all donations made by a specific donor with SUCCESS or PENDING payment status,
    ordered by order_id (descending).
    This returns donations with their relationships loaded.
    Only includes donations where payment status is SUCCESS (2) or PENDING (0).
    """
    statement = (
        select(Donation)
        .join(Payment, Donation.order_id == Payment.order_id)
        .where(
            Donation.donor_id == donor_id,
            Payment.status.in_([PaymentStatus.SUCCESS, PaymentStatus.PENDING])
        )
        .order_by(Donation.order_id.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(session.exec(statement).all())


def count_donations_by_donor_id(
    *,
    session: Session,
    donor_id: uuid.UUID
) -> int:
    """
    Count total donations made by a specific donor with SUCCESS or PENDING payment status.
    Only counts donations where payment status is SUCCESS (2) or PENDING (0).
    """
    statement = (
        select(Donation)
        .join(Payment, Donation.order_id == Payment.order_id)
        .where(
            Donation.donor_id == donor_id,
            Payment.status.in_([PaymentStatus.SUCCESS, PaymentStatus.PENDING])
        )
    )
    return len(list(session.exec(statement).all()))


# Requester Profile CRUD operations


def create_requester_profile(
    *, session: Session, profile_in: RequesterProfileCreate, user_id: uuid.UUID
) -> RequesterProfile:
    """Create a new requester profile"""
    db_profile = RequesterProfile.model_validate(
        profile_in, update={
            "user_id": user_id,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
    )
    session.add(db_profile)
    session.commit()
    session.refresh(db_profile)
    return db_profile


def get_requester_profile(*, session: Session, profile_id: uuid.UUID) -> RequesterProfilePublic | None:
    """Get requester profile by ID with user data"""
    statement = (
        select(RequesterProfile)
        .options(selectinload(RequesterProfile.user))
        .where(RequesterProfile.id == profile_id)
    )
    profile = session.exec(statement).first()

    if not profile:
        return None

    # Convert to public model
    return RequesterProfilePublic.model_validate(profile, update={"user": profile.user})


def get_requester_profile_by_user_id(
    *, session: Session, user_id: uuid.UUID
) -> RequesterProfilePublic | None:
    """Get requester profile by user ID with user data"""
    statement = (
        select(RequesterProfile)
        .options(selectinload(RequesterProfile.user))
        .where(RequesterProfile.user_id == user_id)
    )
    profile = session.exec(statement).first()

    if not profile:
        return None

    # Convert to public model
    return RequesterProfilePublic.model_validate(profile, update={"user": profile.user})


def update_requester_profile(
    *, session: Session, db_profile: RequesterProfile, profile_in: RequesterProfileUpdate
) -> RequesterProfilePublic:
    """Update an existing requester profile"""
    profile_data = profile_in.model_dump(exclude_unset=True)
    profile_data["updated_at"] = datetime.now(timezone.utc)

    db_profile.sqlmodel_update(profile_data)
    session.add(db_profile)
    session.commit()
    session.refresh(db_profile)

    # Load user relationship for response
    session.refresh(db_profile, ["user"])

    return RequesterProfilePublic.model_validate(db_profile, update={"user": db_profile.user})


def delete_requester_profile(*, session: Session, profile_id: uuid.UUID) -> bool:
    """Delete a requester profile"""

    profile = session.get(RequesterProfile, profile_id)
    if profile:
        session.delete(profile)
        session.commit()
        return True
    return False


def get_requester_profiles(
    *, session: Session, skip: int = 0, limit: int = 100
) -> tuple[list[RequesterProfilePublic], int]:
    """Get all requester profiles with pagination"""
    statement = (
        select(RequesterProfile)
        .options(selectinload(RequesterProfile.user))
        .offset(skip)
        .limit(limit)
        .order_by(RequesterProfile.created_at.desc())
    )
    profiles = session.exec(statement).all()

    count_statement = select(func.count(RequesterProfile.id))
    count = session.exec(count_statement).one()

    # Convert to public models
    public_profiles = [
        RequesterProfilePublic.model_validate(
            profile, update={"user": profile.user})
        for profile in profiles
    ]

    return public_profiles, count


def search_requester_profiles(
    *,
    session: Session,
    search_query: str | None = None,
    location: str | None = None,
    skip: int = 0,
    limit: int = 100
) -> tuple[list[RequesterProfilePublic], int]:
    """Search requester profiles with filters"""
    statement = (
        select(RequesterProfile)
        .join(User, RequesterProfile.user_id == User.id)
        .options(selectinload(RequesterProfile.user))
    )

    # Add search filters
    filters = []
    if search_query:
        search_filter = (
            User.firstname.ilike(f"%{search_query}%") |
            User.lastname.ilike(f"%{search_query}%") |
            User.email.ilike(f"%{search_query}%") |
            RequesterProfile.tagline.ilike(f"%{search_query}%") |
            RequesterProfile.about.ilike(f"%{search_query}%")
        )
        filters.append(search_filter)

    if location:
        filters.append(RequesterProfile.location.ilike(f"%{location}%"))

    if filters:
        statement = statement.where(*filters)

    # Add pagination and ordering
    count_statement = statement.with_only_columns(
        func.count(RequesterProfile.id))
    count = session.exec(count_statement).one()

    profiles = session.exec(
        statement.offset(skip).limit(limit).order_by(
            RequesterProfile.created_at.desc())
    ).all()

    # Convert to public models
    public_profiles = [
        RequesterProfilePublic.model_validate(
            profile, update={"user": profile.user})
        for profile in profiles
    ]

    return public_profiles, count


def get_requester_profile_stats(*, session: Session, user_id: uuid.UUID) -> dict:
    """Get statistics for requester's dashboard"""

    # Count projects by status
    total_projects = session.exec(
        select(func.count(Project.id)).where(Project.requester_id == user_id)
    ).one() or 0

    approved_projects = session.exec(
        select(func.count(Project.id)).where(
            Project.requester_id == user_id,
            Project.status == ProjectStatus.APPROVED
        )
    ).one() or 0

    pending_projects = session.exec(
        select(func.count(Project.id)).where(
            Project.requester_id == user_id,
            Project.status == ProjectStatus.PENDING
        )
    ).one() or 0

    # Count applications for user's projects
    total_applications = session.exec(
        select(func.count(ProjectApplication.id))
        .join(Project, ProjectApplication.project_id == Project.id)
        .where(Project.requester_id == user_id)
    ).one() or 0

    # Count pending applications
    pending_applications = session.exec(
        select(func.count(ProjectApplication.id))
        .join(Project, ProjectApplication.project_id == Project.id)
        .where(
            Project.requester_id == user_id,
            ProjectApplication.status == ApplicationStatus.PENDING
        )
    ).one() or 0

    return {
        "total_projects": total_projects,
        "approved_projects": approved_projects,
        "pending_projects": pending_projects,
        "total_applications": total_applications,
        "pending_applications": pending_applications,
        "active_volunteers": 0,
    }
