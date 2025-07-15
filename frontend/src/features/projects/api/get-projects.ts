import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Project, Meta } from '@/types/api';

export const getApprovedProjects = (
  skip = 0,
  limit = 100,
): Promise<{
  data: Project[];
  meta: Meta;
}> => {
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
