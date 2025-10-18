import { Code, GitBranch, TrendingUp, Activity, Calendar } from 'lucide-react';

import { ContentLayout } from '@/components/layouts';
import { Spinner } from '@/components/ui/spinner';
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
      id: app.id,
      title: app.project?.title || 'Unknown Project',
      description: app.project?.description || 'No description available',
      created_at: app.created_at,
    }));

  // Get active projects (approved applications)
  const activeProjects = applications
    .filter((app: ProjectApplication) => app.status === 'APPROVED')
    .map((app: ProjectApplication) => ({
      id: app.id,
      title: app.project?.title || 'Unknown Project',
      progress: Math.floor(Math.random() * 100), // You can implement actual progress calculation
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

  const recentActivities = [
    {
      title: 'New Pull Request',
      description: 'Added feature for real-time collaboration',
      time: '1 hour ago',
      user: 'Januli Nanayakkara',
    },
    {
      title: 'Issue Resolved',
      description: 'Fixed bug in authentication flow',
      time: '3 hours ago',
      user: 'Chathuri Nadeesha',
    },
    {
      title: 'Code Review Completed',
      description: 'Reviewed PR #42 for performance improvements',
      time: '5 hours ago',
      user: 'Peshani Ranaweera',
    },
    {
      title: 'New Repository Starred',
      description: 'Starred "Open Source Dashboard"',
      time: '7 hours ago',
      user: 'Hashini Sewmini',
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

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Recent Activity */}
          <div className="rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-900">
              <Calendar className="size-5 text-primary" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-gray-100"
                >
                  <div className="mt-1 size-2 rounded-full bg-primary"></div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900">
                      {activity.title}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {activity.description}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <span>{activity.user}</span>
                      <span>•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines Section */}
          <div className="rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-900">
              <Calendar className="size-5 text-primary" />
              Upcoming Deadlines
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-red-50 to-red-100/50 p-4">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Project Management Tool
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Deadline:{' '}
                    <span className="font-semibold text-red-600">
                      July 30, 2025
                    </span>
                  </p>
                </div>
                <span className="text-sm font-medium text-red-600">
                  5 days left
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-yellow-50 to-yellow-100/50 p-4">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Fitness Tracker App
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Deadline:{' '}
                    <span className="font-semibold text-yellow-600">
                      August 15, 2025
                    </span>
                  </p>
                </div>
                <span className="text-sm font-medium text-yellow-600">
                  24 days left
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Active Project Progress Section */}
          <div className="rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-900">
              <TrendingUp className="size-5 text-primary" />
              Active Project Progress
            </h2>
            <div className="space-y-4">
              {activeProjects.slice(0, 3).map((project) => {
                const progressColors = [
                  {
                    bg: 'from-green-50 to-green-100/50',
                    text: 'text-green-600',
                    bar: 'bg-green-200',
                    fill: 'bg-green-600',
                  },
                  {
                    bg: 'from-blue-50 to-blue-100/50',
                    text: 'text-blue-600',
                    bar: 'bg-blue-200',
                    fill: 'bg-blue-600',
                  },
                  {
                    bg: 'from-purple-50 to-purple-100/50',
                    text: 'text-purple-600',
                    bar: 'bg-purple-200',
                    fill: 'bg-purple-600',
                  },
                ];
                const colorIndex =
                  activeProjects.indexOf(project) % progressColors.length;
                const colors = progressColors[colorIndex];

                return (
                  <div
                    key={project.id}
                    className={`rounded-lg bg-gradient-to-r ${colors.bg} p-4`}
                  >
                    <h3 className="font-semibold text-slate-900">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      Progress:{' '}
                      <span className={`font-semibold ${colors.text}`}>
                        {project.progress}%
                      </span>
                    </p>
                    <div
                      className={`mt-2 h-2 w-full rounded-full ${colors.bar}`}
                    >
                      <div
                        className={`h-full rounded-full ${colors.fill}`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              {activeProjects.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-slate-500">No active projects</p>
                  <p className="text-sm text-slate-400">
                    Apply to projects and get accepted to see progress here
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Accepted Projects Section */}
          <div className="rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-900">
              <GitBranch className="size-5 text-primary" />
              Accepted Projects
            </h2>
            <div className="space-y-4">
              {acceptedProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-gray-100"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900">
                      {project.title}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {project.description}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Accepted:{' '}
                      {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {acceptedProjects.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-slate-500">No accepted projects yet</p>
                  <p className="text-sm text-slate-400">
                    Apply to projects to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Developer's Contributions Section */}
        <div className="rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-900">
            <TrendingUp className="size-5 text-primary" />
            Past Contributions
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 rounded-lg bg-gradient-to-r from-green-50 to-green-100/50 p-4">
              <div className="flex-1">
                <h4 className="font-medium text-slate-900">
                  E-Commerce Platform
                </h4>
                <p className="text-sm text-slate-600">
                  Contribution:{' '}
                  <span className="font-medium text-green-600">40%</span>
                </p>
                <div className="mt-2 h-2 w-full rounded-full bg-green-200">
                  <div className="h-full w-2/5 rounded-full bg-green-600"></div>
                </div>
                <h5 className="mt-4 text-sm font-semibold text-slate-900">
                  Tasks
                </h5>
                <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
                  <li>Developed product listing and search functionality</li>
                  <li>Integrated payment gateway for secure transactions</li>
                  <li>Implemented user authentication and authorization</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100/50 p-4">
              <div className="flex-1">
                <h4 className="font-medium text-slate-900">
                  Online Learning Portal
                </h4>
                <p className="text-sm text-slate-600">
                  Contribution:{' '}
                  <span className="font-medium text-blue-600">25%</span>
                </p>
                <div className="mt-2 h-2 w-full rounded-full bg-blue-200">
                  <div className="h-full w-1/4 rounded-full bg-blue-600"></div>
                </div>
                <h5 className="mt-4 text-sm font-semibold text-slate-900">
                  Tasks
                </h5>
                <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
                  <li>Designed and implemented course management system</li>
                  <li>Developed real-time video streaming for live classes</li>
                  <li>Optimized database for faster content delivery</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default DashboardRoute;
