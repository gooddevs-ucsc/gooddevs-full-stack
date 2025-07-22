import {
  ArrowLeft,
  Clock,
  Users,
  Calendar,
  Tag,
  ChevronRight,
  Heart,
  Share2,
  MessageCircle,
  FileText,
  CheckCircle,
} from 'lucide-react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useProject } from '@/features/projects/api/get-project';
import { PROJECT_TYPE_STYLES } from '@/lib/constants/ui';
import { ProjectType } from '@/types/api';
import { formatDate, formatEstimatedTimeline } from '@/utils/format';

import { ProjectDescriptionTab } from './project-description-tab';
import { ProjectThread } from './project-thread';

const getProjectTypeColor = (type: ProjectType) => {
  return PROJECT_TYPE_STYLES[type] || PROJECT_TYPE_STYLES.OTHER;
};

export const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('description');

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

      {/* Project Content with Tabs */}
      <div className="w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-3">
            <TabsTrigger
              value="description"
              className="flex items-center gap-2"
            >
              <FileText className="size-4" />
              Description
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckCircle className="size-4" />
              Tasks & Requirements
            </TabsTrigger>
            <TabsTrigger value="discussion" className="flex items-center gap-2">
              <MessageCircle className="size-4" />
              Discussion
            </TabsTrigger>
          </TabsList>

          {/* Description Tab */}
          <TabsContent value="description" className="space-y-8">
            <ProjectDescriptionTab project={project} />
          </TabsContent>

          {/* Tasks & Requirements Tab */}
          <TabsContent value="tasks" className="space-y-8">
            {/* Project Information */}
            <div className="rounded-xl border border-slate-200/60 bg-white p-8 shadow-sm">
              <h2 className="mb-6 text-2xl font-semibold text-slate-900">
                Project Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mr-3 flex size-8 items-center justify-center rounded-full bg-blue-100">
                    <Users className="size-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Team Size</p>
                    <p className="text-sm text-slate-600">
                      Looking for 2-4 developers
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-3 flex size-8 items-center justify-center rounded-full bg-green-100">
                    <Clock className="size-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Duration</p>
                    <p className="text-sm text-slate-600">
                      {project.estimated_timeline
                        ? formatEstimatedTimeline(project.estimated_timeline)
                        : 'TBD'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-3 flex size-8 items-center justify-center rounded-full bg-purple-100">
                    <Tag className="size-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Status</p>
                    <p className="text-sm text-slate-600">
                      {project.status.charAt(0).toUpperCase() +
                        project.status.slice(1).toLowerCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements & Skills */}
            <div className="rounded-xl border border-slate-200/60 bg-white p-8 shadow-sm">
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
                {project.preferred_technologies && (
                  <div className="mt-6">
                    <h3 className="mb-2 font-medium text-slate-900">
                      Tech Stack
                    </h3>
                    <p className="text-slate-700">
                      {project.preferred_technologies}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Task Breakdown */}
            <div className="rounded-xl border border-slate-200/60 bg-white p-8 shadow-sm">
              <h2 className="mb-6 text-2xl font-semibold text-slate-900">
                Proposed Task Breakdown
              </h2>
              <div className="space-y-6">
                {/* Phase 1 */}
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="mb-3 text-lg font-semibold text-slate-900">
                    Phase 1: Planning & Setup
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="size-2 rounded-full bg-blue-500"></div>
                      <span className="text-slate-700">
                        Project architecture planning
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="size-2 rounded-full bg-blue-500"></div>
                      <span className="text-slate-700">
                        Development environment setup
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="size-2 rounded-full bg-blue-500"></div>
                      <span className="text-slate-700">
                        Team communication channels
                      </span>
                    </div>
                  </div>
                </div>

                {/* Phase 2 */}
                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="mb-3 text-lg font-semibold text-slate-900">
                    Phase 2: Core Development
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="size-2 rounded-full bg-green-500"></div>
                      <span className="text-slate-700">
                        Backend API development
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="size-2 rounded-full bg-green-500"></div>
                      <span className="text-slate-700">
                        Frontend user interface
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="size-2 rounded-full bg-green-500"></div>
                      <span className="text-slate-700">
                        Database design & implementation
                      </span>
                    </div>
                  </div>
                </div>

                {/* Phase 3 */}
                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="mb-3 text-lg font-semibold text-slate-900">
                    Phase 3: Testing & Deployment
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="size-2 rounded-full bg-purple-500"></div>
                      <span className="text-slate-700">
                        Unit and integration testing
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="size-2 rounded-full bg-purple-500"></div>
                      <span className="text-slate-700">
                        User acceptance testing
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="size-2 rounded-full bg-purple-500"></div>
                      <span className="text-slate-700">
                        Production deployment
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Discussion Tab */}
          <TabsContent value="discussion" className="mt-6">
            <ProjectThread projectId={id!} />
          </TabsContent>
        </Tabs>
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
