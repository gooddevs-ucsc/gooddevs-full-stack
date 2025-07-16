import { CheckCircle, Eye, Rocket, Target } from 'lucide-react';
import { FC } from 'react';

const missionItems = [
  'Form balanced teams with specialized roles (frontend, backend, project managers, designers)',
  'Enable skill-based matching between projects and developer expertise areas',
  'Provide sponsors with transparent ways to support projects and developers',
  'Facilitate comprehensive project collaboration through advanced workspace tools',
];

export const VisionMissionSection: FC = () => {
  return (
    <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Vision */}
          <div className="group">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-primary/10 transition-all duration-500 group-hover:rotate-3 group-hover:scale-110">
                <Eye className="size-8 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                  Our Vision
                </h2>
                <div className="mt-2 h-1 w-20 rounded-full bg-gradient-to-r from-primary to-accent"></div>
              </div>
            </div>
            <p className="mb-6 text-lg leading-8 text-slate-600">
              A world where every individual, community group, and nonprofit
              organization has access to the technical support they need,
              regardless of their funding limitations.
            </p>
            <p className="text-lg leading-8 text-slate-600">
              We envision a centralized platform that bridges the gap between
              those who need technical help and volunteer developers willing to
              contribute their skills for meaningful causes.
            </p>
            <div className="mt-8 flex items-center gap-4 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 p-4">
              <Target className="size-8 shrink-0 text-primary" />
              <div className="text-sm text-slate-700">
                <strong>Our Goal:</strong> Bridge the gap between nonprofits
                needing tech support and developers seeking meaningful
                experience
              </div>
            </div>
          </div>

          {/* Mission */}
          <div className="group">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 ring-1 ring-accent/10 transition-all duration-500 group-hover:rotate-3 group-hover:scale-110">
                <Rocket className="size-8 text-accent" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                  Our Mission
                </h2>
                <div className="mt-2 h-1 w-20 rounded-full bg-gradient-to-r from-accent to-primary"></div>
              </div>
            </div>
            <p className="mb-6 text-lg leading-8 text-slate-600">
              To create a comprehensive platform that connects nonprofits with
              specialized development teams while enabling sponsors to support
              meaningful tech-for-good initiatives.
            </p>
            <div className="space-y-4">
              {missionItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="mt-1 size-5 shrink-0 text-primary" />
                  <span className="text-slate-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
