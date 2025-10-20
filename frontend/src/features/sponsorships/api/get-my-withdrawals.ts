import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { BaseEntity, Meta } from '@/types/api';

export type WithdrawalStatus = 'NOT_WITHDRAWN' | 'PENDING' | 'COMPLETED';

export type Withdrawal = BaseEntity & {
  recipient_id: string;
  amount_requested: number;
  fee_percentage: number;
  fee_amount: number;
  amount_to_transfer: number;
  bank_account_number: string;
  bank_name: string;
  account_holder_name: string;
  status: WithdrawalStatus;
  requested_at: string;
  completed_at: string | null;
};

export type WithdrawalsResponse = {
  data: Withdrawal[];
  meta: Meta;
};

type GetMyWithdrawalsOptions = {
  page?: number;
};

export const getMyWithdrawals = ({
  page = 1,
}: GetMyWithdrawalsOptions): Promise<WithdrawalsResponse> => {
  const skip = (page - 1) * 100;
  return api.get('/withdrawals/my-withdrawals', {
    params: {
      skip,
      limit: 100,
    },
  });
};

export const getMyWithdrawalsQueryOptions = (
  options: GetMyWithdrawalsOptions,
) => {
  return queryOptions({
    queryKey: ['my-withdrawals', options],
    queryFn: () => getMyWithdrawals(options),
  });
};

type UseMyWithdrawalsOptions = {
  page?: number;
  queryConfig?: QueryConfig<typeof getMyWithdrawalsQueryOptions>;
};

export const useMyWithdrawals = ({
  page = 1,
  queryConfig,
}: UseMyWithdrawalsOptions = {}) => {
  return useQuery({
    ...getMyWithdrawalsQueryOptions({ page }),
    ...queryConfig,
  });
};
