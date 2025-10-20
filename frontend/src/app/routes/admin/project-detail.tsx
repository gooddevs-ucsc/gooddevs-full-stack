import { QueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

import { ContentLayout } from '@/components/layouts';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import {
  useProject,
  getProjectQueryOptions,
} from '@/features/projects/api/get-project';
import { ProjectActionButtons } from '@/features/projects/components/project-action-buttons';

import { AdminProjectDetailView } from './components/admin-project-detail-view';

export const clientLoader =
  (queryClient: QueryClient) =>
  async ({ params }: { params: { id: string } }) => {
    const projectId = params.id;

    const query = getProjectQueryOptions(projectId);

    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

const AdminProjectDetailRoute = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: projectData,
    isLoading,
    error,
  } = useProject({
    projectId: id!,
  });

  const handleBackToApprovals = () => {
    navigate(paths.admin.projectApprovals.getHref());
  };

  if (isLoading) {
    return (
      <ContentLayout title="Project Details">
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-slate-600">Loading project details...</p>
          </div>
        </div>
      </ContentLayout>
    );
  }

  if (error || !projectData?.data) {
    return (
      <ContentLayout title="Project Details">
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">
              Project Not Found
            </h1>
            <p className="mt-4 text-slate-600">
              The project you&apos;re looking for doesn&apos;t exist or
              isn&apos;t available.
            </p>
            <Button
              onClick={handleBackToApprovals}
              className="mt-4"
              variant="outline"
            >
              <div className="flex items-center gap-4">
                <ArrowLeft className="mr-2 size-4" />
                Back to Approvals
              </div>
            </Button>
          </div>
        </div>
      </ContentLayout>
    );
  }

  const project = projectData.data;

  return (
    <ContentLayout title={`Project: ${project.title}`}>
      <div className="space-y-6">
        {/* Back Button and Actions Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={handleBackToApprovals}
            variant="outline"
            className="gap-2"
          >
            <div className="flex items-center gap-4">
              <ArrowLeft className="size-4" />
              Back to Approvals
            </div>
          </Button>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <ProjectActionButtons
              projectId={project.id}
              projectTitle={project.title}
              onActionComplete={handleBackToApprovals}
            />
          </div>
        </div>

        {/* Project Detail View */}
        <AdminProjectDetailView project={project} />
      </div>
    </ContentLayout>
  );
};

export default AdminProjectDetailRoute;
