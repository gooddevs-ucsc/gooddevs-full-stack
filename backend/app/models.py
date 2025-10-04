import uuid
import enum
from datetime import datetime

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel, Column, Enum


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
    notifications: list["Notification"] = Relationship(back_populates="recipient")


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
    tasks: list["Task"] = Relationship(back_populates="project", cascade_delete=True)
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
    assignee_id: uuid.UUID | None = Field(default=None, foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    project: Project | None = Relationship(back_populates="tasks")
    assignee: User | None = Relationship()

# Public Api models


class TaskPublic(TaskBase):
    id: uuid.UUID
    project_id: uuid.UUID
    assignee_id: uuid.UUID | None = None
    assignee: UserPublic | None = None
    created_at: datetime
    updated_at: datetime


class TasksPublic(SQLModel):
    data: list[TaskPublic]
    meta: Meta

# Response wrapper for single task


class TaskResponse(SQLModel):
    data: TaskPublic


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
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})

    author: "User" = Relationship()
    project: "Project" = Relationship(back_populates="threads")
    comments: list["Comment"] = Relationship(back_populates="thread", sa_relationship_kwargs={"cascade": "all, delete-orphan"})


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
    thread_id: uuid.UUID = Field(foreign_key="projectthread.id", nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})

    author: "User" = Relationship()
    thread: ProjectThread = Relationship(back_populates="comments")
    replies: list["Reply"] = Relationship(back_populates="comment", cascade_delete=True)


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
    parent_id: uuid.UUID = Field(foreign_key="comment.id", nullable=False)  # References comment.id
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})

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
    volunteer_role: DeveloperRole = Field(sa_column=Column(Enum(DeveloperRole)))
    cover_letter: str | None = Field(default=None, max_length=2000)
    skills: str | None = Field(default=None, max_length=1000)
    experience_years: int | None = Field(default=None, ge=0, le=50)
    portfolio_url: str | None = Field(default=None, max_length=500)
    linkedin_url: str | None = Field(default=None, max_length=500)
    github_url: str | None = Field(default=None, max_length=500)


# API models for creating application
class ProjectApplicationCreate(ProjectApplicationBase):
    pass


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
        default=ApplicationStatus.PENDING, sa_column=Column(Enum(ApplicationStatus))
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

# Notification

class NotificationType(str, enum.Enum):
    PROJECT_APPROVED = "PROJECT_APPROVED"
    NEW_APPLICATION = "NEW_APPLICATION"
    TASK_ASSIGNED = "TASK_ASSIGNED"
    # Add other types as needed

class Notification(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    message: str
    is_read: bool = Field(default=False)
    link: str | None = Field(default=None) # e.g., /projects/{project_id}
    type: NotificationType = Field(sa_column=Column(Enum(NotificationType)))
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Foreign key to the user who should receive the notification
    recipient_id: uuid.UUID = Field(foreign_key="user.id")
    recipient: "User" = Relationship(back_populates="notifications")

    

