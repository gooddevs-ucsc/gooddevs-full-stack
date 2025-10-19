import {
  BarChart3,
  Users,
  FolderPlus,
  Clock,
  Calendar,
  Eye,
  Shield,
  AlertTriangle,
  Database,
  UserCheck,
  Activity,
} from 'lucide-react';
import { useNavigate } from 'react-router';

import { ContentLayout } from '@/components/layouts';
import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';
import { useUser } from '@/lib/auth';

const AdminDashboardRoute = () => {
  const user = useUser();
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+127 this month',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Projects',
      value: '64',
      change: '18 pending approval',
      icon: FolderPlus,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pending Approvals',
      value: '23',
      change: '5 urgent',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const recentActivities = [
    {
      title: 'New user registration',
      description: 'John Smith registered as a developer',
      time: '5 minutes ago',
      type: 'user',
      status: 'info',
    },
    {
      title: 'Project approval needed',
      description: 'Community Garden Management System awaiting review',
      time: '15 minutes ago',
      type: 'approval',
      status: 'warning',
    },
    {
      title: 'New project submitted',
      description: 'Animal Shelter Management System submitted for review',
      time: '3 hours ago',
      type: 'project',
      status: 'info',
    },
  ];

  const pendingApprovals = [
    {
      title: 'Community Garden Management',
      type: 'Project',
      submittedBy: 'Green Valley Organization',
      urgency: 'High',
      urgencyColor: 'border-red-200 bg-red-50 text-red-600',
      submittedAt: '2 hours ago',
    },
    {
      title: 'Sarah Johnson',
      type: 'Developer Account',
      submittedBy: 'Self Registration',
      urgency: 'Medium',
      urgencyColor: 'border-yellow-200 bg-yellow-50 text-yellow-600',
      submittedAt: '5 hours ago',
    },
    {
      title: 'Nonprofit Partnership Request',
      type: 'Organization',
      submittedBy: 'Local Food Bank',
      urgency: 'Low',
      urgencyColor: 'border-green-200 bg-green-50 text-green-600',
      submittedAt: '1 day ago',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <UserCheck className="size-3 text-blue-600" />;
      case 'approval':
        return <Clock className="size-3 text-orange-600" />;
      case 'report':
        return <AlertTriangle className="size-3 text-red-600" />;
      case 'system':
        return <Database className="size-3 text-green-600" />;
      case 'project':
        return <FolderPlus className="size-3 text-purple-600" />;
      default:
        return <Calendar className="size-3 text-slate-600" />;
    }
  };

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100';
      case 'warning':
        return 'bg-yellow-100';
      case 'error':
        return 'bg-red-100';
      case 'info':
      default:
        return 'bg-blue-100';
    }
  };

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
            Monitor platform activity, manage users, and oversee project
            approvals.
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
                    {stat.value}
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

          {/* Recent System Activity */}
          <div className="rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-900">
              <Activity className="size-5 text-primary" />
              Recent System Activity
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-slate-50 ${getActivityStatusColor(activity.status)}`}
                >
                  <div className="mt-1 flex size-6 items-center justify-center rounded-full bg-white">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900">
                      {activity.title}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {activity.description}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm">
                View All Activity
              </Button>
            </div>
          </div>
        </div>

        {/* Pending Approvals Section */}
        <div className="rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-900">
            <AlertTriangle className="size-5 text-primary" />
            Pending Approvals
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingApprovals.map((item, index) => (
              <div
                key={index}
                className="rounded-lg border border-slate-200/60 bg-gradient-to-br from-white to-slate-50/50 p-4 transition-all hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="line-clamp-1 font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${item.urgencyColor}`}
                  >
                    {item.urgency}
                  </span>
                </div>
                <p className="mb-2 text-sm text-slate-600">
                  Type: <span className="font-medium">{item.type}</span>
                </p>
                <p className="mb-3 text-sm text-slate-600">
                  By: {item.submittedBy}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Submitted {item.submittedAt}</span>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="px-2 py-1 text-xs"
                      onClick={() =>
                        navigate(paths.admin.projectApprovals.getHref())
                      }
                    >
                      Review
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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

        {/* Platform Statistics */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-900">
              <BarChart3 className="size-5 text-primary" />
              Platform Growth
            </h2>
            <div className="space-y-4">
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
    </ContentLayout>
  );
};

export default AdminDashboardRoute;
