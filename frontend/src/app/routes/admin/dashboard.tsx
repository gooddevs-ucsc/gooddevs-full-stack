import {
  BarChart3,
  Users,
  FolderPlus,
  Clock,
  Eye,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import { useNavigate } from 'react-router';

import { ContentLayout } from '@/components/layouts';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import { useApprovedProjects } from '@/features/projects/api/get-approved-projects';
import { usePendingProjects } from '@/features/projects/api/get-pending-projects';
import { useUsers } from '@/features/users';
import { useUser } from '@/lib/auth';
import { formatDate } from '@/utils/format';

const AdminDashboardRoute = () => {
  const user = useUser();
  const navigate = useNavigate();

  // Fetch data for summary cards
  const { data: usersData, isLoading: usersLoading } = useUsers({
    skip: 0,
    limit: 1,
  });

  const { data: approvedProjectsData, isLoading: approvedProjectsLoading } =
    useApprovedProjects({
      page: 1,
      limit: 1,
    });

  const { data: pendingProjectsData, isLoading: pendingProjectsLoading } =
    usePendingProjects({
      page: 1,
      limit: 3,
    });

  // Get counts from API responses
  const totalUsers = usersData?.count || 0;
  const totalApprovedProjects = approvedProjectsData?.meta?.total || 0;
  const totalPendingProjects = pendingProjectsData?.meta?.total || 0;

  const latestPendingProjects = pendingProjectsData?.data || [];

  // Loading state for stats
  const statsLoading =
    usersLoading || approvedProjectsLoading || pendingProjectsLoading;

  const stats = [
    {
      title: 'Total Users',
      value: statsLoading ? '-' : totalUsers.toLocaleString(),
      change: 'All registered users',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Projects',
      value: statsLoading ? '-' : totalApprovedProjects.toLocaleString(),
      change: 'Approved and running',
      icon: FolderPlus,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pending Approvals',
      value: statsLoading ? '-' : totalPendingProjects.toLocaleString(),
      change: 'Awaiting review',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
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
            Manage users and oversee project approvals.
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all hover:shadow-md"
            >
              <div className="flex flex-row items-center gap-8">
                <div className="flex items-center justify-between">
                  <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                    <stat.icon className={`size-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold text-slate-900">
                    {statsLoading ? (
                      <Spinner size="sm" className="inline" />
                    ) : (
                      stat.value
                    )}
                  </h3>
                  <p className="text-sm text-slate-600">{stat.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{stat.change}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Admin Quick Actions */}
          <div className="rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-900">
              <Shield className="size-5 text-primary" />
              Admin Controls
            </h2>
            <div className="space-y-4">
              <div className="rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-4">
                <h3 className="font-semibold text-slate-900">
                  User Management
                </h3>
                <div className="mt-3 space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 w-full justify-start border-primary/20 text-primary"
                  >
                    <div className="flex items-center gap-6">
                      <Users className="size-4" />
                      <span>Manage Users</span>
                    </div>
                  </Button>
                </div>
              </div>

              <div className="rounded-lg bg-gradient-to-r from-green-50 to-green-100/50 p-4">
                <h3 className="font-semibold text-slate-900">
                  Project Oversight
                </h3>
                <div className="mt-3 space-y-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 w-full justify-start"
                    onClick={() =>
                      navigate(paths.admin.projectApprovals.getHref())
                    }
                  >
                    <div className="flex items-center gap-6">
                      <FolderPlus className="size-4" />
                      <span>Review Pending Projects</span>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 w-full justify-start"
                    onClick={() => navigate(paths.projects.getHref())}
                  >
                    <div className="flex items-center gap-6">
                      <Eye className="size-4" />
                      <span>Monitor Active Projects</span>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Statistics */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-1">
            <div className="rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-900">
                <BarChart3 className="size-5 text-primary" />
                Platform Growth
              </h2>
              <div className="space-y-6 px-10 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    New Users (30 days)
                  </span>
                  <span className="font-semibold text-slate-900">+127</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Projects Completed
                  </span>
                  <span className="font-semibold text-slate-900">89</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Active Developers
                  </span>
                  <span className="font-semibold text-slate-900">342</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Approvals Section */}
        <div className="rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-900">
            <AlertTriangle className="size-5 text-primary" />
            Pending Approvals
          </h2>

          {pendingProjectsLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Spinner size="md" />
            </div>
          ) : latestPendingProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {latestPendingProjects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-lg border border-slate-200/60 bg-gradient-to-br from-white to-slate-50/50 p-4 transition-all hover:shadow-md"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="line-clamp-1 font-semibold text-slate-900">
                      {project.title}
                    </h3>
                    <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-2 py-1 text-xs font-medium text-orange-600">
                      Pending
                    </span>
                  </div>
                  <p className="mb-2 text-sm text-slate-600">
                    Type:{' '}
                    <span className="font-medium">
                      {project.project_type?.replace('_', ' ') || 'Project'}
                    </span>
                  </p>
                  <p className="mb-3 line-clamp-2 text-sm text-slate-600">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Submitted {formatDate(project.created_at)}</span>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="px-2 py-1 text-xs"
                        onClick={() =>
                          navigate(
                            paths.admin.projectDetail.getHref(project.id),
                          )
                        }
                      >
                        Review
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center">
              <div className="text-center">
                <AlertTriangle className="mx-auto mb-2 size-12 text-slate-400" />
                <h3 className="mb-1 text-lg font-medium text-slate-900">
                  No pending projects
                </h3>
                <p className="text-slate-600">
                  All projects have been reviewed.
                </p>
              </div>
            </div>
          )}

          <div className="mt-4 text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(paths.admin.projectApprovals.getHref())}
            >
              View All Pending Items
            </Button>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default AdminDashboardRoute;
