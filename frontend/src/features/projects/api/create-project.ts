import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { ESTIMATED_TIMELINES, PROJECT_TYPES, Project } from '@/types/api';

export const createProjectInputSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  project_type: z.enum(
    [
      PROJECT_TYPES.WEBSITE,
      PROJECT_TYPES.MOBILE_APP,
      PROJECT_TYPES.API,
      PROJECT_TYPES.DATABASE,
      PROJECT_TYPES.DESKTOP_APP,
      PROJECT_TYPES.OTHER,
    ],
    {
      required_error: 'Please select a project type',
    },
  ),
  estimated_timeline: z
    .enum(
      [
        ESTIMATED_TIMELINES.LESS_THAN_1_MONTH,
        ESTIMATED_TIMELINES.ONE_TO_THREE_MONTHS,
        ESTIMATED_TIMELINES.THREE_TO_SIX_MONTHS,
        ESTIMATED_TIMELINES.MORE_THAN_SIX_MONTHS,
      ],
      {
        required_error: 'Please select a timeline',
      },
    )
    .optional(),
  preferred_technologies: z.string().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectInputSchema>;

export const createProject = ({
  data,
}: {
  data: CreateProjectInput;
}): Promise<{ data: Project }> => {
  return api.post('/projects', data);
};

type UseCreateProjectOptions = {
  mutationConfig?: MutationConfig<typeof createProject>;
};

export const useCreateProject = ({
  mutationConfig,
}: UseCreateProjectOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['projects'],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createProject,
  });
};
