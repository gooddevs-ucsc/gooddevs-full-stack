import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { OpenPositionResponse, OpenPositionUpdate } from '@/types/api';

export const updateOpenPosition = ({
  positionId,
  data,
}: {
  positionId: string;
  data: OpenPositionUpdate;
}): Promise<OpenPositionResponse> => {
  return api.put(`/open-positions/${positionId}`, data);
};

export const useUpdateOpenPosition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOpenPosition,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['open-positions'],
      });
    },
  });
};
