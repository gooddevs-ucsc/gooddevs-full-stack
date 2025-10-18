import { Search, Heart, Calendar, Users, Clock, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { ContentLayout } from '@/components/layouts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNotifications } from '@/components/ui/notifications';
import { Spinner } from '@/components/ui/spinner';
import { useDeleteApplication } from '@/features/projects/api/delete-application';
import { useApplications } from '@/features/projects/api/get-applications';
import { useApprovedProjects } from '@/features/projects/api/get-approved-projects';
import { ReviewerActionButton } from '@/features/projects/components/reviewer-action-button';
import { PROJECT_TYPE_STYLES } from '@/lib/constants/ui';
import { APPLICATION_STATUS, ProjectApplication, Project } from '@/types/api';
import { formatDate, formatEstimatedTimeline } from '@/utils/format';

const ProjectsRoute = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get('tab') || 'available',
  );
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('search') || '',
  );
  const { addNotification } = useNotifications();

  // Delete application mutation
  const deleteApplicationMutation = useDeleteApplication({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Application Deleted',
          message: 'Your application has been successfully deleted.',
        });
      },
      onError: (error: any) => {
        addNotification({
          type: 'error',
          title: 'Failed to Delete',
          message:
            error.response?.data?.detail ||
            'Failed to delete application. Please try again.',
        });
      },
    },
  });

  const handleDeleteApplication = (applicationId: string) => {
    if (
      window.confirm(
        'Are you sure you want to delete this application? This action cannot be undone.',
      )
    ) {
      deleteApplicationMutation.mutate({ applicationId });
    }
  };

  // Fetch approved projects for "Browse Projects" tab
  const approvedProjectsQuery = useApprovedProjects({
    page: 1,
    limit: 100,
    queryConfig: {
      enabled: activeTab === 'available',
    },
  });

  // Fetch user's applications (needed for all tabs except available, but also needed for available to filter out applied projects)
  const applicationsQuery = useApplications({
    page: 1,
    limit: 100,
    queryConfig: {
      enabled: true, // Always fetch to filter applied projects from available tab
    },
  });

  // Filter applications by status for different tabs
  const getApplicationsByStatus = (status: string) => {
    if (!applicationsQuery.data?.data) return [];
    return applicationsQuery.data.data.filter((app) => app.status === status);
  };

  const getAllApplications = () => {
    if (!applicationsQuery.data?.data) return [];
    return applicationsQuery.data.data;
  };

  const getProjectsForTab = () => {
    let items: (Project | ProjectApplication)[] = [];

    switch (activeTab) {
      case 'available': {
        // Show only approved projects that user hasn't applied to yet
        const approvedProjects = approvedProjectsQuery.data?.data || [];
        const appliedProjectIds = new Set(
          (applicationsQuery.data?.data || []).map((app) => app.project_id),
        );

        items = approvedProjects.filter(
          (project) => !appliedProjectIds.has(project.id),
        );
        break;
      }
      case 'applied':
        items = getApplicationsByStatus(APPLICATION_STATUS.PENDING);
        break;
      case 'accepted':
        items = getApplicationsByStatus(APPLICATION_STATUS.APPROVED);
        break;
      case 'rejected':
        items = getApplicationsByStatus(APPLICATION_STATUS.REJECTED);
        break;
      case 'all':
        items = getAllApplications();
        break;
      case 'workspace':
        // For active projects, show approved applications
        items = getApplicationsByStatus(APPLICATION_STATUS.APPROVED);
        break;
      default:
        items = [];
    }

    // Filter by search term
    if (searchTerm.trim()) {
      items = items.filter((item) => {
        // Extract project data whether it's a direct project or from an application
        const project = 'project' in item ? item.project : (item as Project);
        if (!project) return false;

        return (
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    return items;
  };

  const updateSearchParams = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    updateSearchParams('tab', tabId);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    updateSearchParams('search', value);
  };

  // Calculate available projects count (excluding already applied projects)
  const getAvailableProjectsCount = () => {
    const approvedProjects = approvedProjectsQuery.data?.data || [];
    const appliedProjectIds = new Set(
      (applicationsQuery.data?.data || []).map((app) => app.project_id),
    );
    return approvedProjects.filter(
      (project) => !appliedProjectIds.has(project.id),
    ).length;
  };

  const tabs = [
    {
      id: 'available',
      label: 'Browse Projects',
      count: getAvailableProjectsCount(),
      description: 'New projects you can apply to (excluding already applied)',
    },
    {
      id: 'applied',
      label: 'Pending',
      count: getApplicationsByStatus(APPLICATION_STATUS.PENDING).length,
      description: 'Applications waiting for review',
    },
    {
      id: 'accepted',
      label: 'Accepted',
      count: getApplicationsByStatus(APPLICATION_STATUS.APPROVED).length,
      description: 'Applications that were approved',
    },
    {
      id: 'rejected',
      label: 'Rejected',
      count: getApplicationsByStatus(APPLICATION_STATUS.REJECTED).length,
      description: 'Applications that were declined',
    },
    {
      id: 'all',
      label: 'All My Applications',
      count: getAllApplications().length,
      description: 'All your applications combined',
    },
    {
      id: 'workspace',
      label: 'Active Projects',
      count: getApplicationsByStatus(APPLICATION_STATUS.APPROVED).length,
      description: 'Projects you are working on',
    },
  ];

  const isLoading =
    activeTab === 'available'
      ? approvedProjectsQuery.isLoading
      : applicationsQuery.isLoading;

  const error =
    activeTab === 'available'
      ? approvedProjectsQuery.error
      : applicationsQuery.error;

  if (error) {
    return (
      <ContentLayout title="Projects">
        <div className="flex h-48 w-full items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">Error loading projects</p>
            <p className="text-sm text-slate-500">Please try again later</p>
          </div>
        </div>
      </ContentLayout>
    );
  }

  const projects = getProjectsForTab();

  return (
    <ContentLayout title="Projects">
      <div className="space-y-8">
        {/* Short Description */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h2 className="mb-2 text-lg font-medium text-blue-900">
            Project Dashboard
          </h2>
          <p className="text-sm text-blue-700">
            Manage your project applications and discover new opportunities. Use
            the tabs below to view different categories of projects and
            applications.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search projects by name or description..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-slate-600'
              }`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}{' '}
              <span className="text-xs text-slate-400">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Tab Description */}
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-sm text-slate-600">
            {tabs.find((tab) => tab.id === activeTab)?.description}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex h-48 w-full items-center justify-center">
            <Spinner size="lg" />
          </div>
        )}

        {/* Project Cards */}
        {!isLoading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((item) => {
              // Extract project data whether it's a direct project or from an application
              const project =
                'project' in item ? item.project : (item as Project);
              const application =
                'project' in item ? (item as ProjectApplication) : null;

              if (!project) return null;

              const projectTypeStyle =
                PROJECT_TYPE_STYLES[project.project_type] ||
                PROJECT_TYPE_STYLES.OTHER;

              return (
                <button
                  type="button"
                  key={
                    application
                      ? `app-${application.id}`
                      : `project-${project.id}`
                  }
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-transform hover:scale-105 hover:shadow-lg"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  {/* Project Header */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="mb-2 line-clamp-2 text-lg font-bold text-slate-900">
                        {project.title}
                      </h3>
                      <p className="mb-3 line-clamp-3 text-sm text-slate-600">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  {/* Project Type Badge */}
                  <div className="mb-3">
                    <Badge
                      variant="outline"
                      className={`${projectTypeStyle} text-xs`}
                    >
                      {project.project_type.replace(/_/g, ' ')}
                    </Badge>
                  </div>

                  {/* Application Status for applied/accepted projects */}
                  {application && (
                    <div className="mb-3">
                      <Badge
                        variant={
                          application.status === APPLICATION_STATUS.APPROVED
                            ? 'default'
                            : application.status === APPLICATION_STATUS.REJECTED
                              ? 'destructive'
                              : 'secondary'
                        }
                        className="text-xs"
                      >
                        {application.status === APPLICATION_STATUS.PENDING &&
                          'Application Pending'}
                        {application.status === APPLICATION_STATUS.APPROVED &&
                          'Accepted'}
                        {application.status === APPLICATION_STATUS.REJECTED &&
                          'Rejected'}
                      </Badge>
                    </div>
                  )}

                  {/* Project Details */}
                  <div className="space-y-2 text-sm text-slate-600">
                    {project.estimated_timeline && (
                      <div className="flex items-center gap-2">
                        <Clock className="size-4" />
                        <span>
                          {formatEstimatedTimeline(project.estimated_timeline)}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Calendar className="size-4" />
                      <span>Posted {formatDate(project.created_at)}</span>
                    </div>

                    {application && (
                      <div className="flex items-center gap-2">
                        <Users className="size-4" />
                        <span>
                          Applied as{' '}
                          {application.volunteer_role.replace(/_/g, ' ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/projects/${project.id}`);
                      }}
                    >
                      View Details
                    </Button>

                    {/* Reviewer button for accepted applications - show if user can review */}
                    {application &&
                      application.status === APPLICATION_STATUS.APPROVED && (
                        <ReviewerActionButton projectId={project.id} />
                      )}

                    {/* Delete button for pending applications */}
                    {application &&
                      application.status === APPLICATION_STATUS.PENDING && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteApplication(application.id);
                          }}
                          disabled={deleteApplicationMutation.isPending}
                        >
                          <Trash2 className="size-4" />
                          {deleteApplicationMutation.isPending
                            ? 'Deleting...'
                            : 'Delete'}
                        </Button>
                      )}

                    {/* Heart button for available projects */}
                    {activeTab === 'available' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add to favorites functionality could go here
                        }}
                      >
                        <Heart className="size-4" />
                      </Button>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && projects.length === 0 && (
          <div className="flex h-48 w-full items-center justify-center">
            <div className="text-center">
              <p className="text-slate-600">
                {searchTerm
                  ? 'No projects found matching your search'
                  : 'No projects available'}
              </p>
              <p className="text-sm text-slate-500">
                {activeTab === 'available'
                  ? 'Check back later for new opportunities'
                  : 'Start by applying to available projects'}
              </p>
              {searchTerm && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => handleSearchChange('')}
                >
                  Clear search
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </ContentLayout>
  );
};

export default ProjectsRoute;
