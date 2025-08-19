import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  ChevronRight,
  FileText,
  Heart,
  MessageCircle,
  Share2,
  Tag,
} from 'lucide-react';
import { useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProject } from '@/features/projects/api/get-project';
import { TasksTab } from '@/features/tasks/components/tasks-tab';
import { PROJECT_TYPE_STYLES } from '@/lib/constants/ui';
import { ProjectType } from '@/types/api';
import { formatDate } from '@/utils/format';

import { ProjectDescriptionTab } from './project-description-tab';
import { ProjectThreadList } from './project-thread-list';

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
            <TasksTab projectId={id!} />
          </TabsContent>

          {/* Discussion Tab */}
          <TabsContent value="discussion" className="mt-6">
            <ProjectThreadList projectId={id!} />
            <Outlet />
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
