import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { Withdrawal } from './get-my-withdrawals';

export const requestWithdrawalInputSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  bank_account_number: z
    .string()
    .min(1, 'Bank account number is required')
    .max(50),
  bank_name: z.string().min(1, 'Bank name is required').max(255),
  account_holder_name: z
    .string()
    .min(1, 'Account holder name is required')
    .max(255),
});

export type RequestWithdrawalInput = z.infer<
  typeof requestWithdrawalInputSchema
>;

export const requestWithdrawal = (
  data: RequestWithdrawalInput,
): Promise<Withdrawal> => {
  return api.post('/withdrawals/request', data);
};

type UseRequestWithdrawalOptions = {
  mutationConfig?: MutationConfig<typeof requestWithdrawal>;
};

export const useRequestWithdrawal = ({
  mutationConfig,
}: UseRequestWithdrawalOptions = {}) => {
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
    mutationFn: requestWithdrawal,
  });
};
