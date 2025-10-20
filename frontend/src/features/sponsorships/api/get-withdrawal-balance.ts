import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';

export type WithdrawalBalance = {
  total_received: number;
  total_withdrawn: number;
  pending_withdrawals: number;
  available_balance: number;
};

export const getWithdrawalBalance = (): Promise<WithdrawalBalance> => {
  return api.get('/withdrawals/balance');
};

export const getWithdrawalBalanceQueryOptions = () => {
  return queryOptions({
    queryKey: ['withdrawal-balance'],
    queryFn: () => getWithdrawalBalance(),
  });
};

type UseWithdrawalBalanceOptions = {
  queryConfig?: QueryConfig<typeof getWithdrawalBalanceQueryOptions>;
};

export const useWithdrawalBalance = ({
  queryConfig,
}: UseWithdrawalBalanceOptions = {}) => {
  return useQuery({
    ...getWithdrawalBalanceQueryOptions(),
    ...queryConfig,
  });
};
