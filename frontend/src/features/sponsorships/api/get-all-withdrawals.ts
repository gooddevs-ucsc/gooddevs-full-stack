import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { BaseEntity } from '@/types/api';

export type WithdrawalRecipient = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
};

export type AllWithdrawal = BaseEntity & {
  recipient_id: string;
  amount_requested: number;
  fee_percentage: number;
  fee_amount: number;
  amount_to_transfer: number;
  bank_name: string;
  bank_account_number: string;
  account_holder_name: string;
  status: 'PENDING' | 'COMPLETED' | 'NOT_WITHDRAWN';
  requested_at: string;
  completed_at: string | null;
  recipient?: WithdrawalRecipient;
};

export type AllWithdrawalsResponse = {
  data: AllWithdrawal[];
  count: number;
};

export const getAllWithdrawals = (
  page: number,
): Promise<AllWithdrawalsResponse> => {
  return api.get(`/withdrawals/all`, {
    params: {
      skip: (page - 1) * 10,
      limit: 10,
    },
  });
};

export const getAllWithdrawalsQueryOptions = (page: number) => {
  return queryOptions({
    queryKey: ['all-withdrawals', page],
    queryFn: () => getAllWithdrawals(page),
  });
};

type UseAllWithdrawalsOptions = {
  page: number;
  queryConfig?: QueryConfig<typeof getAllWithdrawalsQueryOptions>;
};

export const useAllWithdrawals = ({
  page,
  queryConfig,
}: UseAllWithdrawalsOptions) => {
  return useQuery({
    ...getAllWithdrawalsQueryOptions(page),
    ...queryConfig,
  });
};
