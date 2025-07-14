import { Sparkles } from 'lucide-react';
import { FC } from 'react';

export const HeroSection: FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-white to-accent/5 px-4 py-24 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 size-80 animate-pulse rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 size-80 animate-pulse rounded-full bg-accent/5 blur-3xl delay-1000"></div>
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          <Sparkles className="size-4" />
          Connecting Purpose with Technology
        </div>
        <h1 className="mb-8 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
          Where{' '}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Good Developers
          </span>
          <br />
          Meet Good Causes
        </h1>
        <p className="mx-auto max-w-3xl text-xl leading-8 text-slate-600">
          A web-based platform that connects individuals and nonprofit
          organizations in need of technical solutions with volunteer developers
          who are willing to offer their skills for free, promoting social good
          through technology.
        </p>
      </div>
    </section>
  );
};
