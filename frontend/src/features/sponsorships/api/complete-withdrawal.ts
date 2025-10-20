import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { Withdrawal } from './get-my-withdrawals';

export const completeWithdrawal = (
  withdrawalId: string,
): Promise<Withdrawal> => {
  return api.post(`/withdrawals/${withdrawalId}/complete`);
};

type UseCompleteWithdrawalOptions = {
  mutationConfig?: MutationConfig<typeof completeWithdrawal>;
};

export const useCompleteWithdrawal = ({
  mutationConfig,
}: UseCompleteWithdrawalOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['my-withdrawals'],
      });
      queryClient.invalidateQueries({
        queryKey: ['withdrawal-balance'],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: completeWithdrawal,
  });
};
