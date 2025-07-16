import { QueryClient } from '@tanstack/react-query';
import { LoaderFunctionArgs } from 'react-router';

import { Head } from '@/components/seo';
import { Footer } from '@/components/ui/footer/footer';
import { Navbar } from '@/components/ui/navbar/navbar';
import { getProjectQueryOptions } from '@/features/projects/api/get-project';
import { ProjectDetail } from '@/features/projects/components/project-detail';

export const clientLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const projectId = params.id as string;

    const query = getProjectQueryOptions(projectId);

    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

const ProjectDetailRoute = () => {
  return (
    <>
      <Head title="Project Details" />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <ProjectDetail />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ProjectDetailRoute;
