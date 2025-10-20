import { useQuery, queryOptions } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { SponsorshipsResponse } from '@/types/api';

export const getReceivedSponsorships = (
  page: number = 1,
  limit: number = 100,
): Promise<SponsorshipsResponse> => {
  const skip = (page - 1) * limit;
  return api.get(`/sponsorships/received`, {
    params: {
      skip,
      limit,
    },
  });
};

export const getReceivedSponsorshipsQueryOptions = (
  page: number = 1,
  limit: number = 100,
) => {
  return queryOptions({
    queryKey: ['received-sponsorships', { page, limit }],
    queryFn: () => getReceivedSponsorships(page, limit),
  });
};

type UseReceivedSponsorshipsOptions = {
  page?: number;
  limit?: number;
  queryConfig?: QueryConfig<typeof getReceivedSponsorshipsQueryOptions>;
};

export const useReceivedSponsorships = ({
  page = 1,
  limit = 100,
  queryConfig,
}: UseReceivedSponsorshipsOptions = {}) => {
  return useQuery({
    ...getReceivedSponsorshipsQueryOptions(page, limit),
    ...queryConfig,
  });
};
