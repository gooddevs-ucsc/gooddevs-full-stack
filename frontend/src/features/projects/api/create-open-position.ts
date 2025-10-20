import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { OpenPositionCreate, OpenPositionResponse } from '@/types/api';

export const createOpenPosition = ({
  projectId,
  data,
}: {
  projectId: string;
  data: OpenPositionCreate;
}): Promise<OpenPositionResponse> => {
  return api.post(`/projects/${projectId}/open-positions`, data);
};

export const useCreateOpenPosition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOpenPosition,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['open-positions', variables.projectId],
      });
    },
  });
};
