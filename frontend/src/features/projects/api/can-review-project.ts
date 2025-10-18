import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';

export const canReviewProject = (
  projectId: string,
): Promise<{ can_review: boolean }> => {
  return api.get(`/applications/projects/${projectId}/can-review`);
};

export const canReviewProjectQueryOptions = (projectId: string) => {
  return queryOptions({
    queryKey: ['can-review-project', projectId],
    queryFn: () => canReviewProject(projectId),
  });
};

type UseCanReviewProjectOptions = {
  projectId: string;
  queryConfig?: QueryConfig<typeof canReviewProjectQueryOptions>;
};

export const useCanReviewProject = ({
  projectId,
  queryConfig,
}: UseCanReviewProjectOptions) => {
  return useQuery({
    ...canReviewProjectQueryOptions(projectId),
    ...queryConfig,
  });
};
