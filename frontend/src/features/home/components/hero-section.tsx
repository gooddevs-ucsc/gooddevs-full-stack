import { ArrowRight, Code, Heart, BookOpen } from 'lucide-react';
import { FC } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';

export const HeroSection: FC = () => {
  const navigate = useNavigate();

  const featuredProjects = [
    {
      icon: Heart,
      title: 'NGO Donation Portal',
      description:
        'Build a secure and transparent platform for a local nonprofit to manage donations.',
      tags: ['React', 'Node.js', 'Stripe'],
    },
    {
      icon: BookOpen,
      title: 'Open Source Library',
      description:
        'Contribute to an open-source library for data visualization and analysis.',
      tags: ['TypeScript', 'D3.js', 'Python'],
    },
    {
      icon: Code,
      title: 'Community Health App',
      description:
        'Develop a mobile app to connect community members with local health resources.',
      tags: ['React Native', 'FastAPI', 'PostgreSQL'],
    },
  ];

  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/img/hero-background.webp')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/70 to-slate-50/90 backdrop-blur-sm" />
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
            <div className="size-2 animate-pulse rounded-full bg-primary"></div>
            Live projects seeking volunteers
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Connect with Projects That
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Make a Difference
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-600 sm:text-xl">
            Join skilled developers working on meaningful projects for
            nonprofits, open source initiatives, and community organizations.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <Button
              size="lg"
              className="w-full whitespace-nowrap bg-primary px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-primary/90 hover:shadow-xl sm:w-auto"
              onClick={() => navigate('/projects')}
            >
              Browse Projects
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full whitespace-nowrap border-2 border-primary bg-white/50 px-8 py-4 text-lg font-semibold text-primary backdrop-blur-sm transition-all duration-200 hover:bg-primary hover:text-white sm:w-auto"
              onClick={() => navigate('/about-us')}
            >
              How It Works
            </Button>
          </div>
        </div>

        {/* Featured Projects Section (makes it longer) */}
        <div className="mt-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-800">
              Featured Opportunities
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-slate-600">
              Get a glimpse of the impactful projects you can join today.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <div
                key={index}
                className="group rounded-2xl border border-slate-200/50 bg-white/60 p-6 shadow-lg backdrop-blur-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <project.icon className="size-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900">
                  {project.title}
                </h3>
                <p className="mb-4 text-slate-600">{project.description}</p>
                <div className="mb-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/projects')}
                  className="font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100"
                >
                  View Project <ArrowRight className="ml-1 inline size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
