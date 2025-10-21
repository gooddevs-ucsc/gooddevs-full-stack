import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig, QueryConfig } from '@/lib/react-query';

// Types
export interface SponsorProfile {
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
  instagram_url: string | null;
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

export interface SponsorProfileResponse {
  data: SponsorProfile;
}

// Schemas
export const updateSponsorProfileSchema = z.object({
  tagline: z.string().optional(),
  logo_url: z.string().url().optional().or(z.literal('')),
  cover_image_url: z.string().url().optional().or(z.literal('')),
  website: z.string().optional(),
  location: z.string().optional(),
  about: z.string().optional(),
  linkedin_url: z.string().url().optional().or(z.literal('')),
  twitter_url: z.string().url().optional().or(z.literal('')),
  facebook_url: z.string().url().optional().or(z.literal('')),
  instagram_url: z.string().url().optional().or(z.literal('')),
  contact_phone: z.string().optional(),
});

export type UpdateSponsorProfileInput = z.infer<
  typeof updateSponsorProfileSchema
>;

// API Functions
export const getSponsorProfile = (): Promise<SponsorProfileResponse> => {
  return api.get('/sponsor-profile/');
};

export const updateSponsorProfile = ({
  data,
}: {
  data: UpdateSponsorProfileInput;
}): Promise<SponsorProfileResponse> => {
  return api.put('/sponsor-profile/', data);
};

export const createSponsorProfile = ({
  data,
}: {
  data: UpdateSponsorProfileInput;
}): Promise<SponsorProfileResponse> => {
  return api.post('/sponsor-profile/', data);
};

// Query Options
export const getSponsorProfileQueryOptions = () => {
  return {
    queryKey: ['sponsor-profile'],
    queryFn: () => getSponsorProfile(),
  };
};

// Hooks
type UseSponsorProfileOptions = {
  queryConfig?: QueryConfig<typeof getSponsorProfileQueryOptions>;
};

export const useSponsorProfile = ({
  queryConfig,
}: UseSponsorProfileOptions = {}) => {
  return useQuery({
    ...getSponsorProfileQueryOptions(),
    ...queryConfig,
  });
};

type UseUpdateSponsorProfileOptions = {
  mutationConfig?: MutationConfig<typeof updateSponsorProfile>;
};

export const useUpdateSponsorProfile = ({
  mutationConfig,
}: UseUpdateSponsorProfileOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ['sponsor-profile'],
      });
      queryClient.setQueryData(['sponsor-profile'], data);
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateSponsorProfile,
  });
};

type UseCreateSponsorProfileOptions = {
  mutationConfig?: MutationConfig<typeof createSponsorProfile>;
};

export const useCreateSponsorProfile = ({
  mutationConfig,
}: UseCreateSponsorProfileOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: ['sponsor-profile'],
      });
      queryClient.setQueryData(['sponsor-profile'], data);
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: createSponsorProfile,
  });
};
