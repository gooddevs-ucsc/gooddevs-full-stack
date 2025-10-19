import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export type RevokeReviewerPermissionData = {
  projectId: string;
  reviewerId: string;
};

export const revokeReviewerPermission = ({
  projectId,
  reviewerId,
}: RevokeReviewerPermissionData): Promise<void> => {
  return api.delete(
    `/applications/projects/${projectId}/reviewers/${reviewerId}`,
  );
};

type UseRevokeReviewerPermissionOptions = {
  mutationConfig?: MutationConfig<typeof revokeReviewerPermission>;
};

export const useRevokeReviewerPermission = ({
  mutationConfig,
}: UseRevokeReviewerPermissionOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ['reviewer-permissions', variables.projectId],
      });

      onSuccess?.(data, variables, ...args);
    },
    ...restConfig,
    mutationFn: revokeReviewerPermission,
  });
};
