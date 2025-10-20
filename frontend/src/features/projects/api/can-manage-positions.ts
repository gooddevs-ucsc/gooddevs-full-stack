import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { useUser } from '@/lib/auth';
import { CanManagePositionsResponse } from '@/types/api';

export const canManagePositions = ({
  projectId,
}: {
  projectId: string;
}): Promise<CanManagePositionsResponse> => {
  return api.get(`/projects/${projectId}/can-manage-positions`);
};

export const getCanManagePositionsQueryOptions = (projectId: string) => {
  return queryOptions({
    queryKey: ['can-manage-positions', projectId],
    queryFn: () => canManagePositions({ projectId }),
  });
};

export const useCanManagePositions = ({ projectId }: { projectId: string }) => {
  const { data: user } = useUser();

  return useQuery({
    ...getCanManagePositionsQueryOptions(projectId),
    enabled: !!user, // Only run if user is authenticated
  });
};
