import { QueryClient } from '@tanstack/react-query';
import { LoaderFunctionArgs, useParams, Navigate } from 'react-router';

import { ContentLayout } from '@/components/layouts';
import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import {
  ProjectApplicationsList,
  getProjectApplicationsQueryOptions,
  useCanReviewProject,
} from '@/features/projects';
import { getProjectQueryOptions } from '@/features/projects/api/get-project';

export const clientLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const projectId = params.projectId;
    if (!projectId) {
      throw new Error('Project ID is required');
    }

    // Load both the project details and its applications
    const [project, applications] = await Promise.all([
      queryClient.ensureQueryData(getProjectQueryOptions(projectId)),
      queryClient.ensureQueryData(
        getProjectApplicationsQueryOptions({ projectId }),
      ),
    ]);

    return { project, applications };
  };

const ReviewApplicationsRoute = () => {
  const { projectId } = useParams();

  if (!projectId) {
    return (
      <ContentLayout title="Error">
        <div className="flex items-center justify-center py-12">
          <p className="text-red-600">Project ID is required</p>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Review Applications">
      <ReviewApplicationsPage projectId={projectId} />
    </ContentLayout>
  );
};

interface ReviewApplicationsPageProps {
  projectId: string;
}

const ReviewApplicationsPage = ({ projectId }: ReviewApplicationsPageProps) => {
  const { data: canReviewData, isLoading } = useCanReviewProject({
    projectId,
  });

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Redirect if user doesn't have permission
  if (!canReviewData?.can_review) {
    return <Navigate to={paths.developer.projects.getHref()} replace />;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h2 className="mb-2 text-lg font-medium text-blue-900">
          Application Review
        </h2>
        <p className="text-sm text-blue-700">
          You have been granted permission to review applications for this
          project. You can approve or reject volunteer applications below.
        </p>
      </div>
      <ProjectApplicationsList projectId={projectId} />
    </div>
  );
};

export default ReviewApplicationsRoute;
