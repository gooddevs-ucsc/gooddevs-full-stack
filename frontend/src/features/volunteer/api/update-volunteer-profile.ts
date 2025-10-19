import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import {
  ExperienceItem,
  VolunteerProfileResponse,
} from './get-volunteer-profile';

export interface UpdateVolunteerProfileInput {
  bio?: string;
  tagline?: string;
  location?: string;
  profile_image_url?: string;
  cover_image_url?: string;
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  twitter_url?: string;
  contact_phone?: string;
  website?: string;
  skills?: string[];
  experience?: ExperienceItem[];
}

export const updateVolunteerProfile = ({
  data,
}: {
  data: UpdateVolunteerProfileInput;
}): Promise<VolunteerProfileResponse> => {
  return api.put('/volunteer-profile/', data);
};

type UseUpdateVolunteerProfileOptions = {
  mutationConfig?: MutationConfig<typeof updateVolunteerProfile>;
};

export const useUpdateVolunteerProfile = ({
  mutationConfig,
}: UseUpdateVolunteerProfileOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['volunteer-profile'],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateVolunteerProfile,
  });
};
