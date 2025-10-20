import {
  ArrowRight,
  Clock,
  Filter,
  MapPin,
  Search,
  Users,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { URLPagination } from '@/components/ui/pagination';
import { Spinner } from '@/components/ui/spinner';
import { PROJECT_TYPE_STYLES } from '@/lib/constants/ui';
import { Project, ProjectType } from '@/types/api';
import { formatDate, formatEstimatedTimeline } from '@/utils/format';

import { useApprovedProjects } from '../api/get-approved-projects';

const getProjectTypeColor = (type: ProjectType) => {
  return PROJECT_TYPE_STYLES[type] || PROJECT_TYPE_STYLES.OTHER;
};

interface ProjectFilters {
  search: string;
  technology: string;
}

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<ProjectFilters>({
    search: searchParams.get('search') || '',
    technology: searchParams.get('technology') || '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const page = Number(searchParams.get('page') || 1);
  const limit = Number(searchParams.get('limit') || 12);

  const projectsQuery = useApprovedProjects({ page, limit });

  // Filter projects based on search criteria
  const filteredProjects = useMemo(() => {
    if (!projectsQuery.data?.data) return [];

    return projectsQuery.data.data.filter((project) => {
      const matchesSearch = filters.search
        ? project.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          project.description
            .toLowerCase()
            .includes(filters.search.toLowerCase())
        : true;

      const matchesTechnology = filters.technology
        ? project.preferred_technologies
            ?.toLowerCase()
            .includes(filters.technology.toLowerCase()) || false
        : true;

      return matchesSearch && matchesTechnology;
    });
  }, [projectsQuery.data?.data, filters]);

  const handleFilterChange = (key: keyof ProjectFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Update URL params
    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      newSearchParams.set(key, value);
    } else {
      newSearchParams.delete(key);
    }
    // Reset to page 1 when filtering
    newSearchParams.set('page', '1');
    setSearchParams(newSearchParams);
  };

  const clearFilters = () => {
    setFilters({ search: '', technology: '' });
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('search');
    newSearchParams.delete('technology');
    newSearchParams.set('page', '1');
    setSearchParams(newSearchParams);
  };

  const hasActiveFilters = filters.search || filters.technology;

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
  const currentPage = meta?.page || 1;
  const totalPages = meta?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="space-y-4">
        {/* Main Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Search projects by title or description..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10 pr-12"
          />
          {filters.search && (
            <button
              onClick={() => handleFilterChange('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="size-4" />
            Advanced Filters
            {hasActiveFilters && (
              <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                {Object.values(filters).filter(Boolean).length}
              </span>
            )}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-slate-600 hover:text-slate-900"
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="technology-filter"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Technology
                </label>
                <div className="relative">
                  <Input
                    id="technology-filter"
                    type="text"
                    placeholder="e.g., React, Python, Node.js..."
                    value={filters.technology}
                    onChange={(e) =>
                      handleFilterChange('technology', e.target.value)
                    }
                    className="pr-8"
                  />
                  {filters.technology && (
                    <button
                      onClick={() => handleFilterChange('technology', '')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Popular Technologies Quick Filters */}
              <div>
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Popular Technologies
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'React',
                    'Python',
                    'Node.js',
                    'TypeScript',
                    'JavaScript',
                    'Java',
                    'PHP',
                    'Docker',
                  ].map((tech) => (
                    <button
                      key={tech}
                      onClick={() => handleFilterChange('technology', tech)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        filters.technology.toLowerCase() === tech.toLowerCase()
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-white text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
          {filteredProjects.length === projects.length ? (
            <>Showing all {projects.length} projects</>
          ) : (
            <>
              Showing {filteredProjects.length} of {projects.length} projects
              {hasActiveFilters && ' (filtered)'}
            </>
          )}
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                Search: &quot;{filters.search}&quot;
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="hover:text-blue-900"
                >
                  <X className="size-3" />
                </button>
              </span>
            )}
            {filters.technology && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                Tech: &quot;{filters.technology}&quot;
                <button
                  onClick={() => handleFilterChange('technology', '')}
                  className="hover:text-green-900"
                >
                  <X className="size-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mx-auto max-w-md">
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              No projects found
            </h3>
            <p className="mb-4 text-slate-600">
              {hasActiveFilters
                ? 'Try adjusting your search filters to find more projects.'
                : 'There are no approved projects available at the moment.'}
            </p>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* Pagination - Only show if we have more than one page and no filters */}
          {totalPages > 1 && !hasActiveFilters && (
            <URLPagination
              totalPages={totalPages}
              currentPage={currentPage}
              rootUrl="/projects"
              limit={limit}
            />
          )}

          {/* Show message when filtering reduces results but we're paginated */}
          {hasActiveFilters && totalPages > 1 && (
            <div className="rounded-lg bg-blue-50 p-4 text-center">
              <p className="text-sm text-blue-800">
                Filters are applied to the current page&apos;s projects.
                <button
                  onClick={clearFilters}
                  className="ml-1 font-medium underline hover:no-underline"
                >
                  Clear filters
                </button>{' '}
                to see pagination.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
