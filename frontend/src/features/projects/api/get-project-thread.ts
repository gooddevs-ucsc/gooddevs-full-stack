import { useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';

export type ProjectThreadComment = {
  id: string;
  content: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  projectId: string;
};

export type ProjectThread = {
  id: string;
  projectId: string;
  comments: ProjectThreadComment[];
  createdAt: string;
  updatedAt: string;
};

export const getProjectThread = ({ projectId }: { projectId: string }): Promise<{ data: ProjectThread }> => {
  return api.get(`/projects/${projectId}/thread`);
};

export const getProjectThreadQueryOptions = (projectId: string) => {
  return {
    queryKey: ['project-thread', projectId],
    queryFn: () => getProjectThread({ projectId }),
  } as const;
};

type UseProjectThreadOptions = {
  projectId: string;
  queryConfig?: QueryConfig<typeof getProjectThread>;
};

export const useProjectThread = ({ projectId, queryConfig }: UseProjectThreadOptions) => {
  return useQuery({
    ...getProjectThreadQueryOptions(projectId),
    ...queryConfig,
  });
};