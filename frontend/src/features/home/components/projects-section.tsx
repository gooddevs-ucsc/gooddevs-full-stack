import { useQuery } from '@tanstack/react-query';
import { FC } from 'react';

import { ProjectCard } from '@/features/projects/components';
import { ProjectsResponse } from '@/features/projects/types';
import { api } from '@/lib/api-client';

const fetchApprovedProjects = async (): Promise<ProjectsResponse> => {
  const response = await api.get('/api/v1/projects/approved');
  return response.data;
};

export const ProjectsSection: FC = () => {
  const {
    data: projectsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['approved-projects'],
    queryFn: fetchApprovedProjects,
  });

  return (
    <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            Available Projects
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            {projectsData?.count || 0} projects currently seeking skilled
            volunteers
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 h-4 w-3/4 rounded bg-slate-200"></div>
                <div className="mb-4 h-3 w-1/2 rounded bg-slate-200"></div>
                <div className="mb-4 h-20 rounded bg-slate-200"></div>
                <div className="mb-2 h-3 w-full rounded bg-slate-200"></div>
                <div className="h-3 w-2/3 rounded bg-slate-200"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <div className="mb-4 text-xl text-red-600">
              Error loading projects
            </div>
            <p className="text-slate-600">Please try again later</p>
          </div>
        ) : projectsData?.data?.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mb-4 text-xl text-slate-500">
              No projects available
            </div>
            <p className="text-slate-600">
              Check back later for new opportunities
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projectsData?.data?.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
