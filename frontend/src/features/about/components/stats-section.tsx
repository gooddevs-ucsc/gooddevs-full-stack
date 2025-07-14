import { Building, CheckCircle, Heart, Users } from 'lucide-react';
import { FC } from 'react';

const stats = [
  { label: 'Volunteer Developers', value: '200+', icon: Users },
  { label: 'Projects Completed', value: '50+', icon: CheckCircle },
  { label: 'Organizations Helped', value: '30+', icon: Building },
  { label: 'Active Sponsors', value: '15+', icon: Heart },
];

export const StatsSection: FC = () => {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-primary/10">
                <stat.icon className="size-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-slate-900">
                {stat.value}
              </div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
