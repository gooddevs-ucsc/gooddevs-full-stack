import { Calendar, Users } from 'lucide-react';
import { useParams } from 'react-router';

import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import {
  BioCard,
  ContactInfoCard,
  ExperienceCard,
  ProfileHeader,
  SkillsCard,
  useVolunteerApprovedProjects,
  useVolunteerProfile,
  VolunteerProject,
} from '@/features/volunteer';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'APPROVED':
    case 'Active':
      return 'border-green-200 bg-green-50 text-green-700';
    case 'IN_PROGRESS':
      return 'border-blue-200 bg-blue-50 text-blue-700';
    case 'COMPLETED':
      return 'border-gray-200 bg-gray-50 text-gray-700';
    default:
      return 'border-slate-200 bg-slate-50 text-slate-700';
  }
};

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'APPROVED':
      return { label: 'Active' };
    case 'IN_PROGRESS':
      return { label: 'In Progress' };
    case 'COMPLETED':
      return { label: 'Completed' };
    default:
      return { label: status };
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const PublicVolunteerProfile = () => {
  const { userId } = useParams<{ userId: string }>();

  // Move ALL hooks to the top, before any conditional logic
  const {
    data: profileResponse,
    isLoading: profileLoading,
    error: profileError,
  } = useVolunteerProfile(userId || ''); // Provide fallback to avoid undefined

  const { data: projectsData } = useVolunteerApprovedProjects({
    page: 1,
    limit: 10,
  });

  // Now handle conditional rendering after all hooks are called
  if (!userId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-red-600">Invalid profile URL</p>
        </div>
      </div>
    );
  }

  const profile = profileResponse?.data;
  const projects = projectsData?.data || [];

  // Transform projects to match interface
  const transformedProjects = projects.map((project: VolunteerProject) => ({
    id: project.id,
    title: project.title,
    description: project.description,
    status:
      project.status === 'APPROVED'
        ? ('APPROVED' as const)
        : project.status === 'IN_PROGRESS'
          ? ('IN_PROGRESS' as const)
          : ('COMPLETED' as const),
    project_type: project.project_type || 'OTHER',
    preferred_technologies: project.preferred_technologies,
    created_at: project.created_at,
    updated_at: project.updated_at,
  }));

  if (profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (profileError || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-red-600">
            {profileError?.message || 'Volunteer profile not found'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Profile Header with Cover - No edit functionality */}
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm">
        {/* Cover Image */}
        <div className="relative h-64 bg-gradient-to-r from-blue-500 to-purple-600">
          <img
            src={
              profile.cover_image_url ||
              'https://placehold.co/1200x300/475569/FFFFFF?text=+'
            }
            alt="Cover"
            className="size-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Profile Header Component - Read-only */}
        <ProfileHeader
          profile={profile}
          onEdit={() => {}} // No-op function
          onSave={() => {}} // No-op function
          onCancel={() => {}} // No-op function
          editingSection={null} // Never editing
          editData={{ tagline: '', location: '' }}
          onEditDataChange={() => {}} // No-op function
          loading={false}
          isOwner={false} // This is the key prop
        />
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Contact Info */}
        <div className="space-y-6 lg:col-span-1">
          {/* Contact Information Card - Read-only */}
          <ContactInfoCard
            profile={profile}
            onEdit={() => {}}
            onSave={() => {}}
            onCancel={() => {}}
            editingSection={null}
            editData={{
              website: '',
              contact_phone: '',
              github_url: '',
              linkedin_url: '',
              portfolio_url: '',
            }}
            onEditDataChange={() => {}}
            loading={false}
            isOwner={false} // Hide edit buttons
          />
        </div>

        {/* Right Column - Bio, Skills, Experience, Projects */}
        <div className="space-y-8 lg:col-span-2">
          {/* Bio Section - Read-only */}
          <BioCard
            profile={profile}
            onEdit={() => {}}
            onSave={() => {}}
            onCancel={() => {}}
            editingSection={null}
            editData={{ bio: '' }}
            onEditDataChange={() => {}}
            loading={false}
            isOwner={false}
          />

          {/* Skills Section - Read-only */}
          <SkillsCard
            profile={profile}
            onEdit={() => {}}
            onSave={() => {}}
            onCancel={() => {}}
            editingSection={null}
            editData={{ skills: [] }}
            onEditDataChange={() => {}}
            loading={false}
            isOwner={false}
          />

          {/* Experience Section - Read-only */}
          <ExperienceCard
            profile={profile}
            onEdit={() => {}}
            onSave={() => {}}
            onCancel={() => {}}
            editingSection={null}
            editData={{ experience: [] }}
            onEditDataChange={() => {}}
            loading={false}
            isOwner={false}
          />

          {/* Projects Section - Read-only */}
          <div className="rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Contributed Projects ({projects.length})
              </h2>
            </div>

            {/* Project Stats */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {
                    projects.filter(
                      (p) => p.status === 'APPROVED' || p.status === 'ACTIVE',
                    ).length
                  }
                </div>
                <div className="text-sm text-green-700">Active Projects</div>
              </div>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {projects.filter((p) => p.status === 'IN_PROGRESS').length}
                </div>
                <div className="text-sm text-blue-700">In Progress</div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {projects.filter((p) => p.status === 'COMPLETED').length}
                </div>
                <div className="text-sm text-gray-700">Completed</div>
              </div>
            </div>

            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-slate-100 p-4">
                  <Users className="size-8 text-slate-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-slate-900">
                  No Projects Yet
                </h3>
                <p className="mt-2 max-w-sm text-center text-slate-600">
                  This developer hasn&apos;t contributed to any projects yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {transformedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="rounded-lg border border-slate-200/60 bg-gradient-to-br from-white to-slate-50/50 p-4"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <h3 className="line-clamp-1 font-semibold text-slate-900">
                        {project.title}
                      </h3>
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${getStatusColor(project.status)}`}
                      >
                        {getStatusInfo(project.status).label}
                      </span>
                    </div>
                    <p className="mb-3 line-clamp-2 text-sm text-slate-600">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    {project.preferred_technologies && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {project.preferred_technologies
                            .split(',')
                            .slice(0, 3)
                            .map((tech, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tech.trim()}
                              </Badge>
                            ))}
                          {project.preferred_technologies.split(',').length >
                            3 && (
                            <Badge variant="secondary" className="text-xs">
                              +
                              {project.preferred_technologies.split(',')
                                .length - 3}{' '}
                              more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        <span>Joined {formatDate(project.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Updated {formatDate(project.updated_at)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicVolunteerProfile;
