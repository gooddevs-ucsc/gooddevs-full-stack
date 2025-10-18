import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig, QueryConfig } from '@/lib/react-query';

// Types
export interface RequesterProfile {
  id: string;
  user_id: string;
  tagline: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  website: string | null;
  location: string | null;
  about: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  facebook_url: string | null;
  contact_phone: string | null;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
  } | null;
}

export interface RequesterProfileResponse {
  data: RequesterProfile;
}

// Schemas
export const updateRequesterProfileSchema = z.object({
  tagline: z.string().optional(),
  logo_url: z.string().url().optional().or(z.literal('')),
  cover_image_url: z.string().url().optional().or(z.literal('')),
  website: z.string().optional(),
  location: z.string().optional(),
  about: z.string().optional(),
  linkedin_url: z.string().url().optional().or(z.literal('')),
  twitter_url: z.string().url().optional().or(z.literal('')),
  facebook_url: z.string().url().optional().or(z.literal('')),
  contact_phone: z.string().optional(),
});

export type UpdateRequesterProfileInput = z.infer<
  typeof updateRequesterProfileSchema
>;

// API Functions
export const getRequesterProfile = (): Promise<RequesterProfileResponse> => {
  return api.get('/requester-profile/');
};

export const updateRequesterProfile = ({
  data,
}: {
  data: UpdateRequesterProfileInput;
}): Promise<RequesterProfileResponse> => {
  return api.put('/requester-profile/', data);
};

export const createRequesterProfile = ({
  data,
}: {
  data: UpdateRequesterProfileInput;
}): Promise<RequesterProfileResponse> => {
  return api.post('/requester-profile/', data);
};

// Query Options
export const getRequesterProfileQueryOptions = () => {
  return {
    queryKey: ['requester-profile'],
    queryFn: () => getRequesterProfile(),
  };
};

// Hooks
type UseRequesterProfileOptions = {
  queryConfig?: QueryConfig<typeof getRequesterProfileQueryOptions>;
};

export const useRequesterProfile = ({
  queryConfig,
}: UseRequesterProfileOptions = {}) => {
  return useQuery({
    ...getRequesterProfileQueryOptions(),
    ...queryConfig,
  });
};

type UseUpdateRequesterProfileOptions = {
  mutationConfig?: MutationConfig<typeof updateRequesterProfile>;
};

export const useUpdateRequesterProfile = ({
  mutationConfig,
}: UseUpdateRequesterProfileOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ['requester-profile'],
      });
      queryClient.setQueryData(['requester-profile'], data);
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateRequesterProfile,
  });
};

type UseCreateRequesterProfileOptions = {
  mutationConfig?: MutationConfig<typeof createRequesterProfile>;
};

export const useCreateRequesterProfile = ({
  mutationConfig,
}: UseCreateRequesterProfileOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ['requester-profile'],
      });
      queryClient.setQueryData(['requester-profile'], data);
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: createRequesterProfile,
  });
};
