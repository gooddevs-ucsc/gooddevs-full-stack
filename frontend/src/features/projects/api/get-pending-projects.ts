import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Project, Meta } from '@/types/api';

export const getPendingProjects = (
  page = 1,
  limit = 100,
): Promise<{
  data: Project[];
  meta: Meta;
}> => {
  return api.get('/projects/pending', {
    params: {
      page,
      limit,
    },
  });
};

export const getPendingProjectsQueryOptions = ({
  page = 1,
  limit = 100,
}: { page?: number; limit?: number } = {}) => {
  return queryOptions({
    queryKey: ['projects', 'pending', { page, limit }],
    queryFn: () => getPendingProjects(page, limit),
  });
};

type UsePendingProjectsOptions = {
  page?: number;
  limit?: number;
  queryConfig?: QueryConfig<typeof getPendingProjectsQueryOptions>;
};

export const usePendingProjects = ({
  page = 1,
  limit = 100,
  queryConfig,
}: UsePendingProjectsOptions = {}) => {
  return useQuery({
    ...getPendingProjectsQueryOptions({ page, limit }),
    ...queryConfig,
  });
};
