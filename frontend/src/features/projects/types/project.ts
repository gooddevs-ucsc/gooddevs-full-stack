import { Entity } from '@/types/api';

/**
 * Enum representing the different types of projects available
 */
export enum ProjectType {
  WEBSITE = 'WEBSITE',
  MOBILE_APP = 'MOBILE_APP',
  DATABASE = 'DATABASE',
  API = 'API',
  DESKTOP_APP = 'DESKTOP_APP',
  OTHER = 'OTHER',
}

/**
 * Interface representing a project entity
 */
export type Project = Entity<{
  title: string;
  description: string;
  project_type: ProjectType;
  preferred_technologies: string | null;
  estimated_timeline: string | null;
  requester_id: string;
}>;

/**
 * Interface for the response from the projects API
 */
export interface ProjectsResponse {
  data: Project[];
  count: number;
}
