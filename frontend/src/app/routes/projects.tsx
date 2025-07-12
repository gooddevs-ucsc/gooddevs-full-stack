import { QueryClient } from '@tanstack/react-query';

import { Head } from '@/components/seo';
import { Footer } from '@/components/ui/footer/footer';
import { Navbar } from '@/components/ui/navbar/navbar';
import { getApprovedProjectsQueryOptions } from '@/features/projects/api/get-projects';
import { ProjectsList } from '@/features/projects/components/projects-list';

export const clientLoader = (queryClient: QueryClient) => async () => {
  const query = getApprovedProjectsQueryOptions();

  return (
    queryClient.getQueryData(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  );
};

const ProjectsRoute = () => {
  return (
    <>
      <Head
        title="Browse Projects"
        description="Discover approved projects looking for skilled developers to make a meaningful impact"
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-slate-900 sm:text-5xl">
              Browse Projects
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-slate-600">
              Find meaningful projects that match your skills and interests. All
              projects listed here have been approved and are ready for
              collaboration.
            </p>
          </div>
          <ProjectsList />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ProjectsRoute;
