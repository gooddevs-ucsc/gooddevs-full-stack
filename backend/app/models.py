import uuid
import enum
import re
from datetime import datetime
from typing import Any
from urllib.parse import urlparse

from pydantic import EmailStr, field_validator, ValidationError
from sqlmodel import Field, Relationship, SQLModel, Column, Enum, Identity, Integer


class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    VOLUNTEER = "VOLUNTEER"
    REQUESTER = "REQUESTER"
    SPONSOR = "SPONSOR"


class ProjectType(str, enum.Enum):
    WEBSITE = "WEBSITE"
    MOBILE_APP = "MOBILE_APP"
    DATABASE = "DATABASE"
    API = "API"
    DESKTOP_APP = "DESKTOP_APP"
    OTHER = "OTHER"


class ProjectStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"


class EstimatedTimeline(str, enum.Enum):
    LESS_THAN_1_MONTH = "LESS_THAN_1_MONTH"
    ONE_TO_THREE_MONTHS = "ONE_TO_THREE_MONTHS"
    THREE_TO_SIX_MONTHS = "THREE_TO_SIX_MONTHS"
    MORE_THAN_SIX_MONTHS = "MORE_THAN_SIX_MONTHS"


class VolunteerRole(str, enum.Enum):
    FRONTEND = "FRONTEND"
    BACKEND = "BACKEND"
    FULLSTACK = "FULLSTACK"
    UIUX = "UIUX"
    PROJECTMANAGER = "PROJECTMANAGER"
    QA = "QA"


class ReviewerPermissionStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    REVOKED = "REVOKED"

# Shared properties


class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    firstname: str | None = Field(default=None, max_length=255)
    lastname: str | None = Field(default=None, max_length=255)
    role: UserRole = Field(default=UserRole.VOLUNTEER,
                           sa_column=Column(Enum(UserRole)))


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    firstname: str = Field(max_length=255)
    lastname: str = Field(max_length=255)
    role: UserRole
    volunteer_roles: list[str] | None = Field(default=None)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(
        default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    items: list["Item"] = Relationship(
        back_populates="owner", cascade_delete=True)
    projects: list["Project"] = Relationship(
        back_populates="requester", cascade_delete=True)
    notifications: list["Notification"] = Relationship(
        back_populates="recipient")
    volunteer_roles: list["UserVolunteerRole"] = Relationship(
        back_populates="user", cascade_delete=True)
    reviewer_permissions: list["ApplicationReviewerPermission"] = Relationship(
        back_populates="reviewer",
        cascade_delete=True,
        sa_relationship_kwargs={
            "foreign_keys": "[ApplicationReviewerPermission.reviewer_id]"}
    )
    granted_permissions: list["ApplicationReviewerPermission"] = Relationship(
        back_populates="granter",
        cascade_delete=True,
        sa_relationship_kwargs={
            "foreign_keys": "[ApplicationReviewerPermission.granted_by]"}
    )


class UserVolunteerRole(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    role: VolunteerRole = Field(sa_column=Column(Enum(VolunteerRole)))
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    user: User | None = Relationship(back_populates="volunteer_roles")

# Properties to return via API, id is always required


class UserPublic(UserBase):
    id: uuid.UUID


# Response wrapper for single user (Swagger-friendly)
class UserResponse(SQLModel):
    data: UserPublic | None


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


class UserIdNameRole(SQLModel):
    id: uuid.UUID
    firstname: str | None
    lastname: str | None
    role: UserRole


class VolunteersPublic(SQLModel):
    data: list[UserIdNameRole]
    count: int

# Shared properties


class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


# Properties to receive on item creation
class ItemCreate(ItemBase):
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: str | None = Field(
        default=None, min_length=1, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="items")


# Properties to return via API, id is always required
class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID


class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int


# Shared properties
class ProjectBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str = Field(min_length=10, max_length=2000)
    project_type: ProjectType = Field(sa_column=Column(Enum(ProjectType)))
    preferred_technologies: str | None = Field(default=None, max_length=500)
    estimated_timeline: EstimatedTimeline | None = Field(
        default=None, sa_column=Column(Enum(EstimatedTimeline)))


# Properties to receive via API on creation
class ProjectCreate(ProjectBase):
    pass


# Properties to receive via API on update
class ProjectUpdate(SQLModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = Field(
        default=None, min_length=10, max_length=2000)
    project_type: ProjectType | None = Field(
        default=None, sa_column=Column(Enum(ProjectType)))
    preferred_technologies: str | None = Field(default=None, max_length=500)
    estimated_timeline: EstimatedTimeline | None = Field(
        default=None, sa_column=Column(Enum(EstimatedTimeline)))
    status: ProjectStatus | None


# Database model, database table inferred from class name
class Project(ProjectBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    requester_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    status: ProjectStatus = Field(
        default=ProjectStatus.PENDING, sa_column=Column(Enum(ProjectStatus)))

    # Relationships
    requester: User | None = Relationship(back_populates="projects")
    tasks: list["Task"] = Relationship(
        back_populates="project", cascade_delete=True)
    threads: list["ProjectThread"] = Relationship(back_populates="project")


# Properties to return via API, id is always required
class ProjectPublic(ProjectBase):
    id: uuid.UUID
    requester_id: uuid.UUID
    status: ProjectStatus = Field(
        default=ProjectStatus.PENDING, sa_column=Column(Enum(ProjectStatus)))
    created_at: datetime
    updated_at: datetime


# Pagination metadata
class Meta(SQLModel):
    page: int
    total: int
    totalPages: int


# Response wrapper for single project
class ProjectResponse(SQLModel):
    data: ProjectPublic


# Response wrapper for multiple projects with pagination
class ProjectsPublic(SQLModel):
    data: list[ProjectPublic]
    meta: Meta


# Generic message
class Message(SQLModel):
    message: str


# TODO: Remove Token class after authentication is completed, if no longer used
# JSON payload containing access tokem
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


class AuthResponse(SQLModel):
    user: UserPublic
    jwt: str


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)

# Task status enum


class TaskStatus(str, enum.Enum):
    TODO = "TODO"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

# Task priority enum


class TaskPriority(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    URGENT = "URGENT"

# Base Task model


class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=1000)
    status: TaskStatus = Field(
        default=TaskStatus.TODO, sa_column=Column(Enum(TaskStatus)))
    priority: TaskPriority = Field(
        default=TaskPriority.MEDIUM, sa_column=Column(Enum(TaskPriority)))
    estimated_hours: int | None = Field(default=None, ge=1)
    actual_hours: int | None = Field(default=None, ge=0)
    due_date: datetime | None = Field(default=None)

# Api models


class TaskCreate(TaskBase):
    assignee_id: uuid.UUID | None = Field(default=None)


class TaskUpdate(SQLModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=1000)
    status: TaskStatus | None = Field(default=None)
    priority: TaskPriority | None = Field(default=None)
    estimated_hours: int | None = Field(default=None, ge=1)
    actual_hours: int | None = Field(default=None, ge=0)
    due_date: datetime | None = Field(default=None)
    assignee_id: uuid.UUID | None = Field(default=None)

# Database models


class Task(TaskBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    project_id: uuid.UUID = Field(
        foreign_key="project.id", nullable=False, ondelete="CASCADE")
    creator_id: uuid.UUID | None = Field(default=None, foreign_key="user.id")
    assignee_id: uuid.UUID | None = Field(default=None, foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships - Use sa_relationship_kwargs for SQLModel
    project: Project | None = Relationship(back_populates="tasks")
    assignee: User | None = Relationship(
        sa_relationship_kwargs={"foreign_keys": "[Task.assignee_id]"}
    )
    creator: User | None = Relationship(
        sa_relationship_kwargs={"foreign_keys": "[Task.creator_id]"}
    )

# Public Api models


class TaskPublic(TaskBase):
    id: uuid.UUID
    project_id: uuid.UUID
    creator_id: uuid.UUID | None = None
    assignee_id: uuid.UUID | None = None
    assignee: UserPublic | None = None
    creator: UserPublic | None = None
    created_at: datetime
    updated_at: datetime


class TasksPublic(SQLModel):
    data: list[TaskPublic]
    meta: Meta

# Response wrapper for single task


class TaskResponse(SQLModel):
    data: TaskPublic


# Response for can create task endpoint
class CanCreateTaskResponse(SQLModel):
    can_create: bool


# Project Thread models
class ProjectThreadBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    body: str = Field(min_length=1, max_length=10000)


class ProjectThreadCreate(ProjectThreadBase):
    pass


class ProjectThreadUpdate(SQLModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    body: str | None = Field(default=None, min_length=1, max_length=10000)


class ProjectThread(ProjectThreadBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    author_id: uuid.UUID = Field(foreign_key="user.id", nullable=False)
    project_id: uuid.UUID = Field(foreign_key="project.id", nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={
                                 "onupdate": datetime.utcnow})

    author: "User" = Relationship()
    project: "Project" = Relationship(back_populates="threads")
    comments: list["Comment"] = Relationship(
        back_populates="thread", sa_relationship_kwargs={"cascade": "all, delete-orphan"})


class ProjectThreadPublic(ProjectThreadBase):
    id: uuid.UUID
    author_id: uuid.UUID
    project_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    author: UserPublic
    comments: list["CommentPublic"] = []


class ProjectThreadsPublic(SQLModel):
    data: list[ProjectThreadPublic]
    meta: Meta


# Refactored Comment models - now without parent_id
class CommentBase(SQLModel):
    body: str = Field(min_length=1, max_length=10000)


class CommentCreate(CommentBase):
    pass  # Remove parent_id from here


class CommentUpdate(SQLModel):
    body: str | None = Field(default=None, min_length=1, max_length=10000)


class Comment(CommentBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    author_id: uuid.UUID = Field(foreign_key="user.id", nullable=False)
    thread_id: uuid.UUID = Field(
        foreign_key="projectthread.id", nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={
                                 "onupdate": datetime.utcnow})

    author: "User" = Relationship()
    thread: ProjectThread = Relationship(back_populates="comments")
    replies: list["Reply"] = Relationship(
        back_populates="comment", cascade_delete=True)


class CommentPublic(CommentBase):
    id: uuid.UUID
    author_id: uuid.UUID
    thread_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    author: UserPublic
    replies: list["ReplyPublic"] = []


class CommentsPublic(SQLModel):
    data: list[CommentPublic]
    meta: Meta


# New Reply models
class ReplyBase(SQLModel):
    body: str = Field(min_length=1, max_length=10000)


class ReplyCreate(ReplyBase):
    parent_id: uuid.UUID  # This is the comment ID this reply belongs to


class ReplyUpdate(SQLModel):
    body: str | None = Field(default=None, min_length=1, max_length=10000)


class Reply(ReplyBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    author_id: uuid.UUID = Field(foreign_key="user.id", nullable=False)
    parent_id: uuid.UUID = Field(
        foreign_key="comment.id", nullable=False)  # References comment.id
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={
                                 "onupdate": datetime.utcnow})

    author: "User" = Relationship()
    comment: Comment = Relationship(back_populates="replies")


class ReplyPublic(ReplyBase):
    id: uuid.UUID
    author_id: uuid.UUID
    parent_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    author: UserPublic


class RepliesPublic(SQLModel):
    data: list[ReplyPublic]
    meta: Meta


# Project Application Status enum
class ApplicationStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    WITHDRAWN = "WITHDRAWN"


# Volunteer roles for projects (matches existing database enum)
class DeveloperRole(str, enum.Enum):
    FRONTEND = "FRONTEND"
    BACKEND = "BACKEND"
    FULLSTACK = "FULLSTACK"
    UIUX = "UIUX"
    MOBILE = "MOBILE"
    DEVOPS = "DEVOPS"
    QA = "QA"
    PM = "PM"


# Base Application model
class ProjectApplicationBase(SQLModel):
    volunteer_role: DeveloperRole = Field(
        sa_column=Column(Enum(DeveloperRole)))
    cover_letter: str | None = Field(default=None, max_length=2000)
    skills: str | None = Field(default=None, max_length=1000)
    experience_years: int | None = Field(default=None, ge=0, le=50)
    portfolio_url: str | None = Field(default=None, max_length=500)
    linkedin_url: str | None = Field(default=None, max_length=500)
    github_url: str | None = Field(default=None, max_length=500)


# API models for creating application
class ProjectApplicationCreate(ProjectApplicationBase):

    @field_validator('cover_letter')
    @classmethod
    def validate_cover_letter(cls, v: str | None) -> str | None:
        if v is None:
            raise ValueError('Cover letter is required')

        # Clean and validate the content
        trimmed = v.strip()

        if len(trimmed) < 50:
            raise ValueError('Cover letter must be at least 50 characters')

        if len(trimmed) > 2000:
            raise ValueError('Cover letter must not exceed 2000 characters')

        # Check if it's just repeated characters or numbers
        if re.match(r'^(.)\1{49,}$', trimmed):  # 50+ of the same character
            raise ValueError(
                'Cover letter must contain meaningful text, not repeated characters')

        if re.match(r'^[0-9\s]*$', trimmed):  # Only numbers and spaces
            raise ValueError(
                'Cover letter must contain meaningful text, not just numbers')

        if re.match(r'^[^a-zA-Z]*$', trimmed):  # No letters at all
            raise ValueError(
                'Cover letter must contain meaningful text with actual words')

        # Check for minimum word count (at least 8 words)
        words = [word for word in trimmed.split() if len(word) > 0]
        if len(words) < 8:
            raise ValueError(
                'Cover letter must contain at least 8 meaningful words')

        return trimmed

    @classmethod
    def _validate_url_with_tld(cls, url: str) -> bool:
        """Validate that URL has a proper domain with TLD"""
        try:
            parsed = urlparse(url)
            hostname = parsed.hostname

            if not hostname:
                return False

            # Check if hostname has at least one dot and a valid TLD
            parts = hostname.split('.')
            if len(parts) < 2:
                return False

            # Get the TLD (last part)
            tld = parts[-1]

            # TLD must be at least 2 characters and contain only letters
            return len(tld) >= 2 and tld.isalpha()
        except Exception:
            return False

    @field_validator('portfolio_url')
    @classmethod
    def validate_portfolio_url(cls, v: str | None) -> str | None:
        if v is None or v == '':
            return v

        if not cls._validate_url_with_tld(v):
            raise ValueError(
                'Please enter a valid portfolio URL with a proper domain (e.g., .com, .org)')

        return v

    @field_validator('linkedin_url')
    @classmethod
    def validate_linkedin_url(cls, v: str | None) -> str | None:
        if v is None or v == '':
            return v

        if not cls._validate_url_with_tld(v):
            raise ValueError(
                'Please enter a valid LinkedIn URL with a proper domain')

        return v

    @field_validator('github_url')
    @classmethod
    def validate_github_url(cls, v: str | None) -> str | None:
        if v is None or v == '':
            raise ValueError('GitHub profile is required')

        if not cls._validate_url_with_tld(v):
            raise ValueError(
                'Please enter a valid GitHub URL with a proper domain')

        return v


# API model for updating application
class ProjectApplicationUpdate(SQLModel):
    volunteer_role: DeveloperRole | None = Field(default=None)
    cover_letter: str | None = Field(default=None, max_length=2000)
    skills: str | None = Field(default=None, max_length=1000)
    experience_years: int | None = Field(default=None, ge=0, le=50)
    portfolio_url: str | None = Field(default=None, max_length=500)
    linkedin_url: str | None = Field(default=None, max_length=500)
    github_url: str | None = Field(default=None, max_length=500)
    status: ApplicationStatus | None = Field(default=None)


# Models for approved team members (with volunteer role information)
class ApprovedTeamMember(SQLModel):
    id: uuid.UUID
    firstname: str | None
    lastname: str | None
    email: str
    volunteer_role: DeveloperRole


class ApprovedTeamMembersPublic(SQLModel):
    data: list[ApprovedTeamMember]
    count: int


# Database model
class ProjectApplication(ProjectApplicationBase, table=True):
    __table_args__ = (
        # Unique constraint to prevent duplicate applications
        {"sqlite_autoincrement": True},
    )

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    project_id: uuid.UUID = Field(
        foreign_key="project.id", nullable=False, ondelete="CASCADE"
    )
    volunteer_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    status: ApplicationStatus = Field(
        default=ApplicationStatus.PENDING, sa_column=Column(
            Enum(ApplicationStatus))
    )
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    project: Project | None = Relationship()
    volunteer: User | None = Relationship()


# Public API model
class ProjectApplicationPublic(ProjectApplicationBase):
    id: uuid.UUID
    project_id: uuid.UUID
    volunteer_id: uuid.UUID
    status: ApplicationStatus
    created_at: datetime
    updated_at: datetime
    volunteer: UserPublic | None = None
    project: ProjectPublic | None = None


# Response wrapper for single application
class ProjectApplicationResponse(SQLModel):
    data: ProjectApplicationPublic


# Response wrapper for multiple applications
class ProjectApplicationsPublic(SQLModel):
    data: list[ProjectApplicationPublic]
    meta: Meta


# Payment status enum with numeric values
class PaymentStatus(int, enum.Enum):
    PENDING = 0
    CANCELLED = -1
    FAILED = -2
    CHARGEDBACK = -3
    NOT_FOUND = -404  # If payment not found in PayHere after initiation
    SUCCESS = 2


# Payment currency enum
class PaymentCurrency(str, enum.Enum):
    LKR = "LKR"
    USD = "USD"


# Base Payment model
class PaymentBase(SQLModel):
    merchant_id: str = Field(max_length=255)
    first_name: str = Field(max_length=255)
    last_name: str = Field(max_length=255)
    email: EmailStr = Field(max_length=255)
    phone: str = Field(max_length=50)
    address: str = Field(max_length=500)
    city: str = Field(max_length=255)
    country: str = Field(max_length=255)
    order_id: int = Field(unique=True, index=True)
    items: str = Field(max_length=1000)  # Item title or Order/Invoice number
    currency: PaymentCurrency = Field(sa_column=Column(Enum(PaymentCurrency)))
    amount: float = Field(ge=0)


# API models for creation - only fields sent from frontend
class PaymentCreate(SQLModel):
    first_name: str | None = Field(default=None, max_length=255)
    last_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)
    phone: str | None = Field(default=None, max_length=50)
    address: str | None = Field(default=None, max_length=500)
    city: str | None = Field(default=None, max_length=255)
    country: str | None = Field(default=None, max_length=255)
    amount: float = Field(ge=0)
    # order_id, items, and currency will be generated by backend


# Database model
class Payment(PaymentBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    order_id: int = Field(sa_column=Column(
        "order_id", Integer, Identity(), unique=True))
    status: PaymentStatus = Field(
        default=PaymentStatus.PENDING, sa_column=Column(Enum(PaymentStatus)))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# Public API models
class PaymentPublic(PaymentBase):
    id: uuid.UUID
    status: PaymentStatus
    created_at: datetime
    updated_at: datetime


class PaymentInitiationPublic(PaymentBase):
    return_url: str
    cancel_url: str
    notify_url: str
    hash: str


class PaymentInitiationResponse(SQLModel):
    data: PaymentInitiationPublic


# PayHere Webhook models
class PayhereCheckoutAPIVerificationResponse(SQLModel):
    """Model for PayHere webhook form data"""
    merchant_id: str | None = None
    order_id: str | None = None
    payment_id: str | None = None
    payhere_amount: str | None = None
    payhere_currency: str | None = None
    status_code: str | None = None
    md5sig: str | None = None
    custom_1: str | None = None
    custom_2: str | None = None
    method: str | None = None
    status_message: str | None = None
    card_holder_name: str | None = None
    card_no: str | None = None
    card_expiry: str | None = None


# PayHere Retrieval API models
class PayHereOAuthTokenResponse(SQLModel):
    """Response from PayHere OAuth token endpoint"""
    access_token: str
    token_type: str
    expires_in: int
    scope: str


class PayHereCustomerDetails(SQLModel):
    """Customer details from PayHere retrieval response"""
    fist_name: str | None = None  # Note: PayHere API has typo "fist_name"
    last_name: str | None = None
    email: str | None = None
    phone: str | None = None
    delivery_details: dict | None = None


class PayHereAmountDetail(SQLModel):
    """Amount details from PayHere retrieval response"""
    currency: str
    gross: float
    fee: float
    net: float
    exchange_rate: float
    exchange_from: str
    exchange_to: str


class PayHerePaymentMethod(SQLModel):
    """Payment method details from PayHere retrieval response"""
    method: str
    card_customer_name: str | None = None
    card_no: str | None = None


class PayHerePaymentData(SQLModel):
    """Individual payment data from PayHere retrieval response"""
    payment_id: int
    order_id: str
    date: str
    description: str
    status: str  # RECEIVED, REFUNDED, CHARGEBACKED, etc.
    currency: str
    amount: float
    customer: PayHereCustomerDetails | None = None
    amount_detail: PayHereAmountDetail | None = None
    payment_method: PayHerePaymentMethod | None = None
    items: Any | None = None


class PayHereRetrievalResponse(SQLModel):
    """Full response from PayHere payment retrieval API"""
    status: int  # 1 = success, -1 = not found, -2 = auth error
    msg: str
    data: list[PayHerePaymentData] | None = None


# Notification


class NotificationPublic(SQLModel):
    id: uuid.UUID
    user_id: uuid.UUID
    type: str
    title: str
    message: str
    related_entity_id: uuid.UUID | None = None
    related_entity_type: str | None = None
    action_url: str | None = None
    is_read: bool
    created_at: datetime


class NotificationsPublic(SQLModel):
    data: list[NotificationPublic]
    meta: Meta


class NotificationType(str, enum.Enum):
    PROJECT_APPROVED = "PROJECT_APPROVED"
    PROJECT_REJECTED = "PROJECT_REJECTED"
    APPLICATION_RECEIVED = "APPLICATION_RECEIVED"
    APPLICATION_APPROVED = "APPLICATION_APPROVED"
    APPLICATION_REJECTED = "APPLICATION_REJECTED"
    NEW_COMMENT = "NEW_COMMENT"
    NEW_REPLY = "NEW_REPLY"
    TASK_ASSIGNED = "TASK_ASSIGNED"
    PROJECT_STATUS_CHANGED = "PROJECT_STATUS_CHANGED"

# Database model


class Notification(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE")
    type: NotificationType = Field(sa_column=Column(Enum(NotificationType)))
    title: str = Field(max_length=255)
    message: str = Field(max_length=1000)

    related_entity_id: uuid.UUID | None = Field(default=None)
    related_entity_type: str | None = Field(default=None, max_length=50)
    action_url: str | None = Field(default=None, max_length=500)

    is_read: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Fix: Use consistent naming
    recipient: User = Relationship(back_populates="notifications")


# Donation models
class DonationBase(SQLModel):
    message: str | None = Field(default=None, max_length=500)


class DonationCreate(DonationBase):
    amount: float = Field(ge=0)
    phone: str = Field(max_length=50)
    address: str = Field(max_length=500)
    city: str = Field(max_length=255)
    country: str = Field(max_length=255)


class Donation(DonationBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    donor_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    order_id: int = Field(
        foreign_key="payment.order_id", nullable=False, unique=True
    )
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    donor: User | None = Relationship()
    payment: Payment | None = Relationship()


class DonationPublic(DonationBase):
    id: uuid.UUID
    donor_id: uuid.UUID
    order_id: int
    created_at: datetime
    donor: UserPublic | None = None
    payment: PaymentPublic | None = None


class DonationResponse(SQLModel):
    data: DonationPublic


class DonationsPublic(SQLModel):
    data: list[DonationPublic]
    meta: Meta

# Application Reviewer Permission models


class ApplicationReviewerPermission(SQLModel, table=True):
    """
    Tracks which approved volunteers have permission to review applications for a specific project.
    Only project owners (requesters) can grant this permission.
    Uses status field (ACTIVE/REVOKED) instead of deleting records for audit trail.
    """
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    project_id: uuid.UUID = Field(
        foreign_key="project.id", nullable=False, ondelete="CASCADE"
    )
    reviewer_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    granted_by: uuid.UUID = Field(
        foreign_key="user.id", nullable=False
    )
    status: ReviewerPermissionStatus = Field(
        default=ReviewerPermissionStatus.ACTIVE,
        sa_column=Column(Enum(ReviewerPermissionStatus))
    )
    created_at: datetime = Field(default_factory=datetime.utcnow)
    revoked_at: datetime | None = Field(default=None)

    # Relationships
    project: Project | None = Relationship()
    reviewer: User | None = Relationship(
        back_populates="reviewer_permissions",
        sa_relationship_kwargs={
            "foreign_keys": "[ApplicationReviewerPermission.reviewer_id]"}
    )
    granter: User | None = Relationship(
        back_populates="granted_permissions",
        sa_relationship_kwargs={
            "foreign_keys": "[ApplicationReviewerPermission.granted_by]"}
    )


# API models for reviewer permissions
class ApplicationReviewerPermissionCreate(SQLModel):
    reviewer_id: uuid.UUID


class ApplicationReviewerPermissionPublic(SQLModel):
    id: uuid.UUID
    project_id: uuid.UUID
    reviewer_id: uuid.UUID
    granted_by: uuid.UUID
    status: ReviewerPermissionStatus
    created_at: datetime
    revoked_at: datetime | None = None
    reviewer: UserPublic | None = None


class ApplicationReviewerPermissionsPublic(SQLModel):
    data: list[ApplicationReviewerPermissionPublic]
    count: int


class CanReviewResponse(SQLModel):
    can_review: bool


# Enhanced Requester Profile models


class RequesterProfileBase(SQLModel):
    tagline: str | None = Field(default=None, max_length=500)
    logo_url: str | None = Field(default=None, max_length=500)
    cover_image_url: str | None = Field(default=None, max_length=500)
    website: str | None = Field(default=None, max_length=255)
    location: str | None = Field(default=None, max_length=255)
    about: str | None = Field(default=None, max_length=2000)
    linkedin_url: str | None = Field(default=None, max_length=500)
    twitter_url: str | None = Field(default=None, max_length=500)
    facebook_url: str | None = Field(default=None, max_length=500)
    instagram_url: str | None = Field(default=None, max_length=500)
    contact_phone: str | None = Field(default=None, max_length=20)


class RequesterProfileCreate(RequesterProfileBase):
    pass


class RequesterProfileUpdate(SQLModel):
    tagline: str | None = Field(default=None, max_length=500)
    logo_url: str | None = Field(default=None, max_length=500)
    cover_image_url: str | None = Field(default=None, max_length=500)
    website: str | None = Field(default=None, max_length=255)
    location: str | None = Field(default=None, max_length=255)
    about: str | None = Field(default=None, max_length=2000)
    linkedin_url: str | None = Field(default=None, max_length=500)
    twitter_url: str | None = Field(default=None, max_length=500)
    facebook_url: str | None = Field(default=None, max_length=500)
    instagram_url: str | None = Field(default=None, max_length=500)
    contact_phone: str | None = Field(default=None, max_length=20)


class RequesterProfile(RequesterProfileBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE", unique=True
    )
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship
    user: User | None = Relationship()


class RequesterProfilePublic(RequesterProfileBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    # Include user info so frontend can access name and email
    user: UserPublic | None = None

    # Computed properties that can be derived from user data
    @property
    def organization_name(self) -> str:
        if self.user:
            return f"{self.user.firstname} {self.user.lastname}"
        return "Unknown Organization"

    @property
    def organization_email(self) -> str:
        if self.user:
            return self.user.email
        return ""


class RequesterProfileResponse(SQLModel):
    data: RequesterProfilePublic


class RequesterProfilesPublic(SQLModel):
    data: list[RequesterProfilePublic]
    count: int
