import {
  Clock,
  Users,
  ArrowLeft,
  Code,
  Target,
  CheckCircle,
  Heart,
  GitBranch,
  Zap,
  Calendar,
  Eye,
  User,
  ExternalLink,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import { useApprovedApplicants } from '@/features/projects/api/get-approved-applicants';
import { useUser } from '@/lib/auth';
import { usePublicUserProfile } from '@/lib/public-profile-api';
import { formatDate, formatEstimatedTimeline } from '@/utils/format';

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

  // Get requester name from profile data
  const requesterProfile = requesterData?.data;
  const requesterName = requesterProfile
    ? `${requesterProfile.firstname} ${requesterProfile.lastname}`.trim()
    : 'Project Requester';

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
                  <div
                    key={member.id}
                    className={`flex items-start gap-4 rounded-lg border p-4 ${styles.border} ${styles.bg}`}
                  >
                    <div
                      className={`flex size-12 items-center justify-center rounded-full ${styles.avatar}`}
                    >
                      <Users className="size-6" />
                    </div>
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h4 className="font-semibold text-slate-900">
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
                    {user && user.id !== member.id && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-pink-300 text-pink-600 hover:bg-pink-50 hover:text-pink-700"
                        onClick={() =>
                          navigate(
                            paths.payments.sponsorship.getHref(member.id),
                          )
                        }
                      >
                        <div className="flex items-center">
                          <Heart className="mr-1 size-4" />
                          Sponsor
                        </div>
                      </Button>
                    )}
                  </div>
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

        {/* Roles We Need */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-full bg-indigo-100 p-2">
              <Users className="size-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">
              Open Positions & Roles Needed
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {/* UI/UX Designer */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-full bg-blue-600 p-1.5">
                  <Target className="size-4 text-white" />
                </div>
                <h4 className="font-semibold text-slate-900">UI/UX Designer</h4>
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                  2 spots open
                </span>
              </div>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>• User research and persona development</li>
                <li>• Wireframing and prototyping</li>
                <li>• Visual design and branding</li>
                <li>• Accessibility and usability testing</li>
                <li>• Design system creation</li>
              </ul>
              <div className="mt-3 flex flex-wrap gap-1">
                <span className="rounded bg-blue-200 px-2 py-1 text-xs text-blue-800">
                  Figma
                </span>
                <span className="rounded bg-blue-200 px-2 py-1 text-xs text-blue-800">
                  Adobe XD
                </span>
                <span className="rounded bg-blue-200 px-2 py-1 text-xs text-blue-800">
                  Sketch
                </span>
              </div>
            </div>

            {/* Frontend Developer */}
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-full bg-green-600 p-1.5">
                  <Code className="size-4 text-white" />
                </div>
                <h4 className="font-semibold text-slate-900">
                  Frontend Developer
                </h4>
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                  3 spots open
                </span>
              </div>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>• React component development</li>
                <li>• Responsive UI implementation</li>
                <li>• State management (Redux/Zustand)</li>
                <li>• API integration and data fetching</li>
                <li>• Performance optimization</li>
              </ul>
              <div className="mt-3 flex flex-wrap gap-1">
                <span className="rounded bg-green-200 px-2 py-1 text-xs text-green-800">
                  React
                </span>
                <span className="rounded bg-green-200 px-2 py-1 text-xs text-green-800">
                  TypeScript
                </span>
                <span className="rounded bg-green-200 px-2 py-1 text-xs text-green-800">
                  Tailwind
                </span>
              </div>
            </div>

            {/* Backend Developer */}
            <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-full bg-purple-600 p-1.5">
                  <GitBranch className="size-4 text-white" />
                </div>
                <h4 className="font-semibold text-slate-900">
                  Backend Developer
                </h4>
                <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                  2 spots open
                </span>
              </div>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>• REST API design and development</li>
                <li>• Database design and optimization</li>
                <li>• Authentication and authorization</li>
                <li>• Data validation and security</li>
                <li>• Performance monitoring</li>
              </ul>
              <div className="mt-3 flex flex-wrap gap-1">
                <span className="rounded bg-purple-200 px-2 py-1 text-xs text-purple-800">
                  FastAPI
                </span>
                <span className="rounded bg-purple-200 px-2 py-1 text-xs text-purple-800">
                  Python
                </span>
                <span className="rounded bg-purple-200 px-2 py-1 text-xs text-purple-800">
                  PostgreSQL
                </span>
              </div>
            </div>

            {/* Full-Stack Developer */}
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-full bg-orange-600 p-1.5">
                  <Zap className="size-4 text-white" />
                </div>
                <h4 className="font-semibold text-slate-900">
                  Full-Stack Developer
                </h4>
                <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">
                  1 spot open
                </span>
              </div>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>• End-to-end feature development</li>
                <li>• Frontend-backend integration</li>
                <li>• DevOps and deployment</li>
                <li>• Code review and mentoring</li>
                <li>• Architecture decisions</li>
              </ul>
              <div className="mt-3 flex flex-wrap gap-1">
                <span className="rounded bg-orange-200 px-2 py-1 text-xs text-orange-800">
                  React
                </span>
                <span className="rounded bg-orange-200 px-2 py-1 text-xs text-orange-800">
                  FastAPI
                </span>
                <span className="rounded bg-orange-200 px-2 py-1 text-xs text-orange-800">
                  Docker
                </span>
              </div>
            </div>
          </div>
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

        {/* Team Formation & Open Positions */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            Team Formation & Open Positions
          </h3>
          <div className="space-y-4">
            {/* Project Lead - Assigned */}
            <div className="rounded-lg bg-gradient-to-r from-indigo-50 to-indigo-100 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-indigo-600">
                    <Users className="size-4 text-white" />
                  </div>
                  <span className="font-medium text-indigo-900">
                    Project Lead
                  </span>
                </div>
                <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white">
                  ✓ Assigned
                </span>
              </div>
              <div className="flex items-center">
                <div className="flex size-6 items-center justify-center rounded-full bg-indigo-500">
                  <span className="text-[10px] font-bold text-white">1</span>
                </div>
                <div className="ml-2 h-2 flex-1 rounded-full bg-green-200">
                  <div className="h-2 w-full rounded-full bg-green-500"></div>
                </div>
                <span className="ml-2 text-xs text-indigo-700">1/1 filled</span>
              </div>
            </div>

            {/* Frontend Developer - Partially Assigned */}
            <div className="rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-100 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-emerald-600">
                    <Code className="size-4 text-white" />
                  </div>
                  <span className="font-medium text-emerald-900">
                    Frontend Dev
                  </span>
                </div>
                <span className="rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-white">
                  2 more needed
                </span>
              </div>
              <div className="flex items-center">
                <div className="flex space-x-1">
                  <div className="flex size-6 items-center justify-center rounded-full bg-emerald-500">
                    <span className="text-[10px] font-bold text-white">1</span>
                  </div>
                  <div className="flex size-6 items-center justify-center rounded-full border-2 border-dashed border-emerald-300 bg-emerald-50">
                    <span className="text-[10px] font-bold text-emerald-400">
                      ?
                    </span>
                  </div>
                  <div className="flex size-6 items-center justify-center rounded-full border-2 border-dashed border-emerald-300 bg-emerald-50">
                    <span className="text-[10px] font-bold text-emerald-400">
                      ?
                    </span>
                  </div>
                </div>
                <div className="ml-3 h-2 flex-1 rounded-full bg-emerald-200">
                  <div className="h-2 w-1/3 rounded-full bg-emerald-500"></div>
                </div>
                <span className="ml-2 text-xs text-emerald-700">
                  1/3 filled
                </span>
              </div>
            </div>

            {/* Backend Developer - Partially Assigned */}
            <div className="rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-purple-600">
                    <GitBranch className="size-4 text-white" />
                  </div>
                  <span className="font-medium text-purple-900">
                    Backend Dev
                  </span>
                </div>
                <span className="rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-white">
                  1 more needed
                </span>
              </div>
              <div className="flex items-center">
                <div className="flex space-x-1">
                  <div className="flex size-6 items-center justify-center rounded-full bg-purple-500">
                    <span className="text-[10px] font-bold text-white">1</span>
                  </div>
                  <div className="flex size-6 items-center justify-center rounded-full border-2 border-dashed border-purple-300 bg-purple-50">
                    <span className="text-[10px] font-bold text-purple-400">
                      ?
                    </span>
                  </div>
                </div>
                <div className="ml-3 h-2 flex-1 rounded-full bg-purple-200">
                  <div className="h-2 w-1/2 rounded-full bg-purple-500"></div>
                </div>
                <span className="ml-2 text-xs text-purple-700">1/2 filled</span>
              </div>
            </div>

            {/* UI/UX Designer - Open */}
            <div className="rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-blue-600">
                    <Target className="size-4 text-white" />
                  </div>
                  <span className="font-medium text-blue-900">
                    UI/UX Designer
                  </span>
                </div>
                <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                  2 open spots
                </span>
              </div>
              <div className="flex items-center">
                <div className="flex space-x-1">
                  <div className="flex size-6 items-center justify-center rounded-full border-2 border-dashed border-blue-300 bg-blue-50">
                    <span className="text-[10px] font-bold text-blue-400">
                      ?
                    </span>
                  </div>
                  <div className="flex size-6 items-center justify-center rounded-full border-2 border-dashed border-blue-300 bg-blue-50">
                    <span className="text-[10px] font-bold text-blue-400">
                      ?
                    </span>
                  </div>
                </div>
                <div className="ml-3 h-2 flex-1 rounded-full bg-blue-200">
                  <div className="h-2 w-0 rounded-full bg-blue-500"></div>
                </div>
                <span className="ml-2 text-xs text-blue-700">0/2 filled</span>
              </div>
            </div>

            {/* Full-Stack Developer - Open */}
            <div className="rounded-lg bg-gradient-to-r from-orange-50 to-orange-100 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-orange-600">
                    <Zap className="size-4 text-white" />
                  </div>
                  <span className="font-medium text-orange-900">
                    Full-Stack Dev
                  </span>
                </div>
                <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                  1 open spot
                </span>
              </div>
              <div className="flex items-center">
                <div className="flex space-x-1">
                  <div className="flex size-6 items-center justify-center rounded-full border-2 border-dashed border-orange-300 bg-orange-50">
                    <span className="text-[10px] font-bold text-orange-400">
                      ?
                    </span>
                  </div>
                </div>
                <div className="ml-3 h-2 flex-1 rounded-full bg-orange-200">
                  <div className="h-2 w-0 rounded-full bg-orange-500"></div>
                </div>
                <span className="ml-2 text-xs text-orange-700">0/1 filled</span>
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
