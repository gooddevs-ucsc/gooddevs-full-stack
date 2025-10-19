import { QueryClient } from '@tanstack/react-query';
import { LoaderFunctionArgs, useParams } from 'react-router';

import { ContentLayout } from '@/components/layouts';
import {
  ProjectApplicationsTable,
  getProjectApplicationsQueryOptions,
  ManageReviewerPermissions,
} from '@/features/projects';
import {
  getProjectQueryOptions,
  useProject,
} from '@/features/projects/api/get-project';

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

const ProjectApplicationsRoute = () => {
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
    <ContentLayout title="Manage Applications">
      <ProjectApplicationsPage projectId={projectId} />
    </ContentLayout>
  );
};

interface ProjectApplicationsPageProps {
  projectId: string;
}

const ProjectApplicationsPage = ({
  projectId,
}: ProjectApplicationsPageProps) => {
  const { data: projectData } = useProject({ projectId });

  const project = projectData?.data;

  if (!project) {
    return null;
  }

  return (
    <div className="space-y-6">
      <ProjectApplicationsTable projectId={projectId} />
      <ManageReviewerPermissions
        projectId={projectId}
        projectOwnerId={project.requester_id}
      />
    </div>
  );
};

export default ProjectApplicationsRoute;
