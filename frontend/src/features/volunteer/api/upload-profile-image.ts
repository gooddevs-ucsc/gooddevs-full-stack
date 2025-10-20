import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { VolunteerProfileResponse } from './get-volunteer-profile';

export const uploadVolunteerProfileImage = ({
  file,
}: {
  file: File;
}): Promise<VolunteerProfileResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  return api.put('/volunteer-profile/upload-profile-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type UseUploadVolunteerProfileImageOptions = {
  mutationConfig?: MutationConfig<typeof uploadVolunteerProfileImage>;
};

export const useUploadVolunteerProfileImage = ({
  mutationConfig,
}: UseUploadVolunteerProfileImageOptions = {}) => {
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
    mutationFn: uploadVolunteerProfileImage,
  });
};
