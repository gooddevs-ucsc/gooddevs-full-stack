import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { VolunteerProfileResponse } from './get-volunteer-profile';

export const uploadVolunteerCoverImage = ({
  file,
}: {
  file: File;
}): Promise<VolunteerProfileResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  return api.put('/volunteer-profile/upload-cover-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type UseUploadVolunteerCoverImageOptions = {
  mutationConfig?: MutationConfig<typeof uploadVolunteerCoverImage>;
};

export const useUploadVolunteerCoverImage = ({
  mutationConfig,
}: UseUploadVolunteerCoverImageOptions = {}) => {
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
    mutationFn: uploadVolunteerCoverImage,
  });
};
