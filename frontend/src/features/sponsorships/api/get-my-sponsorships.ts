import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Sponsorship } from '@/types/api';

export const getMySponsorships = ({
  page = 1,
}: {
  page?: number;
}): Promise<{
  data: Sponsorship[];
  meta: { page: number; total: number; totalPages: number };
}> => {
  const skip = (page - 1) * 100;
  return api.get(`/sponsorships/my-sponsorships?skip=${skip}&limit=100`);
};

export const getMySponsorshipsQueryOptions = (page: number = 1) => {
  return queryOptions({
    queryKey: ['my-sponsorships', page],
    queryFn: () => getMySponsorships({ page }),
  });
};

type UseGetMySponsorshipsOptions = {
  page?: number;
  queryConfig?: QueryConfig<typeof getMySponsorshipsQueryOptions>;
};

export const useGetMySponsorships = ({
  page = 1,
  queryConfig,
}: UseGetMySponsorshipsOptions = {}) => {
  return useQuery({
    ...getMySponsorshipsQueryOptions(page),
    ...queryConfig,
  });
};
