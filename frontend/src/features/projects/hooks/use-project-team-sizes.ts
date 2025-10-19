import { useQueries } from '@tanstack/react-query';

import { getApprovedApplicantsQueryOptions } from '../api/get-approved-applicants';

export interface ProjectWithTeamSize {
  id: string;
  teamSize: number;
}

export const useProjectTeamSizes = (projectIds: string[]) => {
  const queries = useQueries({
    queries: projectIds.map((projectId) => ({
      ...getApprovedApplicantsQueryOptions({ projectId }),
      enabled: !!projectId,
    })),
  });

  const teamSizes = projectIds.reduce(
    (acc, projectId, index) => {
      const query = queries[index];
      acc[projectId] = query.data?.count || 0;
      return acc;
    },
    {} as Record<string, number>,
  );

  const isLoading = queries.some((query) => query.isLoading);
  const hasErrors = queries.some((query) => query.error);

  return {
    teamSizes,
    isLoading,
    hasErrors,
  };
};
