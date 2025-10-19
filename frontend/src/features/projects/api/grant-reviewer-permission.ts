import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export type GrantReviewerPermissionData = {
  projectId: string;
  reviewerId: string;
};

export const grantReviewerPermission = ({
  projectId,
  reviewerId,
}: GrantReviewerPermissionData): Promise<void> => {
  return api.post(`/applications/projects/${projectId}/reviewers`, {
    reviewer_id: reviewerId,
  });
};

type UseGrantReviewerPermissionOptions = {
  mutationConfig?: MutationConfig<typeof grantReviewerPermission>;
};

export const useGrantReviewerPermission = ({
  mutationConfig,
}: UseGrantReviewerPermissionOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ['reviewer-permissions', variables.projectId],
      });

      queryClient.invalidateQueries({
        queryKey: ['applications', 'approved-applicants', variables.projectId],
      });

      onSuccess?.(data, variables, ...args);
    },
    ...restConfig,
    mutationFn: grantReviewerPermission,
  });
};
