import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { RequesterProfileResponse } from './get-requester-profile';

export const uploadRequesterCover = ({
  file,
}: {
  file: File;
}): Promise<RequesterProfileResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  return api.put('/requester-profile/upload-cover', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type UseUploadRequesterCoverOptions = {
  mutationConfig?: MutationConfig<typeof uploadRequesterCover>;
};

export const useUploadRequesterCover = ({
  mutationConfig,
}: UseUploadRequesterCoverOptions = {}) => {
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
    mutationFn: uploadRequesterCover,
  });
};
