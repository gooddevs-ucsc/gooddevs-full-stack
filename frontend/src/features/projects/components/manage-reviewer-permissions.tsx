import { AlertCircle, Shield, ShieldOff, UserPlus, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { useUser } from '@/lib/auth';
import { formatDate } from '@/utils/format';

import { useApprovedApplicants } from '../api/get-approved-applicants';
import { useReviewerPermissions } from '../api/get-reviewer-permissions';
import { useGrantReviewerPermission } from '../api/grant-reviewer-permission';
import { useRevokeReviewerPermission } from '../api/revoke-reviewer-permission';

interface ManageReviewerPermissionsProps {
  projectId: string;
  projectOwnerId: string;
}

export const ManageReviewerPermissions = ({
  projectId,
  projectOwnerId,
}: ManageReviewerPermissionsProps) => {
  const { data: user } = useUser();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);
  const [selectedReviewerId, setSelectedReviewerId] = useState<string | null>(
    null,
  );
  const [reviewerToRevoke, setReviewerToRevoke] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data: reviewersData, isLoading: isLoadingReviewers } =
    useReviewerPermissions({
      projectId,
      includeRevoked: false,
    });

  const { data: approvedApplicantsData, isLoading: isLoadingApplicants } =
    useApprovedApplicants({
      projectId,
    });

  const grantMutation = useGrantReviewerPermission({
    mutationConfig: {
      onSuccess: () => {
        setShowAddDialog(false);
        setSelectedReviewerId(null);
      },
    },
  });

  const revokeMutation = useRevokeReviewerPermission({
    mutationConfig: {
      onSuccess: () => {
        setShowRevokeDialog(false);
        setReviewerToRevoke(null);
      },
    },
  });

  const isOwner = user?.id === projectOwnerId;

  if (!isOwner) {
    return null;
  }

  if (isLoadingReviewers) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Spinner size="md" />
      </div>
    );
  }

  const reviewers = reviewersData?.data || [];

  // Get approved applicants who are not already reviewers
  const availableApplicants = (approvedApplicantsData?.data || []).filter(
    (applicant) =>
      !reviewers.some((reviewer) => reviewer.reviewer.id === applicant.id),
  );

  const handleGrantPermission = () => {
    if (selectedReviewerId) {
      grantMutation.mutate({
        projectId,
        reviewerId: selectedReviewerId,
      });
    }
  };

  const handleRevokePermission = (reviewerId: string, reviewerName: string) => {
    setReviewerToRevoke({ id: reviewerId, name: reviewerName });
    setShowRevokeDialog(true);
  };

  const confirmRevokePermission = () => {
    if (reviewerToRevoke) {
      revokeMutation.mutate({
        projectId,
        reviewerId: reviewerToRevoke.id,
      });
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="size-5 text-slate-700" />
          <h3 className="text-lg font-medium text-slate-900">
            Application Reviewers
          </h3>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          size="sm"
          disabled={availableApplicants.length === 0}
        >
          <div className="flex items-center">
            <UserPlus className="size-4" />
            Add Reviewer
          </div>
        </Button>
      </div>

      {reviewers.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
          <ShieldOff className="mx-auto mb-3 size-10 text-slate-400" />
          <p className="text-sm text-slate-600">
            No reviewers added yet. Add approved volunteers to help review
            applications.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {reviewers.map((permission) => (
            <div
              key={permission.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-slate-200">
                  <Shield className="size-5 text-slate-600" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">
                    {permission.reviewer.firstname}{' '}
                    {permission.reviewer.lastname}
                  </div>
                  <div className="text-sm text-slate-500">
                    {permission.reviewer.email}
                  </div>
                  <div className="text-xs text-slate-400">
                    Granted on{' '}
                    {formatDate(new Date(permission.created_at).getTime())}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleRevokePermission(
                    permission.reviewer.id,
                    `${permission.reviewer.firstname} ${permission.reviewer.lastname}`,
                  )
                }
                disabled={revokeMutation.isPending}
              >
                <div className="flex items-center">
                  <X className="size-4" />
                  Revoke
                </div>
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Application Reviewer</DialogTitle>
            <DialogDescription>
              Select an approved volunteer to grant them permission to review
              applications for this project.
            </DialogDescription>
          </DialogHeader>

          {isLoadingApplicants ? (
            <div className="flex h-32 items-center justify-center">
              <Spinner size="md" />
            </div>
          ) : availableApplicants.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
              <AlertCircle className="mx-auto mb-3 size-10 text-slate-400" />
              <p className="text-sm text-slate-600">
                All approved volunteers already have reviewer permissions.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {availableApplicants.map((applicant) => (
                <button
                  key={applicant.id}
                  onClick={() => setSelectedReviewerId(applicant.id)}
                  className={`w-full rounded-lg border p-4 text-left transition-colors ${
                    selectedReviewerId === applicant.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="font-medium text-slate-900">
                    {applicant.firstname} {applicant.lastname}
                  </div>
                  <div className="text-sm text-slate-500">
                    {applicant.email}
                  </div>
                  <div className="text-xs text-slate-400">
                    Role: {applicant.volunteer_role}
                  </div>
                </button>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false);
                setSelectedReviewerId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGrantPermission}
              disabled={!selectedReviewerId || grantMutation.isPending}
            >
              {grantMutation.isPending ? (
                <>
                  <Spinner size="sm" />
                  Granting...
                </>
              ) : (
                'Grant Permission'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke Reviewer Permission</DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke reviewer permission for{' '}
              <span className="font-semibold">{reviewerToRevoke?.name}</span>?
              They will no longer be able to review applications for this
              project.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRevokeDialog(false);
                setReviewerToRevoke(null);
              }}
              disabled={revokeMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmRevokePermission}
              disabled={revokeMutation.isPending}
            >
              {revokeMutation.isPending ? (
                <>
                  <Spinner size="sm" />
                  Revoking...
                </>
              ) : (
                'Revoke Permission'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
