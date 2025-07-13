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


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID


# Response wrapper for single user (Swagger-friendly)
class UserResponse(SQLModel):
    data: UserPublic


class UsersPublic(SQLModel):
    data: list[UserPublic]
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
    estimated_timeline: str | None = Field(default=None, max_length=100)


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


# Properties to return via API, id is always required
class ProjectPublic(ProjectBase):
    id: uuid.UUID
    requester_id: uuid.UUID
    status: ProjectStatus = Field(
        default=ProjectStatus.PENDING, sa_column=Column(Enum(ProjectStatus)))
    created_at: datetime
    updated_at: datetime


# Response wrapper for single project
class ProjectResponse(SQLModel):
    data: ProjectPublic


class ProjectsPublic(SQLModel):
    data: list[ProjectPublic]
    count: int


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
