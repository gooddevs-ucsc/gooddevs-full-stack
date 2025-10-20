import { Plus, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { ContentLayout } from '@/components/layouts';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import { useUserProjects } from '@/features/projects/api/get-user-projects'; // You'll need to create this
import { useProjectTeamSizes } from '@/features/projects/hooks/use-project-team-sizes';
import {
  ProjectCard,
  RequesterProject,
} from '@/features/requester/components/project-card';
import { Project } from '@/types/api';
import { formatEstimatedTimeline } from '@/utils/format';

// Map API project status to display status
const mapProjectStatus = (apiStatus: string) => {
  switch (apiStatus) {
    case 'PENDING':
      return 'Pending';
    case 'APPROVED':
      return 'Active';
    case 'COMPLETED':
      return 'Completed';
    case 'REJECTED':
      return 'Rejected';
    default:
      return 'Pending';
  }
};

// Transform API Project to RequesterProject with team size
const transformProject = (
  project: Project,
  teamSize: number = 0,
): RequesterProject => ({
  id: project.id,
  title: project.title,
  description: project.description,
  status: mapProjectStatus(project.status) as
    | 'Pending'
    | 'Active'
    | 'Completed'
    | 'Rejected',
  createdAt: new Date(project.created_at as string).toISOString().split('T')[0],
  teamSize: teamSize,
  estimatedCompletion: project.estimated_timeline
    ? formatEstimatedTimeline(project.estimated_timeline)
    : null,
  projectType: project.project_type
    ? project.project_type.replace('_', ' ')
    : 'Unknown',
  technologies: project.preferred_technologies?.split(',') || [],
});

type ProjectStatus = 'All' | 'Active' | 'Completed' | 'Pending' | 'Rejected';

const RequesterProjectsRoute = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>('All');

  // Fetch user's projects
  const {
    data: projectsData,
    isLoading,
    error,
  } = useUserProjects({
    page: 1,
    limit: 100,
  });

  const projects = projectsData?.data || [];
  const projectIds = projects.map((project) => project.id);

  // Fetch team sizes for all projects
  const { teamSizes, isLoading: isLoadingTeamSizes } =
    useProjectTeamSizes(projectIds);

  const statusTabs: ProjectStatus[] = [
    'All',
    'Active',
    'Completed',
    'Pending',
    'Rejected',
  ];

  // Filter projects based on search term and status
  const filteredProjects = projects.filter((project: Project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const projectDisplayStatus = mapProjectStatus(project.status);
    const matchesStatus =
      selectedStatus === 'All' || projectDisplayStatus === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Get count for each status
  const getStatusCount = (status: ProjectStatus) => {
    if (status === 'All') return projects.length;
    return projects.filter(
      (project: Project) => mapProjectStatus(project.status) === status,
    ).length;
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'All':
        return 'border-primary/20 bg-primary/5 text-primary';
      case 'Active':
        return 'border-green-200 bg-green-50 text-green-700';
      case 'Completed':
        return 'border-blue-200 bg-blue-50 text-blue-700';
      case 'Pending':
        return 'border-orange-200 bg-orange-50 text-orange-700';
      case 'Rejected':
        return 'border-red-200 bg-red-50 text-red-700';
      default:
        return 'border-slate-200 bg-slate-50 text-slate-700';
    }
  };

  if (isLoading || isLoadingTeamSizes) {
    return (
      <ContentLayout title="My Projects">
        <div className="flex h-32 items-center justify-center">
          <Spinner size="lg" />
        </div>
      </ContentLayout>
    );
  }
  if (error) {
    return (
      <ContentLayout title="My Projects">
        <div className="flex h-48 w-full items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">Error loading projects</p>
            <p className="text-sm text-slate-500">Please try again later</p>
          </div>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="My Projects">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-slate-600">
              Manage and track your submitted projects
            </p>
          </div>
          <Button
            className="bg-primary text-white shadow-lg hover:bg-primary/90 hover:shadow-xl"
            size="lg"
            onClick={() => navigate(paths.requester.createProject.getHref())}
          >
            <div className="flex items-center gap-4">
              <Plus className="mr-2 size-4" />
              New Project
            </div>
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2">
            {statusTabs.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all hover:shadow-md ${
                  selectedStatus === status
                    ? getStatusColor(status)
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{status}</span>
                <span className="bg-current/20 rounded-full px-2 py-0.5 text-xs">
                  {getStatusCount(status)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <p className="text-sm text-slate-600">
            Showing {filteredProjects.length} of {projects.length} projects
            {selectedStatus !== 'All' && ` • ${selectedStatus} projects`}
            {searchTerm && ` • Search: "${searchTerm}"`}
          </p>
          {(searchTerm || selectedStatus !== 'All') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedStatus('All');
              }}
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project: Project) => (
              <ProjectCard
                key={project.id}
                project={transformProject(project, teamSizes[project.id] || 0)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 py-12">
            <div className="rounded-full bg-slate-100 p-3">
              <Filter className="size-6 text-slate-500" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No projects found
            </h3>
            <p className="mt-2 max-w-sm text-center text-slate-600">
              {searchTerm || selectedStatus !== 'All'
                ? 'Try adjusting your search or filter criteria.'
                : "You haven't submitted any projects yet. Create your first project to get started."}
            </p>
            {!searchTerm && selectedStatus === 'All' && (
              <Button
                className="mt-4"
                size="lg"
                onClick={() =>
                  navigate(paths.requester.createProject.getHref())
                }
              >
                <Plus className="mr-2 size-4" />
                Create Your First Project
              </Button>
            )}
          </div>
        )}
      </div>
    </ContentLayout>
  );
};

export default RequesterProjectsRoute;
