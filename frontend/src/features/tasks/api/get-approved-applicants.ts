import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { User } from '@/types/api';

export const getApprovedApplicants = (
  projectId: string,
): Promise<{ data: User[] }> => {
  return api.get(`/applications/projects/${projectId}/approved-applicants`);
};

type UseApprovedApplicantsOptions = {
  projectId: string;
  queryConfig?: QueryConfig<typeof getApprovedApplicants>;
};

export const useApprovedApplicants = ({
  projectId,
  queryConfig,
}: UseApprovedApplicantsOptions) => {
  return useQuery({
    queryKey: ['approved-applicants', projectId],
    queryFn: () => getApprovedApplicants(projectId),
    ...queryConfig,
  });
};
