import { useQueryClient } from '@tanstack/react-query';
import { Check, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useNotifications } from '@/components/ui/notifications';
import { Spinner } from '@/components/ui/spinner';

import { useApproveProject } from '../api/approve-project';
import { useRejectProject } from '../api/reject-project';

interface ProjectActionButtonsProps {
  projectId: string;
  projectTitle: string;
  page: number;
}

export const ProjectActionButtons = ({
  projectId,
  projectTitle,
  page,
}: ProjectActionButtonsProps) => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  const approveProjectMutation = useApproveProject({
    mutationConfig: {
      onSuccess: () => {
        console.log(page);
        queryClient.invalidateQueries({
          queryKey: ['projects', 'pending'],
        });
        addNotification({
          type: 'success',
          title: 'Project Approved',
          message: `Project "${projectTitle}" has been approved successfully.`,
        });
      },
      onError: (error) => {
        console.error('Approval error:', error);
        addNotification({
          type: 'error',
          title: 'Approval Failed',
          message: 'Failed to approve project. Please try again.',
        });
      },
    },
  });

  const rejectProjectMutation = useRejectProject({
    mutationConfig: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['projects', 'pending'],
        });
        addNotification({
          type: 'success',
          title: 'Project Rejected',
          message: `Project "${projectTitle}" has been rejected.`,
        });
      },
      onError: () => {
        addNotification({
          type: 'error',
          title: 'Rejection Failed',
          message: 'Failed to reject project. Please try again.',
        });
      },
    },
  });

  const handleApprove = () => {
    approveProjectMutation.mutate(projectId);
  };

  const handleReject = () => {
    rejectProjectMutation.mutate(projectId);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleReject}
        disabled={
          approveProjectMutation.isPending || rejectProjectMutation.isPending
        }
        className="border-red-200 text-red-700 hover:border-red-300 hover:bg-red-50"
      >
        {rejectProjectMutation.isPending ? (
          <>
            <Spinner className="mr-1 size-3" />
          </>
        ) : (
          <div className="flex items-center gap-1">
            <X className="mr-1 size-3" />
            Reject
          </div>
        )}
      </Button>
      <Button
        size="sm"
        onClick={handleApprove}
        disabled={
          approveProjectMutation.isPending || rejectProjectMutation.isPending
        }
        className="bg-green-600 hover:bg-green-700"
      >
        {approveProjectMutation.isPending ? (
          <>
            <Spinner className="mr-1 size-3" />
          </>
        ) : (
          <div className="flex items-center gap-1">
            <Check className="mr-1 size-3" />
            Approve
          </div>
        )}
      </Button>
    </div>
  );
};
