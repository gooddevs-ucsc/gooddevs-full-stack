import {
  BarChart3,
  Users,
  MessageSquare,
  TrendingUp,
  Activity,
  Calendar,
} from 'lucide-react';

import { ContentLayout } from '@/components/layouts';
import { useUser } from '@/lib/auth';
import { ROLES } from '@/lib/roles';

const DashboardRoute = () => {
  const user = useUser();

  const stats = [
    {
      title: 'Total Discussions',
      value: '24',
      change: '+12%',
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Users',
      value: '1,234',
      change: '+5%',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Monthly Growth',
      value: '18%',
      change: '+3%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Activity Score',
      value: '8.9',
      change: '+0.5',
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const recentActivities = [
    {
      title: 'New discussion created',
      description: 'React Performance Optimization',
      time: '2 hours ago',
      user: 'John Doe',
    },
    {
      title: 'User joined',
      description: 'Sarah Wilson joined the platform',
      time: '4 hours ago',
      user: 'Sarah Wilson',
    },
    {
      title: 'Discussion updated',
      description: 'Vue.js Best Practices',
      time: '6 hours ago',
      user: 'Mike Johnson',
    },
    {
      title: 'New comment added',
      description: 'TypeScript Migration Guide',
      time: '8 hours ago',
      user: 'Emma Davis',
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
            Here&apos;s what&apos;s happening with your projects today.
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
          {/* Capabilities Section */}
          <div className="rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-900">
              <BarChart3 className="size-5 text-primary" />
              Platform Capabilities
            </h2>
            <div className="space-y-4">
              <div className="rounded-lg bg-gradient-to-r from-blue-50 to-blue-100/50 p-4">
                <h3 className="font-semibold text-slate-900">For Everyone</h3>
                <ul className="mt-2 space-y-1 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-blue-500"></div>
                    Browse and search discussions
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-blue-500"></div>
                    Comment on discussions
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-blue-500"></div>
                    View user profiles
                  </li>
                </ul>
              </div>

              {user.data?.role === ROLES.ADMIN && (
                <div className="rounded-lg bg-gradient-to-r from-purple-50 to-purple-100/50 p-4">
                  <h3 className="font-semibold text-slate-900">
                    Admin Privileges
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <div className="size-1.5 rounded-full bg-purple-500"></div>
                      Create and manage discussions
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="size-1.5 rounded-full bg-purple-500"></div>
                      Edit and delete discussions
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="size-1.5 rounded-full bg-purple-500"></div>
                      Manage all comments
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="size-1.5 rounded-full bg-purple-500"></div>
                      User management
                    </li>
                  </ul>
                </div>
              )}
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
