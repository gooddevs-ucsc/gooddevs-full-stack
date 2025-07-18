import { Clock, MapPin, Users, Eye, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { formatDate, formatEstimatedTimeline } from '@/utils/format';

interface ProjectDescriptionTabProps {
  project: any; // Replace with proper type
}

export const ProjectDescriptionTab = ({
  project,
}: ProjectDescriptionTabProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
      {/* Main Content */}
      <div className="space-y-8 lg:col-span-2">
        {/* Project Description */}
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

        {/* What You'll Work On */}
        <div className="rounded-xl border border-slate-200/60 bg-white p-8 shadow-sm">
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

        {/* Project Goals & Impact */}
        <div className="rounded-xl border border-slate-200/60 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold text-slate-900">
            Project Goals & Impact
          </h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="mr-3 mt-1 size-2 rounded-full bg-green-500"></div>
              <p className="text-slate-700">
                Create a solution that addresses real community needs
              </p>
            </div>
            <div className="flex items-start">
              <div className="mr-3 mt-1 size-2 rounded-full bg-blue-500"></div>
              <p className="text-slate-700">
                Provide learning opportunities for volunteer developers
              </p>
            </div>
            <div className="flex items-start">
              <div className="mr-3 mt-1 size-2 rounded-full bg-purple-500"></div>
              <p className="text-slate-700">
                Build sustainable, maintainable code for long-term use
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
  );
};
