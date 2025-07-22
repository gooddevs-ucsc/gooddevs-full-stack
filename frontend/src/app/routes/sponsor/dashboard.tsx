import {
  DollarSign,
  Heart,
  TrendingUp,
  Activity,
  Users,
  Award,
  BarChart3,
  Target,
  Zap,
  Eye,
  Search,
  Star,
  Shield,
} from 'lucide-react';

import { ContentLayout } from '@/components/layouts';
import { useUser } from '@/lib/auth';

const SponsorDashboardRoute = () => {
  const user = useUser();

  const stats = [
    {
      title: 'Total Contributions',
      value: '$24,750',
      change: '+32%',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Platform & project donations',
    },
    {
      title: 'Projects Sponsored',
      value: '12',
      change: '+15%',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Approved projects supported',
    },
    {
      title: 'Developers Sponsored',
      value: '8',
      change: '+25%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Individual developer support',
    },
    {
      title: 'Impact Score',
      value: '94%',
      change: '+8%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Community impact rating',
    },
  ];

  const recentActivities = [
    {
      title: 'Platform Donation',
      description: 'General platform support for infrastructure & operations',
      time: '2 hours ago',
      type: 'platform',
      amount: '$1,000',
      badge: 'Platform Support',
    },
    {
      title: 'Project Sponsorship',
      description: 'Sponsored "Healthcare Management System" project',
      time: '1 day ago',
      type: 'project',
      amount: '$750',
      badge: 'Project Sponsor',
    },
    {
      title: 'Developer Sponsorship',
      description:
        'Monthly sponsorship for Senior Frontend Developer - Sarah Chen',
      time: '3 days ago',
      type: 'developer',
      amount: '$300/month',
      badge: 'Developer Sponsor',
    },
    {
      title: 'Category Sponsorship',
      description: 'Sponsored all "Education Technology" category projects',
      time: '5 days ago',
      type: 'category',
      amount: '$2,000',
      badge: 'Category Sponsor',
    },
    {
      title: 'Impact Report Received',
      description: 'Quarterly transparency report on donation utilization',
      time: '1 week ago',
      type: 'report',
      badge: 'Transparency',
    },
  ];

  const sponsoredProjects = [
    {
      name: 'Healthcare Management System',
      progress: 75,
      totalFunding: '$4,500',
      yourContribution: '$1,200',
      status: 'In Progress',
      developers: 6,
      category: 'Healthcare',
      bgClass: 'bg-gradient-to-r from-green-50 to-green-100/50',
      textClass: 'text-green-600',
      progressClass: 'bg-green-200',
      barClass: 'bg-green-600',
    },
    {
      name: 'Education Platform',
      progress: 100,
      totalFunding: '$3,800',
      yourContribution: '$800',
      status: 'Completed',
      developers: 4,
      category: 'Education',
      bgClass: 'bg-gradient-to-r from-blue-50 to-blue-100/50',
      textClass: 'text-blue-600',
      progressClass: 'bg-blue-200',
      barClass: 'bg-blue-600',
    },
    {
      name: 'Community Food Bank App',
      progress: 85,
      totalFunding: '$2,900',
      yourContribution: '$750',
      status: 'In Progress',
      developers: 3,
      category: 'Social Impact',
      bgClass: 'bg-gradient-to-r from-purple-50 to-purple-100/50',
      textClass: 'text-purple-600',
      progressClass: 'bg-purple-200',
      barClass: 'bg-purple-600',
    },
  ];

  const impactMetrics = [
    {
      label: 'Lives Impacted',
      value: '1,250+',
      icon: Heart,
      description: 'Through sponsored applications',
    },
    {
      label: 'Developers Trained',
      value: '42',
      icon: Users,
      description: 'Gained real-world experience',
    },
    {
      label: 'Open Source Contributions',
      value: '156',
      icon: Award,
      description: 'Pull requests merged',
    },
    {
      label: 'Project Success Rate',
      value: '94%',
      icon: Target,
      description: 'Projects completed successfully',
    },
  ];

  return (
    <ContentLayout title="Sponsor Dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="rounded-2xl bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back,{' '}
            <span className="text-green-600">
              {user.data?.firstname} {user.data?.lastname}
            </span>
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Your impact:{' '}
            <span className="font-semibold text-green-600">
              Community Champion
            </span>
          </p>
          <p className="mt-4 text-slate-600">
            Thank you for supporting developers and creating positive impact
            through technology.
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
          {/* Sponsored Projects Progress */}
          <div className="rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-900">
              <BarChart3 className="size-5 text-green-600" />
              Sponsored Projects Progress
            </h2>
            <div className="space-y-4">
              {sponsoredProjects.map((project, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-4 ${project.bgClass}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">
                        {project.name}
                      </h3>
                      <div className="mt-1 text-xs text-slate-500">
                        Category: {project.category}
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-slate-600">
                        <div>
                          <span className="font-medium">
                            Your contribution:
                          </span>
                          <br />
                          <span
                            className={`font-semibold ${project.textClass}`}
                          >
                            {project.yourContribution}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Developers:</span>
                          <br />
                          <span className="font-semibold">
                            {project.developers}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        project.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Progress</span>
                      <span className={`font-semibold ${project.textClass}`}>
                        {project.progress}%
                      </span>
                    </div>
                    <div
                      className={`mt-2 h-2 w-full rounded-full ${project.progressClass}`}
                    >
                      <div
                        className={`h-full rounded-full ${project.barClass}`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-900">
              <Activity className="size-5 text-blue-600" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-slate-50"
                >
                  <div
                    className={`mt-1 size-2 rounded-full ${
                      activity.type === 'platform'
                        ? 'bg-green-500'
                        : activity.type === 'project'
                          ? 'bg-blue-500'
                          : activity.type === 'developer'
                            ? 'bg-purple-500'
                            : activity.type === 'category'
                              ? 'bg-orange-500'
                              : 'bg-slate-500'
                    }`}
                  ></div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900">
                      {activity.title}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {activity.description}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      {activity.amount && (
                        <>
                          <span className="font-medium text-green-600">
                            {activity.amount}
                          </span>
                          <span>•</span>
                        </>
                      )}
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-900">
            <Zap className="size-5 text-purple-600" />
            Your Impact Summary
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {impactMetrics.map((metric, index) => (
              <div
                key={index}
                className="rounded-lg bg-gradient-to-br from-slate-50 to-slate-100/50 p-6 text-center"
              >
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-purple-100">
                  <metric.icon className="size-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {metric.value}
                </div>
                <div className="text-sm font-medium text-slate-900">
                  {metric.label}
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  {metric.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Quick Actions for Sponsor Management */}
        <div className="rounded-xl border border-slate-200/60 bg-gradient-to-r from-green-50 to-blue-50 p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">
            Sponsor Actions & Management
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <button className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md">
              <Search className="size-6 text-blue-600" />
              <div className="text-left">
                <div className="font-medium text-slate-900">
                  Browse Projects
                </div>
                <div className="text-sm text-slate-600">
                  View approved projects
                </div>
              </div>
            </button>
            <button className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md">
              <DollarSign className="size-6 text-green-600" />
              <div className="text-left">
                <div className="font-medium text-slate-900">
                  Make a Donation
                </div>
                <div className="text-sm text-slate-600">
                  Support platform or project
                </div>
              </div>
            </button>
            <button className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md">
              <Users className="size-6 text-purple-600" />
              <div className="text-left">
                <div className="font-medium text-slate-900">
                  Sponsor Developer
                </div>
                <div className="text-sm text-slate-600">
                  Support individual developers
                </div>
              </div>
            </button>
            <button className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md">
              <BarChart3 className="size-6 text-orange-600" />
              <div className="text-left">
                <div className="font-medium text-slate-900">Track Impact</div>
                <div className="text-sm text-slate-600">
                  View donation tracking
                </div>
              </div>
            </button>
          </div>

          {/* Category Sponsorship Options */}
          <div className="mt-6">
            <h3 className="mb-3 text-lg font-medium text-slate-900">
              Category Sponsorship
            </h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <button className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-center transition-colors hover:bg-blue-100">
                <div className="text-sm font-medium text-blue-900">
                  Healthcare
                </div>
                <div className="text-xs text-blue-700">4 projects</div>
              </button>
              <button className="rounded-lg border border-green-200 bg-green-50 p-3 text-center transition-colors hover:bg-green-100">
                <div className="text-sm font-medium text-green-900">
                  Education
                </div>
                <div className="text-xs text-green-700">6 projects</div>
              </button>
              <button className="rounded-lg border border-purple-200 bg-purple-50 p-3 text-center transition-colors hover:bg-purple-100">
                <div className="text-sm font-medium text-purple-900">
                  Social Impact
                </div>
                <div className="text-xs text-purple-700">3 projects</div>
              </button>
              <button className="rounded-lg border border-orange-200 bg-orange-50 p-3 text-center transition-colors hover:bg-orange-100">
                <div className="text-sm font-medium text-orange-900">
                  Environment
                </div>
                <div className="text-xs text-orange-700">2 projects</div>
              </button>
            </div>
          </div>

          {/* Sponsor Recognition Options */}
          <div className="mt-6">
            <h3 className="mb-3 text-lg font-medium text-slate-900">
              Recognition Preferences
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2">
                  <Shield className="size-5 text-blue-600" />
                  <span className="font-medium text-slate-900">Anonymous</span>
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  Keep contributions private
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2">
                  <Eye className="size-5 text-green-600" />
                  <span className="font-medium text-slate-900">Public</span>
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  Show name on projects
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2">
                  <Star className="size-5 text-yellow-600" />
                  <span className="font-medium text-slate-900">Featured</span>
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  Highlight major contributions
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default SponsorDashboardRoute;
