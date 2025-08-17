import { useParams } from 'react-router';

import { Head } from '@/components/seo';
import { Footer } from '@/components/ui/footer/footer';
import { Navbar } from '@/components/ui/navbar/navbar';
import { ProjectThread } from '@/features/projects/components/project-thread';

const ProjectThreadRoute = () => {
  const { threadId } = useParams<{ threadId: string }>();

  return <ProjectThread threadId={threadId!} />;
};

export default ProjectThreadRoute;
