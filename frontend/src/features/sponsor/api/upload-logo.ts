import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { SponsorProfileResponse } from './get-sponsor-profile';

export const uploadSponsorLogo = ({
  file,
}: {
  file: File;
}): Promise<SponsorProfileResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  return api.put('/sponsor-profile/upload-logo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type UseUploadSponsorLogoOptions = {
  mutationConfig?: MutationConfig<typeof uploadSponsorLogo>;
};

export const useUploadSponsorLogo = ({
  mutationConfig,
}: UseUploadSponsorLogoOptions = {}) => {
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
    mutationFn: uploadSponsorLogo,
  });
};
