import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { DonationsResponse } from '@/types/api';

export const getMyDonations = ({
  skip = 0,
  limit = 100,
}: {
  skip?: number;
  limit?: number;
}): Promise<DonationsResponse> => {
  return api.get('/donations/my-donations', {
    params: { skip, limit },
  });
};

type UseMyDonationsOptions = {
  skip?: number;
  limit?: number;
  queryConfig?: QueryConfig<typeof getMyDonations>;
};

export const useMyDonations = ({
  skip = 0,
  limit = 100,
  queryConfig,
}: UseMyDonationsOptions = {}) => {
  return useQuery({
    ...queryConfig,
    queryKey: ['my-donations', { skip, limit }],
    queryFn: () => getMyDonations({ skip, limit }),
  });
};
