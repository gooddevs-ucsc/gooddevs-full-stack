import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { User } from '@/types/api';

export const getUsers = (
  skip = 0,
  limit = 100,
): Promise<{
  data: User[];
  count: number;
}> => {
  return api.get('/users/', {
    params: {
      skip,
      limit,
    },
  });
};

export const getUsersQueryOptions = ({
  skip = 0,
  limit = 100,
}: { skip?: number; limit?: number } = {}) => {
  return queryOptions({
    queryKey: ['users', { skip, limit }],
    queryFn: () => getUsers(skip, limit),
  });
};

type UseUsersOptions = {
  skip?: number;
  limit?: number;
  queryConfig?: QueryConfig<typeof getUsersQueryOptions>;
};

export const useUsers = ({
  skip = 0,
  limit = 100,
  queryConfig,
}: UseUsersOptions = {}) => {
  return useQuery({
    ...getUsersQueryOptions({ skip, limit }),
    ...queryConfig,
  });
};
