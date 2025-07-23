import { Code, GitBranch, TrendingUp, Activity, Calendar } from 'lucide-react';

import { ContentLayout } from '@/components/layouts';
import { useUser } from '@/lib/auth';

const DashboardRoute = () => {
  const user = useUser();

  const stats = [
    {
      title: 'Total Projects',
      value: '20',
      change: '+15%',
      icon: GitBranch,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Applied Projects',
      value: '3',
      change: '+5%',
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Accepted Projects',
      value: '2',
      change: '+10%',
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Active Projects',
      value: '3',
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

  const acceptedProjects = [
    {
      title: 'Remote Work Platform',
      description: 'Facilitate remote team collaboration.',
    },
    {
      title: 'Food Delivery App',
      description: 'Streamline food ordering and delivery.',
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
                  className={`flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-slate-50 ${
                    activity.title.includes('Pull Request')
                      ? 'bg-blue-50'
                      : activity.title.includes('Issue Resolved')
                        ? 'bg-green-50'
                        : activity.title.includes('Code Review')
                          ? 'bg-yellow-50'
                          : 'bg-gray-50'
                  }`}
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
              <div className="rounded-lg bg-gradient-to-r from-green-50 to-green-100/50 p-4">
                <h3 className="font-semibold text-slate-900">
                  Project Management Tool
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Progress:{' '}
                  <span className="font-semibold text-green-600">75%</span>
                </p>
                <div className="mt-2 h-2 w-full rounded-full bg-green-200">
                  <div className="h-full w-3/4 rounded-full bg-green-600"></div>
                </div>
              </div>
              <div className="rounded-lg bg-gradient-to-r from-blue-50 to-blue-100/50 p-4">
                <h3 className="font-semibold text-slate-900">
                  Fitness Tracker App
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Progress:{' '}
                  <span className="font-semibold text-blue-600">50%</span>
                </p>
                <div className="mt-2 h-2 w-full rounded-full bg-blue-200">
                  <div className="h-full w-1/2 rounded-full bg-blue-600"></div>
                </div>
              </div>
              <div className="rounded-lg bg-gradient-to-r from-yellow-50 to-yellow-100/50 p-4">
                <h3 className="font-semibold text-slate-900">
                  Inventory Management System
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Progress:{' '}
                  <span className="font-semibold text-yellow-600">30%</span>
                </p>
                <div className="mt-2 h-2 w-full rounded-full bg-yellow-200">
                  <div className="h-full w-1/4 rounded-full bg-yellow-600"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Accepted Projects Section */}
          <div className="rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-900">
              <GitBranch className="size-5 text-primary" />
              Accepted Projects
            </h2>
            <div className="space-y-4">
              {acceptedProjects.map((project, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 rounded-lg p-3 transition-colors ${
                    project.title === 'Food Delivery App'
                      ? 'bg-blue-100'
                      : 'bg-green-100'
                  }`}
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900">
                      {project.title}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {project.description}
                    </p>
                  </div>
                </div>
              ))}
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
