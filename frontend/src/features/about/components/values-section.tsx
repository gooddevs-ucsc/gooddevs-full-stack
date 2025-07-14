import { Heart, Shield, Target, Users } from 'lucide-react';
import { FC } from 'react';

const values = [
  {
    icon: Users,
    title: 'Team-First Approach',
    description:
      'We believe great projects come from balanced teams with diverse, specialized skills working together.',
  },
  {
    icon: Target,
    title: 'Skill Specialization',
    description:
      'Matching the right expertise to project needs ensures higher quality outcomes and better learning experiences.',
  },
  {
    icon: Heart,
    title: 'Inclusive Participation',
    description:
      'Our platform welcomes requesters, developers, sponsors, and supporters - everyone has a role in tech for good.',
  },
  {
    icon: Shield,
    title: 'Transparent Impact',
    description:
      'From project progress to donation tracking, we provide clear visibility into how contributions create change.',
  },
];

export const ValuesSection: FC = () => {
  return (
    <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 text-center">
          <h2 className="mb-6 text-3xl font-bold text-slate-900 sm:text-4xl">
            Our Core Values
          </h2>
          <p className="mx-auto max-w-3xl text-xl leading-8 text-slate-600">
            These principles guide every decision we make and every line of code
            we write.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {values.map((value, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 p-8 transition-all duration-300 hover:shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-primary/10 transition-all duration-300 group-hover:scale-110">
                    <value.icon className="size-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 transition-colors group-hover:text-primary">
                    {value.title}
                  </h3>
                </div>
                <p className="leading-7 text-slate-600">{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
