import uuid
import enum
from datetime import datetime
from typing import Optional

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
    firstname: Optional[str] = Field(default=None, max_length=255)
    lastname: Optional[str] = Field(default=None, max_length=255)
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
    email: Optional[EmailStr] = Field(
        default=None, max_length=255)  # type: ignore
    password: Optional[str] = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    full_name: Optional[str] = Field(default=None, max_length=255)
    email: Optional[EmailStr] = Field(default=None, max_length=255)


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
    volunteer_profile: Optional["VolunteerProfile"] = Relationship(
        back_populates="user", cascade_delete=True)


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
    description: Optional[str] = Field(default=None, max_length=255)


# Properties to receive on item creation
class ItemCreate(ItemBase):
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: Optional[str] = Field(
        default=None, min_length=1, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: Optional[User] = Relationship(back_populates="items")


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
    preferred_technologies: Optional[str] = Field(default=None, max_length=500)
    estimated_timeline: Optional[EstimatedTimeline] = Field(
        default=None, sa_column=Column(Enum(EstimatedTimeline)))


# Properties to receive via API on creation
class ProjectCreate(ProjectBase):
    pass


# Properties to receive via API on update
class ProjectUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(
        default=None, min_length=10, max_length=2000)
    project_type: Optional[ProjectType] = Field(
        default=None, sa_column=Column(Enum(ProjectType)))
    preferred_technologies: Optional[str] = Field(default=None, max_length=500)
    estimated_timeline: Optional[EstimatedTimeline] = Field(
        default=None, sa_column=Column(Enum(EstimatedTimeline)))
    status: Optional[ProjectStatus]


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
    requester: Optional[User] = Relationship(back_populates="projects")
    tasks: list["Task"] = Relationship(back_populates="project", cascade_delete=True)
 

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
    sub: Optional[str] = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)

class ProjectThread(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    project_id: uuid.UUID = Field(foreign_key="project.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProjectComment(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    content: str
    project_id: uuid.UUID = Field(foreign_key="project.id")
    author_id: uuid.UUID = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Request/Response models
class ProjectCommentCreate(SQLModel):
    content: str

class ProjectCommentUpdate(SQLModel):
    content: Optional[str] = None

class ProjectCommentPublic(SQLModel):
    id: uuid.UUID
    content: str
    project_id: uuid.UUID
    author: UserPublic
    created_at: datetime
    updated_at: datetime

class ProjectThreadPublic(SQLModel):
    id: uuid.UUID
    project_id: uuid.UUID
    comments: list[ProjectCommentPublic]
    created_at: datetime
    updated_at: datetime
    
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
    description: Optional[str] = Field(default=None, max_length=1000)
    status: TaskStatus = Field(default= TaskStatus.TODO, sa_column=Column(Enum(TaskStatus)))
    priority: TaskPriority = Field(default= TaskPriority.MEDIUM, sa_column=Column(Enum(TaskPriority)))
    estimated_hours: Optional[int] = Field(default=None, ge=1)
    actual_hours: Optional[int] = Field(default=None, ge=0)
    due_date: Optional[datetime] = Field(default=None)
    
# Api models
class TaskCreate(TaskBase):
    pass

class TaskUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    status: Optional[TaskStatus] = Field(default=None)
    priority: Optional[TaskPriority] = Field(default=None)
    estimated_hours: Optional[int] = Field(default=None, ge=1)
    actual_hours: Optional[int] = Field(default=None, ge=0)
    due_date: Optional[datetime] = Field(default=None)
    
# Database models
class Task(TaskBase, table=True):
    id:uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    project_id: uuid.UUID = Field(foreign_key="project.id", nullable=False, ondelete="CASCADE")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    project: Optional[Project] = Relationship(back_populates="tasks")
    
# Public Api models
class TaskPublic(TaskBase):
    id: uuid.UUID
    project_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    
class TasksPublic(SQLModel):
    data: list[TaskPublic]
    meta: Meta
    
# Response wrapper for single task
class TaskResponse(SQLModel):   
    data: TaskPublic


# Volunteer Profile Models
class VolunteerProfileBase(SQLModel):
    age: Optional[int] = Field(default=None, ge=18, le=100)
    title: Optional[str] = Field(default=None, max_length=255)
    bio: Optional[str] = Field(default=None, max_length=2000)
    phone: Optional[str] = Field(default=None, max_length=20)
    location: Optional[str] = Field(default=None, max_length=255)
    profile_photo_url: Optional[str] = Field(default=None, max_length=500)
    linkedin_profile_url: Optional[str] = Field(default=None, max_length=500)
    github_profile_url: Optional[str] = Field(default=None, max_length=500)


class VolunteerProfileCreate(VolunteerProfileBase):
    pass


class VolunteerProfileUpdate(SQLModel):
    age: Optional[int] = Field(default=None, ge=18, le=100)
    title: Optional[str] = Field(default=None, max_length=255)
    bio: Optional[str] = Field(default=None, max_length=2000)
    phone: Optional[str] = Field(default=None, max_length=20)
    location: Optional[str] = Field(default=None, max_length=255)
    profile_photo_url: Optional[str] = Field(default=None, max_length=500)
    linkedin_profile_url: Optional[str] = Field(default=None, max_length=500)
    github_profile_url: Optional[str] = Field(default=None, max_length=500)


class VolunteerProfile(VolunteerProfileBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", unique=True, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    user: Optional[User] = Relationship(back_populates="volunteer_profile")
    skills: list["VolunteerSkill"] = Relationship(back_populates="profile", cascade_delete=True)
    experiences: list["VolunteerExperience"] = Relationship(back_populates="profile", cascade_delete=True)
    projects: list["VolunteerProject"] = Relationship(back_populates="profile", cascade_delete=True)


class VolunteerSkillBase(SQLModel):
    name: str = Field(max_length=100)


class VolunteerSkillCreate(VolunteerSkillBase):
    pass


class VolunteerSkill(VolunteerSkillBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    profile_id: uuid.UUID = Field(foreign_key="volunteerprofile.id", nullable=False)
    
    # Relationships
    profile: Optional[VolunteerProfile] = Relationship(back_populates="skills")


class VolunteerExperienceBase(SQLModel):
    title: str = Field(max_length=255)
    company: str = Field(max_length=255)
    years: str = Field(max_length=100)
    description: Optional[str] = Field(default=None, max_length=1000)


class VolunteerExperienceCreate(VolunteerExperienceBase):
    pass


class VolunteerExperience(VolunteerExperienceBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    profile_id: uuid.UUID = Field(foreign_key="volunteerprofile.id", nullable=False)
    
    # Relationships
    profile: Optional[VolunteerProfile] = Relationship(back_populates="experiences")


class VolunteerProjectBase(SQLModel):
    title: str = Field(max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    link: Optional[str] = Field(default=None, max_length=500)


class VolunteerProjectCreate(VolunteerProjectBase):
    pass


class VolunteerProject(VolunteerProjectBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    profile_id: uuid.UUID = Field(foreign_key="volunteerprofile.id", nullable=False)
    
    # Relationships
    profile: Optional[VolunteerProfile] = Relationship(back_populates="projects")


# Public API models
class VolunteerSkillPublic(VolunteerSkillBase):
    id: uuid.UUID


class VolunteerExperiencePublic(VolunteerExperienceBase):
    id: uuid.UUID


class VolunteerProjectPublic(VolunteerProjectBase):
    id: uuid.UUID


class VolunteerProfilePublic(VolunteerProfileBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    user: UserPublic
    skills: list[VolunteerSkillPublic] = []
    experiences: list[VolunteerExperiencePublic] = []
    projects: list[VolunteerProjectPublic] = []


class VolunteerProfileResponse(SQLModel):
    data: VolunteerProfilePublic


class VolunteerProfileCreateRequest(SQLModel):
    profile: VolunteerProfileCreate
    skills: list[str] = []
    experiences: list[VolunteerExperienceCreate] = []
    projects: list[VolunteerProjectCreate] = []