import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { TaskResponse } from '@/types/api';

export const createTaskInputSchema = z.object({
  projectId: z.string(),
  data: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    estimated_hours: z.number().positive().optional(),
    due_date: z.string().optional(),
  }),
});

export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;

export const createTask = ({
  projectId,
  data,
}: CreateTaskInput): Promise<TaskResponse> => {
  return api.post(`/projects/${projectId}/tasks/`, data);
};

type UseCreateTaskOptions = {
  mutationConfig?: MutationConfig<typeof createTask>;
};

export const useCreateTask = ({
  mutationConfig,
}: UseCreateTaskOptions = {}) => {
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
    mutationFn: createTask,
  });
};
