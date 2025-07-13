import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';

/**
 * TODO:
 * - Export Project and ProjectsResponse types to src/types/api.ts
 * - Use a more generic pagination type across the project
 */
export interface Project {
  id: string;
  title: string;
  description: string;
  project_type: string;
  preferred_technologies: string | null;
  estimated_timeline:
    | 'LESS_THAN_1_MONTH'
    | 'ONE_TO_THREE_MONTHS'
    | 'THREE_TO_SIX_MONTHS'
    | 'MORE_THAN_SIX_MONTHS'
    | null;
  created_at: string;
  requester_id: string;
  status: string;
}

export interface ProjectsResponse {
  data: Project[];
  count: number;
}

export const getApprovedProjects = (
  skip = 0,
  limit = 100,
): Promise<ProjectsResponse> => {
  return api.get('/projects/approved', {
    params: {
      skip,
      limit,
    },
  });
};

export const getApprovedProjectsQueryOptions = ({
  skip = 0,
  limit = 100,
}: { skip?: number; limit?: number } = {}) => {
  return queryOptions({
    queryKey: ['projects', 'approved', { skip, limit }],
    queryFn: () => getApprovedProjects(skip, limit),
  });
};

type UseApprovedProjectsOptions = {
  skip?: number;
  limit?: number;
  queryConfig?: QueryConfig<typeof getApprovedProjectsQueryOptions>;
};

export const useApprovedProjects = ({
  skip = 0,
  limit = 100,
  queryConfig,
}: UseApprovedProjectsOptions = {}) => {
  return useQuery({
    ...getApprovedProjectsQueryOptions({ skip, limit }),
    ...queryConfig,
  });
};
