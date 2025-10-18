import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { CanCreateTaskResponse } from '@/types/api';

export const canCreateTask = (
  projectId: string,
): Promise<CanCreateTaskResponse> => {
  return api.get(`/projects/${projectId}/tasks/can-create`);
};

export const canCreateTaskQueryOptions = (projectId: string) => {
  return queryOptions({
    queryKey: ['tasks', 'can-create', projectId],
    queryFn: () => canCreateTask(projectId),
  });
};

type UseCanCreateTaskOptions = {
  projectId: string;
  queryConfig?: QueryConfig<typeof canCreateTaskQueryOptions>;
};

export const useCanCreateTask = ({
  projectId,
  queryConfig,
}: UseCanCreateTaskOptions) => {
  return useQuery({
    ...canCreateTaskQueryOptions(projectId),
    ...queryConfig,
  });
};
