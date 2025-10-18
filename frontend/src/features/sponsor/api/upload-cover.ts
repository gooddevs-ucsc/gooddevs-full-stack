import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { SponsorProfileResponse } from './get-sponsor-profile';

export const uploadSponsorCover = ({
  file,
}: {
  file: File;
}): Promise<SponsorProfileResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  return api.put('/sponsor-profile/upload-cover', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type UseUploadSponsorCoverOptions = {
  mutationConfig?: MutationConfig<typeof uploadSponsorCover>;
};

export const useUploadSponsorCover = ({
  mutationConfig,
}: UseUploadSponsorCoverOptions = {}) => {
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
    mutationFn: uploadSponsorCover,
  });
};
