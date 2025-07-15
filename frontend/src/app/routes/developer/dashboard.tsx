import {
  Code,
  GitBranch,
  Star,
  TrendingUp,
  Activity,
  Calendar,
} from 'lucide-react';

import { ContentLayout } from '@/components/layouts';
import { useUser } from '@/lib/auth';

const DashboardRoute = () => {
  const user = useUser();

  const stats = [
    {
      title: 'Total Projects',
      value: '10',
      change: '+15%',
      icon: GitBranch,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Projects',
      value: '1',
      change: '+5%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Projects Contributed',
      value: '12',
      change: '+2%',
      icon: Code,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pending Projects',
      value: '2',
      change: '+5%',
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Stars Earned',
      value: '4,567',
      change: '+8%',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ];

  const recentActivities = [
    {
      title: 'New Pull Request',
      description: 'Added feature for real-time collaboration',
      time: '1 hour ago',
      user: 'Alice Johnson',
    },
    {
      title: 'Issue Resolved',
      description: 'Fixed bug in authentication flow',
      time: '3 hours ago',
      user: 'Bob Smith',
    },
    {
      title: 'Code Review Completed',
      description: 'Reviewed PR #42 for performance improvements',
      time: '5 hours ago',
      user: 'Charlie Brown',
    },
    {
      title: 'New Repository Starred',
      description: 'Starred "Open Source Dashboard"',
      time: '7 hours ago',
      user: 'Diana Prince',
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
          {/* Active Project Progress Section */}
          <div className="rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-900">
              <TrendingUp className="size-5 text-primary" />
              Active Project Progress
            </h2>
            <div className="space-y-4">
              <div className="rounded-lg bg-gradient-to-r from-green-50 to-green-100/50 p-4">
                <h3 className="font-semibold text-slate-900">Project Alpha</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Progress:{' '}
                  <span className="font-semibold text-green-600">75%</span>
                </p>
                <div className="mt-2 h-2 w-full rounded-full bg-green-200">
                  <div className="h-full w-3/4 rounded-full bg-green-600"></div>
                </div>
              </div>
              <div className="rounded-lg bg-gradient-to-r from-blue-50 to-blue-100/50 p-4">
                <h3 className="font-semibold text-slate-900">Project Beta</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Progress:{' '}
                  <span className="font-semibold text-blue-600">50%</span>
                </p>
                <div className="mt-2 h-2 w-full rounded-full bg-blue-200">
                  <div className="h-full w-1/2 rounded-full bg-blue-600"></div>
                </div>
              </div>
            </div>
          </div>

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
                  className="flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-slate-50"
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
        </div>
      </div>
    </ContentLayout>
  );
};

export default DashboardRoute;
