import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const deleteTaskInputSchema = z.object({
  projectId: z.string(),
  taskId: z.string(),
});

export type DeleteTaskInput = z.infer<typeof deleteTaskInputSchema>;

export const deleteTask = ({
  projectId,
  taskId,
}: DeleteTaskInput): Promise<{ message: string }> => {
  return api.delete(`/projects/${projectId}/tasks/${taskId}`);
};

type UseDeleteTaskOptions = {
  mutationConfig?: MutationConfig<typeof deleteTask>;
};

export const useDeleteTask = ({
  mutationConfig,
}: UseDeleteTaskOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', variables.projectId],
      });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig,
    mutationFn: deleteTask,
  });
};
