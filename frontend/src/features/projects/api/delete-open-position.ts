import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';

export const deleteOpenPosition = ({
  positionId,
}: {
  positionId: string;
}): Promise<{ message: string }> => {
  return api.delete(`/open-positions/${positionId}`);
};

export const useDeleteOpenPosition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOpenPosition,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['open-positions'],
      });
    },
  });
};
