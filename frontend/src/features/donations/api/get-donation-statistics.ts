import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';

export type DonationStatistics = {
  total_donations: number;
  total_amount: number;
  average_donation: number;
  pending_donations: number;
  successful_donations: number;
  unique_donors: number;
};

export const getDonationStatistics = (): Promise<DonationStatistics> => {
  return api.get('/donations/statistics');
};

type UseDonationStatisticsOptions = {
  queryConfig?: QueryConfig<typeof getDonationStatistics>;
};

export const useDonationStatistics = ({
  queryConfig,
}: UseDonationStatisticsOptions = {}) => {
  return useQuery({
    ...queryConfig,
    queryKey: ['donation-statistics'],
    queryFn: getDonationStatistics,
  });
};
