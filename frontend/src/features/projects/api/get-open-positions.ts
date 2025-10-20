import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { OpenPositionsResponse } from '@/types/api';

export const getOpenPositions = ({
  projectId,
}: {
  projectId: string;
}): Promise<OpenPositionsResponse> => {
  return api.get(`/projects/${projectId}/open-positions`);
};

export const getOpenPositionsQueryOptions = (projectId: string) => {
  return queryOptions({
    queryKey: ['open-positions', projectId],
    queryFn: () => getOpenPositions({ projectId }),
  });
};

export const useOpenPositions = ({ projectId }: { projectId: string }) => {
  return useQuery({
    ...getOpenPositionsQueryOptions(projectId),
  });
};
