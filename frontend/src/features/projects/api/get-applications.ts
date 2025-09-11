import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { ProjectApplication, Meta } from '@/types/api';

export const getApplications = (
  page = 1,
  limit = 100,
): Promise<{
  data: ProjectApplication[];
  meta: Meta;
}> => {
  return api.get('/applications/', {
    params: {
      page,
      limit,
    },
  });
};

export const getApplicationsQueryOptions = ({
  page = 1,
  limit = 100,
}: { page?: number; limit?: number } = {}) => {
  return queryOptions({
    queryKey: ['applications', { page, limit }],
    queryFn: () => getApplications(page, limit),
  });
};

type UseApplicationsOptions = {
  page?: number;
  limit?: number;
  queryConfig?: QueryConfig<typeof getApplicationsQueryOptions>;
};

export const useApplications = ({
  page = 1,
  limit = 100,
  queryConfig,
}: UseApplicationsOptions = {}) => {
  return useQuery({
    ...getApplicationsQueryOptions({ page, limit }),
    ...queryConfig,
  });
};
