import {
  Users,
  FolderPlus,
  Clock,
  CheckCircle,
  Calendar,
  Plus,
} from 'lucide-react';
import { useNavigate } from 'react-router';

import { ContentLayout } from '@/components/layouts';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import { useUserProjects } from '@/features/projects/api/get-user-projects';
import { useProjectTeamSizes } from '@/features/projects/hooks/use-project-team-sizes';
import { useUser } from '@/lib/auth';
import { Project } from '@/types/api';

const RequestorDashboardRoute = () => {
  const user = useUser();
  const navigate = useNavigate();

  // Fetch user's projects
  const { data: projectsData, isLoading: projectsLoading } = useUserProjects({
    page: 1,
    limit: 100,
  });

  const projects = projectsData?.data || [];
  const projectIds = projects.map((project) => project.id);

  // Fetch team sizes for all projects
  const { teamSizes, isLoading: isLoadingTeamSizes } =
    useProjectTeamSizes(projectIds);

  // Calculate project counts by status
  const getProjectCountsByStatus = () => {
    const counts = {
      total: projects.length,
      active: 0,
      pending: 0,
      completed: 0,
      rejected: 0,
    };

    projects.forEach((project: Project) => {
      switch (project.status) {
        case 'APPROVED':
          counts.active++;
          break;
        case 'PENDING':
          counts.pending++;
          break;
        case 'COMPLETED':
          counts.completed++;
          break;
        case 'REJECTED':
          counts.rejected++;
          break;
      }
    });

    return counts;
  };

  const projectCounts = getProjectCountsByStatus();

  // Transform projects for display with real team data
  const transformedProjects = projects.map((project: Project) => {
    const getStatusInfo = (status: string) => {
      switch (status) {
        case 'APPROVED':
          return {
            status: 'Active',
            statusColor: 'border-green-200 bg-green-50 text-green-600',
          };
        case 'PENDING':
          return {
            status: 'Pending',
            statusColor: 'border-orange-200 bg-orange-50 text-orange-600',
          };
        case 'COMPLETED':
          return {
            status: 'Completed',
            statusColor: 'border-blue-200 bg-blue-50 text-blue-600',
          };
        default:
          return {
            status: 'Rejected',
            statusColor: 'border-red-200 bg-red-100 text-red-800',
          };
      }
    };

    const statusInfo = getStatusInfo(project.status);

    return {
      id: project.id,
      title: project.title,
      description: project.description,
      status: statusInfo.status,
      statusColor: statusInfo.statusColor,
      developers: teamSizes[project.id] || 0, // Use real team size from API
      lastUpdate: new Date(
        project.updated_at || project.created_at,
      ).toLocaleDateString(),
      createdAt: new Date(project.created_at).toLocaleDateString(),
    };
  });

  const stats = [
    {
      title: 'Total Projects',
      value: projectCounts.total.toString(),
      change: `${projectCounts.total} submitted`,
      icon: FolderPlus,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Projects',
      value: projectCounts.active.toString(),
      change: `${projectCounts.active} in progress`,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Completed Projects',
      value: projectCounts.completed.toString(),
      change: `${projectCounts.completed} finished`,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pending Projects',
      value: projectCounts.pending.toString(),
      change: 'Awaiting approval',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <ContentLayout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back,{' '}
            <span className="text-primary">
              {user.data?.firstname} {user.data?.lastname}
            </span>
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Your role:{' '}
            <span className="font-semibold text-primary">
              {user.data?.role}
            </span>
          </p>
          <p className="mt-4 text-slate-600">
            Here&apos;s an overview of your project portfolio and recent
            activity.
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                  <stat.icon className={`size-6 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-slate-900">
                  {stat.value}
                </h3>
                <p className="text-sm text-slate-600">{stat.title}</p>
                <p className="mt-1 text-xs text-slate-500">{stat.change}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Projects Overview */}
        <div className="rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
              <FolderPlus className="size-5 text-primary" />
              Recent Projects Overview
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(paths.requester.projects.getHref())}
            >
              View All Projects
            </Button>
          </div>

          {projectsLoading || isLoadingTeamSizes ? (
            <div className="flex h-32 items-center justify-center">
              <Spinner size="md" />
            </div>
          ) : transformedProjects.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {transformedProjects.slice(0, 6).map((project) => (
                  <button
                    key={project.id}
                    className="cursor-pointer rounded-lg border border-slate-200/60 bg-gradient-to-br from-white to-slate-50/50 p-4 text-left transition-all hover:shadow-md"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <h3 className="line-clamp-1 font-semibold text-slate-900">
                        {project.title}
                      </h3>
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${project.statusColor}`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <p className="mb-3 line-clamp-2 text-sm text-slate-600">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        <span>Created {project.createdAt}</span>
                      </div>
                      <span>Updated {project.lastUpdate}</span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-slate-100 p-4">
                <FolderPlus className="size-8 text-slate-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                No projects yet
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Get started by creating your first project
              </p>
              <Button
                className="mt-4"
                onClick={() =>
                  navigate(paths.requester.createProject.getHref())
                }
              >
                <Plus className="mr-2 size-4" />
                Create Project
              </Button>
            </div>
          )}
        </div>
      </div>
    </ContentLayout>
  );
};

export default RequestorDashboardRoute;
