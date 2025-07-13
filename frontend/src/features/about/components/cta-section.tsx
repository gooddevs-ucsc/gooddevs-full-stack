import { Clock, Heart, MapPin, Sparkles } from 'lucide-react';
import { FC } from 'react';

import { Button } from '@/components/ui/button';

export const CtaSection: FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-accent px-4 py-24 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 size-48 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute -bottom-24 -left-24 size-48 rounded-full bg-white/10 blur-2xl"></div>
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white">
          <Sparkles className="size-4" />
          Join the Movement
        </div>
        <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
          Ready to Code for Good?
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-white/90">
          Whether you&apos;re a requester needing technical solutions, a
          developer with specialized skills, or a sponsor wanting to support
          meaningful projects, we&apos;re here to connect you.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <Button
            size="lg"
            className="w-full whitespace-nowrap bg-white px-8 py-4 text-lg font-semibold text-primary shadow-lg transition-all duration-200 hover:scale-105 hover:bg-gray-50 hover:shadow-xl sm:w-auto"
          >
            Join a Team
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full whitespace-nowrap border-2 border-white bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all duration-200 hover:bg-white hover:text-primary sm:w-auto"
          >
            Become a Sponsor
          </Button>
        </div>

        {/* Contact info */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
          <div className="flex items-center gap-2">
            <MapPin className="size-4" />
            <span className="text-sm">Global Remote Team</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4" />
            <span className="text-sm">24/7 Support</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="size-4" />
            <span className="text-sm">Impact Focused</span>
          </div>
        </div>
      </div>
    </section>
  );
};
