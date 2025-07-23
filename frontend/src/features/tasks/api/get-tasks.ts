import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { TasksResponse } from '@/types/api';

export const getTasksInputSchema = z.object({
  projectId: z.string(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export type GetTasksInput = z.infer<typeof getTasksInputSchema>;

export const getTasks = ({
  projectId,
  page = 1,
  limit = 100,
}: GetTasksInput): Promise<TasksResponse> => {
  return api.get(`/projects/${projectId}/tasks/`, {
    params: {
      page,
      limit,
    },
  });
};

export const getTasksQueryOptions = (input: GetTasksInput) => {
  return queryOptions({
    queryKey: [
      'tasks',
      input.projectId,
      { page: input.page, limit: input.limit },
    ],
    queryFn: () => getTasks(input),
  });
};

export const useTasks = (input: GetTasksInput) => {
  return useQuery({
    ...getTasksQueryOptions(input),
  });
};
