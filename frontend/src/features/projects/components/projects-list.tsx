import { Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { URLPagination } from '@/components/ui/pagination';
import { Spinner } from '@/components/ui/spinner';
import { Project } from '@/types/api';
import { formatDate, formatEstimatedTimeline } from '@/utils/format';

import { useApprovedProjects } from '../api/get-approved-projects';

const getProjectTypeColor = (type: string) => {
  const colors = {
    WEBSITE: 'bg-blue-50 text-blue-800 border border-blue-200',
    MOBILE_APP: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    DATABASE: 'bg-purple-50 text-purple-800 border border-purple-200',
    API: 'bg-amber-50 text-amber-800 border border-amber-200',
    DESKTOP_APP: 'bg-rose-50 text-rose-800 border border-rose-200',
    OTHER: 'bg-slate-50 text-slate-700 border border-slate-200',
  };
  return colors[type as keyof typeof colors] || colors.OTHER;
};

const ProjectCard = ({ project }: { project: Project }) => {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    navigate(`/projects/${project.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleLearnMore();
    }
  };

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/20 hover:ring-slate-200"
      onClick={handleLearnMore}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/30 to-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      <div className="relative p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="mb-2 text-xl font-semibold text-slate-900 transition-colors duration-200 group-hover:text-primary">
              {project.title}
            </h3>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getProjectTypeColor(project.project_type)}`}
            >
              {project.project_type.replace('_', ' ')}
            </span>
          </div>
        </div>

        <p
          className="mb-4 overflow-hidden leading-relaxed text-slate-600"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {project.description}
        </p>

        <div className="mb-6 space-y-3">
          {project.preferred_technologies && (
            <div className="flex items-center text-sm text-slate-500">
              <div className="mr-3 flex size-6 items-center justify-center rounded-full bg-blue-100">
                <Users className="size-3 text-blue-600" />
              </div>
              <span className="font-medium">Tech Stack:</span>
              <span className="ml-2 text-slate-700">
                {project.preferred_technologies}
              </span>
            </div>
          )}

          {project.estimated_timeline && (
            <div className="flex items-center text-sm text-slate-500">
              <div className="mr-3 flex size-6 items-center justify-center rounded-full bg-amber-100">
                <Clock className="size-3 text-amber-600" />
              </div>
              <span className="font-medium">Timeline:</span>
              <span className="ml-2 text-slate-700">
                {formatEstimatedTimeline(project.estimated_timeline)}
              </span>
            </div>
          )}

          <div className="flex items-center text-sm text-slate-500">
            <div className="mr-3 flex size-6 items-center justify-center rounded-full bg-emerald-100">
              <MapPin className="size-3 text-emerald-600" />
            </div>
            <span className="font-medium">Posted:</span>
            <span className="ml-2 text-slate-700">
              {formatDate(new Date(project.created_at).getTime())}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            className="border-primary text-primary shadow-sm transition-all duration-200 hover:bg-primary hover:text-white hover:shadow-lg group-hover:translate-x-1"
            onClick={(e) => {
              e.stopPropagation();
              handleLearnMore();
            }}
          >
            <div className="flex items-center gap-1">
              View Details
              <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Button>
          <div className="text-xs text-slate-500">
            ID: {project.id.slice(-6)}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProjectsList = () => {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const limit = Number(searchParams.get('limit') || 12); // Default to 12 for better grid layout

  const projectsQuery = useApprovedProjects({ page, limit });

  if (projectsQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (projectsQuery.isError) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading projects</p>
          <p className="text-sm text-slate-500">Please try again later</p>
        </div>
      </div>
    );
  }

  const projects = projectsQuery.data?.data || [];
  const meta = projectsQuery.data?.meta;

  if (projects.length === 0) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">No approved projects found</p>
          <p className="text-sm text-slate-500">
            Check back later for new opportunities
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      {meta && meta.totalPages > 1 && (
        <URLPagination
          totalPages={meta.totalPages}
          currentPage={meta.page}
          rootUrl="/projects"
          limit={limit}
        />
      )}
    </div>
  );
};
