import { Globe, Heart, Lightbulb, Shield, Users } from 'lucide-react';
import { FC } from 'react';

const storyMilestones = [
  {
    year: 'Phase 1',
    title: 'Platform Foundation',
    description:
      'Building the core platform with user registration, project submission, and basic matching features.',
    icon: Lightbulb,
    detail:
      'Establishing secure user authentication for requesters, developers, and admins with fundamental project management tools.',
  },
  {
    year: 'Phase 2',
    title: 'Enhanced Features',
    description:
      'Adding advanced project collaboration tools, status tracking, and communication features.',
    icon: Users,
    detail:
      'Implementing comprehensive project management with real-time updates and developer-requester communication channels.',
  },
  {
    year: 'Phase 3',
    title: 'Quality & Trust',
    description:
      'Introducing feedback systems, performance reviews, and enhanced admin moderation tools.',
    icon: Shield,
    detail:
      'Building trust through transparent rating systems and comprehensive quality assurance processes.',
  },
  {
    year: 'Phase 4',
    title: 'Community Growth',
    description:
      'Expanding platform reach and introducing donation/sponsorship features for sustainability.',
    icon: Heart,
    detail:
      'Growing our community of volunteer developers and supporting organizations while ensuring platform longevity.',
  },
  {
    year: 'Future',
    title: 'Global Impact',
    description:
      'Scaling to serve tech-for-good projects worldwide with advanced matching algorithms.',
    icon: Globe,
    detail:
      'Creating a global network where technology expertise flows freely to those who need it most.',
  },
];

export const RoadmapSection: FC = () => {
  return (
    <section className="bg-gradient-to-br from-slate-50 to-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 text-center">
          <h2 className="mb-6 text-3xl font-bold text-slate-900 sm:text-4xl">
            Development Roadmap
          </h2>
          <p className="mx-auto max-w-3xl text-xl leading-8 text-slate-600">
            Many individuals, community groups, and nonprofits need technical
            support but lack funding to hire professional developers. Meanwhile,
            many developers seek opportunities to gain experience and contribute
            to meaningful causes. GoodDevs bridges this gap.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 z-0 h-full w-0.5 bg-gradient-to-b from-primary via-accent to-primary md:left-1/2 md:-translate-x-0.5"></div>

          <div className="space-y-16">
            {storyMilestones.map((milestone, index) => (
              <div
                key={index}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-8 z-0 flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-lg md:left-1/2 md:-translate-x-8">
                  <milestone.icon className="size-8" />
                </div>

                {/* Content */}
                <div
                  className={`ml-24 w-full md:ml-0 md:w-5/12 ${
                    index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'
                  }`}
                >
                  <div className="group rounded-2xl bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="text-2xl font-bold text-primary">
                        {milestone.year}
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent"></div>
                    </div>
                    <h3 className="mb-4 text-xl font-semibold text-slate-900 transition-colors group-hover:text-primary">
                      {milestone.title}
                    </h3>
                    <p className="mb-4 leading-relaxed text-slate-600">
                      {milestone.description}
                    </p>
                    <p className="border-l-4 border-primary/20 pl-4 text-sm italic text-slate-500">
                      {milestone.detail}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
