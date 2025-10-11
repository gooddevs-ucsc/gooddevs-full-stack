import {
  Calendar,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Search,
  Star,
  User,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNotifications } from '@/components/ui/notifications';
import { Spinner } from '@/components/ui/spinner';
import { APPLICATION_STATUS, ProjectApplication } from '@/types/api';
import { formatDate } from '@/utils/format';

import { useUpdateApplicationStatus } from '../api/application-status-update';
import { useProject } from '../api/get-project';
import { useProjectApplications } from '../api/get-project-applications';

interface ProjectApplicationsListProps {
  projectId: string;
}

export const ProjectApplicationsList = ({
  projectId,
}: ProjectApplicationsListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch project details
  const { data: projectData } = useProject({
    projectId,
  });

  const {
    data: applicationsData,
    isLoading,
    error,
  } = useProjectApplications({
    projectId,
    page: 1,
    limit: 100,
  });

  const applications = applicationsData?.data || [];

  // Filter applications by status and search term
  const filteredApplications = applications.filter((app) => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch =
      searchTerm === '' ||
      app.volunteer?.firstname
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      app.volunteer?.lastname
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      app.volunteer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.volunteer_role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.cover_letter?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Helper function to count applications by status for tab badges
  const getStatusCount = (status: string) => {
    if (status === 'all') return applications.length; // Total count for "All" tab
    return applications.filter((app) => app.status === status).length; // Count for specific status
  };

  // Configuration for status filter tabs with counts
  const statusTabs = [
    { key: 'all', label: 'All Applications', count: getStatusCount('all') },
    {
      key: APPLICATION_STATUS.PENDING,
      label: 'Pending',
      count: getStatusCount(APPLICATION_STATUS.PENDING),
    },
    {
      key: APPLICATION_STATUS.APPROVED,
      label: 'Approved',
      count: getStatusCount(APPLICATION_STATUS.APPROVED),
    },
    {
      key: APPLICATION_STATUS.REJECTED,
      label: 'Rejected',
      count: getStatusCount(APPLICATION_STATUS.REJECTED),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-8" />
        <span className="ml-2 text-sm text-gray-600">
          Loading applications...
        </span>
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
        <h2 className="text-2xl font-bold text-gray-900">Applications</h2>
        <p className="mt-1 text-sm text-gray-600">
          Manage developer applications for &quot;
          {projectData?.data?.title || 'Loading...'}
          &quot;
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
      <div className="relative">
        <Search className="absolute left-3 top-3 size-4 text-gray-400" />
        <Input
          placeholder="Search by developer name, role, or cover letter..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <div className="py-12 text-center">
            <User className="mx-auto size-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {applications.length === 0
                ? 'No Applications Yet'
                : 'No Matching Applications'}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              {applications.length === 0
                ? 'No developers have applied to this project yet.'
                : 'Try adjusting your search or filter criteria.'}
            </p>
          </div>
        ) : (
          filteredApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              projectId={projectId}
            />
          ))
        )}
      </div>
    </div>
  );
};

/**
 * Props for the ApplicationCard component
 */
interface ApplicationCardProps {
  application: ProjectApplication; // The application data to display
  projectId: string; // Project ID for cache invalidation after updates
}

/**
 * Individual application card component
 *
 * Displays:
 * - Developer information (name, email, experience)
 * - Application details (role, cover letter, skills)
 * - Portfolio and social links
 * - Approve/Reject buttons for pending applications
 */
const ApplicationCard = ({ application, projectId }: ApplicationCardProps) => {
  // Hook for showing success/error notifications
  const { addNotification } = useNotifications();

  // Mutation hook for updating application status (approve/reject)
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateApplicationStatus({
      projectId, // Pass project ID for proper cache invalidation
      mutationConfig: {
        // Show success notification when status update succeeds
        onSuccess: () => {
          addNotification({
            type: 'success',
            title: 'Application Updated',
            message: 'Application status has been successfully updated.',
          });
        },
        // Show error notification when status update fails
        onError: () => {
          addNotification({
            type: 'error',
            title: 'Update Failed',
            message: 'Failed to update application status. Please try again.',
          });
        },
      },
    });

  /**
   * Handle approving an application
   * Calls the API to update status to APPROVED and refreshes the applications list
   */
  const handleApprove = () => {
    updateStatus({
      applicationId: application.id,
      status: APPLICATION_STATUS.APPROVED,
    });
  };

  /**
   * Handle rejecting an application
   * Calls the API to update status to REJECTED and refreshes the applications list
   */
  const handleReject = () => {
    updateStatus({
      applicationId: application.id,
      status: APPLICATION_STATUS.REJECTED,
    });
  };
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-blue-100">
                <User className="size-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {application.volunteer
                    ? `${application.volunteer.firstname} ${application.volunteer.lastname}`
                    : 'Loading...'}
                </h3>
                <p className="text-sm text-gray-600">
                  {application.volunteer_role}
                </p>
              </div>
            </div>
            <Badge
              className={`border ${
                application.status === APPLICATION_STATUS.APPROVED
                  ? 'border-green-200 bg-green-100 text-green-800'
                  : application.status === APPLICATION_STATUS.REJECTED
                    ? 'border-red-200 bg-red-100 text-red-800'
                    : application.status === APPLICATION_STATUS.PENDING
                      ? 'border-yellow-200 bg-yellow-100 text-yellow-800'
                      : 'border-gray-200 bg-gray-100 text-gray-800'
              }`}
            >
              {application.status}
            </Badge>
          </div>

          {/* Application Details */}
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="mr-2 size-4" />
                {application.volunteer?.email || 'No email'}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="mr-2 size-4" />
                Applied {formatDate(new Date(application.created_at).getTime())}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Star className="mr-2 size-4" />
                {application.experience_years || 0} years experience
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="mr-2 size-4" />
                Portfolio:{' '}
                {application.portfolio_url ? 'Available' : 'Not provided'}
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-medium text-gray-900">
              Cover Letter
            </h4>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="whitespace-pre-wrap text-sm text-gray-700">
                {application.cover_letter}
              </p>
            </div>
          </div>

          {/* Skills */}
          {application.skills && application.skills.length > 0 && (
            <div className="mb-4">
              <h4 className="mb-2 text-sm font-medium text-gray-900">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {application.skills.split(',').map((skill, index) => (
                  <Badge
                    key={index}
                    className="border-blue-200 bg-blue-50 text-blue-700"
                  >
                    {skill.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio */}
          {application.portfolio_url && (
            <div className="mb-4">
              <h4 className="mb-2 text-sm font-medium text-gray-900">
                Portfolio
              </h4>
              <a
                href={application.portfolio_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 underline hover:text-blue-800"
              >
                {application.portfolio_url}
              </a>
            </div>
          )}

          {/* GitHub and LinkedIn Links */}
          {(application.github_url || application.linkedin_url) && (
            <div className="mb-4">
              <h4 className="mb-2 text-sm font-medium text-gray-900">Links</h4>
              <div className="space-y-2">
                {application.github_url && (
                  <div className="flex items-center">
                    <Github className="mr-2 size-4 text-gray-600" />
                    <a
                      href={application.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 underline hover:text-blue-800"
                    >
                      GitHub Profile
                    </a>
                  </div>
                )}
                {application.linkedin_url && (
                  <div className="flex items-center">
                    <Linkedin className="mr-2 size-4 text-blue-600" />
                    <a
                      href={application.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 underline hover:text-blue-800"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons - Only show for pending applications */}
          {application.status === APPLICATION_STATUS.PENDING && (
            <div className="flex space-x-3 border-t border-gray-200 pt-4">
              <Button
                size="sm"
                disabled={isUpdating}
                onClick={handleApprove}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                {isUpdating ? 'Updating...' : 'Approve Application'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={isUpdating}
                onClick={handleReject}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                {isUpdating ? 'Updating...' : 'Reject Application'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
