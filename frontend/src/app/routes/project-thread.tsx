import { useParams } from 'react-router';

import { Head } from '@/components/seo';
import { Footer } from '@/components/ui/footer/footer';
import { Navbar } from '@/components/ui/navbar/navbar';
import { ProjectThread } from '@/features/projects/components/project-thread';

const ProjectThreadRoute = () => {
  const { id } = useParams();

  return (
    <>
      <Head title="Project Discussion" />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <ProjectThread projectId={id!} />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ProjectThreadRoute;