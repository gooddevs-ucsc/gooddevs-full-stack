import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { DonationsResponse } from '@/types/api';

export const getAllDonations = ({
  skip = 0,
  limit = 100,
}: {
  skip?: number;
  limit?: number;
}): Promise<DonationsResponse> => {
  return api.get('/donations/all', {
    params: { skip, limit },
  });
};

type UseAllDonationsOptions = {
  skip?: number;
  limit?: number;
  queryConfig?: QueryConfig<typeof getAllDonations>;
};

export const useAllDonations = ({
  skip = 0,
  limit = 100,
  queryConfig,
}: UseAllDonationsOptions = {}) => {
  return useQuery({
    ...queryConfig,
    queryKey: ['all-donations', { skip, limit }],
    queryFn: () => getAllDonations({ skip, limit }),
  });
};
