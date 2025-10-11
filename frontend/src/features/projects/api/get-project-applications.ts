import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { ProjectApplication, Meta } from '@/types/api';

export const getProjectApplications = (
  projectId: string,
  page = 1,
  limit = 100,
): Promise<{
  data: ProjectApplication[];
  meta: Meta;
}> => {
  return api.get(`/applications/projects/${projectId}`, {
    params: {
      page,
      limit,
    },
  });
};

export const getProjectApplicationsQueryOptions = ({
  projectId,
  page = 1,
  limit = 100,
}: {
  projectId: string;
  page?: number;
  limit?: number;
}) => {
  return queryOptions({
    queryKey: ['applications', 'project', projectId, { page, limit }],
    queryFn: () => getProjectApplications(projectId, page, limit),
  });
};

type UseProjectApplicationsOptions = {
  projectId: string;
  page?: number;
  limit?: number;
  queryConfig?: QueryConfig<typeof getProjectApplicationsQueryOptions>;
};

export const useProjectApplications = ({
  projectId,
  page = 1,
  limit = 100,
  queryConfig,
}: UseProjectApplicationsOptions) => {
  return useQuery({
    ...getProjectApplicationsQueryOptions({ projectId, page, limit }),
    ...queryConfig,
  });
};