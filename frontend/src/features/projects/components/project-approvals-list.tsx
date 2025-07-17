import { useQueryClient } from '@tanstack/react-query';
import { Check, X, Clock, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'react-router';

import { Button } from '@/components/ui/button';
import { useNotifications } from '@/components/ui/notifications';
import { URLPagination } from '@/components/ui/pagination';
import { Spinner } from '@/components/ui/spinner';
import { Project } from '@/types/api';
import { formatDate, formatEstimatedTimeline } from '@/utils/format';

import { useApproveProject } from '../api/approve-project';
import {
  usePendingProjects,
  getPendingProjectsQueryOptions,
} from '../api/get-pending-projects';
import { useRejectProject } from '../api/reject-project';

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

const ProjectApprovalCard = ({
  project,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: {
  project: Project;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isApproving: boolean;
  isRejecting: boolean;
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm ring-1 ring-slate-100">
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="mb-2 text-xl font-semibold text-slate-900">
              {project.title}
            </h3>
            <div className="mb-3 flex items-center gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-1">
                <Clock className="size-4" />
                {formatDate(project.created_at)}
              </span>
              {project.estimated_timeline && (
                <span className="flex items-center gap-1">
                  <Clock className="size-4" />
                  {formatEstimatedTimeline(project.estimated_timeline)}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getProjectTypeColor(project.project_type)}`}
            >
              {project.project_type.replace(/_/g, ' ')}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-800">
              <AlertCircle className="size-3" />
              Pending
            </span>
          </div>
        </div>

        <p className="mb-4 line-clamp-3 text-slate-600">
          {project.description}
        </p>

        {project.preferred_technologies && (
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-medium text-slate-900">
              Preferred Technologies:
            </h4>
            <p className="text-sm text-slate-600">
              {project.preferred_technologies}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-500">Project ID: {project.id}</div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReject(project.id)}
              disabled={isApproving || isRejecting}
              className="border-red-200 text-red-700 hover:border-red-300 hover:bg-red-50"
            >
              {isRejecting ? (
                <>
                  <Spinner className="mr-2 size-4" />
                  Rejecting...
                </>
              ) : (
                <>
                  <X className="mr-2 size-4" />
                  Reject
                </>
              )}
            </Button>
            <Button
              size="sm"
              onClick={() => onApprove(project.id)}
              disabled={isApproving || isRejecting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isApproving ? (
                <>
                  <Spinner className="mr-2 size-4" />
                  Approving...
                </>
              ) : (
                <>
                  <Check className="mr-2 size-4" />
                  Approve
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProjectApprovalsList = () => {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const limit = Number(searchParams.get('limit') || 10);
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: { approving: boolean; rejecting: boolean };
  }>({});

  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  const { data, isLoading, error } = usePendingProjects({
    page,
    limit,
  });

  const approveProjectMutation = useApproveProject({
    mutationConfig: {
      onMutate: async (projectId) => {
        setLoadingStates((prev) => ({
          ...prev,
          [projectId]: { ...prev[projectId], approving: true },
        }));
      },
      onSuccess: (data, projectId) => {
        queryClient.invalidateQueries({
          queryKey: getPendingProjectsQueryOptions({ page }).queryKey,
        });
        addNotification({
          type: 'success',
          title: 'Project Approved',
          message: `Project "${data.data.title}" has been approved successfully.`,
        });
        setLoadingStates((prev) => ({
          ...prev,
          [projectId]: { ...prev[projectId], approving: false },
        }));
      },
      onError: (error, projectId) => {
        addNotification({
          type: 'error',
          title: 'Approval Failed',
          message: 'Failed to approve project. Please try again.',
        });
        setLoadingStates((prev) => ({
          ...prev,
          [projectId]: { ...prev[projectId], approving: false },
        }));
      },
    },
  });

  const rejectProjectMutation = useRejectProject({
    mutationConfig: {
      onMutate: async (projectId) => {
        setLoadingStates((prev) => ({
          ...prev,
          [projectId]: { ...prev[projectId], rejecting: true },
        }));
      },
      onSuccess: (data, projectId) => {
        queryClient.invalidateQueries({
          queryKey: getPendingProjectsQueryOptions({ page }).queryKey,
        });
        addNotification({
          type: 'success',
          title: 'Project Rejected',
          message: `Project "${data.data.title}" has been rejected.`,
        });
        setLoadingStates((prev) => ({
          ...prev,
          [projectId]: { ...prev[projectId], rejecting: false },
        }));
      },
      onError: (error, projectId) => {
        addNotification({
          type: 'error',
          title: 'Rejection Failed',
          message: 'Failed to reject project. Please try again.',
        });
        setLoadingStates((prev) => ({
          ...prev,
          [projectId]: { ...prev[projectId], rejecting: false },
        }));
      },
    },
  });

  const handleApprove = (projectId: string) => {
    approveProjectMutation.mutate(projectId);
  };

  const handleReject = (projectId: string) => {
    rejectProjectMutation.mutate(projectId);
  };

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

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {projects.map((project) => {
          const projectLoadingState = loadingStates[project.id] || {
            approving: false,
            rejecting: false,
          };

          return (
            <ProjectApprovalCard
              key={project.id}
              project={project}
              onApprove={handleApprove}
              onReject={handleReject}
              isApproving={projectLoadingState.approving}
              isRejecting={projectLoadingState.rejecting}
            />
          );
        })}
      </div>

      {meta && meta.totalPages > 1 && (
        <URLPagination
          totalPages={meta.totalPages}
          currentPage={meta.page}
          rootUrl="/admin/project-approvals"
          limit={limit}
        />
      )}
    </div>
  );
};
