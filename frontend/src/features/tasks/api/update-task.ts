import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { TaskResponse } from '@/types/api';

export const updateTaskInputSchema = z.object({
  projectId: z.string(),
  taskId: z.string(),
  data: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    status: z
      .enum(['TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
      .optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    estimated_hours: z.number().positive().optional(),
    actual_hours: z.number().min(0).optional(),
    due_date: z.string().optional(),
  }),
});

export type UpdateTaskInput = z.infer<typeof updateTaskInputSchema>;

export const updateTask = ({
  projectId,
  taskId,
  data,
}: UpdateTaskInput): Promise<TaskResponse> => {
  return api.put(`/projects/${projectId}/tasks/${taskId}`, data);
};

type UseUpdateTaskOptions = {
  mutationConfig?: MutationConfig<typeof updateTask>;
};

export const useUpdateTask = ({
  mutationConfig,
}: UseUpdateTaskOptions = {}) => {
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
    mutationFn: updateTask,
  });
};
