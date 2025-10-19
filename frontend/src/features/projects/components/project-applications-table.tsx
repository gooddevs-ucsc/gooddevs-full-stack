import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useNotifications } from '@/components/ui/notifications';
import { Spinner } from '@/components/ui/spinner';
import { Table, type TableColumn } from '@/components/ui/table';
import { APPLICATION_STATUS, type ProjectApplication } from '@/types/api';
import { formatDate } from '@/utils/format';

import { useUpdateApplicationStatus } from '../api/application-status-update';
import { useProject } from '../api/get-project';
import { useProjectApplications } from '../api/get-project-applications';

type ApplicationStatus = keyof typeof APPLICATION_STATUS;

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmationDialog = ({
  open,
  title,
  message,
  confirmText,
  onConfirm,
  onClose,
}: ConfirmationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600">{message}</p>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant={confirmText === 'Reject' ? 'destructive' : 'default'}
          >
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface ProjectApplicationsTableProps {
  projectId: string;
}

export const ProjectApplicationsTable = ({
  projectId,
}: ProjectApplicationsTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'ALL'>(
    'ALL',
  );
  const [confirmationDialog, setConfirmationDialog] = useState<{
    open: boolean;
    applicationId: string;
    status: ApplicationStatus;
    userName: string;
  } | null>(null);

  const { addNotification } = useNotifications();

  // Fetch project details
  const { data: projectData } = useProject({ projectId });

  // Fetch applications
  const {
    data: applicationsData,
    isLoading,
    error,
  } = useProjectApplications({
    projectId,
    page: 1,
    limit: 100,
  });

  // Update application status mutation
  const updateStatus = useUpdateApplicationStatus({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Application Updated',
          message: 'Application status has been updated successfully.',
        });
      },
      onError: (error) => {
        addNotification({
          type: 'error',
          title: 'Update Failed',
          message: error.message || 'Failed to update application status.',
        });
      },
    },
  });

  const applications = applicationsData?.data || [];

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    const matchesSearch =
      searchTerm === '' ||
      app.volunteer?.firstname
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      app.volunteer?.lastname
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      app.volunteer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.volunteer_role.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Status tabs with counts
  const statusTabs = [
    {
      key: 'ALL' as const,
      label: 'All Applications',
      count: applications.length,
    },
    {
      key: APPLICATION_STATUS.PENDING,
      label: 'Pending',
      count: applications.filter(
        (app) => app.status === APPLICATION_STATUS.PENDING,
      ).length,
    },
    {
      key: APPLICATION_STATUS.APPROVED,
      label: 'Approved',
      count: applications.filter(
        (app) => app.status === APPLICATION_STATUS.APPROVED,
      ).length,
    },
    {
      key: APPLICATION_STATUS.REJECTED,
      label: 'Rejected',
      count: applications.filter(
        (app) => app.status === APPLICATION_STATUS.REJECTED,
      ).length,
    },
  ];

  const handleStatusUpdate = (
    applicationId: string,
    status: ApplicationStatus,
  ) => {
    const application = applicationsData?.data?.find(
      (app) => app.id === applicationId,
    );
    if (!application) return;

    setConfirmationDialog({
      open: true,
      applicationId,
      status,
      userName: `${application.volunteer?.firstname} ${application.volunteer?.lastname}`,
    });
  };

  const handleConfirm = () => {
    if (!confirmationDialog) return;
    updateStatus.mutate({
      applicationId: confirmationDialog.applicationId,
      status: confirmationDialog.status,
    });
    setConfirmationDialog(null);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const colors = {
      [APPLICATION_STATUS.PENDING]:
        'border-yellow-200 bg-yellow-100 text-yellow-800',
      [APPLICATION_STATUS.APPROVED]:
        'border-green-200 bg-green-100 text-green-800',
      [APPLICATION_STATUS.REJECTED]: 'border-red-200 bg-red-100 text-red-800',
    };
    return (
      <Badge className={`border ${colors[status as keyof typeof colors]}`}>
        {status}
      </Badge>
    );
  };

  // Table columns configuration
  const columns: TableColumn<ProjectApplication>[] = [
    {
      title: 'User Name',
      field: 'volunteer',
      Cell: ({ entry }) => (
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-blue-100">
            <span className="text-xs font-semibold text-blue-600">
              {entry.volunteer?.firstname?.[0]}
              {entry.volunteer?.lastname?.[0]}
            </span>
          </div>
          <div>
            <p className="font-medium">
              {entry.volunteer?.firstname} {entry.volunteer?.lastname}
            </p>
            <p className="text-sm text-gray-500">{entry.volunteer?.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      field: 'volunteer_role',
      Cell: ({ entry }) => (
        <div>
          <p className="font-medium">{entry.volunteer_role}</p>
          <p className="text-sm text-gray-500">
            {entry.experience_years || 0} years exp.
          </p>
        </div>
      ),
    },
    {
      title: 'Applied Date',
      field: 'created_at',
      Cell: ({ entry }) => (
        <p className="text-sm">
          {formatDate(new Date(entry.created_at).getTime())}
        </p>
      ),
    },
    {
      title: 'Status',
      field: 'status',
      Cell: ({ entry }) => getStatusBadge(entry.status as ApplicationStatus),
    },
    {
      title: 'Actions',
      field: 'id',
      Cell: ({ entry }) => (
        <div className="flex items-center gap-2">
          {entry.status === APPLICATION_STATUS.PENDING && (
            <>
              <Button
                size="sm"
                onClick={() =>
                  handleStatusUpdate(
                    entry.id,
                    APPLICATION_STATUS.APPROVED as ApplicationStatus,
                  )
                }
                disabled={updateStatus.isPending}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  handleStatusUpdate(
                    entry.id,
                    APPLICATION_STATUS.REJECTED as ApplicationStatus,
                  )
                }
                disabled={updateStatus.isPending}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Reject
              </Button>
            </>
          )}
          {entry.status === APPLICATION_STATUS.APPROVED && (
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                handleStatusUpdate(
                  entry.id,
                  APPLICATION_STATUS.REJECTED as ApplicationStatus,
                )
              }
              disabled={updateStatus.isPending}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              Reject
            </Button>
          )}
          {entry.status === APPLICATION_STATUS.REJECTED && (
            <Button
              size="sm"
              onClick={() =>
                handleStatusUpdate(
                  entry.id,
                  APPLICATION_STATUS.APPROVED as ApplicationStatus,
                )
              }
              disabled={updateStatus.isPending}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Approve
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-600">
          Failed to load applications. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Applications for {projectData?.data?.title || 'Loading...'}
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Manage and review applications from developers interested in your
          project
        </p>
      </div>

      {/* Status Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`whitespace-nowrap border-b-2 px-1 pb-2 text-sm font-medium ${
                statusFilter === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {tab.label}
              <Badge className="ml-2 bg-gray-100 text-xs text-gray-600">
                {tab.count}
              </Badge>
            </button>
          ))}
        </nav>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Search by name, email, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      {filteredApplications.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-500">
            {applications.length === 0
              ? 'No applications yet'
              : 'No applications match your filters'}
          </p>
          {applications.length === 0 && (
            <p className="mt-1 text-sm text-gray-400">
              Developers can apply to your project from the public projects page
            </p>
          )}
        </div>
      ) : (
        <Table data={filteredApplications as any} columns={columns as any} />
      )}

      {/* Confirmation Dialog */}
      {confirmationDialog && (
        <ConfirmationDialog
          open={confirmationDialog.open}
          title={`Confirm ${
            confirmationDialog.status === APPLICATION_STATUS.APPROVED
              ? 'Approval'
              : 'Rejection'
          }`}
          message={`Are you sure you want to ${
            confirmationDialog.status === APPLICATION_STATUS.APPROVED
              ? 'approve'
              : 'reject'
          } ${confirmationDialog.userName}'s application?`}
          confirmText={
            confirmationDialog.status === APPLICATION_STATUS.APPROVED
              ? 'Approve'
              : 'Reject'
          }
          onConfirm={handleConfirm}
          onClose={() => setConfirmationDialog(null)}
        />
      )}
    </div>
  );
};
