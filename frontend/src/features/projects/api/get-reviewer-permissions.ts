import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';

export interface ReviewerPermission {
  id: string;
  project_id: string;
  reviewer_id: string;
  granted_by: string;
  status: 'ACTIVE' | 'REVOKED';
  created_at: string;
  revoked_at: string | null;
  reviewer: {
    id: string;
    email: string;
    is_active: boolean;
    is_superuser: boolean;
    firstname: string | null;
    lastname: string | null;
    role: string;
  };
}

export const getReviewerPermissions = (
  projectId: string,
  includeRevoked: boolean = false,
): Promise<{
  data: ReviewerPermission[];
  count: number;
}> => {
  return api.get(
    `/applications/projects/${projectId}/reviewers?include_revoked=${includeRevoked}`,
  );
};

export const getReviewerPermissionsQueryOptions = ({
  projectId,
  includeRevoked = false,
}: {
  projectId: string;
  includeRevoked?: boolean;
}) => {
  return queryOptions({
    queryKey: ['reviewer-permissions', projectId, includeRevoked],
    queryFn: () => getReviewerPermissions(projectId, includeRevoked),
  });
};

type UseReviewerPermissionsOptions = {
  projectId: string;
  includeRevoked?: boolean;
  queryConfig?: QueryConfig<typeof getReviewerPermissionsQueryOptions>;
};

export const useReviewerPermissions = ({
  projectId,
  includeRevoked = false,
  queryConfig,
}: UseReviewerPermissionsOptions) => {
  return useQuery({
    ...getReviewerPermissionsQueryOptions({ projectId, includeRevoked }),
    ...queryConfig,
  });
};
