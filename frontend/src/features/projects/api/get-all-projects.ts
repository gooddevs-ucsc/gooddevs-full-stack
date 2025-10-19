import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Project, Meta } from '@/types/api';

export const getAllProjects = (
  page = 1,
  limit = 100,
): Promise<{
  data: Project[];
  meta: Meta;
}> => {
  return api.get('/projects/', {
    params: {
      page,
      limit,
    },
  });
};

export const getAllProjectsQueryOptions = ({
  page = 1,
  limit = 100,
}: { page?: number; limit?: number } = {}) => {
  return queryOptions({
    queryKey: ['projects', 'all', { page, limit }],
    queryFn: () => getAllProjects(page, limit),
  });
};

type UseAllProjectsOptions = {
  page?: number;
  limit?: number;
  queryConfig?: QueryConfig<typeof getAllProjectsQueryOptions>;
};

export const useAllProjects = ({
  page = 1,
  limit = 100,
  queryConfig,
}: UseAllProjectsOptions = {}) => {
  return useQuery({
    ...getAllProjectsQueryOptions({ page, limit }),
    ...queryConfig,
  });
};
