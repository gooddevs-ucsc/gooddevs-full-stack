import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import {
  DEVELOPER_ROLES,
  EXPERIENCE_LEVELS,
  AVAILABILITIES,
  ProjectApplicationResponse,
} from '@/types/api';

export const createProjectApplicationInputSchema = z.object({
  firstname: z.string().min(1, 'First name is required'),
  lastname: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().min(1, 'GitHub profile is required'),
  portfolio: z.string().optional(),
  role: z.enum(
    [
      DEVELOPER_ROLES.FRONTEND,
      DEVELOPER_ROLES.BACKEND,
      DEVELOPER_ROLES.FULLSTACK,
      DEVELOPER_ROLES.UIUX,
      DEVELOPER_ROLES.MOBILE,
      DEVELOPER_ROLES.DEVOPS,
      DEVELOPER_ROLES.QA,
      DEVELOPER_ROLES.PM,
    ],
    {
      required_error: 'Please select a role',
    },
  ),
  experience_level: z.enum(
    [
      EXPERIENCE_LEVELS.BEGINNER,
      EXPERIENCE_LEVELS.INTERMEDIATE,
      EXPERIENCE_LEVELS.ADVANCED,
      EXPERIENCE_LEVELS.EXPERT,
    ],
    {
      required_error: 'Please select experience level',
    },
  ),
  motivation: z.string().min(10, 'Motivation must be at least 10 characters'),
  relevant_experience: z.string().optional(),
  availability: z.enum(
    [
      AVAILABILITIES.FIVE_TO_TEN,
      AVAILABILITIES.TEN_TO_TWENTY,
      AVAILABILITIES.TWENTY_TO_THIRTY,
      AVAILABILITIES.THIRTY_PLUS,
    ],
    {
      required_error: 'Please select availability',
    },
  ),
  preferred_technologies: z.string().optional(),
});

export type CreateProjectApplicationInput = z.infer<
  typeof createProjectApplicationInputSchema
>;

export const createProjectApplication = ({
  data,
  projectId,
}: {
  data: CreateProjectApplicationInput;
  projectId: string;
}): Promise<ProjectApplicationResponse> => {
  return api.post(`/project-applications/projects/${projectId}/apply`, data);
};

type UseCreateProjectApplicationOptions = {
  mutationConfig?: MutationConfig<typeof createProjectApplication>;
};

export const useCreateProjectApplication = ({
  mutationConfig,
}: UseCreateProjectApplicationOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['project-applications'],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createProjectApplication,
  });
};
