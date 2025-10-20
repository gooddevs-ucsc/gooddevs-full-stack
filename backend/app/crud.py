from sqlalchemy.orm import selectinload
from app.models import (
    Item, ItemCreate, User, UserCreate, UserUpdate, Project, ProjectCreate, ProjectUpdate, ProjectStatus, Task, TaskCreate, TaskUpdate, ProjectThread, UserRole,
    ProjectThreadCreate, Comment, CommentCreate, CommentUpdate, CommentPublic, Reply, ReplyCreate, ReplyUpdate, ReplyPublic, Payment, PaymentCreate, TaskStatus,PaymentCurrency, PaymentStatus, ProjectApplication, ProjectApplicationCreate, ProjectApplicationUpdate, ApplicationStatus, RequesterProfile, RequesterProfileCreate, RequesterProfileUpdate, RequesterProfilePublic, Donation, DonationCreate, DonationStatistics, UserVolunteerRole, VolunteerRole, SponsorProfile, SponsorProfileCreate, SponsorProfileUpdate, SponsorProfilePublic, VolunteerProfile, VolunteerProfileCreate, VolunteerProfilePublic, VolunteerProfileUpdate,
    ApplicationReviewerPermission, ApplicationReviewerPermissionCreate, ApplicationReviewerPermissionPublic, ReviewerPermissionStatus, Sponsorship, SponsorshipCreate, SponsorshipStatistics, UserVolunteerRole, VolunteerRole, Withdrawal, WithdrawalStatus, OpenPosition, OpenPositionCreate, OpenPositionUpdate, DeveloperRole
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

    if db_obj.role == UserRole.VOLUNTEER:
        default_profile = VolunteerProfileCreate(
            bio=f"Hi! I'm {db_obj.firstname} {db_obj.lastname}. I'm passionate about contributing to meaningful projects.",
            tagline="Volunteer Developer",
            skills=[],
            experience=[]
        )
        create_volunteer_profile(
            session=session,
            profile_in=default_profile,
            user_id=db_obj.id
        )
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
def create_task(*, session: Session, task_in: TaskCreate, project_id: uuid.UUID, creator_id: uuid.UUID) -> Task:
    db_task = Task.model_validate(
        task_in, update={"project_id": project_id, "creator_id": creator_id})
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
    db_comment = Comment(
        body=comment_in.body,
        thread_id=thread_id,
        author_id=author_id,
    )
    session.add(db_comment)
    session.commit()
    session.refresh(db_comment)
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
) -> list[dict]:
    """
    Get all approved applicants (volunteers) for a specific project with their volunteer roles.
    Returns combined User and ProjectApplication data.
    """
    statement = (
        select(User, ProjectApplication.volunteer_role)
        .join(ProjectApplication, ProjectApplication.volunteer_id == User.id)
        .where(
            ProjectApplication.project_id == project_id,
            ProjectApplication.status == ApplicationStatus.APPROVED
        )
        .order_by(User.firstname, User.lastname)
    )
    results = session.exec(statement).all()

    # Convert to list of dicts with combined data
    team_members = []
    for user, volunteer_role in results:
        team_members.append({
            "id": user.id,
            "firstname": user.firstname,
            "lastname": user.lastname,
            "email": user.email,
            "volunteer_role": volunteer_role
        })

    return team_members


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
        # Silently handle notification delivery failure (user may be offline)
        pass

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


def get_all_donations(
    *,
    session: Session,
    skip: int = 0,
    limit: int = 100
) -> list[Donation]:
    """
    Get all donations with SUCCESS or PENDING payment status,
    ordered by order_id (descending) - for admin use.
    """
    statement = (
        select(Donation)
        .join(Payment, Donation.order_id == Payment.order_id)
        .where(
            Payment.status.in_([PaymentStatus.SUCCESS, PaymentStatus.PENDING])
        )
        .order_by(Donation.order_id.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(session.exec(statement).all())


def count_all_donations(
    *,
    session: Session
) -> int:
    """
    Count total donations with SUCCESS or PENDING payment status - for admin use.
    """
    statement = (
        select(func.count())
        .select_from(Donation)
        .join(Payment, Donation.order_id == Payment.order_id)
        .where(
            Payment.status.in_([PaymentStatus.SUCCESS, PaymentStatus.PENDING])
        )
    )
    return session.exec(statement).one()


def get_donation_statistics(
    *,
    session: Session
) -> DonationStatistics:
    """
    Get donation statistics for admin dashboard.
    Returns total donations, total amount, average donation, etc.
    """
    # Get all successful donations
    statement = (
        select(Donation, Payment)
        .join(Payment, Donation.order_id == Payment.order_id)
        .where(Payment.status == PaymentStatus.SUCCESS)
    )
    results = list(session.exec(statement).all())

    if not results:
        return DonationStatistics(
            total_donations=0,
            total_amount=0.0,
            average_donation=0.0,
            pending_donations=0,
            successful_donations=0,
            unique_donors=0
        )

    # Calculate statistics
    total_amount = sum(payment.amount for _, payment in results)
    successful_count = len(results)
    average_donation = total_amount / successful_count if successful_count > 0 else 0.0

    # Count pending donations
    pending_statement = (
        select(func.count())
        .select_from(Donation)
        .join(Payment, Donation.order_id == Payment.order_id)
        .where(Payment.status == PaymentStatus.PENDING)
    )
    pending_count = session.exec(pending_statement).one()

    # Count unique donors
    unique_donors_statement = (
        select(func.count(func.distinct(Donation.donor_id)))
        .select_from(Donation)
        .join(Payment, Donation.order_id == Payment.order_id)
        .where(Payment.status == PaymentStatus.SUCCESS)
    )
    unique_donors = session.exec(unique_donors_statement).one()

    return DonationStatistics(
        total_donations=successful_count + pending_count,
        total_amount=float(total_amount),
        average_donation=float(average_donation),
        pending_donations=pending_count,
        successful_donations=successful_count,
        unique_donors=unique_donors
    )


# Sponsorship CRUD operations


def create_sponsorship(
    *,
    session: Session,
    order_id: int,
    sponsor_id: uuid.UUID,
    recipient_id: uuid.UUID,
    message: str | None = None
) -> Sponsorship:
    """
    Create a new sponsorship record linked to a payment.
    Called during payment initiation, not after payment completion.
    """
    # Check if sponsorship already exists for this order_id
    existing = get_sponsorship_by_order_id(session=session, order_id=order_id)
    if existing:
        raise ValueError("Sponsorship already exists for this payment")

    # Validate that sponsor and recipient are different users
    if sponsor_id == recipient_id:
        raise ValueError("Cannot sponsor yourself")

    # Create sponsorship
    db_sponsorship = Sponsorship(
        sponsor_id=sponsor_id,
        recipient_id=recipient_id,
        order_id=order_id,
        message=message
    )
    session.add(db_sponsorship)
    session.commit()
    session.refresh(db_sponsorship)
    return db_sponsorship


def get_sponsorship_by_order_id(
    *,
    session: Session,
    order_id: int
) -> Sponsorship | None:
    """Get sponsorship by payment order_id"""
    statement = select(Sponsorship).where(Sponsorship.order_id == order_id)
    return session.exec(statement).first()


def get_sponsorships_by_sponsor_id(
    *,
    session: Session,
    sponsor_id: uuid.UUID,
    skip: int = 0,
    limit: int = 100
) -> list[Sponsorship]:
    """
    Get all sponsorships made by a specific sponsor with SUCCESS or PENDING payment status,
    ordered by order_id (descending).
    This returns sponsorships with their relationships loaded.
    Only includes sponsorships where payment status is SUCCESS (2) or PENDING (0).
    """
    statement = (
        select(Sponsorship)
        .join(Payment, Sponsorship.order_id == Payment.order_id)
        .where(
            Sponsorship.sponsor_id == sponsor_id,
            Payment.status.in_([PaymentStatus.SUCCESS, PaymentStatus.PENDING])
        )
        .order_by(Sponsorship.order_id.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(session.exec(statement).all())


def get_sponsorships_by_recipient_id(
    *,
    session: Session,
    recipient_id: uuid.UUID,
    skip: int = 0,
    limit: int = 100
) -> list[Sponsorship]:
    """
    Get all sponsorships received by a specific recipient with SUCCESS or PENDING payment status,
    ordered by order_id (descending).
    This returns sponsorships with their relationships loaded.
    Only includes sponsorships where payment status is SUCCESS (2) or PENDING (0).
    """
    statement = (
        select(Sponsorship)
        .join(Payment, Sponsorship.order_id == Payment.order_id)
        .where(
            Sponsorship.recipient_id == recipient_id,
            Payment.status.in_([PaymentStatus.SUCCESS, PaymentStatus.PENDING])
        )
        .order_by(Sponsorship.order_id.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(session.exec(statement).all())


def count_sponsorships_by_sponsor_id(
    *,
    session: Session,
    sponsor_id: uuid.UUID
) -> int:
    """
    Count total sponsorships made by a specific sponsor with SUCCESS or PENDING payment status.
    Only counts sponsorships where payment status is SUCCESS (2) or PENDING (0).
    """
    statement = (
        select(Sponsorship)
        .join(Payment, Sponsorship.order_id == Payment.order_id)
        .where(
            Sponsorship.sponsor_id == sponsor_id,
            Payment.status.in_([PaymentStatus.SUCCESS, PaymentStatus.PENDING])
        )
    )
    return len(list(session.exec(statement).all()))


def count_sponsorships_by_recipient_id(
    *,
    session: Session,
    recipient_id: uuid.UUID
) -> int:
    """
    Count total sponsorships received by a specific recipient with SUCCESS or PENDING payment status.
    Only counts sponsorships where payment status is SUCCESS (2) or PENDING (0).
    """
    statement = (
        select(Sponsorship)
        .join(Payment, Sponsorship.order_id == Payment.order_id)
        .where(
            Sponsorship.recipient_id == recipient_id,
            Payment.status.in_([PaymentStatus.SUCCESS, PaymentStatus.PENDING])
        )
    )
    return len(list(session.exec(statement).all()))


def get_all_sponsorships(
    *,
    session: Session,
    skip: int = 0,
    limit: int = 100
) -> list[Sponsorship]:
    """
    Get all sponsorships with SUCCESS or PENDING payment status,
    ordered by order_id (descending) - for admin use.
    """
    statement = (
        select(Sponsorship)
        .join(Payment, Sponsorship.order_id == Payment.order_id)
        .where(
            Payment.status.in_([PaymentStatus.SUCCESS, PaymentStatus.PENDING])
        )
        .order_by(Sponsorship.order_id.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(session.exec(statement).all())


def count_all_sponsorships(
    *,
    session: Session
) -> int:
    """
    Count total sponsorships with SUCCESS or PENDING payment status - for admin use.
    """
    statement = (
        select(func.count())
        .select_from(Sponsorship)
        .join(Payment, Sponsorship.order_id == Payment.order_id)
        .where(
            Payment.status.in_([PaymentStatus.SUCCESS, PaymentStatus.PENDING])
        )
    )
    return session.exec(statement).one()


def get_sponsorship_statistics(
    *,
    session: Session
) -> SponsorshipStatistics:
    """
    Get sponsorship statistics for admin dashboard.
    Returns total sponsorships, total amount, average sponsorship, etc.
    """
    # Get all successful sponsorships
    statement = (
        select(Sponsorship, Payment)
        .join(Payment, Sponsorship.order_id == Payment.order_id)
        .where(Payment.status == PaymentStatus.SUCCESS)
    )
    results = list(session.exec(statement).all())

    if not results:
        return SponsorshipStatistics(
            total_sponsorships=0,
            total_amount=0.0,
            average_sponsorship=0.0,
            pending_sponsorships=0,
            successful_sponsorships=0,
            unique_sponsors=0,
            unique_recipients=0
        )

    # Calculate statistics
    total_amount = sum(payment.amount for _, payment in results)
    successful_count = len(results)
    average_sponsorship = total_amount / \
        successful_count if successful_count > 0 else 0.0

    # Count pending sponsorships
    pending_statement = (
        select(func.count())
        .select_from(Sponsorship)
        .join(Payment, Sponsorship.order_id == Payment.order_id)
        .where(Payment.status == PaymentStatus.PENDING)
    )
    pending_count = session.exec(pending_statement).one()

    # Count unique sponsors
    unique_sponsors_statement = (
        select(func.count(func.distinct(Sponsorship.sponsor_id)))
        .select_from(Sponsorship)
        .join(Payment, Sponsorship.order_id == Payment.order_id)
        .where(Payment.status == PaymentStatus.SUCCESS)
    )
    unique_sponsors = session.exec(unique_sponsors_statement).one()

    # Count unique recipients
    unique_recipients_statement = (
        select(func.count(func.distinct(Sponsorship.recipient_id)))
        .select_from(Sponsorship)
        .join(Payment, Sponsorship.order_id == Payment.order_id)
        .where(Payment.status == PaymentStatus.SUCCESS)
    )
    unique_recipients = session.exec(unique_recipients_statement).one()

    return SponsorshipStatistics(
        total_sponsorships=successful_count + pending_count,
        total_amount=float(total_amount),
        average_sponsorship=float(average_sponsorship),
        pending_sponsorships=pending_count,
        successful_sponsorships=successful_count,
        unique_sponsors=unique_sponsors,
        unique_recipients=unique_recipients
    )


# Withdrawal CRUD operations


def get_withdrawal_balance(
    *,
    session: Session,
    recipient_id: uuid.UUID
) -> dict[str, float]:
    """
    Calculate withdrawal balance for a recipient.
    Returns total received, total withdrawn, pending withdrawals, and available balance.
    """

    # Get total successfully received sponsorships
    statement = (
        select(func.sum(Payment.amount))
        .select_from(Sponsorship)
        .join(Payment, Sponsorship.order_id == Payment.order_id)
        .where(
            Sponsorship.recipient_id == recipient_id,
            Payment.status == PaymentStatus.SUCCESS
        )
    )
    total_received = session.exec(statement).one() or 0.0

    # Get total withdrawn (completed withdrawals)
    withdrawn_statement = (
        select(func.sum(Withdrawal.amount_requested))
        .where(
            Withdrawal.recipient_id == recipient_id,
            Withdrawal.status == WithdrawalStatus.COMPLETED
        )
    )
    total_withdrawn = session.exec(withdrawn_statement).one() or 0.0

    # Get pending withdrawals
    pending_statement = (
        select(func.sum(Withdrawal.amount_requested))
        .where(
            Withdrawal.recipient_id == recipient_id,
            Withdrawal.status == WithdrawalStatus.PENDING
        )
    )
    pending_withdrawals = session.exec(pending_statement).one() or 0.0

    # Calculate available balance
    available_balance = total_received - total_withdrawn - pending_withdrawals

    return {
        "total_received": float(total_received),
        "total_withdrawn": float(total_withdrawn),
        "pending_withdrawals": float(pending_withdrawals),
        "available_balance": float(available_balance)
    }


def create_withdrawal(
    *,
    session: Session,
    recipient_id: uuid.UUID,
    amount_requested: float,
    bank_account_number: str,
    bank_name: str,
    account_holder_name: str,
    fee_percentage: float = 6.0
) -> Withdrawal:
    """
    Create a new withdrawal request.
    Calculates fee and amount to transfer automatically.
    """

    # Calculate fee and amount to transfer
    fee_amount = amount_requested * (fee_percentage / 100)
    amount_to_transfer = amount_requested - fee_amount

    withdrawal = Withdrawal(
        recipient_id=recipient_id,
        amount_requested=amount_requested,
        fee_percentage=fee_percentage,
        fee_amount=fee_amount,
        amount_to_transfer=amount_to_transfer,
        bank_account_number=bank_account_number,
        bank_name=bank_name,
        account_holder_name=account_holder_name,
        status=WithdrawalStatus.PENDING,
        requested_at=datetime.utcnow()
    )

    session.add(withdrawal)
    session.commit()
    session.refresh(withdrawal)
    return withdrawal


def get_withdrawals_by_recipient(
    *,
    session: Session,
    recipient_id: uuid.UUID,
    skip: int = 0,
    limit: int = 100
) -> list[Withdrawal]:
    """Get all withdrawals for a specific recipient, ordered by requested_at descending"""

    statement = (
        select(Withdrawal)
        .where(Withdrawal.recipient_id == recipient_id)
        .order_by(Withdrawal.requested_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(session.exec(statement).all())


def count_withdrawals_by_recipient(
    *,
    session: Session,
    recipient_id: uuid.UUID
) -> int:
    """Count total withdrawals for a recipient"""

    statement = (
        select(func.count())
        .select_from(Withdrawal)
        .where(Withdrawal.recipient_id == recipient_id)
    )
    return session.exec(statement).one()


def get_withdrawal_by_id(
    *,
    session: Session,
    withdrawal_id: uuid.UUID
) -> Withdrawal | None:
    """Get a specific withdrawal by ID"""

    return session.get(Withdrawal, withdrawal_id)


def complete_withdrawal(
    *,
    session: Session,
    withdrawal_id: uuid.UUID
) -> Withdrawal:
    """
    Mark a withdrawal as completed.
    This would be called after the mock transfer is processed.
    """

    withdrawal = session.get(Withdrawal, withdrawal_id)
    if not withdrawal:
        raise ValueError(f"Withdrawal with id {withdrawal_id} not found")

    withdrawal.status = WithdrawalStatus.COMPLETED
    withdrawal.completed_at = datetime.utcnow()

    session.add(withdrawal)
    session.commit()
    session.refresh(withdrawal)
    return withdrawal


def get_all_withdrawals(
    *,
    session: Session,
    skip: int = 0,
    limit: int = 100
) -> list[Withdrawal]:
    """Get all withdrawals across all users (admin only), ordered by requested_at descending"""

    statement = (
        select(Withdrawal)
        .order_by(Withdrawal.requested_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(session.exec(statement).all())


def count_all_withdrawals(
    *,
    session: Session
) -> int:
    """Count total withdrawals across all users"""

    statement = select(func.count()).select_from(Withdrawal)
    return session.exec(statement).one()


def get_all_donations(
    *,
    session: Session,
    skip: int = 0,
    limit: int = 100
) -> list[Donation]:
    """
    Get all donations with SUCCESS or PENDING payment status,
    ordered by order_id (descending) - for admin use.
    """
    statement = (
        select(Donation)
        .join(Payment, Donation.order_id == Payment.order_id)
        .where(
            Payment.status.in_([PaymentStatus.SUCCESS, PaymentStatus.PENDING])
        )
        .order_by(Donation.order_id.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(session.exec(statement).all())


def count_all_donations(
    *,
    session: Session
) -> int:
    """
    Count total donations with SUCCESS or PENDING payment status - for admin use.
    """
    statement = (
        select(func.count())
        .select_from(Donation)
        .join(Payment, Donation.order_id == Payment.order_id)
        .where(
            Payment.status.in_([PaymentStatus.SUCCESS, PaymentStatus.PENDING])
        )
    )
    return session.exec(statement).one()


def get_donation_statistics(
    *,
    session: Session
) -> DonationStatistics:
    """
    Get donation statistics for admin dashboard.
    Returns total donations, total amount, average donation, etc.
    """
    # Get all successful donations
    statement = (
        select(Donation, Payment)
        .join(Payment, Donation.order_id == Payment.order_id)
        .where(Payment.status == PaymentStatus.SUCCESS)
    )
    results = list(session.exec(statement).all())

    if not results:
        return DonationStatistics(
            total_donations=0,
            total_amount=0.0,
            average_donation=0.0,
            pending_donations=0,
            successful_donations=0,
            unique_donors=0
        )

    # Calculate statistics
    total_amount = sum(payment.amount for _, payment in results)
    successful_count = len(results)
    average_donation = total_amount / successful_count if successful_count > 0 else 0.0

    # Count pending donations
    pending_statement = (
        select(func.count())
        .select_from(Donation)
        .join(Payment, Donation.order_id == Payment.order_id)
        .where(Payment.status == PaymentStatus.PENDING)
    )
    pending_count = session.exec(pending_statement).one()

    # Count unique donors
    unique_donors_statement = (
        select(func.count(func.distinct(Donation.donor_id)))
        .select_from(Donation)
        .join(Payment, Donation.order_id == Payment.order_id)
        .where(Payment.status == PaymentStatus.SUCCESS)
    )
    unique_donors = session.exec(unique_donors_statement).one()

    return DonationStatistics(
        total_donations=successful_count + pending_count,
        total_amount=float(total_amount),
        average_donation=float(average_donation),
        pending_donations=pending_count,
        successful_donations=successful_count,
        unique_donors=unique_donors
    )


# Sponsorship CRUD operations


def create_sponsorship(
    *,
    session: Session,
    order_id: int,
    sponsor_id: uuid.UUID,
    recipient_id: uuid.UUID,
    message: str | None = None
) -> Sponsorship:
    """
    Create a new sponsorship record linked to a payment.
    Called during payment initiation, not after payment completion.
    """
    # Check if sponsorship already exists for this order_id
    existing = get_sponsorship_by_order_id(session=session, order_id=order_id)
    if existing:
        raise ValueError("Sponsorship already exists for this payment")

    # Validate that sponsor and recipient are different users
    if sponsor_id == recipient_id:
        raise ValueError("Cannot sponsor yourself")

    # Create sponsorship
    db_sponsorship = Sponsorship(
        sponsor_id=sponsor_id,
        recipient_id=recipient_id,
        order_id=order_id,
        message=message
    )
    session.add(db_sponsorship)
    session.commit()
    session.refresh(db_sponsorship)
    return db_sponsorship


def get_sponsorship_by_order_id(
    *,
    session: Session,
    order_id: int
) -> Sponsorship | None:
    """Get sponsorship by payment order_id"""
    statement = select(Sponsorship).where(Sponsorship.order_id == order_id)
    return session.exec(statement).first()


def get_sponsorships_by_sponsor_id(
    *,
    session: Session,
    sponsor_id: uuid.UUID,
    skip: int = 0,
    limit: int = 100
) -> list[Sponsorship]:
    """
    Get all sponsorships made by a specific sponsor with SUCCESS or PENDING payment status,
    ordered by order_id (descending).
    This returns sponsorships with their relationships loaded.
    Only includes sponsorships where payment status is SUCCESS (2) or PENDING (0).
    """
    statement = (
        select(Sponsorship)
        .join(Payment, Sponsorship.order_id == Payment.order_id)
        .where(
            Sponsorship.sponsor_id == sponsor_id,
            Payment.status.in_([PaymentStatus.SUCCESS, PaymentStatus.PENDING])
        )
        .order_by(Sponsorship.order_id.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(session.exec(statement).all())


def get_sponsorships_by_recipient_id(
    *,
    session: Session,
    recipient_id: uuid.UUID,
    skip: int = 0,
    limit: int = 100
) -> list[Sponsorship]:
    """
    Get all sponsorships received by a specific recipient with SUCCESS or PENDING payment status,
    ordered by order_id (descending).
    This returns sponsorships with their relationships loaded.
    Only includes sponsorships where payment status is SUCCESS (2) or PENDING (0).
    """
    statement = (
        select(Sponsorship)
        .join(Payment, Sponsorship.order_id == Payment.order_id)
        .where(
            Sponsorship.recipient_id == recipient_id,
            Payment.status.in_([PaymentStatus.SUCCESS, PaymentStatus.PENDING])
        )
        .order_by(Sponsorship.order_id.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(session.exec(statement).all())


def count_sponsorships_by_sponsor_id(
    *,
    session: Session,
    sponsor_id: uuid.UUID
) -> int:
    """
    Count total sponsorships made by a specific sponsor with SUCCESS or PENDING payment status.
    Only counts sponsorships where payment status is SUCCESS (2) or PENDING (0).
    """
    statement = (
        select(Sponsorship)
        .join(Payment, Sponsorship.order_id == Payment.order_id)
        .where(
            Sponsorship.sponsor_id == sponsor_id,
            Payment.status.in_([PaymentStatus.SUCCESS, PaymentStatus.PENDING])
        )
    )
    return len(list(session.exec(statement).all()))


def count_sponsorships_by_recipient_id(
    *,
    session: Session,
    recipient_id: uuid.UUID
) -> int:
    """
    Count total sponsorships received by a specific recipient with SUCCESS or PENDING payment status.
    Only counts sponsorships where payment status is SUCCESS (2) or PENDING (0).
    """
    statement = (
        select(Sponsorship)
        .join(Payment, Sponsorship.order_id == Payment.order_id)
        .where(
            Sponsorship.recipient_id == recipient_id,
            Payment.status.in_([PaymentStatus.SUCCESS, PaymentStatus.PENDING])
        )
    )
    return len(list(session.exec(statement).all()))


def get_all_sponsorships(
    *,
    session: Session,
    skip: int = 0,
    limit: int = 100
) -> list[Sponsorship]:
    """
    Get all sponsorships with SUCCESS or PENDING payment status,
    ordered by order_id (descending) - for admin use.
    """
    statement = (
        select(Sponsorship)
        .join(Payment, Sponsorship.order_id == Payment.order_id)
        .where(
            Payment.status.in_([PaymentStatus.SUCCESS, PaymentStatus.PENDING])
        )
        .order_by(Sponsorship.order_id.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(session.exec(statement).all())


def count_all_sponsorships(
    *,
    session: Session
) -> int:
    """
    Count total sponsorships with SUCCESS or PENDING payment status - for admin use.
    """
    statement = (
        select(func.count())
        .select_from(Sponsorship)
        .join(Payment, Sponsorship.order_id == Payment.order_id)
        .where(
            Payment.status.in_([PaymentStatus.SUCCESS, PaymentStatus.PENDING])
        )
    )
    return session.exec(statement).one()


def get_sponsorship_statistics(
    *,
    session: Session
) -> SponsorshipStatistics:
    """
    Get sponsorship statistics for admin dashboard.
    Returns total sponsorships, total amount, average sponsorship, etc.
    """
    # Get all successful sponsorships
    statement = (
        select(Sponsorship, Payment)
        .join(Payment, Sponsorship.order_id == Payment.order_id)
        .where(Payment.status == PaymentStatus.SUCCESS)
    )
    results = list(session.exec(statement).all())

    if not results:
        return SponsorshipStatistics(
            total_sponsorships=0,
            total_amount=0.0,
            average_sponsorship=0.0,
            pending_sponsorships=0,
            successful_sponsorships=0,
            unique_sponsors=0,
            unique_recipients=0
        )

    # Calculate statistics
    total_amount = sum(payment.amount for _, payment in results)
    successful_count = len(results)
    average_sponsorship = total_amount / \
        successful_count if successful_count > 0 else 0.0

    # Count pending sponsorships
    pending_statement = (
        select(func.count())
        .select_from(Sponsorship)
        .join(Payment, Sponsorship.order_id == Payment.order_id)
        .where(Payment.status == PaymentStatus.PENDING)
    )
    pending_count = session.exec(pending_statement).one()

    # Count unique sponsors
    unique_sponsors_statement = (
        select(func.count(func.distinct(Sponsorship.sponsor_id)))
        .select_from(Sponsorship)
        .join(Payment, Sponsorship.order_id == Payment.order_id)
        .where(Payment.status == PaymentStatus.SUCCESS)
    )
    unique_sponsors = session.exec(unique_sponsors_statement).one()

    # Count unique recipients
    unique_recipients_statement = (
        select(func.count(func.distinct(Sponsorship.recipient_id)))
        .select_from(Sponsorship)
        .join(Payment, Sponsorship.order_id == Payment.order_id)
        .where(Payment.status == PaymentStatus.SUCCESS)
    )
    unique_recipients = session.exec(unique_recipients_statement).one()

    return SponsorshipStatistics(
        total_sponsorships=successful_count + pending_count,
        total_amount=float(total_amount),
        average_sponsorship=float(average_sponsorship),
        pending_sponsorships=pending_count,
        successful_sponsorships=successful_count,
        unique_sponsors=unique_sponsors,
        unique_recipients=unique_recipients
    )


# Withdrawal CRUD operations


def get_withdrawal_balance(
    *,
    session: Session,
    recipient_id: uuid.UUID
) -> dict[str, float]:
    """
    Calculate withdrawal balance for a recipient.
    Returns total received, total withdrawn, pending withdrawals, and available balance.
    """

    # Get total successfully received sponsorships
    statement = (
        select(func.sum(Payment.amount))
        .select_from(Sponsorship)
        .join(Payment, Sponsorship.order_id == Payment.order_id)
        .where(
            Sponsorship.recipient_id == recipient_id,
            Payment.status == PaymentStatus.SUCCESS
        )
    )
    total_received = session.exec(statement).one() or 0.0

    # Get total withdrawn (completed withdrawals)
    withdrawn_statement = (
        select(func.sum(Withdrawal.amount_requested))
        .where(
            Withdrawal.recipient_id == recipient_id,
            Withdrawal.status == WithdrawalStatus.COMPLETED
        )
    )
    total_withdrawn = session.exec(withdrawn_statement).one() or 0.0

    # Get pending withdrawals
    pending_statement = (
        select(func.sum(Withdrawal.amount_requested))
        .where(
            Withdrawal.recipient_id == recipient_id,
            Withdrawal.status == WithdrawalStatus.PENDING
        )
    )
    pending_withdrawals = session.exec(pending_statement).one() or 0.0

    # Calculate available balance
    available_balance = total_received - total_withdrawn - pending_withdrawals

    return {
        "total_received": float(total_received),
        "total_withdrawn": float(total_withdrawn),
        "pending_withdrawals": float(pending_withdrawals),
        "available_balance": float(available_balance)
    }


def create_withdrawal(
    *,
    session: Session,
    recipient_id: uuid.UUID,
    amount_requested: float,
    bank_account_number: str,
    bank_name: str,
    account_holder_name: str,
    fee_percentage: float = 6.0
) -> Withdrawal:
    """
    Create a new withdrawal request.
    Calculates fee and amount to transfer automatically.
    """

    # Calculate fee and amount to transfer
    fee_amount = amount_requested * (fee_percentage / 100)
    amount_to_transfer = amount_requested - fee_amount

    withdrawal = Withdrawal(
        recipient_id=recipient_id,
        amount_requested=amount_requested,
        fee_percentage=fee_percentage,
        fee_amount=fee_amount,
        amount_to_transfer=amount_to_transfer,
        bank_account_number=bank_account_number,
        bank_name=bank_name,
        account_holder_name=account_holder_name,
        status=WithdrawalStatus.PENDING,
        requested_at=datetime.utcnow()
    )

    session.add(withdrawal)
    session.commit()
    session.refresh(withdrawal)
    return withdrawal


def get_withdrawals_by_recipient(
    *,
    session: Session,
    recipient_id: uuid.UUID,
    skip: int = 0,
    limit: int = 100
) -> list[Withdrawal]:
    """Get all withdrawals for a specific recipient, ordered by requested_at descending"""

    statement = (
        select(Withdrawal)
        .where(Withdrawal.recipient_id == recipient_id)
        .order_by(Withdrawal.requested_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(session.exec(statement).all())


def count_withdrawals_by_recipient(
    *,
    session: Session,
    recipient_id: uuid.UUID
) -> int:
    """Count total withdrawals for a recipient"""

    statement = (
        select(func.count())
        .select_from(Withdrawal)
        .where(Withdrawal.recipient_id == recipient_id)
    )
    return session.exec(statement).one()


def get_withdrawal_by_id(
    *,
    session: Session,
    withdrawal_id: uuid.UUID
) -> Withdrawal | None:
    """Get a specific withdrawal by ID"""

    return session.get(Withdrawal, withdrawal_id)


def complete_withdrawal(
    *,
    session: Session,
    withdrawal_id: uuid.UUID
) -> Withdrawal:
    """
    Mark a withdrawal as completed.
    This would be called after the mock transfer is processed.
    """

    withdrawal = session.get(Withdrawal, withdrawal_id)
    if not withdrawal:
        raise ValueError(f"Withdrawal with id {withdrawal_id} not found")

    withdrawal.status = WithdrawalStatus.COMPLETED
    withdrawal.completed_at = datetime.utcnow()

    session.add(withdrawal)
    session.commit()
    session.refresh(withdrawal)
    return withdrawal


def get_all_withdrawals(
    *,
    session: Session,
    skip: int = 0,
    limit: int = 100
) -> list[Withdrawal]:
    """Get all withdrawals across all users (admin only), ordered by requested_at descending"""

    statement = (
        select(Withdrawal)
        .order_by(Withdrawal.requested_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(session.exec(statement).all())


def count_all_withdrawals(
    *,
    session: Session
) -> int:
    """Count total withdrawals across all users"""

    statement = select(func.count()).select_from(Withdrawal)
    return session.exec(statement).one()


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


# Public Profile CRUD operations
def get_user_approved_projects(
    *, session: Session, requester_id: uuid.UUID, skip: int = 0, limit: int = 100
) -> list[Project]:
    """Get approved projects for a specific user (for public view)"""
    statement = (
        select(Project)
        .where(
            Project.requester_id == requester_id,
            Project.status == ProjectStatus.APPROVED
        )
        .order_by(Project.created_at.desc())
        .offset(skip)
        .limit(limit)
    )

    projects = session.exec(statement).all()
    return list(projects)


def count_user_approved_projects(*, session: Session, requester_id: uuid.UUID) -> int:
    """Count approved projects for a specific user"""
    statement = select(func.count(Project.id)).where(
        Project.requester_id == requester_id,
        Project.status == ProjectStatus.APPROVED
    )

    count = session.exec(statement).one() or 0
    return count

# Application Reviewer Permissions


def grant_reviewer_permission(
    *,
    session: Session,
    project_id: uuid.UUID,
    reviewer_id: uuid.UUID,
    granted_by: uuid.UUID
) -> ApplicationReviewerPermission:
    """
    Grant permission to a volunteer to review applications for a project.
    Only approved volunteers for the project can be granted this permission.
    If a revoked permission exists, it will be reactivated.
    """
    # Check if a permission already exists (active or revoked)
    statement = select(ApplicationReviewerPermission).where(
        ApplicationReviewerPermission.project_id == project_id,
        ApplicationReviewerPermission.reviewer_id == reviewer_id
    )
    existing_permission = session.exec(statement).first()

    if existing_permission:
        # Reactivate if revoked
        if existing_permission.status == ReviewerPermissionStatus.REVOKED:
            existing_permission.status = ReviewerPermissionStatus.ACTIVE
            existing_permission.revoked_at = None
            existing_permission.granted_by = granted_by
            session.add(existing_permission)
            session.commit()
            session.refresh(existing_permission)
            return existing_permission
        else:
            # Already active
            return existing_permission

    # Create new permission record
    db_permission = ApplicationReviewerPermission(
        project_id=project_id,
        reviewer_id=reviewer_id,
        granted_by=granted_by,
        status=ReviewerPermissionStatus.ACTIVE
    )
    session.add(db_permission)
    session.commit()
    session.refresh(db_permission)
    return db_permission


def revoke_reviewer_permission(
    *,
    session: Session,
    permission_id: uuid.UUID
) -> bool:
    """Revoke reviewer permission by setting status to REVOKED"""
    permission = session.get(ApplicationReviewerPermission, permission_id)
    if permission and permission.status == ReviewerPermissionStatus.ACTIVE:
        permission.status = ReviewerPermissionStatus.REVOKED
        permission.revoked_at = datetime.now(timezone.utc)
        session.add(permission)
        session.commit()
        return True
    return False


def revoke_reviewer_permission_by_ids(
    *,
    session: Session,
    project_id: uuid.UUID,
    reviewer_id: uuid.UUID
) -> bool:
    """Revoke reviewer permission by project and reviewer IDs"""
    statement = select(ApplicationReviewerPermission).where(
        ApplicationReviewerPermission.project_id == project_id,
        ApplicationReviewerPermission.reviewer_id == reviewer_id,
        ApplicationReviewerPermission.status == ReviewerPermissionStatus.ACTIVE
    )
    permission = session.exec(statement).first()
    if permission:
        permission.status = ReviewerPermissionStatus.REVOKED
        permission.revoked_at = datetime.now(timezone.utc)
        session.add(permission)
        session.commit()
        return True
    return False


def check_reviewer_permission(
    *,
    session: Session,
    project_id: uuid.UUID,
    user_id: uuid.UUID
) -> bool:
    """
    Check if a user has permission to review applications for a project.
    Returns True if the user is the project owner OR has an ACTIVE reviewer permission.
    """
    # Check if user is the project owner
    project = session.get(Project, project_id)
    if project and project.requester_id == user_id:
        return True

    # Check if user has an active reviewer permission
    statement = select(ApplicationReviewerPermission).where(
        ApplicationReviewerPermission.project_id == project_id,
        ApplicationReviewerPermission.reviewer_id == user_id,
        ApplicationReviewerPermission.status == ReviewerPermissionStatus.ACTIVE
    )
    permission = session.exec(statement).first()
    return permission is not None


def get_reviewer_permissions_for_project(
    *,
    session: Session,
    project_id: uuid.UUID,
    include_revoked: bool = False
) -> list[ApplicationReviewerPermission]:
    """
    Get all reviewer permissions for a specific project with reviewer info.
    By default, only returns ACTIVE permissions.
    """
    statement = (
        select(ApplicationReviewerPermission)
        .where(ApplicationReviewerPermission.project_id == project_id)
        .options(selectinload(ApplicationReviewerPermission.reviewer))
        .order_by(ApplicationReviewerPermission.created_at.desc())
    )

    if not include_revoked:
        statement = statement.where(
            ApplicationReviewerPermission.status == ReviewerPermissionStatus.ACTIVE
        )

    return list(session.exec(statement).all())


def get_projects_user_can_review(
    *,
    session: Session,
    user_id: uuid.UUID
) -> list[Project]:
    """
    Get all projects where the user has permission to review applications.
    This includes projects they own and projects where they have ACTIVE reviewer permission.
    """
    # Get projects owned by user
    owned_projects_statement = select(Project).where(
        Project.requester_id == user_id
    )
    owned_projects = list(session.exec(owned_projects_statement).all())

    # Get projects where user has active reviewer permission
    permission_statement = (
        select(Project)
        .join(ApplicationReviewerPermission,
              ApplicationReviewerPermission.project_id == Project.id)
        .where(
            ApplicationReviewerPermission.reviewer_id == user_id,
            ApplicationReviewerPermission.status == ReviewerPermissionStatus.ACTIVE
        )
    )
    permitted_projects = list(session.exec(permission_statement).all())

    # Combine and deduplicate
    all_projects = {p.id: p for p in owned_projects + permitted_projects}
    return list(all_projects.values())


def check_user_is_approved_volunteer(
    *,
    session: Session,
    project_id: uuid.UUID,
    user_id: uuid.UUID
) -> bool:
    """
    Check if a user is an approved volunteer for a specific project.
    """
    statement = select(ProjectApplication).where(
        ProjectApplication.project_id == project_id,
        ProjectApplication.volunteer_id == user_id,
        ProjectApplication.status == ApplicationStatus.APPROVED
    )
    application = session.exec(statement).first()
    return application is not None


# Public Profile CRUD operations
def get_user_approved_projects(
    *, session: Session, requester_id: uuid.UUID, skip: int = 0, limit: int = 100
) -> list[Project]:
    """Get approved projects for a specific user (for public view)"""
    statement = (
        select(Project)
        .where(
            Project.requester_id == requester_id,
            Project.status == ProjectStatus.APPROVED
        )
        .order_by(Project.created_at.desc())
        .offset(skip)
        .limit(limit)
    )

    projects = session.exec(statement).all()
    return list(projects)


def count_user_approved_projects(*, session: Session, requester_id: uuid.UUID) -> int:
    """Count approved projects for a specific user"""
    statement = select(func.count(Project.id)).where(
        Project.requester_id == requester_id,
        Project.status == ProjectStatus.APPROVED
    )

    count = session.exec(statement).one() or 0
    return count

# Application Reviewer Permissions


def grant_reviewer_permission(
    *,
    session: Session,
    project_id: uuid.UUID,
    reviewer_id: uuid.UUID,
    granted_by: uuid.UUID
) -> ApplicationReviewerPermission:
    """
    Grant permission to a volunteer to review applications for a project.
    Only approved volunteers for the project can be granted this permission.
    If a revoked permission exists, it will be reactivated.
    """
    # Check if a permission already exists (active or revoked)
    statement = select(ApplicationReviewerPermission).where(
        ApplicationReviewerPermission.project_id == project_id,
        ApplicationReviewerPermission.reviewer_id == reviewer_id
    )
    existing_permission = session.exec(statement).first()

    if existing_permission:
        # Reactivate if revoked
        if existing_permission.status == ReviewerPermissionStatus.REVOKED:
            existing_permission.status = ReviewerPermissionStatus.ACTIVE
            existing_permission.revoked_at = None
            existing_permission.granted_by = granted_by
            session.add(existing_permission)
            session.commit()
            session.refresh(existing_permission)
            return existing_permission
        else:
            # Already active
            return existing_permission

    # Create new permission record
    db_permission = ApplicationReviewerPermission(
        project_id=project_id,
        reviewer_id=reviewer_id,
        granted_by=granted_by,
        status=ReviewerPermissionStatus.ACTIVE
    )
    session.add(db_permission)
    session.commit()
    session.refresh(db_permission)
    return db_permission


def revoke_reviewer_permission(
    *,
    session: Session,
    permission_id: uuid.UUID
) -> bool:
    """Revoke reviewer permission by setting status to REVOKED"""
    permission = session.get(ApplicationReviewerPermission, permission_id)
    if permission and permission.status == ReviewerPermissionStatus.ACTIVE:
        permission.status = ReviewerPermissionStatus.REVOKED
        permission.revoked_at = datetime.now(timezone.utc)
        session.add(permission)
        session.commit()
        return True
    return False


def revoke_reviewer_permission_by_ids(
    *,
    session: Session,
    project_id: uuid.UUID,
    reviewer_id: uuid.UUID
) -> bool:
    """Revoke reviewer permission by project and reviewer IDs"""
    statement = select(ApplicationReviewerPermission).where(
        ApplicationReviewerPermission.project_id == project_id,
        ApplicationReviewerPermission.reviewer_id == reviewer_id,
        ApplicationReviewerPermission.status == ReviewerPermissionStatus.ACTIVE
    )
    permission = session.exec(statement).first()
    if permission:
        permission.status = ReviewerPermissionStatus.REVOKED
        permission.revoked_at = datetime.now(timezone.utc)
        session.add(permission)
        session.commit()
        return True
    return False


def check_reviewer_permission(
    *,
    session: Session,
    project_id: uuid.UUID,
    user_id: uuid.UUID
) -> bool:
    """
    Check if a user has permission to review applications for a project.
    Returns True if the user is the project owner OR has an ACTIVE reviewer permission.
    """
    # Check if user is the project owner
    project = session.get(Project, project_id)
    if project and project.requester_id == user_id:
        return True

    # Check if user has an active reviewer permission
    statement = select(ApplicationReviewerPermission).where(
        ApplicationReviewerPermission.project_id == project_id,
        ApplicationReviewerPermission.reviewer_id == user_id,
        ApplicationReviewerPermission.status == ReviewerPermissionStatus.ACTIVE
    )
    permission = session.exec(statement).first()
    return permission is not None


def get_reviewer_permissions_for_project(
    *,
    session: Session,
    project_id: uuid.UUID,
    include_revoked: bool = False
) -> list[ApplicationReviewerPermission]:
    """
    Get all reviewer permissions for a specific project with reviewer info.
    By default, only returns ACTIVE permissions.
    """
    statement = (
        select(ApplicationReviewerPermission)
        .where(ApplicationReviewerPermission.project_id == project_id)
        .options(selectinload(ApplicationReviewerPermission.reviewer))
        .order_by(ApplicationReviewerPermission.created_at.desc())
    )

    if not include_revoked:
        statement = statement.where(
            ApplicationReviewerPermission.status == ReviewerPermissionStatus.ACTIVE
        )

    return list(session.exec(statement).all())


def get_projects_user_can_review(
    *,
    session: Session,
    user_id: uuid.UUID
) -> list[Project]:
    """
    Get all projects where the user has permission to review applications.
    This includes projects they own and projects where they have ACTIVE reviewer permission.
    """
    # Get projects owned by user
    owned_projects_statement = select(Project).where(
        Project.requester_id == user_id
    )
    owned_projects = list(session.exec(owned_projects_statement).all())

    # Get projects where user has active reviewer permission
    permission_statement = (
        select(Project)
        .join(ApplicationReviewerPermission,
              ApplicationReviewerPermission.project_id == Project.id)
        .where(
            ApplicationReviewerPermission.reviewer_id == user_id,
            ApplicationReviewerPermission.status == ReviewerPermissionStatus.ACTIVE
        )
    )
    permitted_projects = list(session.exec(permission_statement).all())

    # Combine and deduplicate
    all_projects = {p.id: p for p in owned_projects + permitted_projects}
    return list(all_projects.values())


def check_user_is_approved_volunteer(
    *,
    session: Session,
    project_id: uuid.UUID,
    user_id: uuid.UUID
) -> bool:
    """
    Check if a user is an approved volunteer for a specific project.
    """
    statement = select(ProjectApplication).where(
        ProjectApplication.project_id == project_id,
        ProjectApplication.volunteer_id == user_id,
        ProjectApplication.status == ApplicationStatus.APPROVED
    )
    application = session.exec(statement).first()
    return application is not None


def create_volunteer_profile(
    *, session: Session, profile_in: VolunteerProfileCreate, user_id: uuid.UUID
) -> VolunteerProfile:
    """Create a new volunteer profile"""
    db_profile = VolunteerProfile.model_validate(
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


def get_volunteer_profile(*, session: Session, profile_id: uuid.UUID) -> VolunteerProfilePublic | None:
    """Get volunteer profile by ID with user data"""
    statement = (
        select(VolunteerProfile)
        .options(selectinload(VolunteerProfile.user))
        .where(VolunteerProfile.id == profile_id)
    )
    profile = session.exec(statement).first()

    if not profile:
        return None

    # Convert to public model
    return VolunteerProfilePublic.model_validate(profile, update={"user": profile.user})


def get_volunteer_profile_by_user_id(
    *, session: Session, user_id: uuid.UUID
) -> VolunteerProfilePublic | None:
    """Get volunteer profile by user ID with user data"""
    statement = (
        select(VolunteerProfile)
        .options(selectinload(VolunteerProfile.user))
        .where(VolunteerProfile.user_id == user_id)
    )
    profile = session.exec(statement).first()

    if not profile:
        return None

    # Convert to public model
    return VolunteerProfilePublic.model_validate(profile, update={"user": profile.user})


def update_volunteer_profile(
    *, session: Session, db_profile: VolunteerProfile, profile_in: VolunteerProfileUpdate
) -> VolunteerProfilePublic:
    """Update an existing volunteer profile"""
    profile_data = profile_in.model_dump(exclude_unset=True)
    profile_data["updated_at"] = datetime.now(timezone.utc)

    db_profile.sqlmodel_update(profile_data)
    session.add(db_profile)
    session.commit()
    session.refresh(db_profile)

    # Load user relationship for response
    session.refresh(db_profile, ["user"])

    return VolunteerProfilePublic.model_validate(db_profile, update={"user": db_profile.user})


def delete_volunteer_profile(*, session: Session, profile_id: uuid.UUID) -> bool:
    """Delete a volunteer profile"""
    profile = session.get(VolunteerProfile, profile_id)
    if profile:
        session.delete(profile)
        session.commit()
        return True
    return False


def get_volunteer_profiles(
    *, session: Session, skip: int = 0, limit: int = 100
) -> tuple[list[VolunteerProfilePublic], int]:
    """Get all volunteer profiles with pagination"""
    statement = (
        select(VolunteerProfile)
        .options(selectinload(VolunteerProfile.user))
        .offset(skip)
        .limit(limit)
        .order_by(VolunteerProfile.created_at.desc())
    )
    profiles = session.exec(statement).all()

    count_statement = select(func.count(VolunteerProfile.id))
    count = session.exec(count_statement).one()

    # Convert to public models
    public_profiles = [
        VolunteerProfilePublic.model_validate(
            profile, update={"user": profile.user})
        for profile in profiles
    ]

    return public_profiles, count


def search_volunteer_profiles(
    *,
    session: Session,
    search_query: str | None = None,
    skills: list[str] | None = None,
    location: str | None = None,
    skip: int = 0,
    limit: int = 100
) -> tuple[list[VolunteerProfilePublic], int]:
    """Search volunteer profiles with filters"""
    statement = (
        select(VolunteerProfile)
        .join(User, VolunteerProfile.user_id == User.id)
        .options(selectinload(VolunteerProfile.user))
    )

    # Add search filters
    filters = []
    if search_query:
        search_filter = (
            User.firstname.ilike(f"%{search_query}%") |
            User.lastname.ilike(f"%{search_query}%") |
            VolunteerProfile.bio.ilike(f"%{search_query}%") |
            VolunteerProfile.tagline.ilike(f"%{search_query}%")
        )
        filters.append(search_filter)

    if location:
        filters.append(VolunteerProfile.location.ilike(f"%{location}%"))

    if skills:
        # PostgreSQL array contains operator
        for skill in skills:
            filters.append(VolunteerProfile.skills.contains([skill]))

    if filters:
        statement = statement.where(*filters)

    # Add pagination and ordering
    count_statement = statement.with_only_columns(
        func.count(VolunteerProfile.id))
    count = session.exec(count_statement).one()

    profiles = session.exec(
        statement.offset(skip).limit(limit).order_by(
            VolunteerProfile.created_at.desc())
    ).all()

    # Convert to public models
    public_profiles = [
        VolunteerProfilePublic.model_validate(
            profile, update={"user": profile.user})
        for profile in profiles
    ]

    return public_profiles, count


def get_volunteer_profile_stats(*, session: Session, user_id: uuid.UUID) -> dict:
    """Get statistics for volunteer's dashboard"""

    # Count approved projects the volunteer contributed to
    total_projects_contributed = session.exec(
        select(func.count(func.distinct(ProjectApplication.project_id)))
        .where(
            ProjectApplication.volunteer_id == user_id,
            ProjectApplication.status == ApplicationStatus.APPROVED
        )
    ).one() or 0

    # Count tasks assigned to volunteer (excluding cancelled)
    total_tasks_assigned = session.exec(
        select(func.count(Task.id))
        .where(
            Task.assignee_id == user_id,
            Task.status != TaskStatus.CANCELLED
        )
    ).one() or 0

    # Count completed tasks
    total_tasks_completed = session.exec(
        select(func.count(Task.id))
        .where(
            Task.assignee_id == user_id,
            Task.status == TaskStatus.COMPLETED
        )
    ).one() or 0

    # Count threads created by volunteer
    total_threads_created = session.exec(
        select(func.count(ProjectThread.id))
        .where(ProjectThread.author_id == user_id)
    ).one() or 0

    # Count comments made by volunteer
    total_comments_made = session.exec(
        select(func.count(Comment.id))
        .where(Comment.author_id == user_id)
    ).one() or 0

    # Count replies made by volunteer
    total_replies_made = session.exec(
        select(func.count(Reply.id))
        .where(Reply.author_id == user_id)
    ).one() or 0

    return {
        "total_projects_contributed": total_projects_contributed,
        "total_tasks_assigned": total_tasks_assigned,
        "total_tasks_completed": total_tasks_completed,
        "total_threads_created": total_threads_created,
        "total_comments_made": total_comments_made,
        "total_replies_made": total_replies_made,
    }


def get_volunteer_approved_projects(
    *, session: Session, user_id: uuid.UUID, skip: int = 0, limit: int = 100
) -> tuple[list[Project], int]:
    """Get projects that the volunteer has been approved to contribute to"""
    statement = (
        select(Project)
        .join(ProjectApplication, ProjectApplication.project_id == Project.id)
        .where(
            ProjectApplication.volunteer_id == user_id,
            ProjectApplication.status == ApplicationStatus.APPROVED
        )
        .offset(skip)
        .limit(limit)
        .order_by(Project.created_at.desc())
    )

    projects = session.exec(statement).all()

    count_statement = (
        select(func.count(Project.id))
        .join(ProjectApplication, ProjectApplication.project_id == Project.id)
        .where(
            ProjectApplication.volunteer_id == user_id,
            ProjectApplication.status == ApplicationStatus.APPROVED
        )
    )
    count = session.exec(count_statement).one()

    return list(projects), count


def create_volunteer_profile(
    *, session: Session, profile_in: VolunteerProfileCreate, user_id: uuid.UUID
) -> VolunteerProfile:
    """Create a new volunteer profile"""
    db_profile = VolunteerProfile.model_validate(
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


def get_volunteer_profile(*, session: Session, profile_id: uuid.UUID) -> VolunteerProfilePublic | None:
    """Get volunteer profile by ID with user data"""
    statement = (
        select(VolunteerProfile)
        .options(selectinload(VolunteerProfile.user))
        .where(VolunteerProfile.id == profile_id)
    )
    profile = session.exec(statement).first()

    if not profile:
        return None

    # Convert to public model
    return VolunteerProfilePublic.model_validate(profile, update={"user": profile.user})


def get_volunteer_profile_by_user_id(
    *, session: Session, user_id: uuid.UUID
) -> VolunteerProfilePublic | None:
    """Get volunteer profile by user ID with user data"""
    statement = (
        select(VolunteerProfile)
        .options(selectinload(VolunteerProfile.user))
        .where(VolunteerProfile.user_id == user_id)
    )
    profile = session.exec(statement).first()

    if not profile:
        return None

    # Convert to public model
    return VolunteerProfilePublic.model_validate(profile, update={"user": profile.user})


def update_volunteer_profile(
    *, session: Session, db_profile: VolunteerProfile, profile_in: VolunteerProfileUpdate
) -> VolunteerProfilePublic:
    """Update an existing volunteer profile"""
    profile_data = profile_in.model_dump(exclude_unset=True)
    profile_data["updated_at"] = datetime.now(timezone.utc)

    db_profile.sqlmodel_update(profile_data)
    session.add(db_profile)
    session.commit()
    session.refresh(db_profile)

    # Load user relationship for response
    session.refresh(db_profile, ["user"])

    return VolunteerProfilePublic.model_validate(db_profile, update={"user": db_profile.user})


def delete_volunteer_profile(*, session: Session, profile_id: uuid.UUID) -> bool:
    """Delete a volunteer profile"""
    profile = session.get(VolunteerProfile, profile_id)
    if profile:
        session.delete(profile)
        session.commit()
        return True
    return False


def get_volunteer_profiles(
    *, session: Session, skip: int = 0, limit: int = 100
) -> tuple[list[VolunteerProfilePublic], int]:
    """Get all volunteer profiles with pagination"""
    statement = (
        select(VolunteerProfile)
        .options(selectinload(VolunteerProfile.user))
        .offset(skip)
        .limit(limit)
        .order_by(VolunteerProfile.created_at.desc())
    )
    profiles = session.exec(statement).all()

    count_statement = select(func.count(VolunteerProfile.id))
    count = session.exec(count_statement).one()

    # Convert to public models
    public_profiles = [
        VolunteerProfilePublic.model_validate(
            profile, update={"user": profile.user})
        for profile in profiles
    ]

    return public_profiles, count


def search_volunteer_profiles(
    *,
    session: Session,
    search_query: str | None = None,
    skills: list[str] | None = None,
    location: str | None = None,
    skip: int = 0,
    limit: int = 100
) -> tuple[list[VolunteerProfilePublic], int]:
    """Search volunteer profiles with filters"""
    statement = (
        select(VolunteerProfile)
        .join(User, VolunteerProfile.user_id == User.id)
        .options(selectinload(VolunteerProfile.user))
    )

    # Add search filters
    filters = []
    if search_query:
        search_filter = (
            User.firstname.ilike(f"%{search_query}%") |
            User.lastname.ilike(f"%{search_query}%") |
            VolunteerProfile.bio.ilike(f"%{search_query}%") |
            VolunteerProfile.tagline.ilike(f"%{search_query}%")
        )
        filters.append(search_filter)

    if location:
        filters.append(VolunteerProfile.location.ilike(f"%{location}%"))

    if skills:
        # PostgreSQL array contains operator
        for skill in skills:
            filters.append(VolunteerProfile.skills.contains([skill]))

    if filters:
        statement = statement.where(*filters)

    # Add pagination and ordering
    count_statement = statement.with_only_columns(
        func.count(VolunteerProfile.id))
    count = session.exec(count_statement).one()

    profiles = session.exec(
        statement.offset(skip).limit(limit).order_by(
            VolunteerProfile.created_at.desc())
    ).all()

    # Convert to public models
    public_profiles = [
        VolunteerProfilePublic.model_validate(
            profile, update={"user": profile.user})
        for profile in profiles
    ]

    return public_profiles, count


def get_volunteer_profile_stats(*, session: Session, user_id: uuid.UUID) -> dict:
    """Get statistics for volunteer's dashboard"""

    # Count approved projects the volunteer contributed to
    total_projects_contributed = session.exec(
        select(func.count(func.distinct(ProjectApplication.project_id)))
        .where(
            ProjectApplication.volunteer_id == user_id,
            ProjectApplication.status == ApplicationStatus.APPROVED
        )
    ).one() or 0

    # Count tasks assigned to volunteer (excluding cancelled)
    total_tasks_assigned = session.exec(
        select(func.count(Task.id))
        .where(
            Task.assignee_id == user_id,
            Task.status != TaskStatus.CANCELLED
        )
    ).one() or 0

    # Count completed tasks
    total_tasks_completed = session.exec(
        select(func.count(Task.id))
        .where(
            Task.assignee_id == user_id,
            Task.status == TaskStatus.COMPLETED
        )
    ).one() or 0

    # Count threads created by volunteer
    total_threads_created = session.exec(
        select(func.count(ProjectThread.id))
        .where(ProjectThread.author_id == user_id)
    ).one() or 0

    # Count comments made by volunteer
    total_comments_made = session.exec(
        select(func.count(Comment.id))
        .where(Comment.author_id == user_id)
    ).one() or 0

    # Count replies made by volunteer
    total_replies_made = session.exec(
        select(func.count(Reply.id))
        .where(Reply.author_id == user_id)
    ).one() or 0

    return {
        "total_projects_contributed": total_projects_contributed,
        "total_tasks_assigned": total_tasks_assigned,
        "total_tasks_completed": total_tasks_completed,
        "total_threads_created": total_threads_created,
        "total_comments_made": total_comments_made,
        "total_replies_made": total_replies_made,
    }


def get_volunteer_approved_projects(
    *, session: Session, user_id: uuid.UUID, skip: int = 0, limit: int = 100
) -> tuple[list[Project], int]:
    """Get projects that the volunteer has been approved to contribute to"""
    statement = (
        select(Project)
        .join(ProjectApplication, ProjectApplication.project_id == Project.id)
        .where(
            ProjectApplication.volunteer_id == user_id,
            ProjectApplication.status == ApplicationStatus.APPROVED
        )
        .offset(skip)
        .limit(limit)
        .order_by(Project.created_at.desc())
    )

    projects = session.exec(statement).all()

    count_statement = (
        select(func.count(Project.id))
        .join(ProjectApplication, ProjectApplication.project_id == Project.id)
        .where(
            ProjectApplication.volunteer_id == user_id,
            ProjectApplication.status == ApplicationStatus.APPROVED
        )
    )
    count = session.exec(count_statement).one()

    return list(projects), count

def create_open_position(
    *,
    session: Session,
    position_in: OpenPositionCreate,
    project_id: uuid.UUID
) -> OpenPosition:
    """Create a new open position for a project"""
    # Check if position for this role already exists
    existing = get_open_position_by_role(
        session=session, project_id=project_id, volunteer_role=position_in.volunteer_role
    )
    if existing:
        raise ValueError(f"Open position for {position_in.volunteer_role} already exists")
    
    db_position = OpenPosition.model_validate(
        position_in,
        update={"project_id": project_id}
    )
    session.add(db_position)
    session.commit()
    session.refresh(db_position)
    return db_position


def get_open_position_by_id(
    *, session: Session, position_id: uuid.UUID
) -> OpenPosition | None:
    """Get open position by ID"""
    return session.get(OpenPosition, position_id)


def get_open_position_by_role(
    *,
    session: Session,
    project_id: uuid.UUID,
    volunteer_role: DeveloperRole
) -> OpenPosition | None:
    """Get open position by project and role"""
    statement = select(OpenPosition).where(
        OpenPosition.project_id == project_id,
        OpenPosition.volunteer_role == volunteer_role
    )
    return session.exec(statement).first()


def get_open_positions_by_project(
    *,
    session: Session,
    project_id: uuid.UUID
) -> list[OpenPosition]:
    """Get all open positions for a project"""
    statement = (
        select(OpenPosition)
        .where(OpenPosition.project_id == project_id)
        .order_by(OpenPosition.volunteer_role)
    )
    return session.exec(statement).all()


def update_open_position(
    *,
    session: Session,
    db_position: OpenPosition,
    position_in: OpenPositionUpdate
) -> OpenPosition:
    """Update an open position"""
    position_data = position_in.model_dump(exclude_unset=True)
    position_data["updated_at"] = datetime.now(timezone.utc)

    db_position.sqlmodel_update(position_data)
    session.add(db_position)
    session.commit()
    session.refresh(db_position)
    return db_position


def delete_open_position(
    *, session: Session, position_id: uuid.UUID
) -> bool:
    """Delete an open position"""
    position = session.get(OpenPosition, position_id)
    if position:
        session.delete(position)
        session.commit()
        return True
    return False

# Sponsor Profile CRUD operations (identical to requester)
def create_sponsor_profile(
    *, session: Session, profile_in: SponsorProfileCreate, user_id: uuid.UUID
) -> SponsorProfile:
    """Create a new sponsor profile"""
    db_profile = SponsorProfile.model_validate(
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

def get_sponsor_profile(*, session: Session, profile_id: uuid.UUID) -> SponsorProfilePublic | None:
    """Get sponsor profile by ID with user data"""
    statement = (
        select(SponsorProfile)
        .options(selectinload(SponsorProfile.user))
        .where(SponsorProfile.id == profile_id)
    )
    profile = session.exec(statement).first()

    if not profile:
        return None

    return SponsorProfilePublic.model_validate(profile, update={"user": profile.user})

def get_sponsor_profile_by_user_id(
    *, session: Session, user_id: uuid.UUID
) -> SponsorProfilePublic | None:
    """Get sponsor profile by user ID with user data"""
    statement = (
        select(SponsorProfile)
        .options(selectinload(SponsorProfile.user))
        .where(SponsorProfile.user_id == user_id)
    )
    profile = session.exec(statement).first()

    if not profile:
        return None

    return SponsorProfilePublic.model_validate(profile, update={"user": profile.user})

def update_sponsor_profile(
    *, session: Session, db_profile: SponsorProfile, profile_in: SponsorProfileUpdate
) -> SponsorProfilePublic:
    """Update an existing sponsor profile"""
    profile_data = profile_in.model_dump(exclude_unset=True)
    profile_data["updated_at"] = datetime.now(timezone.utc)

    db_profile.sqlmodel_update(profile_data)
    session.add(db_profile)
    session.commit()
    session.refresh(db_profile)

    session.refresh(db_profile, ["user"])

    return SponsorProfilePublic.model_validate(db_profile, update={"user": db_profile.user})

def delete_sponsor_profile(*, session: Session, profile_id: uuid.UUID) -> bool:
    """Delete a sponsor profile"""
    profile = session.get(SponsorProfile, profile_id)
    if profile:
        session.delete(profile)
        session.commit()
        return True
    return False

def get_sponsor_profiles(
    *, session: Session, skip: int = 0, limit: int = 100
) -> tuple[list[SponsorProfilePublic], int]:
    """Get all sponsor profiles with pagination"""
    statement = select(SponsorProfile).options(selectinload(SponsorProfile.user)).offset(skip).limit(limit)
    profiles = session.exec(statement).all()
    count_statement = select(func.count(SponsorProfile.id))
    count = session.exec(count_statement).one()

    public_profiles = [
        RequesterProfilePublic.model_validate(
            profile, update={"user": profile.user})
        for profile in profiles
    ]

    return public_profiles, count

def search_sponsor_profiles(
    *, session: Session, search_query: str | None = None, location: str | None = None, skip: int = 0, limit: int = 100
) -> tuple[list[SponsorProfilePublic], int]:
    """Search sponsor profiles by query and filters"""
    statement = select(SponsorProfile).options(selectinload(SponsorProfile.user))

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

def get_sponsor_profile_stats(*, session: Session, user_id: uuid.UUID) -> dict:
    """Get statistics for sponsor's dashboard (donations and sponsorships)"""
    # Count total donations by sponsor (user_id)
    total_donations = session.exec(
        select(func.count(Donation.id)).where(Donation.donor_id == user_id)
    ).one() or 0

    # Count total sponsorships (assuming sponsorships are linked via a separate model or donation type; adjust if needed)
    # Placeholder: If sponsorships are a subset of donations, filter accordingly. For now, assume all donations are sponsorships or add a flag.
    total_sponsorships = session.exec(
        select(func.count(Donation.id)).where(Donation.donor_id == user_id)  # Adjust filter if sponsorships differ
    ).one() or 0

    # Calculate total amount donated
    total_amount_donated = session.exec(
        select(func.sum(Payment.amount))
        .join(Donation, Payment.order_id == Donation.order_id)
        .where(Donation.donor_id == user_id)
    ).one() or 0

    return {
        "total_donations": total_donations,
        "total_sponsorships": total_sponsorships,
        "total_amount_donated": total_amount_donated,
        "active_sponsorships": total_sponsorships,  # Placeholder; adjust based on status if available
    }