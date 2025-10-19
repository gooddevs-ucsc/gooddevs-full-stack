import {
  Eye,
  Mail,
  Briefcase,
  Calendar,
  ExternalLink,
  FileText,
  Lightbulb,
  User,
  Clock,
  Check,
  RotateCcw,
  Info,
  X,
} from 'lucide-react';
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

// Reusable card wrapper with consistent styling
const InfoCard = ({
  children,
  gradient,
  icon: Icon,
  title,
}: {
  children: React.ReactNode;
  gradient: string;
  icon: React.ComponentType<any>;
  title: string;
}) => (
  <div className={`rounded-xl ${gradient} p-6 shadow-sm`}>
    <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
      <div className="mr-3 rounded-lg bg-white/50 p-2">
        <Icon className="size-5" />
      </div>
      {title}
    </h3>
    {children}
  </div>
);

// Professional link component
const ProfessionalLink = ({
  url,
  label,
  icon: Icon,
  iconColor,
}: {
  url: string;
  label: string;
  icon: React.ComponentType<any>;
  iconColor: string;
}) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md"
  >
    <div className={`rounded-full ${iconColor} p-2`}>
      <Icon className="size-4" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-900">{label}</p>
      <p className="max-w-[200px] truncate text-xs text-gray-500">{url}</p>
    </div>
  </a>
);

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
}: ConfirmationDialogProps) => (
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

interface ApplicationDetailsDialogProps {
  open: boolean;
  application: ProjectApplication;
  onClose: () => void;
}

const ApplicationDetailsDialog = ({
  open,
  application,
  onClose,
}: ApplicationDetailsDialogProps) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
      {/* Header */}
      <DialogHeader className="border-b pb-4">
        <div className="flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <span className="text-lg font-bold">
              {application.volunteer?.firstname?.[0]}
              {application.volunteer?.lastname?.[0]}
            </span>
          </div>
          <div>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {application.volunteer?.firstname}{' '}
              {application.volunteer?.lastname}
            </DialogTitle>
            <p className="text-lg text-gray-600">
              {application.volunteer_role}
            </p>
            <div className="mt-2">
              {getStatusBadge(application.status as ApplicationStatus)}
            </div>
          </div>
        </div>
      </DialogHeader>

      <div className="grid grid-cols-1 gap-6 py-6 lg:grid-cols-3">
        {/* Left Column - Contact & Links */}
        <div className="space-y-6">
          {/* Contact Information */}
          <InfoCard
            gradient="bg-gradient-to-br from-blue-50 to-indigo-50"
            icon={User}
            title="Contact Information"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="size-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">
                  {application.volunteer?.email}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="size-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">
                  {application.experience_years || 0} years experience
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="size-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Applied on{' '}
                  {formatDate(new Date(application.created_at).getTime())}
                </span>
              </div>
            </div>
          </InfoCard>

          {/* Professional Links */}
          {(application.portfolio_url ||
            application.linkedin_url ||
            application.github_url) && (
            <InfoCard
              gradient="bg-gradient-to-br from-green-50 to-emerald-50"
              icon={ExternalLink}
              title="Professional Links"
            >
              <div className="space-y-3">
                {application.portfolio_url && (
                  <ProfessionalLink
                    url={application.portfolio_url}
                    label="Portfolio"
                    icon={ExternalLink}
                    iconColor="bg-purple-100 text-purple-600"
                  />
                )}
                {application.linkedin_url && (
                  <ProfessionalLink
                    url={application.linkedin_url}
                    label="LinkedIn"
                    icon={ExternalLink}
                    iconColor="bg-blue-100 text-blue-600"
                  />
                )}
                {application.github_url && (
                  <ProfessionalLink
                    url={application.github_url}
                    label="GitHub"
                    icon={ExternalLink}
                    iconColor="bg-gray-100 text-gray-600"
                  />
                )}
              </div>
            </InfoCard>
          )}
        </div>

        {/* Right Column - Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Cover Letter */}
          {application.cover_letter && (
            <InfoCard
              gradient="bg-gradient-to-br from-amber-50 to-orange-50"
              icon={FileText}
              title="Cover Letter"
            >
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                  {application.cover_letter}
                </p>
              </div>
            </InfoCard>
          )}

          {/* Skills */}
          {application.skills && (
            <InfoCard
              gradient="bg-gradient-to-br from-purple-50 to-pink-50"
              icon={Lightbulb}
              title="Skills & Expertise"
            >
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                  {application.skills}
                </p>
              </div>
            </InfoCard>
          )}

          {/* Bio */}
          {application.volunteer?.bio && (
            <InfoCard
              gradient="bg-gradient-to-br from-gray-50 to-slate-50"
              icon={User}
              title="About the Applicant"
            >
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <p className="text-sm leading-relaxed text-gray-700">
                  {application.volunteer.bio}
                </p>
              </div>
            </InfoCard>
          )}

          {/* Timeline */}
          <InfoCard
            gradient="bg-gradient-to-br from-indigo-50 to-blue-50"
            icon={Clock}
            title="Application Timeline"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 p-1">
                    <Check className="size-3 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Application Submitted
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDate(new Date(application.created_at).getTime())}
                </span>
              </div>
              {application.updated_at !== application.created_at && (
                <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-blue-100 p-1">
                      <RotateCcw className="size-3 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      Last Updated
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(new Date(application.updated_at).getTime())}
                  </span>
                </div>
              )}
            </div>
          </InfoCard>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Info className="size-4" />
            Application ID: {application.id}
          </div>
          <div className="flex gap-3">
            {application.status === APPLICATION_STATUS.PENDING && (
              <>
                <Button
                  className="bg-green-600 text-white hover:bg-green-700"
                  onClick={onClose}
                >
                  <Check className="mr-2 size-4" />
                  Approve Application
                </Button>
                <Button
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                  onClick={onClose}
                >
                  <X className="mr-2 size-4" />
                  Reject Application
                </Button>
              </>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

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
  const [detailsDialog, setDetailsDialog] = useState<{
    open: boolean;
    application: ProjectApplication;
  } | null>(null);

  const { addNotification } = useNotifications();

  // Fetch data
  const { data: projectData } = useProject({ projectId });
  const {
    data: applicationsData,
    isLoading,
    error,
  } = useProjectApplications({
    projectId,
    page: 1,
    limit: 100,
  });

  // Update mutation
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

  // Filter logic
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

  // Status tabs
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
    const application = applications.find((app) => app.id === applicationId);
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

  // Table configuration
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
          <Button
            size="sm"
            variant="outline"
            onClick={() => setDetailsDialog({ open: true, application: entry })}
            className="border-blue-300 text-blue-600 hover:bg-blue-50"
          >
            <Eye className="mr-1 size-4" />
            Details
          </Button>

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

      {/* Dialogs */}
      {confirmationDialog && (
        <ConfirmationDialog
          open={confirmationDialog.open}
          title={`Confirm ${confirmationDialog.status === APPLICATION_STATUS.APPROVED ? 'Approval' : 'Rejection'}`}
          message={`Are you sure you want to ${confirmationDialog.status === APPLICATION_STATUS.APPROVED ? 'approve' : 'reject'} ${confirmationDialog.userName}'s application?`}
          confirmText={
            confirmationDialog.status === APPLICATION_STATUS.APPROVED
              ? 'Approve'
              : 'Reject'
          }
          onConfirm={handleConfirm}
          onClose={() => setConfirmationDialog(null)}
        />
      )}

      {detailsDialog && (
        <ApplicationDetailsDialog
          open={detailsDialog.open}
          application={detailsDialog.application}
          onClose={() => setDetailsDialog(null)}
        />
      )}
    </div>
  );
};
