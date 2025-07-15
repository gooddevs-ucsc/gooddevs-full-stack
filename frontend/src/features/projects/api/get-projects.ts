import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Project, Meta } from '@/types/api';

export const getApprovedProjects = (
  page = 1,
  limit = 100,
): Promise<{
  data: Project[];
  meta: Meta;
}> => {
  return api.get('/projects/approved', {
    params: {
      page,
      limit,
    },
  });
};

export const getApprovedProjectsQueryOptions = ({
  page = 1,
  limit = 100,
}: { page?: number; limit?: number } = {}) => {
  return queryOptions({
    queryKey: ['projects', 'approved', { page, limit }],
    queryFn: () => getApprovedProjects(page, limit),
  });
};

export const getProjectById = (id: string): Promise<{ data: Project }> => {
  return api.get(`/projects/${id}`);
};

export const getProjectByIdQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: ['projects', id],
    queryFn: () => getProjectById(id),
  });
};

type UseApprovedProjectsOptions = {
  page?: number;
  limit?: number;
  queryConfig?: QueryConfig<typeof getApprovedProjectsQueryOptions>;
};

export const useApprovedProjects = ({
  page = 1,
  limit = 100,
  queryConfig,
}: UseApprovedProjectsOptions = {}) => {
  return useQuery({
    ...getApprovedProjectsQueryOptions({ page, limit }),
    ...queryConfig,
  });
};

type UseProjectByIdOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getProjectByIdQueryOptions>;
};

export const useProjectById = ({ id, queryConfig }: UseProjectByIdOptions) => {
  return useQuery({
    ...getProjectByIdQueryOptions(id),
    ...queryConfig,
  });
};
