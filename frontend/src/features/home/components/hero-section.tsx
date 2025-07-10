import { FC } from 'react';

import { Button } from '@/components/ui/button';

export const HeroSection: FC = () => {
  return (
    <section className="relative bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      <div className="relative mx-auto max-w-4xl text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
          <div className="size-2 animate-pulse rounded-full bg-primary"></div>
          Live projects seeking volunteers
        </div>

        <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
          Connect with Projects That
          <span className="block text-primary">Make a Difference</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-600 sm:text-xl">
          Join skilled developers working on meaningful projects for nonprofits,
          open source initiatives, and community organizations.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <Button
            size="lg"
            className="w-full whitespace-nowrap bg-primary px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-primary/90 hover:shadow-xl sm:w-auto"
          >
            Browse Projects
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full whitespace-nowrap border-2 border-primary px-8 py-4 text-lg font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white sm:w-auto"
          >
            How It Works
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="text-center">
            <div className="mb-2 text-2xl font-bold text-primary">50+</div>
            <div className="text-sm text-slate-600">Active Projects</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-2xl font-bold text-primary">200+</div>
            <div className="text-sm text-slate-600">Developers</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-2xl font-bold text-primary">30+</div>
            <div className="text-sm text-slate-600">Organizations</div>
          </div>
        </div>
      </div>
    </section>
  );
};
