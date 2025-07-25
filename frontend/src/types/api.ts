// let's imagine this file is autogenerated from the backend
// ideally, we want to keep these api related types in sync
// with the backend instead of manually writing them out

export type BaseEntity = {
  id: string;
  created_at: number;
};

export type Entity<T> = {
  [K in keyof T]: T[K];
} & BaseEntity;

export type Meta = {
  page: number;
  total: number;
  totalPages: number;
};

export type User = Entity<{
  firstname: string;
  lastname: string;
  email: string;
  role: 'ADMIN' | 'SPONSOR' | 'VOLUNTEER' | 'REQUESTER';
  bio: string;
}>;

export type AuthResponse = {
  jwt: string;
  user: User;
};

export type Team = Entity<{
  name: string;
  description: string;
}>;

export type Discussion = Entity<{
  title: string;
  body: string;
  teamId: string;
  author: User;
}>;

export type Comment = Entity<{
  body: string;
  discussionId: string;
  author: User;
}>;

/**
 * Project-related enums that match the backend models
 */
export const PROJECT_TYPES = {
  WEBSITE: 'WEBSITE',
  MOBILE_APP: 'MOBILE_APP',
  DATABASE: 'DATABASE',
  API: 'API',
  DESKTOP_APP: 'DESKTOP_APP',
  OTHER: 'OTHER',
} as const;

export const ESTIMATED_TIMELINES = {
  LESS_THAN_1_MONTH: 'LESS_THAN_1_MONTH',
  ONE_TO_THREE_MONTHS: 'ONE_TO_THREE_MONTHS',
  THREE_TO_SIX_MONTHS: 'THREE_TO_SIX_MONTHS',
  MORE_THAN_SIX_MONTHS: 'MORE_THAN_SIX_MONTHS',
} as const;

export type ProjectType = (typeof PROJECT_TYPES)[keyof typeof PROJECT_TYPES];
export type EstimatedTimeline =
  (typeof ESTIMATED_TIMELINES)[keyof typeof ESTIMATED_TIMELINES];

/**
 * UI Select options for forms
 */
export const PROJECT_TYPE_OPTIONS = [
  { label: 'Select a project type...', value: '' },
  { label: 'Website Development', value: PROJECT_TYPES.WEBSITE },
  { label: 'Mobile App', value: PROJECT_TYPES.MOBILE_APP },
  { label: 'API Development', value: PROJECT_TYPES.API },
  { label: 'Database Design', value: PROJECT_TYPES.DATABASE },
  { label: 'Desktop Application', value: PROJECT_TYPES.DESKTOP_APP },
  { label: 'Other', value: PROJECT_TYPES.OTHER },
];

export const ESTIMATED_TIMELINE_OPTIONS = [
  { label: 'Select timeline...', value: '' },
  { label: 'Less than 1 month', value: ESTIMATED_TIMELINES.LESS_THAN_1_MONTH },
  { label: '1-3 months', value: ESTIMATED_TIMELINES.ONE_TO_THREE_MONTHS },
  { label: '3-6 months', value: ESTIMATED_TIMELINES.THREE_TO_SIX_MONTHS },
  {
    label: 'More than 6 months',
    value: ESTIMATED_TIMELINES.MORE_THAN_SIX_MONTHS,
  },
];

/**
 * Project-related types that match the backend models
 */
export type Project = Entity<{
  id: string;
  title: string;
  description: string;
  project_type: ProjectType;
  preferred_technologies: string | null;
  estimated_timeline: EstimatedTimeline | null;
  created_at: string;
  updated_at: string;
  requester_id: string;
  status: string;
}>;

// task types
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimated_hours?: number;
  actual_hours?: number;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  estimated_hours?: number;
  actual_hours?: number;
  due_date?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  estimated_hours?: number;
  actual_hours?: number;
  due_date?: string;
}

export interface TasksResponse {
  data: Task[];
  meta: Meta;
}

export interface TaskResponse {
  data: Task;
}
