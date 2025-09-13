import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Project, Meta } from '@/types/api';

export const getUserProjects = (
  page = 1,
  limit = 100,
): Promise<{
  data: Project[];
  meta: Meta;
}> => {
  return api.get('/projects/my-projects', {
    params: {
      page,
      limit,
    },
  });
};

export const getUserProjectsQueryOptions = ({
  page = 1,
  limit = 100,
}: { page?: number; limit?: number } = {}) => {
  return queryOptions({
    queryKey: ['projects', 'user-projects', { page, limit }],
    queryFn: () => getUserProjects(page, limit),
  });
};

type UseUserProjectsOptions = {
  page?: number;
  limit?: number;
  queryConfig?: QueryConfig<typeof getUserProjectsQueryOptions>;
};

export const useUserProjects = ({
  page = 1,
  limit = 100,
  queryConfig,
}: UseUserProjectsOptions = {}) => {
  return useQuery({
    ...getUserProjectsQueryOptions({ page, limit }),
    ...queryConfig,
  });
};
