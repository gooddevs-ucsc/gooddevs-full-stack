import {
  BarChart3,
  Users,
  FolderPlus,
  Clock,
  CheckCircle,
  Calendar,
  User,
  MessageSquare,
  Eye,
  Plus,
} from 'lucide-react';

import { ContentLayout } from '@/components/layouts';
import { Button } from '@/components/ui/button';
import { useUser } from '@/lib/auth';

const RequestorDashboardRoute = () => {
  const user = useUser();

  const stats = [
    {
      title: 'Total Projects',
      value: '12',
      change: '+2 this month',
      icon: FolderPlus,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Projects',
      value: '5',
      change: '3 in progress',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Completed Projects',
      value: '7',
      change: '+1 this week',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pending Projects',
      value: '2',
      change: 'Awaiting approval',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const recentActivities = [
    {
      title: 'New team formed',
      description:
        'A development team has been assigned to Environmental Tracker',
      time: '2 hours ago',
      project: 'Environmental Tracker',
      type: 'team',
    },
    {
      title: 'Developer application',
      description: 'Sarah Johnson applied to join Community Food Bank App',
      time: '4 hours ago',
      project: 'Community Food Bank App',
      type: 'application',
    },
    {
      title: 'New comment added',
      description: 'Mike Chen commented on Local Library System discussion',
      time: '6 hours ago',
      project: 'Local Library System',
      type: 'comment',
    },
    {
      title: 'Status updated',
      description: 'Youth Education Platform status changed to "In Progress"',
      time: '1 day ago',
      project: 'Youth Education Platform',
      type: 'status',
    },
    {
      title: 'Project approved',
      description: 'Senior Care Connect has been approved and is now live',
      time: '2 days ago',
      project: 'Senior Care Connect',
      type: 'approval',
    },
  ];

  const recentProjects = [
    {
      title: 'Environmental Tracker',
      status: 'Active',
      statusColor: 'border-green-200 bg-green-50 text-green-600',
      description:
        'Mobile app for tracking personal carbon footprint and environmental impact',
      developers: 3,
      lastUpdate: '2 hours ago',
    },
    {
      title: 'Community Food Bank App',
      status: 'Pending',
      statusColor: 'border-orange-200 bg-orange-50 text-orange-600',
      description: 'Web platform connecting food donors with local food banks',
      developers: 0,
      lastUpdate: '1 day ago',
    },
    {
      title: 'Local Library System',
      status: 'Active',
      statusColor: 'border-green-200 bg-green-50 text-green-600',
      description:
        'Digital catalog and book reservation system for community library',
      developers: 2,
      lastUpdate: '3 hours ago',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'team':
        return <Users className="size-3 text-blue-600" />;
      case 'application':
        return <User className="size-3 text-purple-600" />;
      case 'comment':
        return <MessageSquare className="size-3 text-green-600" />;
      case 'status':
        return <BarChart3 className="size-3 text-orange-600" />;
      case 'approval':
        return <CheckCircle className="size-3 text-emerald-600" />;
      default:
        return <Calendar className="size-3 text-slate-600" />;
    }
  };

  return (
    <ContentLayout title="Requester Dashboard">
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
              Project Requester
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

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Platform Capabilities/Quick Actions */}
          <div className="rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-900">
              <BarChart3 className="size-5 text-primary" />
              Quick Actions
            </h2>
            <div className="space-y-4">
              <div className="rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-4">
                <h3 className="font-semibold text-slate-900">
                  Project Management
                </h3>
                <div className="mt-3 space-y-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start border-primary/20 text-primary h-10"
                  >
                    <div className="flex items-center gap-6">
                      <Plus className="size-4" />
                      Submit New Project Request
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start h-10"
                  >
                    <div className="flex items-center gap-6">
                      <Eye className="size-4" />
                      View All My Projects
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start h-10"
                  >
                    <div className="flex items-center gap-6">
                      <Users className="size-4" />
                      Browse Recommended Developers
                    </div>
                  </Button>
                </div>
              </div>

              <div className="rounded-lg bg-gradient-to-r from-green-50 to-green-100/50 p-4">
                <h3 className="font-semibold text-slate-900">Your Benefits</h3>
                <ul className="mt-2 space-y-1 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-green-500"></div>
                    Access to skilled volunteer developers
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-green-500"></div>
                    Free project development services
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-green-500"></div>
                    Project progress tracking and updates
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-green-500"></div>
                    Direct communication with dev teams
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Recent Activity Feed */}
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
                  <div className="mt-1 flex size-6 items-center justify-center rounded-full bg-slate-100">
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
                      <span className="font-medium">{activity.project}</span>
                      <span>•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Projects Overview */}
        <div className="rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-900">
            <FolderPlus className="size-5 text-primary" />
            Recent Projects Overview
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentProjects.map((project, index) => (
              <div
                key={index}
                className="rounded-lg border border-slate-200/60 bg-gradient-to-br from-white to-slate-50/50 p-4 transition-all hover:shadow-md"
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
                    <Users className="size-3" />
                    <span>{project.developers} developers</span>
                  </div>
                  <span>Updated {project.lastUpdate}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm">
              View All Projects
            </Button>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default RequestorDashboardRoute;
