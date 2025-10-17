import { useQueryClient } from '@tanstack/react-query';
import {
  Building2,
  Calendar,
  Edit2,
  ExternalLink,
  Facebook,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Twitter,
  Save,
  X,
  Plus,
  Phone,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Trash2,
} from 'lucide-react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNotifications } from '@/components/ui/notifications';
import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import { useUserProjects } from '@/features/projects/api/get-user-projects';
import {
  useRequesterProfile,
  useUpdateRequesterProfile,
  UpdateRequesterProfileInput,
} from '@/features/requester/api/get-requester-profile';
import { api } from '@/lib/api-client';
import { Project } from '@/types/api';

const OrganizationProfile = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const queryClient = useQueryClient();
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  // Use the new API hooks
  const {
    data: profileResponse,
    isLoading: profileLoading,
    error: profileError,
  } = useRequesterProfile();

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
      onError: (error) => {
        addNotification({
          type: 'error',
          title: 'Update Failed',
          message: 'Failed to update profile. Please try again.',
        });
        console.error('Failed to update profile:', error);
      },
    },
  });

  const profile = profileResponse?.data;

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState<{
    logo: boolean;
    cover: boolean;
  }>({
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

  // Image upload handler
  const handleImageUpload = async (file: File, type: 'logo' | 'cover') => {
    setUploadingImage((prev) => ({ ...prev, [type]: true }));

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Use dedicated endpoints that upload AND save to database
      const endpoint =
        type === 'logo'
          ? '/requester-profile/upload-logo'
          : '/requester-profile/upload-cover';

      const response = await api.put(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // The backend returns RequesterProfileResponse which has { data: RequesterProfile }
      // So response.data is already the RequesterProfileResponse
      const updatedProfile = response.data;

      if (!updatedProfile) {
        throw new Error('No profile data returned from server');
      }

      // Invalidate and refetch the profile query to update UI
      queryClient.invalidateQueries({ queryKey: ['requester-profile'] });

      addNotification({
        type: 'success',
        title: 'Image Uploaded',
        message: `${type === 'logo' ? 'Logo' : 'Cover image'} uploaded and saved successfully!`,
      });

      // Close the editing modal since the image is now saved
      setEditingSection(null);
    } catch (error: any) {
      console.error('Error uploading image:', error);

      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Failed to upload image. Please try again.';

      addNotification({
        type: 'error',
        title: 'Upload Failed',
        message: errorMessage,
      });
    } finally {
      setUploadingImage((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'cover',
  ) => {
    console.log('File selected:', event.target.files?.[0]); // Debug log

    const file = event.target.files?.[0];
    if (file) {
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

      console.log('Starting upload for:', type, file.name); // Debug log
      handleImageUpload(file, type);
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

    projects.forEach((project: Project) => {
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
  const transformedProjects = projects.map((project: Project) => {
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
      developers: 0,
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

  const organizationName = profile.user
    ? `${profile.user.firstname} ${profile.user.lastname}`
    : 'Unknown Organization';

  const organizationEmail = profile.user?.email || '';

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Hidden file inputs */}
      <input
        ref={logoFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e, 'logo')}
      />
      <input
        ref={coverFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e, 'cover')}
      />

      {/* Profile Header */}
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

        {/* Profile Content */}
        <div className="relative px-8 pb-8">
          {/* Logo */}
          <div className="absolute -top-16 left-8">
            <div className="relative">
              <img
                src={
                  profile.logo_url ||
                  `https://placehold.co/100x100/E2E8F0/475569?text=${organizationName.charAt(0)}`
                }
                alt={organizationName}
                className="size-40 rounded-2xl border-4 border-white bg-white object-cover shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 rounded-full bg-green-500 p-2">
                <Building2 className="size-4 text-white" />
              </div>

              {/* Logo Edit Button */}
              <div className="absolute -right-2 -top-2">
                {editingSection === 'logo' ? (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      onClick={handleSaveSection}
                      disabled={loading}
                      className="size-8 rounded-full border-2 border-white bg-slate-600 p-2 text-white shadow-lg hover:bg-slate-700"
                      title="Save logo"
                    >
                      <Save className="size-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      disabled={loading}
                      className="size-8 rounded-full border-2 border-white bg-slate-500 p-2 text-white shadow-lg hover:bg-slate-600"
                      title="Cancel"
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditSection('logo')}
                    disabled={loading}
                    className="size-8 rounded-full border-2 border-white bg-slate-600 p-2 text-white opacity-80 shadow-lg transition-all hover:bg-slate-700 hover:opacity-100"
                    title="Edit logo"
                  >
                    <Edit2 className="size-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <div className="absolute right-8 top-4">
            {editingSection === 'header' ? (
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
                onClick={() => handleEditSection('header')}
                disabled={loading}
              >
                <Edit2 className="size-4" />
              </Button>
            )}
          </div>

          {/* Requester Info */}
          <div className="ml-48 mt-8 space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">
              {organizationName}
            </h1>

            {editingSection === 'header' ? (
              <Input
                value={editData.tagline}
                onChange={(e) =>
                  setEditData({ ...editData, tagline: e.target.value })
                }
                className="max-w-2xl border-2 border-blue-300 bg-white text-lg"
                placeholder="Add a tagline"
              />
            ) : (
              <p className="max-w-2xl text-lg text-slate-600">
                {profile.tagline || 'Add a tagline'}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <MapPin className="size-4" />
                {editingSection === 'header' ? (
                  <Input
                    value={editData.location}
                    onChange={(e) =>
                      setEditData({ ...editData, location: e.target.value })
                    }
                    className="h-8 w-48 border-2 border-blue-300 bg-white"
                    placeholder="Add a location"
                  />
                ) : (
                  profile.location || 'Add a location'
                )}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="size-4" />
                Member since {new Date(profile.created_at).getFullYear()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Edit Forms - Fixed positioning with action buttons */}
      {editingSection === 'cover' && (
        <div className="fixed left-1/2 top-1/2 z-50 min-w-96 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
          {/* Header with close button */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              Update Cover Image
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelEdit}
              className="size-8 rounded-full p-2"
              title="Close"
            >
              <X className="size-3" />
            </Button>
          </div>

          {/* Current Image Preview */}
          {editData.cover_image_url && (
            <div className="mb-4">
              <p className="mb-2 text-sm font-medium text-slate-700">
                Current Image:
              </p>
              <div className="relative">
                <img
                  src={editData.cover_image_url}
                  alt="Cover preview"
                  className="h-24 w-full rounded-lg object-cover"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setEditData({ ...editData, cover_image_url: '' })
                  }
                  className="absolute -right-2 -top-2 size-8 rounded-full border-2 border-white bg-red-500 p-1 text-white hover:bg-red-600"
                  title="Remove image"
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            </div>
          )}

          {/* Upload Option */}
          <div className="space-y-4">
            <div className="rounded-lg border-2 border-dashed border-slate-300 p-6 transition-colors hover:border-slate-400">
              <div className="text-center">
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-slate-100">
                  <Upload className="size-6 text-slate-600" />
                </div>
                <p className="mb-2 text-sm font-medium text-slate-900">
                  Upload a new image
                </p>
                <p className="mb-4 text-xs text-slate-500">
                  PNG, JPG, GIF up to 5MB
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => coverFileInputRef.current?.click()}
                  disabled={uploadingImage.cover}
                  className="relative"
                >
                  {uploadingImage.cover ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="mr-2 size-4" />
                      Choose File
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-3 text-slate-500">or</span>
              </div>
            </div>

            {/* URL Option */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <LinkIcon className="size-4 text-slate-500" />
                <label
                  htmlFor="cover-image-url"
                  className="text-sm font-medium text-slate-700"
                >
                  Enter image URL
                </label>
              </div>
              <Input
                id="cover-image-url"
                value={editData.cover_image_url}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    cover_image_url: e.target.value,
                  })
                }
                placeholder="https://example.com/your-cover-image.jpg"
                className="w-full"
              />
              {editData.cover_image_url &&
                !editData.cover_image_url.startsWith('http') && (
                  <p className="text-xs text-red-500">
                    Please enter a valid URL starting with http:// or https://
                  </p>
                )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-2 border-t border-slate-200 pt-4">
            <Button
              variant="outline"
              onClick={handleCancelEdit}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveSection}
              disabled={loading || uploadingImage.cover}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Saving...
                </>
              ) : (
                <Save className="size-4" />
              )}
            </Button>
          </div>
        </div>
      )}

      {editingSection === 'logo' && (
        <div className="fixed left-1/2 top-1/2 z-50 min-w-96 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
          {/* Header with close button */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              Update Logo
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelEdit}
              className="size-8 rounded-full p-2"
              title="Close"
            >
              <X className="size-3" />
            </Button>
          </div>

          {/* Current Logo Preview */}
          {editData.logo_url && (
            <div className="mb-4">
              <p className="mb-2 text-sm font-medium text-slate-700">
                Current Logo:
              </p>
              <div className="relative inline-block">
                <img
                  src={editData.logo_url}
                  alt="Logo preview"
                  className="size-20 rounded-lg border border-slate-200 object-cover"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditData({ ...editData, logo_url: '' })}
                  className="absolute -right-2 -top-2 size-6 rounded-full border-2 border-white bg-red-500 p-1 text-white hover:bg-red-600"
                  title="Remove logo"
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            </div>
          )}

          {/* Upload Option */}
          <div className="space-y-4">
            <div className="rounded-lg border-2 border-dashed border-slate-300 p-6 transition-colors hover:border-slate-400">
              <div className="text-center">
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-slate-100">
                  <ImageIcon className="size-6 text-slate-600" />
                </div>
                <p className="mb-2 text-sm font-medium text-slate-900">
                  Upload a new logo
                </p>
                <p className="mb-4 text-xs text-slate-500">
                  Recommended: Square image, PNG format
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => logoFileInputRef.current?.click()}
                  disabled={uploadingImage.logo}
                  className="relative"
                >
                  {uploadingImage.logo ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 size-4" />
                      Choose File
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-3 text-slate-500">or</span>
              </div>
            </div>

            {/* URL Option */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <LinkIcon className="size-4 text-slate-500" />
                <label
                  htmlFor="logo-url"
                  className="text-sm font-medium text-slate-700"
                >
                  Enter logo URL
                </label>
              </div>
              <Input
                id="logo-url"
                value={editData.logo_url}
                onChange={(e) =>
                  setEditData({ ...editData, logo_url: e.target.value })
                }
                placeholder="https://example.com/your-logo.png"
                className="w-full"
              />
              {editData.logo_url && !editData.logo_url.startsWith('http') && (
                <p className="text-xs text-red-500">
                  Please enter a valid URL starting with http:// or https://
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-2 border-t border-slate-200 pt-4">
            <Button
              variant="outline"
              onClick={handleCancelEdit}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveSection}
              disabled={loading || uploadingImage.logo}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Saving...
                </>
              ) : (
                <Save className="size-4" />
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Backdrop for modals */}
      {(editingSection === 'cover' || editingSection === 'logo') && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          role="button"
          tabIndex={0}
          aria-label="Close modal"
          onClick={handleCancelEdit}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleCancelEdit();
            }
          }}
        />
      )}

      {/* Rest of the component remains the same... */}
      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Contact Info */}
        <div className="space-y-6 lg:col-span-1">
          {/* Contact Information Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Contact Information
              </h2>
              {editingSection === 'contact' ? (
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
                  onClick={() => handleEditSection('contact')}
                  disabled={loading}
                >
                  <Edit2 className="size-4" />
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {/* Website */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-blue-100 p-2">
                  <Globe className="size-4 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900">Website</p>
                  {editingSection === 'contact' ? (
                    <Input
                      value={editData.website}
                      onChange={(e) =>
                        setEditData({ ...editData, website: e.target.value })
                      }
                      placeholder="Add a website"
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-sm text-slate-600">
                      {profile.website ? (
                        <a
                          href={`https://${profile.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 break-all text-primary hover:text-primary/80"
                        >
                          {profile.website}
                          <ExternalLink className="size-3 shrink-0" />
                        </a>
                      ) : (
                        'Add a website'
                      )}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-green-100 p-2">
                  <Mail className="size-4 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900">Email</p>
                  <a
                    href={`mailto:${organizationEmail}`}
                    className="break-all text-sm text-slate-600 hover:text-primary"
                  >
                    {organizationEmail}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-purple-100 p-2">
                  <Phone className="size-4 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900">Phone</p>
                  {editingSection === 'contact' ? (
                    <Input
                      value={editData.contact_phone}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          contact_phone: e.target.value,
                        })
                      }
                      placeholder="Add a phone number"
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-sm text-slate-600">
                      {profile.contact_phone || 'Add a phone number'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-6 border-t border-slate-200 pt-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-900">
                  Connect With Us
                </h3>
                {editingSection === 'social' ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSaveSection}
                      disabled={loading}
                    >
                      <Save className="size-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      disabled={loading}
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditSection('social')}
                    disabled={loading}
                  >
                    <Edit2 className="size-3" />
                  </Button>
                )}
              </div>

              {editingSection === 'social' ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg bg-blue-100 p-2">
                      <Linkedin className="size-4 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        LinkedIn
                      </p>
                      <Input
                        value={editData.linkedin_url}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            linkedin_url: e.target.value,
                          })
                        }
                        placeholder="https://linkedin.com/company/your-org"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg bg-sky-100 p-2">
                      <Twitter className="size-4 text-sky-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        Twitter
                      </p>
                      <Input
                        value={editData.twitter_url}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            twitter_url: e.target.value,
                          })
                        }
                        placeholder="https://twitter.com/your-org"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg bg-indigo-100 p-2">
                      <Facebook className="size-4 text-indigo-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        Facebook
                      </p>
                      <Input
                        value={editData.facebook_url}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            facebook_url: e.target.value,
                          })
                        }
                        placeholder="https://facebook.com/your-org"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* LinkedIn */}
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg bg-blue-100 p-2">
                      <Linkedin className="size-4 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        LinkedIn
                      </p>
                      <p className="text-sm text-slate-600">
                        {profile.linkedin_url ? (
                          <a
                            href={profile.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 break-all text-primary hover:text-primary/80"
                          >
                            {profile.linkedin_url}
                            <ExternalLink className="size-3 shrink-0" />
                          </a>
                        ) : (
                          'Add LinkedIn profile'
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Twitter */}
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg bg-sky-100 p-2">
                      <Twitter className="size-4 text-sky-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        Twitter
                      </p>
                      <p className="text-sm text-slate-600">
                        {profile.twitter_url ? (
                          <a
                            href={profile.twitter_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 break-all text-primary hover:text-primary/80"
                          >
                            {profile.twitter_url}
                            <ExternalLink className="size-3 shrink-0" />
                          </a>
                        ) : (
                          'Add Twitter profile'
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Facebook */}
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg bg-indigo-100 p-2">
                      <Facebook className="size-4 text-indigo-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        Facebook
                      </p>
                      <p className="text-sm text-slate-600">
                        {profile.facebook_url ? (
                          <a
                            href={profile.facebook_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 break-all text-primary hover:text-primary/80"
                          >
                            {profile.facebook_url}
                            <ExternalLink className="size-3 shrink-0" />
                          </a>
                        ) : (
                          'Add Facebook page'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

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
