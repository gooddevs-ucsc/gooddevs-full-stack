import { Users, Clock, MapPin } from 'lucide-react';
import { FC } from 'react';

export const AboutSection: FC = () => {
  return (
    <section
      id="about"
      className="bg-gradient-to-br from-slate-50 to-white px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 text-center">
          <h2 className="mb-6 text-3xl font-bold text-slate-900 sm:text-4xl">
            About GoodDevs
          </h2>
          <p className="mx-auto max-w-3xl text-xl leading-8 text-slate-600">
            We connect skilled developers with meaningful projects that make a
            difference. Whether you&apos;re looking to contribute to open
            source, help nonprofits, or work on innovative solutions, we have
            opportunities for you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="group text-center">
            <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:from-primary/15 group-hover:to-primary/10">
              <Users className="size-10 text-primary" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-slate-900">
              Connect
            </h3>
            <p className="leading-7 text-slate-600">
              Find projects that match your skills and interests with our smart
              matching system
            </p>
          </div>

          <div className="group text-center">
            <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 ring-1 ring-accent/10 transition-all duration-300 group-hover:scale-110 group-hover:from-accent/15 group-hover:to-accent/10">
              <Clock className="size-10 text-accent" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-slate-900">
              Contribute
            </h3>
            <p className="leading-7 text-slate-600">
              Work on projects that make a real impact in communities and
              organizations worldwide
            </p>
          </div>

          <div className="group text-center">
            <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:from-primary/15 group-hover:to-primary/10">
              <MapPin className="size-10 text-primary" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-slate-900">Grow</h3>
            <p className="leading-7 text-slate-600">
              Build your portfolio, expand your network, and develop new skills
              while helping others
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
