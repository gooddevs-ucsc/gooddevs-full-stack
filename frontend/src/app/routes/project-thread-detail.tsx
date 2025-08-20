import { useParams } from 'react-router';

import { ProjectThread } from '@/features/projects/components/project-thread';

const ProjectThreadDetailRoute = () => {
  const { threadId } = useParams<{ threadId: string }>();

  if (!threadId) {
    return <div>Thread not found.</div>;
  }

  return <ProjectThread threadId={threadId} />;
};

export default ProjectThreadDetailRoute;
