import { QueryClient } from '@tanstack/react-query';

import { ContentLayout } from '@/components/layouts';
import { ProjectApprovalsList } from '@/features/projects';
import { getPendingProjectsQueryOptions } from '@/features/projects/api/get-pending-projects';

export const clientLoader = (queryClient: QueryClient) => async () => {
  const query = getPendingProjectsQueryOptions();

  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  );
};

const ProjectApprovalsRoute = () => {
  return (
    <ContentLayout title="Project Approvals">
      <div className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h2 className="mb-2 text-lg font-medium text-slate-900">
            Review Pending Projects
          </h2>
          <p className="text-sm text-slate-600">
            Review and approve or reject project submissions. Approved projects
            will be visible to developers on the projects page.
          </p>
        </div>
        <ProjectApprovalsList />
      </div>
    </ContentLayout>
  );
};

export default ProjectApprovalsRoute;
