import { BarChart3, CheckCircle, MessageSquare, Users } from 'lucide-react';

import { VolunteerStats } from '../api/get-volunteer-stats';

interface StatsCardProps {
  stats: VolunteerStats;
  isOwner: boolean;
}

export const StatsCard = ({ stats, isOwner }: StatsCardProps) => {
  const statItems = [
    {
      label: 'Projects Contributed',
      value: stats.total_projects_contributed,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Tasks Assigned',
      value: stats.total_tasks_assigned,
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      label: 'Tasks Completed',
      value: stats.total_tasks_completed,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Discussions Started',
      value: stats.total_threads_created,
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Comments Made',
      value: stats.total_comments_made,
      icon: MessageSquare,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
    {
      label: 'Replies Made',
      value: stats.total_replies_made,
      icon: MessageSquare,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
    },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          {isOwner ? 'Your Statistics' : 'Volunteer Statistics'}
        </h2>
        <span className="text-xs text-slate-500">Live data</span>
      </div>

      <div className="space-y-4">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${item.bgColor}`}>
                  <Icon className={`size-4 ${item.color}`} />
                </div>
                <span className="text-sm text-slate-600">{item.label}</span>
              </div>
              <span className="font-semibold text-slate-900">{item.value}</span>
            </div>
          );
        })}
      </div>

      {/* Additional info */}
      <div className="mt-6 border-t border-slate-200 pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Member since</span>
          <span className="font-medium text-slate-900">
            {stats.member_since}
          </span>
        </div>
      </div>
    </div>
  );
};
