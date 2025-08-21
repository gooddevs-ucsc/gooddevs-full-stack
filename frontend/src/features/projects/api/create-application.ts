import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import {
  DEVELOPER_ROLES,
  ProjectApplicationCreate,
  ProjectApplicationResponse,
} from '@/types/api';

export const createApplicationInputSchema = z.object({
  volunteer_role: z.enum(
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
      required_error: 'Please select your role',
    },
  ),
  cover_letter: z
    .string()
    .min(50, 'Cover letter must be at least 50 characters')
    .max(2000, 'Cover letter must not exceed 2000 characters')
    .optional(),
  skills: z
    .string()
    .max(1000, 'Skills must not exceed 1000 characters')
    .optional(),
  experience_years: z
    .number()
    .min(0, 'Experience years must be at least 0')
    .max(50, 'Experience years must not exceed 50')
    .optional(),
  portfolio_url: z
    .string()
    .url('Please enter a valid URL')
    .max(500, 'URL must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
  linkedin_url: z
    .string()
    .url('Please enter a valid LinkedIn URL')
    .max(500, 'URL must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
  github_url: z
    .string()
    .url('Please enter a valid GitHub URL')
    .max(500, 'URL must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
});

export type CreateApplicationInput = z.infer<
  typeof createApplicationInputSchema
>;

export const createApplication = ({
  projectId,
  data,
}: {
  projectId: string;
  data: ProjectApplicationCreate;
}): Promise<ProjectApplicationResponse> => {
  return api.post(`/applications/projects/${projectId}`, data);
};

type UseCreateApplicationOptions = {
  mutationConfig?: MutationConfig<typeof createApplication>;
};

export const useCreateApplication = ({
  mutationConfig,
}: UseCreateApplicationOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['applications'],
      });
      queryClient.invalidateQueries({
        queryKey: ['projects'],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createApplication,
  });
};
