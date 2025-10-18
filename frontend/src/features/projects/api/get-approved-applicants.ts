import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';

export interface ApprovedTeamMember {
  id: string;
  firstname: string | null;
  lastname: string | null;
  email: string;
  volunteer_role: string;
}

export const getApprovedApplicants = (
  projectId: string,
): Promise<{
  data: ApprovedTeamMember[];
  count: number;
}> => {
  return api.get(`/applications/projects/${projectId}/approved-applicants`);
};

export const getApprovedApplicantsQueryOptions = ({
  projectId,
}: {
  projectId: string;
}) => {
  return queryOptions({
    queryKey: ['applications', 'approved-applicants', projectId],
    queryFn: () => getApprovedApplicants(projectId),
  });
};

type UseApprovedApplicantsOptions = {
  projectId: string;
  queryConfig?: QueryConfig<typeof getApprovedApplicantsQueryOptions>;
};

export const useApprovedApplicants = ({
  projectId,
  queryConfig,
}: UseApprovedApplicantsOptions) => {
  return useQuery({
    ...getApprovedApplicantsQueryOptions({ projectId }),
    ...queryConfig,
  });
};
