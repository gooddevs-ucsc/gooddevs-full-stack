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
    .min(1, 'Cover letter is required')
    .min(50, 'Cover letter must be at least 50 characters')
    .max(2000, 'Cover letter must not exceed 2000 characters')
    .refine(
      (value) => {
        // Check if the text contains meaningful content
        const trimmed = value.trim();

        // Check if it's just repeated characters or numbers
        const isRepeatedChar = /^(.)\1{49,}$/.test(trimmed); // 50+ of the same character
        const isOnlyNumbers = /^[0-9\s]*$/.test(trimmed); // Only numbers and spaces
        const isOnlySpecialChars = /^[^a-zA-Z]*$/.test(trimmed); // No letters at all

        // Check for minimum word count (at least 8 words)
        const wordCount = trimmed
          .split(/\s+/)
          .filter((word) => word.length > 0).length;
        const hasMinWords = wordCount >= 8;

        return (
          !isRepeatedChar &&
          !isOnlyNumbers &&
          !isOnlySpecialChars &&
          hasMinWords
        );
      },
      {
        message:
          'Cover letter must contain meaningful text with at least 8 words. Please avoid using only numbers, repeated characters, or special characters.',
      },
    ),
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
    .min(1, 'GitHub profile is required')
    .url('Please enter a valid GitHub URL')
    .max(500, 'URL must not exceed 500 characters'),
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
