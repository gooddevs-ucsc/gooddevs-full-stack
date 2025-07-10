import { useQuery } from '@tanstack/react-query';
import { Clock, MapPin, Users, ArrowRight } from 'lucide-react';

import { Head } from '@/components/seo';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/ui/navbar/navbar';
import { api } from '@/lib/api-client';

interface Project {
  id: string;
  title: string;
  description: string;
  project_type: string;
  preferred_technologies: string | null;
  estimated_timeline: string | null;
  created_at: string;
  requester_id: string;
}

interface ProjectsResponse {
  data: Project[];
  count: number;
}

const fetchApprovedProjects = async (): Promise<ProjectsResponse> => {
  const response = await api.get('/api/v1/projects/approved');
  return response;
};

const ProjectCard = ({ project }: { project: Project }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getProjectTypeColor = (type: string) => {
    const colors = {
      WEBSITE: 'bg-blue-50 text-blue-800 border border-blue-200',
      MOBILE_APP: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
      DATABASE: 'bg-purple-50 text-purple-800 border border-purple-200',
      API: 'bg-amber-50 text-amber-800 border border-amber-200',
      DESKTOP_APP: 'bg-rose-50 text-rose-800 border border-rose-200',
      OTHER: 'bg-slate-50 text-slate-700 border border-slate-200',
    };
    return colors[type as keyof typeof colors] || colors.OTHER;
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/20 hover:ring-slate-200">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/30 to-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      <div className="relative p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="mb-2 text-xl font-semibold text-slate-900 transition-colors duration-200 group-hover:text-primary">
              {project.title}
            </h3>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getProjectTypeColor(project.project_type)}`}
            >
              {project.project_type.replace('_', ' ')}
            </span>
          </div>
        </div>

        <p
          className="mb-4 overflow-hidden leading-relaxed text-slate-600"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {project.description}
        </p>

        <div className="mb-6 space-y-3">
          {project.preferred_technologies && (
            <div className="flex items-center text-sm text-slate-500">
              <div className="mr-3 flex size-6 items-center justify-center rounded-full bg-blue-100">
                <Users className="size-3 text-blue-600" />
              </div>
              <span className="font-medium">Tech Stack:</span>
              <span className="ml-2 text-slate-700">
                {project.preferred_technologies}
              </span>
            </div>
          )}

          {project.estimated_timeline && (
            <div className="flex items-center text-sm text-slate-500">
              <div className="mr-3 flex size-6 items-center justify-center rounded-full bg-amber-100">
                <Clock className="size-3 text-amber-600" />
              </div>
              <span className="font-medium">Timeline:</span>
              <span className="ml-2 text-slate-700">
                {project.estimated_timeline}
              </span>
            </div>
          )}

          <div className="flex items-center text-sm text-slate-500">
            <div className="mr-3 flex size-6 items-center justify-center rounded-full bg-emerald-100">
              <MapPin className="size-3 text-emerald-600" />
            </div>
            <span className="font-medium">Posted:</span>
            <span className="ml-2 text-slate-700">
              {formatDate(project.created_at)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            className="border-primary text-primary shadow-sm transition-all duration-200 hover:bg-primary hover:text-white hover:shadow-lg group-hover:translate-x-1"
          >
            Learn More
            <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const LandingRoute = () => {
  const {
    data: projectsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['approved-projects'],
    queryFn: fetchApprovedProjects,
  });

  return (
    <>
      <Head description="Discover amazing projects looking for skilled developers" />
      <div className="min-h-screen bg-white">
        <Navbar />

        {/* Hero Section */}
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
              Join skilled developers working on meaningful projects for
              nonprofits, open source initiatives, and community organizations.
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

        {/* Projects Section */}
        <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
                Available Projects
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-600">
                {projectsData?.count || 0} projects currently seeking skilled
                volunteers
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="mb-4 h-4 w-3/4 rounded bg-slate-200"></div>
                    <div className="mb-4 h-3 w-1/2 rounded bg-slate-200"></div>
                    <div className="mb-4 h-20 rounded bg-slate-200"></div>
                    <div className="mb-2 h-3 w-full rounded bg-slate-200"></div>
                    <div className="h-3 w-2/3 rounded bg-slate-200"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="py-16 text-center">
                <div className="mb-4 text-xl text-red-600">
                  Error loading projects
                </div>
                <p className="text-slate-600">Please try again later</p>
              </div>
            ) : projectsData?.data?.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mb-4 text-xl text-slate-500">
                  No projects available
                </div>
                <p className="text-slate-600">
                  Check back later for new opportunities
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projectsData?.data?.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* About Section */}
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
                We connect skilled developers with meaningful projects that make
                a difference. Whether you&apos;re looking to contribute to open
                source, help nonprofits, or work on innovative solutions, we
                have opportunities for you.
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
                  Find projects that match your skills and interests with our
                  smart matching system
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
                <h3 className="mb-3 text-xl font-semibold text-slate-900">
                  Grow
                </h3>
                <p className="leading-7 text-slate-600">
                  Build your portfolio, expand your network, and develop new
                  skills while helping others
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-primary px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <div className="mb-6">
                <span className="bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-3xl font-bold text-transparent">
                  GoodDevs
                </span>
              </div>
              <p className="mb-8 text-lg text-slate-200">
                Connecting developers with meaningful projects that make a
                difference
              </p>
              <div className="mb-8 flex flex-wrap justify-center gap-8">
                <a
                  href="#"
                  className="text-slate-200 transition-colors hover:text-accent"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-slate-200 transition-colors hover:text-accent"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-slate-200 transition-colors hover:text-accent"
                >
                  Contact Us
                </a>
              </div>
              <div className="text-sm text-slate-300">
                © 2025 GoodDevs. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingRoute;
