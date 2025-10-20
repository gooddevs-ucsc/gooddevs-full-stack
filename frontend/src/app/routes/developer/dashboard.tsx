import { Code, TrendingUp, Activity, Calendar, FolderPlus } from 'lucide-react';
import { useNavigate } from 'react-router';

import { ContentLayout } from '@/components/layouts';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import { useApplications } from '@/features/projects/api/get-applications';
import { useUser } from '@/lib/auth';
import { ProjectApplication } from '@/types/api';

const DashboardRoute = () => {
  const user = useUser();

  // Fetch volunteer's applications
  const { data: applicationsData, isLoading } = useApplications({
    page: 1,
    limit: 100,
  });

  const applications = applicationsData?.data || [];

  // Calculate counts based on application status
  const appliedProjectsCount = applications.filter(
    (app: ProjectApplication) => app.status === 'PENDING',
  ).length;

  const acceptedProjectsCount = applications.filter(
    (app: ProjectApplication) => app.status === 'APPROVED',
  ).length;

  // Get accepted projects for display
  const acceptedProjects = applications
    .filter((app: ProjectApplication) => app.status === 'APPROVED')
    .map((app: ProjectApplication) => ({
      id: app.project?.id || app.id,
      title: app.project?.title || 'Unknown Project',
      description: app.project?.description || 'No description available',
      created_at: app.created_at,
    }));

  // Navigation for project overview actions
  const navigate = useNavigate();

  // Transform accepted projects for overview display (Recent Projects Overview)
  const transformedActiveProjects = acceptedProjects.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    status: 'Accepted',
    statusColor: 'border-green-200 bg-green-50 text-green-600',
    createdAt: new Date(p.created_at).toLocaleDateString(),
    lastUpdate: new Date(p.created_at).toLocaleDateString(),
  }));

  const stats = [
    {
      title: 'Applied Projects',
      value: appliedProjectsCount.toString(),
      change:
        applications.length > 0
          ? `${appliedProjectsCount} applied`
          : 'No applications',
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Accepted Projects',
      value: acceptedProjectsCount.toString(),
      change:
        acceptedProjectsCount > 0
          ? `${acceptedProjectsCount} active`
          : 'No accepted projects',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Active Projects',
      value: acceptedProjectsCount.toString(),
      change: acceptedProjectsCount > 0 ? 'In progress' : 'No active projects',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Projects Contributed',
      value: '2',
      change: '+2%',
      icon: Code,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  if (isLoading) {
    return (
      <ContentLayout title="Dashboard">
        <div className="flex h-48 w-full items-center justify-center">
          <Spinner size="lg" />
        </div>
      </ContentLayout>
    );
  }

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
            Here&apos;s an overview of your contributions and activities.
          </p>
        </div>

        {/* Stats Grid */}
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
                <span className="text-sm font-medium text-green-600">
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-slate-900">
                  {stat.value}
                </h3>
                <p className="text-sm text-slate-600">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Projects Overview */}
        <div className="rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
              <FolderPlus className="size-5 text-primary" />
              My Projects Overview
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                +navigate(`${paths.developer.projects.getHref()}?tab=accepted`)
              }
            >
              View My Projects
            </Button>
          </div>

          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Spinner size="md" />
            </div>
          ) : transformedActiveProjects.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {transformedActiveProjects.slice(0, 6).map((project) => (
                  <button
                    key={project.id}
                    className="cursor-pointer rounded-lg border border-slate-200/60 bg-gradient-to-br from-white to-slate-50/50 p-4 text-left transition-all hover:shadow-md"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <h3 className="line-clamp-1 font-semibold text-slate-900">
                        {project.title}
                      </h3>
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

              {transformedActiveProjects.length > 6 && (
                <div className="mt-4 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      +navigate(
                        `${paths.developer.projects.getHref()}?tab=accepted`,
                      )
                    }
                  >
                    View All {transformedActiveProjects.length} Projects
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-slate-100 p-4">
                <FolderPlus className="size-8 text-slate-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                No active projects yet
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Accept projects to see them here
              </p>
            </div>
          )}
        </div>
      </div>
    </ContentLayout>
  );
};

export default DashboardRoute;
