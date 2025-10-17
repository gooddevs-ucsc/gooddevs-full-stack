import { Calendar, Edit2, Save, X, Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { useNotifications } from '@/components/ui/notifications';
import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import { useUserProjects } from '@/features/projects/api/get-user-projects';
import {
  useRequesterProfile,
  useUpdateRequesterProfile,
  UpdateRequesterProfileInput,
  useUploadRequesterLogo,
  useUploadRequesterCover,
  ContactInfoCard,
  SocialMediaCard,
  ProfileHeader,
  ImageUploadModal,
} from '@/features/requester';

const OrganizationProfile = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  // Fetch profile
  const {
    data: profileResponse,
    isLoading: profileLoading,
    error: profileError,
  } = useRequesterProfile();

  const profile = profileResponse?.data;

  // Update profile mutation
  const updateProfileMutation = useUpdateRequesterProfile({
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

  // Upload logo mutation
  const uploadLogoMutation = useUploadRequesterLogo({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Logo Uploaded',
          message: 'Logo uploaded and saved successfully!',
        });
        setEditingSection(null);
        setUploadingImage({ logo: false, cover: false });
      },
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          'Failed to upload logo. Please try again.';
        addNotification({
          type: 'error',
          title: 'Upload Failed',
          message: errorMessage,
        });
        setUploadingImage({ logo: false, cover: false });
      },
    },
  });

  // Upload cover mutation
  const uploadCoverMutation = useUploadRequesterCover({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Cover Uploaded',
          message: 'Cover image uploaded and saved successfully!',
        });
        setEditingSection(null);
        setUploadingImage({ logo: false, cover: false });
      },
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          'Failed to upload cover. Please try again.';
        addNotification({
          type: 'error',
          title: 'Upload Failed',
          message: errorMessage,
        });
        setUploadingImage({ logo: false, cover: false });
      },
    },
  });

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState({
    logo: false,
    cover: false,
  });
  const [editData, setEditData] = useState({
    tagline: '',
    location: '',
    website: '',
    contact_phone: '',
    about: '',
    linkedin_url: '',
    twitter_url: '',
    facebook_url: '',
    logo_url: '',
    cover_image_url: '',
  });

  // Fetch user's projects using the same hook as dashboard
  const { data: projectsData, isLoading: projectsLoading } = useUserProjects({
    page: 1,
    limit: 100,
  });

  const projects = projectsData?.data || [];

  // Handle file select for upload
  const handleFileSelect = (file: File, type: 'logo' | 'cover') => {
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

    setUploadingImage((prev) => ({ ...prev, [type]: true }));

    if (type === 'logo') {
      uploadLogoMutation.mutate({ file });
    } else {
      uploadCoverMutation.mutate({ file });
    }
  };

  // Calculate project counts by status (same as dashboard)
  const getProjectCountsByStatus = () => {
    const counts = {
      total: projects.length,
      active: 0,
      pending: 0,
      completed: 0,
    };

    projects.forEach((project) => {
      switch (project.status) {
        case 'APPROVED':
          counts.active++;
          break;
        case 'PENDING':
          counts.pending++;
          break;
        case 'COMPLETED':
          counts.completed++;
          break;
      }
    });

    return counts;
  };

  const projectCounts = getProjectCountsByStatus();

  // Transform projects for display (same as dashboard)
  const transformedProjects = projects.map((project) => {
    const getStatusInfo = (status: string) => {
      switch (status) {
        case 'APPROVED':
          return {
            status: 'Active',
            statusColor: 'border-green-200 bg-green-50 text-green-600',
          };
        case 'PENDING':
          return {
            status: 'Pending',
            statusColor: 'border-orange-200 bg-orange-50 text-orange-600',
          };
        case 'COMPLETED':
          return {
            status: 'Completed',
            statusColor: 'border-blue-200 bg-blue-50 text-blue-600',
          };
        default:
          return {
            status: 'Unknown',
            statusColor: 'border-gray-200 bg-gray-50 text-gray-600',
          };
      }
    };

    const statusInfo = getStatusInfo(project.status);

    return {
      id: project.id,
      title: project.title,
      description: project.description,
      status: statusInfo.status,
      statusColor: statusInfo.statusColor,
      lastUpdate: new Date(
        project.updated_at || project.created_at,
      ).toLocaleDateString(),
      createdAt: new Date(project.created_at).toLocaleDateString(),
    };
  });

  // Get only active projects
  const activeProjects = transformedProjects.filter(
    (project) => project.status === 'Active',
  );

  const handleEditSection = (section: string) => {
    if (!profile) return;

    setEditingSection(section);
    setEditData({
      tagline: profile.tagline || '',
      location: profile.location || '',
      website: profile.website || '',
      contact_phone: profile.contact_phone || '',
      about: profile.about || '',
      linkedin_url: profile.linkedin_url || '',
      twitter_url: profile.twitter_url || '',
      facebook_url: profile.facebook_url || '',
      logo_url: profile.logo_url || '',
      cover_image_url: profile.cover_image_url || '',
    });
  };

  const handleSaveSection = async () => {
    if (!profile) return;

    let payload: UpdateRequesterProfileInput = {};

    if (editingSection === 'header') {
      payload = {
        tagline: editData.tagline,
        location: editData.location,
      };
    } else if (editingSection === 'contact') {
      payload = {
        website: editData.website,
        contact_phone: editData.contact_phone,
      };
    } else if (editingSection === 'social') {
      payload = {
        linkedin_url: editData.linkedin_url,
        twitter_url: editData.twitter_url,
        facebook_url: editData.facebook_url,
      };
    } else if (editingSection === 'about') {
      payload = {
        about: editData.about,
      };
    } else if (editingSection === 'cover') {
      payload = {
        cover_image_url: editData.cover_image_url,
      };
    } else if (editingSection === 'logo') {
      payload = {
        logo_url: editData.logo_url,
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
        <div className="relative h-72 bg-gradient-to-r from-slate-500 to-slate-600">
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
          <div className="absolute right-4 top-4">
            {editingSection === 'cover' ? (
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
                onClick={() => handleEditSection('cover')}
                disabled={loading}
                className="border-white/30 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                title="Edit cover image"
              >
                <Edit2 className="size-3" />
              </Button>
            )}
          </div>
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
        />
      </div>

      {/* Image Upload Modals */}
      {editingSection === 'logo' && (
        <ImageUploadModal
          type="logo"
          currentImageUrl={editData.logo_url}
          onImageUrlChange={(url) =>
            setEditData({ ...editData, logo_url: url })
          }
          onFileSelect={(file: File) => handleFileSelect(file, 'logo')}
          onSave={handleSaveSection}
          onCancel={handleCancelEdit}
          uploading={uploadingImage.logo}
          loading={loading}
        />
      )}

      {editingSection === 'cover' && (
        <ImageUploadModal
          type="cover"
          currentImageUrl={editData.cover_image_url}
          onImageUrlChange={(url) =>
            setEditData({ ...editData, cover_image_url: url })
          }
          onFileSelect={(file: File) => handleFileSelect(file, 'cover')}
          onSave={handleSaveSection}
          onCancel={handleCancelEdit}
          uploading={uploadingImage.cover}
          loading={loading}
        />
      )}

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Contact Info */}
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
            }}
            onEditDataChange={(data) => setEditData({ ...editData, ...data })}
            loading={loading}
          />

          {/* Social Media Card */}
          <SocialMediaCard
            profile={profile}
            onEdit={handleEditSection}
            onSave={handleSaveSection}
            onCancel={handleCancelEdit}
            editingSection={editingSection}
            editData={{
              linkedin_url: editData.linkedin_url,
              twitter_url: editData.twitter_url,
              facebook_url: editData.facebook_url,
            }}
            onEditDataChange={(data) => setEditData({ ...editData, ...data })}
            loading={loading}
          />

          {/* Requester Stats Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Requester Stats
              </h2>
              <span className="text-xs text-slate-500">Live data</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Total Projects</span>
                <span className="font-semibold text-slate-900">
                  {projectCounts.total}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Active Projects</span>
                <span className="font-semibold text-green-600">
                  {projectCounts.active}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Pending Projects</span>
                <span className="font-semibold text-orange-600">
                  {projectCounts.pending}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  Completed Projects
                </span>
                <span className="font-semibold text-blue-600">
                  {projectCounts.completed}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Projects and About */}
        <div className="space-y-8 lg:col-span-2">
          {/* About Us Section */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">About Us</h2>
              {editingSection === 'about' ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveSection}
                    disabled={loading}
                  >
                    <Save className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    disabled={loading}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditSection('about')}
                  disabled={loading}
                >
                  <Edit2 className="size-4" />
                </Button>
              )}
            </div>

            <div className="prose prose-slate max-w-none">
              {editingSection === 'about' ? (
                <textarea
                  value={editData.about}
                  onChange={(e) =>
                    setEditData({ ...editData, about: e.target.value })
                  }
                  placeholder="Tell us about you..."
                  className="min-h-[150px] w-full resize-y rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="leading-relaxed text-slate-600">
                  {profile.about || 'Add a description about you.'}
                </p>
              )}
            </div>
          </div>

          {/* Active Projects Section - Same as Dashboard */}
          <div className="rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                Active Projects ({activeProjects.length})
              </h2>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() =>
                    navigate(paths.requester.createProject.getHref())
                  }
                >
                  <div className="flex items-center gap-4">
                    <Plus className="mr-2 size-4" />
                    New Project
                  </div>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(paths.requester.projects.getHref())}
                >
                  View All Projects
                </Button>
              </div>
            </div>

            {projectsLoading ? (
              <div className="flex h-32 items-center justify-center">
                <Spinner size="md" />
              </div>
            ) : activeProjects.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1">
                  {activeProjects.slice(0, 6).map((project) => (
                    <button
                      key={project.id}
                      className="cursor-pointer rounded-lg border border-slate-200/60 bg-gradient-to-br from-white to-slate-50/50 p-4 text-left transition-all hover:shadow-md"
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <h3 className="line-clamp-1 font-semibold text-slate-900">
                          {project.title}
                        </h3>
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${project.statusColor}`}
                        >
                          {project.status}
                        </span>
                      </div>
                      <p className="mb-3 line-clamp-2 text-sm text-slate-600">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          <span>Created {project.createdAt}</span>
                        </div>
                        <span>Updated {project.lastUpdate}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {activeProjects.length > 6 && (
                  <div className="mt-4 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(paths.requester.projects.getHref())
                      }
                    >
                      View All {activeProjects.length} Active Projects
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-slate-100 p-4">
                  <Plus className="size-8 text-slate-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-slate-900">
                  No Active Projects
                </h3>
                <p className="mt-2 max-w-sm text-center text-slate-600">
                  You don&apos;t have any active projects yet.
                </p>
                <Button
                  className="mt-4"
                  onClick={() =>
                    navigate(paths.requester.createProject.getHref())
                  }
                >
                  <div className="flex items-center gap-4">
                    <Plus className="mr-2 size-4" />
                    Create your Project
                  </div>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationProfile;
