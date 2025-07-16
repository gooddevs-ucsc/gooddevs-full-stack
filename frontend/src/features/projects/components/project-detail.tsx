import {
  ArrowLeft,
  Clock,
  MapPin,
  Users,
  Calendar,
  Tag,
  ChevronRight,
  Heart,
  Share2,
  Eye,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useProject } from '@/features/projects/api/get-project';
import { formatDate, formatEstimatedTimeline } from '@/utils/format';

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

export const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const projectQuery = useProject({ projectId: id! });

  if (projectQuery.isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-slate-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (projectQuery.isError) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600">Project Not Found</h1>
          <p className="mt-4 text-slate-600">
            The project you&apos;re looking for doesn&apos;t exist or isn&apos;t
            available.
          </p>
          <Button
            onClick={() => navigate('/projects')}
            className="mt-4"
            variant="outline"
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const project = projectQuery.data?.data;

  if (!project) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600">Project Not Found</h1>
          <p className="mt-4 text-slate-600">
            The project you&apos;re looking for doesn&apos;t exist or isn&apos;t
            available.
          </p>
          <Button
            onClick={() => navigate('/projects')}
            className="mt-4"
            variant="outline"
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Back Button */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/projects')}
          className="-ml-2 mb-4 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to Projects
        </Button>
      </div>

      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center space-x-2 text-sm text-slate-600">
        <button
          onClick={() => navigate('/projects')}
          className="hover:text-primary"
        >
          Projects
        </button>
        <ChevronRight className="size-4" />
        <span className="text-slate-900">{project.title}</span>
      </nav>

      {/* Project Header */}
      <div className="mb-12">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex-1">
            <h1 className="mb-4 text-4xl font-bold text-slate-900">
              {project.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <span
                className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ${getProjectTypeColor(project.project_type)}`}
              >
                <Tag className="mr-2 size-4" />
                {project.project_type.replace('_', ' ')}
              </span>
              <div className="flex items-center text-sm text-slate-600">
                <Calendar className="mr-2 size-4" />
                Posted {formatDate(new Date(project.created_at).getTime())}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Heart className="mr-2 size-4" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 size-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Project Content */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-slate-200/60 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold text-slate-900">
              Project Description
            </h2>
            <div className="prose prose-slate max-w-none">
              <p className="leading-relaxed text-slate-700">
                {project.description}
              </p>
            </div>
          </div>

          {/* Additional Project Information */}
          <div className="mt-8 rounded-xl border border-slate-200/60 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold text-slate-900">
              What You&apos;ll Work On
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-3 mt-1 size-2 rounded-full bg-primary"></div>
                <p className="text-slate-700">
                  Collaborate with a team of passionate developers
                </p>
              </div>
              <div className="flex items-start">
                <div className="mr-3 mt-1 size-2 rounded-full bg-primary"></div>
                <p className="text-slate-700">
                  Build meaningful solutions that make a real impact
                </p>
              </div>
              <div className="flex items-start">
                <div className="mr-3 mt-1 size-2 rounded-full bg-primary"></div>
                <p className="text-slate-700">
                  Gain experience with modern technologies and best practices
                </p>
              </div>
              <div className="flex items-start">
                <div className="mr-3 mt-1 size-2 rounded-full bg-primary"></div>
                <p className="text-slate-700">
                  Contribute to open-source projects and build your portfolio
                </p>
              </div>
            </div>
          </div>

          {/* Project Requirements */}
          <div className="mt-8 rounded-xl border border-slate-200/60 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold text-slate-900">
              Requirements & Skills
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-3 mt-1 size-2 rounded-full bg-green-500"></div>
                <p className="text-slate-700">
                  Strong understanding of web development fundamentals
                </p>
              </div>
              <div className="flex items-start">
                <div className="mr-3 mt-1 size-2 rounded-full bg-green-500"></div>
                <p className="text-slate-700">
                  Experience with modern JavaScript frameworks
                </p>
              </div>
              <div className="flex items-start">
                <div className="mr-3 mt-1 size-2 rounded-full bg-green-500"></div>
                <p className="text-slate-700">
                  Passion for learning and contributing to open source
                </p>
              </div>
              <div className="flex items-start">
                <div className="mr-3 mt-1 size-2 rounded-full bg-amber-500"></div>
                <p className="text-slate-700">
                  Version control experience (Git) - preferred
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Details */}
          <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-semibold text-slate-900">
              Project Details
            </h3>
            <div className="space-y-4">
              {project.preferred_technologies && (
                <div className="flex items-start">
                  <div className="mr-3 flex size-8 items-center justify-center rounded-full bg-blue-100">
                    <Users className="size-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Tech Stack</p>
                    <p className="text-sm text-slate-600">
                      {project.preferred_technologies}
                    </p>
                  </div>
                </div>
              )}

              {project.estimated_timeline && (
                <div className="flex items-start">
                  <div className="mr-3 flex size-8 items-center justify-center rounded-full bg-amber-100">
                    <Clock className="size-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Timeline</p>
                    <p className="text-sm text-slate-600">
                      {formatEstimatedTimeline(project.estimated_timeline)}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start">
                <div className="mr-3 flex size-8 items-center justify-center rounded-full bg-emerald-100">
                  <MapPin className="size-4 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Status</p>
                  <p className="text-sm text-slate-600">
                    {project.status.charAt(0).toUpperCase() +
                      project.status.slice(1).toLowerCase()}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-3 flex size-8 items-center justify-center rounded-full bg-purple-100">
                  <Eye className="size-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Last Updated</p>
                  <p className="text-sm text-slate-600">
                    {formatDate(new Date(project.updated_at).getTime())}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-semibold text-slate-900">
              Get Involved
            </h3>
            <p className="mb-4 text-sm text-slate-600">
              Ready to make a difference? Join this project and help create
              something meaningful.
            </p>
            <Button className="w-full">Express Interest</Button>
            <Button
              variant="outline"
              className="mt-2 w-full"
              onClick={() => navigate('/projects')}
            >
              <ArrowLeft className="mr-2 size-4" />
              Back to Projects
            </Button>
          </div>

          {/* Project Analytics */}
          <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-semibold text-slate-900">
              Project Analytics
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Total Views</span>
                <span className="font-medium text-slate-900">
                  {Math.floor(Math.random() * 500) + 50}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  Developers Interested
                </span>
                <span className="font-medium text-slate-900">
                  {Math.floor(Math.random() * 20) + 3}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Project Saves</span>
                <span className="font-medium text-slate-900">
                  {Math.floor(Math.random() * 30) + 8}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Completion Rate</span>
                <span className="font-medium text-green-600">
                  {Math.floor(Math.random() * 30) + 70}%
                </span>
              </div>
            </div>
          </div>

          {/* Project Activity */}
          <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-semibold text-slate-900">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="size-2 rounded-full bg-green-500"></div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700">
                    Project approved for development
                  </p>
                  <p className="text-xs text-slate-500">2 days ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="size-2 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700">Requirements updated</p>
                  <p className="text-xs text-slate-500">5 days ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="size-2 rounded-full bg-purple-500"></div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700">Project created</p>
                  <p className="text-xs text-slate-500">1 week ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <Button
          size="lg"
          className="rounded-full shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
        >
          <Heart className="mr-2 size-5" />
          Express Interest
        </Button>
      </div>
    </>
  );
};
