import { AlertCircle } from 'lucide-react';
import { useSearchParams } from 'react-router';

import { Spinner } from '@/components/ui/spinner';
import { Table, type TableColumn } from '@/components/ui/table';
import { PROJECT_TYPE_STYLES } from '@/lib/constants/ui';
import { Project, ProjectType } from '@/types/api';
import { formatDate, formatEstimatedTimeline } from '@/utils/format';

import { usePendingProjects } from '../api/get-pending-projects';

import { ProjectActionButtons } from './project-action-buttons';

const getProjectTypeColor = (type: ProjectType) => {
  return PROJECT_TYPE_STYLES[type] || PROJECT_TYPE_STYLES.OTHER;
};

export const ProjectApprovalsList = () => {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const limit = Number(searchParams.get('limit') || 10);

  const { data, isLoading, error } = usePendingProjects({
    page,
    limit,
  });

  if (isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex items-center gap-2 text-red-800">
          <AlertCircle className="size-5" />
          <span className="font-medium">Error loading pending projects</span>
        </div>
        <p className="mt-1 text-sm text-red-700">
          Please try refreshing the page. If the problem persists, contact
          support.
        </p>
      </div>
    );
  }

  const projects = data?.data || [];
  const meta = data?.meta;

  if (projects.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
        <AlertCircle className="mx-auto mb-4 size-12 text-slate-400" />
        <h3 className="mb-2 text-lg font-medium text-slate-900">
          No pending projects
        </h3>
        <p className="text-slate-600">
          All projects have been reviewed. Check back later for new submissions.
        </p>
      </div>
    );
  }

  const columns: TableColumn<Project>[] = [
    {
      title: 'Project',
      field: 'title',
      Cell: ({ entry: project }: { entry: Project }) => (
        <div className="min-w-0">
          <div className="truncate font-medium text-slate-900">
            {project.title && project.title.length > 40
              ? `${project.title.substring(0, 40)}...`
              : project.title}
          </div>
          <div className="truncate text-sm text-slate-500">
            {project.description && project.description.length > 60
              ? `${project.description.substring(0, 60)}...`
              : project.description}
          </div>
        </div>
      ),
    },
    {
      title: 'Type',
      field: 'project_type',
      Cell: ({ entry: project }: { entry: Project }) => (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getProjectTypeColor(project.project_type)}`}
        >
          {project.project_type.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      title: 'Technologies',
      field: 'preferred_technologies',
      Cell: ({ entry: project }: { entry: Project }) => (
        <div className="max-w-xs truncate text-sm text-slate-600">
          {project.preferred_technologies &&
          project.preferred_technologies.length > 15
            ? `${project.preferred_technologies.substring(0, 15)}...`
            : project.preferred_technologies || '-'}
        </div>
      ),
    },
    {
      title: 'Timeline',
      field: 'estimated_timeline',
      Cell: ({ entry: project }: { entry: Project }) => (
        <div className="text-sm text-slate-600">
          {project.estimated_timeline
            ? formatEstimatedTimeline(project.estimated_timeline)
            : '-'}
        </div>
      ),
    },
    {
      title: 'Created',
      field: 'created_at',
      Cell: ({ entry: project }: { entry: Project }) => (
        <div className="text-sm text-slate-600">
          {formatDate(project.created_at)}
        </div>
      ),
    },
    {
      title: 'Status',
      field: 'status',
      Cell: () => (
        <span className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2 py-1 text-xs font-medium text-orange-800">
          <AlertCircle className="size-3" />
          Pending
        </span>
      ),
    },
    {
      title: 'Actions',
      field: 'id',
      Cell: ({ entry: project }: { entry: Project }) => {
        return (
          <ProjectActionButtons
            projectId={project.id}
            projectTitle={project.title}
          />
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <Table
        data={projects}
        columns={columns}
        pagination={
          meta && meta.totalPages > 1
            ? {
                totalPages: meta.totalPages,
                currentPage: meta.page,
                rootUrl: '',
                limit,
              }
            : undefined
        }
      />
    </div>
  );
};
