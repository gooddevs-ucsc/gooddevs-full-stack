import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { User } from '@/types/api';

export const getVolunteers = (): Promise<{ data: User[] }> => {
  return api.get('/users/volunteers');
};

type UseVolunteersOptions = {
  queryConfig?: QueryConfig<typeof getVolunteers>;
};

export const useVolunteers = ({ queryConfig }: UseVolunteersOptions = {}) => {
  return useQuery({
    queryKey: ['volunteers'],
    queryFn: () => getVolunteers(),
    ...queryConfig,
  });
};
