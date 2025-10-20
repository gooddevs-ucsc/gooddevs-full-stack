import {
  Briefcase,
  CheckCircle,
  Code,
  Heart,
  Shield,
  Users,
} from 'lucide-react';
import { FC } from 'react';

const services = [
  {
    icon: Code,
    title: 'Team-Based Development',
    description:
      'Projects are assigned to balanced teams with specialized roles rather than individual developers.',
    benefits: [
      'Project managers',
      'Frontend & backend developers',
      'UI/UX designers',
      'QA engineers',
    ],
  },
  {
    icon: Users,
    title: 'Skill-Based Matching',
    description:
      'Advanced matching system that forms teams based on developer specializations and project requirements.',
    benefits: [
      'Role specification',
      'Experience-based matching',
      'Complementary skill sets',
      'Team collaboration tools',
    ],
  },
  {
    icon: Heart,
    title: 'Sponsor Integration',
    description:
      'Dedicated sponsor role for individuals and organizations who want to financially support projects.',
    benefits: ['Developer support', 'Impact tracking', 'Tax documentation'],
  },
  {
    icon: Shield,
    title: 'Enhanced Collaboration',
    description:
      'Comprehensive project management with GitHub-style discussions, file sharing, and progress tracking.',
    benefits: [
      'Team workspaces',
      'Discussion threads',
      'Task management',
      'Real-time progress updates',
    ],
  },
];

export const ServicesSection: FC = () => {
  return (
    <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Briefcase className="size-4" />
            Platform Features
          </div>
          <h2 className="mb-6 text-3xl font-bold text-slate-900 sm:text-4xl">
            How Our Platform Works
          </h2>
          <p className="mx-auto max-w-3xl text-xl leading-8 text-slate-600">
            From team formation to project completion, our platform provides
            comprehensive tools for requesters, developers, sponsors, and admins
            to collaborate effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-primary/10 transition-all duration-300 group-hover:rotate-3 group-hover:scale-110">
                    <service.icon className="size-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 transition-colors group-hover:text-primary">
                      {service.title}
                    </h3>
                    <div className="mt-1 h-0.5 w-16 scale-x-0 rounded-full bg-gradient-to-r from-primary to-accent transition-transform duration-300 group-hover:scale-x-100"></div>
                  </div>
                </div>
                <p className="mb-6 leading-relaxed text-slate-600">
                  {service.description}
                </p>
                <div className="space-y-2">
                  <div className="mb-3 text-sm font-medium text-slate-900">
                    Key Benefits:
                  </div>
                  {service.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center gap-3">
                      <CheckCircle className="size-4 shrink-0 text-primary" />
                      <span className="text-sm text-slate-600">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
