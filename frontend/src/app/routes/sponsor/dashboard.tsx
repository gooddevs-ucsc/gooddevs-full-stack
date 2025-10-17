import { DollarSign, Heart, TrendingUp, Activity, Users } from 'lucide-react';

import { ContentLayout } from '@/components/layouts';
import { useUser } from '@/lib/auth';

const SponsorDashboardRoute = () => {
  const user = useUser();

  const stats = [
    {
      title: 'Total Contributions',
      value: 'Rs.425,000',
      change: '+32%',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Platform & volunteer donations',
    },
    {
      title: 'Volunteers Sponsored',
      value: '12',
      change: '+15%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Individual volunteers supported',
    },
    {
      title: 'Platform Donations',
      value: 'Rs.75,000',
      change: '+18%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Platform infrastructure support',
    },
    {
      title: 'Total Sponsor Amount',
      value: 'Rs.350,000',
      change: '+22%',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Total spent on volunteer sponsorships',
    },
  ];

  const recentActivities = [
    {
      title: 'Platform Donation',
      description: 'General platform support for infrastructure & operations',
      time: '2 hours ago',
      type: 'platform',
      amount: 'Rs.10,000',
      badge: 'Platform Support',
    },
    {
      title: 'Volunteer Sponsor - Saman Fonseka',
      description:
        'Monthly sponsorship payment for Frontend Volunteer specializing in React & TypeScript',
      time: '3 days ago',
      type: 'volunteer',
      amount: 'Rs.3,000/month',
      badge: 'Frontend Volunteer',
    },
    {
      title: 'Volunteer Sponsor - Jayath Indunil',
      description:
        'Monthly sponsorship payment for Backend Volunteer specializing in Python & FastAPI',
      time: '1 week ago',
      type: 'volunteer',
      amount: 'Rs.2,500/month',
      badge: 'Backend Volunteer',
    },
    {
      title: 'Volunteer Sponsor - Malindu Pathum',
      description:
        'Completed sponsorship program for Full-Stack Volunteer specializing in React & Node.js',
      time: '2 weeks ago',
      type: 'volunteer',
      amount: 'Rs.12,000 total',
      badge: 'Full-Stack Volunteer',
    },
  ];

  return (
    <ContentLayout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="rounded-2xl bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-8 shadow-sm">
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
            Thank you for supporting volunteers and creating positive impact
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
          {/* Sponsored Volunteers */}
          <div className="rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-slate-900">
              <div className="rounded-full bg-blue-100 p-2">
                <Users className="size-5 text-blue-600" />
              </div>
              Sponsored Volunteers
            </h2>
            <div className="space-y-4">
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-blue-100/50 to-indigo-100/30 p-5 transition-all hover:scale-[1.02] hover:shadow-lg">
                <div className="absolute -right-6 -top-6 size-20 rounded-full bg-blue-200/30"></div>
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          Saman Fonseka
                        </h3>
                        <p className="text-sm font-medium text-blue-700">
                          Frontend Volunteer
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        Rs.3,000
                      </div>
                      <div className="text-xs text-slate-500">per month</div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                      React
                    </span>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                      TypeScript
                    </span>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                      UI/UX
                    </span>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-green-100/50 to-teal-100/30 p-5 transition-all hover:scale-[1.02] hover:shadow-lg">
                <div className="absolute -right-6 -top-6 size-20 rounded-full bg-green-200/30"></div>
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          Jayath Indunil
                        </h3>
                        <p className="text-sm font-medium text-green-700">
                          Backend Volunteer
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        Rs.2,500
                      </div>
                      <div className="text-xs text-slate-500">per month</div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                      Python
                    </span>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                      FastAPI
                    </span>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                      PostgreSQL
                    </span>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-violet-100/50 to-indigo-100/30 p-5 transition-all hover:scale-[1.02] hover:shadow-lg">
                <div className="absolute -right-6 -top-6 size-20 rounded-full bg-purple-200/30"></div>
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          Malindu Pathum
                        </h3>
                        <p className="text-sm font-medium text-purple-700">
                          Full-Stack Volunteer
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">
                        Rs.12,000
                      </div>
                      <div className="text-xs text-slate-500">
                        total sponsored
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
                      React
                    </span>
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
                      Node.js
                    </span>
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
                      MongoDB
                    </span>
                  </div>
                </div>
              </div>
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
                        : activity.type === 'volunteer'
                          ? 'bg-blue-500'
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

        {/* Volunteer Sponsorship Actions */}
        <div className="rounded-xl border border-slate-200/60 bg-gradient-to-r from-green-50 to-blue-50 p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <button className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md">
              <Users className="size-6 text-blue-600" />
              <div className="text-left">
                <div className="font-medium text-slate-900">
                  Browse Volunteers
                </div>
                <div className="text-sm text-slate-600">
                  Find volunteers to sponsor
                </div>
              </div>
            </button>
            <button className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md">
              <DollarSign className="size-6 text-green-600" />
              <div className="text-left">
                <div className="font-medium text-slate-900">
                  Platform Donation
                </div>
                <div className="text-sm text-slate-600">
                  Support platform operations
                </div>
              </div>
            </button>
            <a
              href="/sponsor/donations-sponsorships"
              className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md"
            >
              <Heart className="size-6 text-red-600" />
              <div className="text-left">
                <div className="font-medium text-slate-900">My Donations</div>
                <div className="text-sm text-slate-600">
                  View donation history
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default SponsorDashboardRoute;
