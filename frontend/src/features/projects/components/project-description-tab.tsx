import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Code,
  Edit,
  ExternalLink,
  Eye,
  GitBranch,
  Heart,
  Plus,
  Target,
  Trash2,
  User,
  Users,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import { useApprovedApplicants } from '@/features/projects/api/get-approved-applicants';
import { useUser } from '@/lib/auth';
import { usePublicUserProfile } from '@/lib/public-profile-api';
import { DeveloperRole, OpenPosition } from '@/types/api';
import { formatDate, formatEstimatedTimeline } from '@/utils/format';

import { useCanManagePositions } from '../api/can-manage-positions';
import { useDeleteOpenPosition } from '../api/delete-open-position';
import { useOpenPositions } from '../api/get-open-positions';

import { OpenPositionForm } from './open-position-form';
import { ProjectApplicationForm } from './project-application-form';

interface ProjectDescriptionTabProps {
  project: any; // Replace with proper type
}

export const ProjectDescriptionTab = ({
  project,
}: ProjectDescriptionTabProps) => {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showPositionForm, setShowPositionForm] = useState(false);
  const [editingPosition, setEditingPosition] = useState<OpenPosition | null>(
    null,
  ); // Fix type

  // Fetch open positions
  const { data: openPositionsData, isLoading: isLoadingPositions } =
    useOpenPositions({
      projectId: project.id,
    });

  // Check if user can manage positions
  const { data: canManageData } = useCanManagePositions({
    projectId: project.id,
  });

  const deletePositionMutation = useDeleteOpenPosition();

  // Fetch requester profile to get the name
  const { data: requesterData, isLoading: isLoadingRequester } =
    usePublicUserProfile({
      userId: project.requester_id,
      queryConfig: {
        enabled: !!project.requester_id,
      },
    });

  // Fetch approved team members using the public endpoint
  const { data: approvedData, isLoading: isLoadingApproved } =
    useApprovedApplicants({
      projectId: project.id,
    });

  const approvedTeamMembers = approvedData?.data || [];
  const approvedCount = approvedData?.count || 0;
  const openPositions = openPositionsData?.data || [];
  const canManage = canManageData?.can_manage || false;

  // Get requester name from profile data
  const requesterProfile = requesterData?.data;
  const requesterName = requesterProfile
    ? `${requesterProfile.firstname} ${requesterProfile.lastname}`.trim()
    : 'Project Requester';

  const handleDeletePosition = (positionId: string) => {
    if (confirm('Are you sure you want to delete this position?')) {
      deletePositionMutation.mutate({ positionId });
    }
  };

  const handleEditPosition = (position: OpenPosition) => {
    setEditingPosition(position);
    setShowPositionForm(true);
  };

  const handleClosePositionForm = () => {
    setShowPositionForm(false);
    setEditingPosition(null);
  };

  // Helper function to get role display info with proper CSS classes (only basic info)
  const getRoleDisplayInfo = (role: DeveloperRole) => {
    const roleMap = {
      FRONTEND: {
        name: 'Frontend Developer',
        icon: Code,
        borderClass: 'border-green-200',
        bgClass: 'bg-green-50',
        iconBgClass: 'bg-green-600',
        badgeBgClass: 'bg-green-100',
        badgeTextClass: 'text-green-800',
      },
      BACKEND: {
        name: 'Backend Developer',
        icon: GitBranch,
        borderClass: 'border-purple-200',
        bgClass: 'bg-purple-50',
        iconBgClass: 'bg-purple-600',
        badgeBgClass: 'bg-purple-100',
        badgeTextClass: 'text-purple-800',
      },
      FULLSTACK: {
        name: 'Full-Stack Developer',
        icon: Zap,
        borderClass: 'border-orange-200',
        bgClass: 'bg-orange-50',
        iconBgClass: 'bg-orange-600',
        badgeBgClass: 'bg-orange-100',
        badgeTextClass: 'text-orange-800',
      },
      UIUX: {
        name: 'UI/UX Designer',
        icon: Target,
        borderClass: 'border-blue-200',
        bgClass: 'bg-blue-50',
        iconBgClass: 'bg-blue-600',
        badgeBgClass: 'bg-blue-100',
        badgeTextClass: 'text-blue-800',
      },
      MOBILE: {
        name: 'Mobile Developer',
        icon: Code,
        borderClass: 'border-indigo-200',
        bgClass: 'bg-indigo-50',
        iconBgClass: 'bg-indigo-600',
        badgeBgClass: 'bg-indigo-100',
        badgeTextClass: 'text-indigo-800',
      },
      DEVOPS: {
        name: 'DevOps Engineer',
        icon: GitBranch,
        borderClass: 'border-red-200',
        bgClass: 'bg-red-50',
        iconBgClass: 'bg-red-600',
        badgeBgClass: 'bg-red-100',
        badgeTextClass: 'text-red-800',
      },
      QA: {
        name: 'QA Engineer',
        icon: CheckCircle,
        borderClass: 'border-emerald-200',
        bgClass: 'bg-emerald-50',
        iconBgClass: 'bg-emerald-600',
        badgeBgClass: 'bg-emerald-100',
        badgeTextClass: 'text-emerald-800',
      },
      PM: {
        name: 'Project Manager',
        icon: Users,
        borderClass: 'border-violet-200',
        bgClass: 'bg-violet-50',
        iconBgClass: 'bg-violet-600',
        badgeBgClass: 'bg-violet-100',
        badgeTextClass: 'text-violet-800',
      },
    };
    return roleMap[role] || roleMap.FRONTEND;
  };

  // Show application form if requested
  if (showApplicationForm) {
    return (
      <ProjectApplicationForm
        projectId={project.id}
        projectTitle={project.title}
        onCancel={() => setShowApplicationForm(false)}
        onSuccess={() => setShowApplicationForm(false)}
      />
    );
  }

  // Show position form if requested
  if (showPositionForm) {
    return (
      <OpenPositionForm
        projectId={project.id}
        position={editingPosition}
        onSuccess={handleClosePositionForm}
        onCancel={handleClosePositionForm}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Main Content */}
      <div className="space-y-6 lg:col-span-2">
        {/* Project Overview */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">
              Project Overview
            </h2>
            <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
              <CheckCircle className="size-4" />
              Approved
            </div>
          </div>
          <div className="prose prose-slate max-w-none">
            <p className="text-lg leading-relaxed text-slate-700">
              {project.description ||
                'This project aims to create a meaningful solution that addresses real community needs while providing volunteer developers with valuable learning opportunities and portfolio contributions.'}
            </p>
          </div>
        </div>

        {/* Product Owner Section */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2">
              <User className="size-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">
              Product Owner
            </h2>
          </div>

          <Link
            to={`/profile/${project.requester_id}`}
            className="group flex items-center rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 transition-all duration-200 hover:from-blue-100 hover:to-indigo-100"
          >
            <div className="mr-4 flex size-12 items-center justify-center rounded-full bg-blue-600 text-white">
              <User className="size-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900 transition-colors group-hover:text-blue-600">
                {isLoadingRequester ? 'Loading...' : requesterName}
              </h4>
              <p className="text-sm text-slate-600">Click to view profile</p>
            </div>
            <ExternalLink className="size-4 text-slate-400 transition-colors group-hover:text-blue-600" />
          </Link>
        </div>

        {/* Current Team Members */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-full bg-indigo-100 p-2">
              <Users className="size-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">
              Current Team Members ({approvedCount})
            </h2>
          </div>

          {isLoadingApproved ? (
            <div className="flex items-center justify-center py-8">
              <Spinner className="size-6" />
            </div>
          ) : approvedTeamMembers.length > 0 ? (
            <div className="space-y-4">
              {approvedTeamMembers.map((member) => {
                const getRoleStyles = (role: string) => {
                  switch (role) {
                    case 'FRONTEND':
                      return {
                        border: 'border-emerald-200',
                        bg: 'bg-emerald-50',
                        avatar: 'bg-emerald-200 text-emerald-700',
                        badge: 'bg-emerald-200 text-emerald-800',
                      };
                    case 'BACKEND':
                      return {
                        border: 'border-purple-200',
                        bg: 'bg-purple-50',
                        avatar: 'bg-purple-200 text-purple-700',
                        badge: 'bg-purple-200 text-purple-800',
                      };
                    case 'FULLSTACK':
                      return {
                        border: 'border-blue-200',
                        bg: 'bg-blue-50',
                        avatar: 'bg-blue-200 text-blue-700',
                        badge: 'bg-blue-200 text-blue-800',
                      };
                    case 'UIUX':
                      return {
                        border: 'border-pink-200',
                        bg: 'bg-pink-50',
                        avatar: 'bg-pink-200 text-pink-700',
                        badge: 'bg-pink-200 text-pink-800',
                      };
                    case 'MOBILE':
                      return {
                        border: 'border-orange-200',
                        bg: 'bg-orange-50',
                        avatar: 'bg-orange-200 text-orange-700',
                        badge: 'bg-orange-200 text-orange-800',
                      };
                    case 'DEVOPS':
                      return {
                        border: 'border-indigo-200',
                        bg: 'bg-indigo-50',
                        avatar: 'bg-indigo-200 text-indigo-700',
                        badge: 'bg-indigo-200 text-indigo-800',
                      };
                    default:
                      return {
                        border: 'border-slate-200',
                        bg: 'bg-slate-50',
                        avatar: 'bg-slate-200 text-slate-700',
                        badge: 'bg-slate-200 text-slate-800',
                      };
                  }
                };

                const styles = getRoleStyles(member.volunteer_role);

                return (
                  <Link
                    key={member.id}
                    to={`/volunteer/${member.id}`} // Link to public profile
                    className={`flex items-start gap-4 rounded-lg border p-4 transition-all hover:shadow-md ${styles.border} ${styles.bg}`}
                  >
                    <div
                      className={`flex size-12 items-center justify-center rounded-full ${styles.avatar}`}
                    >
                      <Users className="size-6" />
                    </div>
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h4 className="font-semibold text-slate-900 hover:text-blue-600">
                          {member.firstname} {member.lastname}
                        </h4>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${styles.badge}`}
                        >
                          {member.volunteer_role.replace('_', ' ')}
                        </span>
                      </div>
                      {member.email && (
                        <p className="text-sm text-slate-600">{member.email}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {user && user.id !== member.id && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-pink-300 text-pink-600 hover:bg-pink-50 hover:text-pink-700"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(
                              paths.payments.sponsorship.getHref(member.id),
                            );
                          }}
                        >
                          <div className="flex items-center">
                            <Heart className="mr-1 size-4" />
                            Sponsor
                          </div>
                        </Button>
                      )}
                      <ExternalLink className="size-4 text-slate-400" />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-8">
              <div className="text-center">
                <Users className="mx-auto mb-3 size-12 text-slate-400" />
                <h3 className="mb-2 text-lg font-medium text-slate-900">
                  No approved team members yet
                </h3>
                <p className="text-slate-600">
                  This project is waiting for volunteers to join the team.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Open Positions & Roles Needed */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-indigo-100 p-2">
                <Users className="size-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">
                Open Positions & Roles Needed
              </h2>
            </div>
            {canManage && (
              <Button
                size="sm"
                onClick={() => setShowPositionForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="mr-1 size-4" />
                Add Position
              </Button>
            )}
          </div>

          {isLoadingPositions ? (
            <div className="flex items-center justify-center py-8">
              <Spinner className="size-6" />
            </div>
          ) : openPositions.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {openPositions.map((position) => {
                const roleInfo = getRoleDisplayInfo(position.volunteer_role);
                const IconComponent = roleInfo.icon;

                return (
                  <div
                    key={position.id}
                    className={`relative rounded-lg border p-4 ${roleInfo.borderClass} ${roleInfo.bgClass}`}
                  >
                    {/* Edit/Delete buttons for users with permissions */}
                    {canManage && (
                      <div className="absolute right-3 top-3 flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditPosition(position)}
                          className="size-8 p-0 hover:bg-white"
                        >
                          <Edit className="size-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeletePosition(position.id)}
                          className="size-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                    )}

                    {/* Position header */}
                    <div className="mb-3 flex items-center gap-2 pr-20">
                      <div
                        className={`rounded-full p-1.5 ${roleInfo.iconBgClass}`}
                      >
                        <IconComponent className="size-4 text-white" />
                      </div>
                      <h4 className="font-semibold text-slate-900">
                        {roleInfo.name}
                      </h4>
                    </div>

                    {/* Openings count badge */}
                    <div className="mb-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${roleInfo.badgeBgClass} ${roleInfo.badgeTextClass}`}
                      >
                        {position.openings_count} spot
                        {position.openings_count > 1 ? 's' : ''} open
                      </span>
                    </div>

                    {/* Position description (if provided) */}
                    {position.description && (
                      <p className="text-sm text-slate-700">
                        {position.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Users className="mx-auto mb-3 size-12 text-slate-400" />
              <h3 className="mb-2 text-lg font-medium text-slate-900">
                No open positions yet
              </h3>
              <p className="text-slate-600">
                {canManage
                  ? 'Add some open positions to attract volunteers to your project.'
                  : 'No open positions have been defined for this project yet.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Apply to Project */}
        <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
          <div className="mb-4 text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-blue-600 text-white">
              <Heart className="size-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Ready to Make an Impact?
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Join this meaningful project and help create positive change
            </p>
          </div>
          <div className="space-y-3">
            <Button
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => setShowApplicationForm(true)}
              disabled={!user || user.role !== 'VOLUNTEER'}
            >
              Apply to Join Project
            </Button>
            {(!user || user.role !== 'VOLUNTEER') && (
              <p className="text-center text-sm text-slate-600">
                {!user
                  ? 'Please log in as a volunteer to apply'
                  : 'Only volunteers can apply to projects'}
              </p>
            )}
          </div>
        </div>

        {/* Project Details */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            Project Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="mr-3 flex size-8 items-center justify-center rounded-full bg-blue-100">
                <Code className="size-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Project Type</p>
                <p className="text-sm text-slate-600">
                  {project.project_type
                    ?.replace(/_/g, ' ')
                    .replace(/\b\w/g, (l: string) => l.toUpperCase()) ||
                    'Not specified'}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-3 flex size-8 items-center justify-center rounded-full bg-green-100">
                <Clock className="size-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Timeline</p>
                <p className="text-sm text-slate-600">
                  {project.estimated_timeline
                    ? formatEstimatedTimeline(project.estimated_timeline)
                    : 'Not specified'}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-3 flex size-8 items-center justify-center rounded-full bg-purple-100">
                <CheckCircle className="size-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Status</p>
                <p className="text-sm text-slate-600">
                  {project.status?.charAt(0).toUpperCase() +
                    project.status?.slice(1).toLowerCase().replace(/_/g, ' ') ||
                    'Pending'}
                </p>
              </div>
            </div>

            {project.preferred_technologies && (
              <div className="flex items-start">
                <div className="mr-3 flex size-8 items-center justify-center rounded-full bg-indigo-100">
                  <Zap className="size-4 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Technologies</p>
                  <p className="text-sm text-slate-600">
                    {project.preferred_technologies}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start">
              <div className="mr-3 flex size-8 items-center justify-center rounded-full bg-orange-100">
                <Calendar className="size-4 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Posted</p>
                <p className="text-sm text-slate-600">
                  {project.created_at
                    ? formatDate(new Date(project.created_at).getTime())
                    : 'Recently'}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-3 flex size-8 items-center justify-center rounded-full bg-red-100">
                <Eye className="size-4 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Last Updated</p>
                <p className="text-sm text-slate-600">
                  {project.updated_at
                    ? formatDate(new Date(project.updated_at).getTime())
                    : 'Recently'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/projects')}
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to All Projects
          </Button>
        </div>
      </div>
    </div>
  );
};
