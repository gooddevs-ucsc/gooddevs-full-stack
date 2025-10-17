import { useParams } from 'react-router';

import { ProjectThread } from '@/features/projects/components/project-thread';

const ProjectThreadRoute = () => {
  const { threadId } = useParams<{ threadId: string }>();

  return <ProjectThread threadId={threadId!} />;
};

export default ProjectThreadRoute;
