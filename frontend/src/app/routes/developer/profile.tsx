import { Edit2, Plus, Save, X } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router';

import { Button } from '@/components/ui/button';
import { useNotifications } from '@/components/ui/notifications';
import { Spinner } from '@/components/ui/spinner';
import {
  BioCard,
  ContactInfoCard,
  ExperienceCard,
  ExperienceItem,
  ImageUploadModal,
  ProfileHeader,
  ProjectCard,
  SkillsCard,
  StatsCard,
  UpdateVolunteerProfileInput,
  useUpdateVolunteerProfile,
  useUploadVolunteerCoverImage,
  useUploadVolunteerProfileImage,
  useVolunteerApprovedProjects,
  useVolunteerProfile,
  useVolunteerStats,
  VolunteerProject,
} from '@/features/volunteer';
import { useUser } from '@/lib/auth';

const VolunteerProfile = () => {
  const { userId } = useParams();
  const { data: currentUser } = useUser();
  const { addNotification } = useNotifications();

  // Determine if viewing own profile or someone else's
  const isOwnProfile = !userId || userId === currentUser?.id;
  const profileUserId = userId || currentUser?.id;

  // Fetch profile data
  const {
    data: profileResponse,
    isLoading: profileLoading,
    error: profileError,
  } = useVolunteerProfile(profileUserId);

  const profile = profileResponse?.data;

  // Fetch stats (only for own profile)
  const { data: stats } = useVolunteerStats();

  // Fetch approved projects
  const { data: projectsData } = useVolunteerApprovedProjects({
    page: 1,
    limit: 10,
  });

  const projects = projectsData?.data || [];

  // Update profile mutation
  const updateProfileMutation = useUpdateVolunteerProfile({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Profile Updated',
          message: 'Your profile has been updated successfully.',
        });
        setEditingSection(null);
      },
      onError: () => {
        addNotification({
          type: 'error',
          title: 'Update Failed',
          message: 'Failed to update profile. Please try again.',
        });
      },
    },
  });

  // Upload profile image mutation
  const uploadProfileImageMutation = useUploadVolunteerProfileImage({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Profile Image Updated',
          message: 'Profile image uploaded and saved successfully!',
        });
        setEditingSection(null);
        setUploadingImage({ profileImage: false, coverImage: false });
      },
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          'Failed to upload profile image. Please try again.';
        addNotification({
          type: 'error',
          title: 'Upload Failed',
          message: errorMessage,
        });
        setUploadingImage({ profileImage: false, coverImage: false });
      },
    },
  });

  // Upload cover image mutation
  const uploadCoverImageMutation = useUploadVolunteerCoverImage({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Cover Image Updated',
          message: 'Cover image uploaded and saved successfully!',
        });
        setEditingSection(null);
        setUploadingImage({ profileImage: false, coverImage: false });
      },
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          'Failed to upload cover image. Please try again.';
        addNotification({
          type: 'error',
          title: 'Upload Failed',
          message: errorMessage,
        });
        setUploadingImage({ profileImage: false, coverImage: false });
      },
    },
  });

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState({
    profileImage: false,
    coverImage: false,
  });
  const [editData, setEditData] = useState({
    tagline: '',
    location: '',
    bio: '',
    skills: [] as string[],
    experience: [] as ExperienceItem[],
    website: '',
    contact_phone: '',
    github_url: '',
    linkedin_url: '',
    portfolio_url: '',
    profile_image_url: '',
    cover_image_url: '',
  });

  // Projects pagination
  const [currentProjectPage, setCurrentProjectPage] = useState(1);
  const projectsPerPage = 6;

  // Handle file select for upload
  const handleFileSelect = (
    file: File,
    type: 'profile-image' | 'cover-image',
  ) => {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      addNotification({
        type: 'error',
        title: 'File Too Large',
        message: 'Please select an image smaller than 5MB.',
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      addNotification({
        type: 'error',
        title: 'Invalid File Type',
        message: 'Please select an image file.',
      });
      return;
    }

    if (type === 'profile-image') {
      setUploadingImage((prev) => ({ ...prev, profileImage: true }));
      uploadProfileImageMutation.mutate({ file });
    } else {
      setUploadingImage((prev) => ({ ...prev, coverImage: true }));
      uploadCoverImageMutation.mutate({ file });
    }
  };

  // Calculate pagination for projects
  const totalProjectPages = Math.ceil(projects.length / projectsPerPage);
  const displayedProjects = projects.slice(
    (currentProjectPage - 1) * projectsPerPage,
    currentProjectPage * projectsPerPage,
  );

  // Transform projects to match ProjectCard interface
  const transformedProjects = displayedProjects.map(
    (project: VolunteerProject) => ({
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
    }),
  );

  const handleEditSection = (section: string) => {
    if (!profile) return;

    setEditingSection(section);
    setEditData({
      tagline: profile.tagline || '',
      location: profile.location || '',
      bio: profile.bio || '',
      skills: profile.skills || [],
      experience: profile.experience || [],
      website: profile.website || '',
      contact_phone: profile.contact_phone || '',
      github_url: profile.github_url || '',
      linkedin_url: profile.linkedin_url || '',
      portfolio_url: profile.portfolio_url || '',
      profile_image_url: profile.profile_image_url || '',
      cover_image_url: profile.cover_image_url || '',
    });
  };

  const handleSaveSection = async () => {
    if (!profile) return;

    let payload: UpdateVolunteerProfileInput = {};

    if (editingSection === 'header') {
      payload = {
        tagline: editData.tagline,
        location: editData.location,
      };
    } else if (editingSection === 'bio') {
      payload = {
        bio: editData.bio,
      };
    } else if (editingSection === 'skills') {
      payload = {
        skills: editData.skills,
      };
    } else if (editingSection === 'experience') {
      payload = {
        experience: editData.experience,
      };
    } else if (editingSection === 'contact') {
      payload = {
        website: editData.website,
        contact_phone: editData.contact_phone,
        github_url: editData.github_url,
        linkedin_url: editData.linkedin_url,
        portfolio_url: editData.portfolio_url,
      };
    } else if (editingSection === 'profile-image') {
      payload = {
        profile_image_url: editData.profile_image_url,
      };
    } else if (editingSection === 'cover-image') {
      payload = {
        cover_image_url: editData.cover_image_url,
      };
    }

    updateProfileMutation.mutate({ data: payload });
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
  };

  const loading = profileLoading || updateProfileMutation.isPending;

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
            {profileError?.message || 'Profile not found'}
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Profile Header with Cover */}
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

          {/* Cover Image Edit Button */}
          {isOwnProfile && (
            <div className="absolute right-4 top-4">
              {editingSection === 'cover-image' ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveSection}
                    disabled={loading}
                    className="bg-white/90 backdrop-blur-sm hover:bg-white"
                  >
                    <Save className="size-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    disabled={loading}
                    className="bg-white/90 backdrop-blur-sm hover:bg-white"
                  >
                    <X className="size-3" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditSection('cover-image')}
                  disabled={loading}
                  className="border-white/30 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                  title="Edit cover image"
                >
                  <Edit2 className="size-3" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Profile Header Component */}
        <ProfileHeader
          profile={profile}
          onEdit={handleEditSection}
          onSave={handleSaveSection}
          onCancel={handleCancelEdit}
          editingSection={editingSection}
          editData={{ tagline: editData.tagline, location: editData.location }}
          onEditDataChange={(data) => setEditData({ ...editData, ...data })}
          loading={loading}
          isOwner={isOwnProfile}
        />
      </div>

      {/* Image Upload Modals */}
      {editingSection === 'profile-image' && (
        <ImageUploadModal
          type="profile-image"
          currentImageUrl={editData.profile_image_url}
          onImageUrlChange={(url) =>
            setEditData({ ...editData, profile_image_url: url })
          }
          onFileSelect={(file: File) => handleFileSelect(file, 'profile-image')}
          onSave={handleSaveSection}
          onCancel={handleCancelEdit}
          uploading={uploadingImage.profileImage}
          loading={loading}
        />
      )}

      {editingSection === 'cover-image' && (
        <ImageUploadModal
          type="cover-image"
          currentImageUrl={editData.cover_image_url}
          onImageUrlChange={(url) =>
            setEditData({ ...editData, cover_image_url: url })
          }
          onFileSelect={(file: File) => handleFileSelect(file, 'cover-image')}
          onSave={handleSaveSection}
          onCancel={handleCancelEdit}
          uploading={uploadingImage.coverImage}
          loading={loading}
        />
      )}

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Contact Info & Stats */}
        <div className="space-y-6 lg:col-span-1">
          {/* Contact Information Card */}
          <ContactInfoCard
            profile={profile}
            onEdit={handleEditSection}
            onSave={handleSaveSection}
            onCancel={handleCancelEdit}
            editingSection={editingSection}
            editData={{
              website: editData.website,
              contact_phone: editData.contact_phone,
              github_url: editData.github_url,
              linkedin_url: editData.linkedin_url,
              portfolio_url: editData.portfolio_url,
            }}
            onEditDataChange={(data) => setEditData({ ...editData, ...data })}
            loading={loading}
            isOwner={isOwnProfile}
          />

          {/* Stats Card - Only show for own profile or if stats are available */}
          {isOwnProfile && stats && (
            <StatsCard stats={stats} isOwner={isOwnProfile} />
          )}
        </div>

        {/* Right Column - Bio, Skills, Experience, Projects */}
        <div className="space-y-8 lg:col-span-2">
          {/* Bio Section */}
          <BioCard
            profile={profile}
            onEdit={handleEditSection}
            onSave={handleSaveSection}
            onCancel={handleCancelEdit}
            editingSection={editingSection}
            editData={{ bio: editData.bio }}
            onEditDataChange={(data) => setEditData({ ...editData, ...data })}
            loading={loading}
            isOwner={isOwnProfile}
          />

          {/* Skills Section */}
          <SkillsCard
            profile={profile}
            onEdit={handleEditSection}
            onSave={handleSaveSection}
            onCancel={handleCancelEdit}
            editingSection={editingSection}
            editData={{ skills: editData.skills }}
            onEditDataChange={(data) => setEditData({ ...editData, ...data })}
            loading={loading}
            isOwner={isOwnProfile}
          />

          {/* Experience Section */}
          <ExperienceCard
            profile={profile}
            onEdit={handleEditSection}
            onSave={handleSaveSection}
            onCancel={handleCancelEdit}
            editingSection={editingSection}
            editData={{
              experience: editData.experience,
            }}
            onEditDataChange={(data) => setEditData({ ...editData, ...data })}
            loading={loading}
            isOwner={isOwnProfile}
          />

          {/* Projects Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Projects</h2>
              {isOwnProfile && (
                <Button
                  size="sm"
                  onClick={() => handleEditSection('projects')}
                  className="bg-blue-600 text-white"
                >
                  <Plus className="mr-2" />
                  New Project
                </Button>
              )}
            </div>

            {projects.length === 0 ? (
              <p className="text-gray-500">
                No projects found. Apply to projects to showcase your
                contributions.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {transformedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalProjectPages > 1 && (
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentProjectPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentProjectPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentProjectPage((prev) =>
                      Math.min(prev + 1, totalProjectPages),
                    )
                  }
                  disabled={currentProjectPage === totalProjectPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerProfile;
