import { ContentLayout } from '@/components/layouts';
import { ProjectCreateForm } from '@/features/projects';

const SubmitNewProject = () => {
  return (
    <ContentLayout title="Submit New Project">
      <div className="mx-auto max-w-4xl space-y-6">
        <ProjectCreateForm />
      </div>
    </ContentLayout>
  );
};

export default SubmitNewProject;
