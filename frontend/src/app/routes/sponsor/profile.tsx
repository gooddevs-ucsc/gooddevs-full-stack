import { Edit2, Save, X, Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { useNotifications } from '@/components/ui/notifications';
import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import {
  useSponsorProfile,
  useUpdateSponsorProfile,
  UpdateSponsorProfileInput,
  useUploadSponsorLogo,
  useUploadSponsorCover,
  ContactInfoCard,
  SocialMediaCard,
  ProfileHeader,
  ImageUploadModal,
} from '@/features/sponsor';
import { DonationCard } from '@/features/sponsor/components/donation-card';
import { SponsorshipCard } from '@/features/sponsor/components/sponsorship-card';

// Mock data for donations (from sponsor-donations-view.tsx)
const mockSponsorDonations = [
  {
    id: '1',
    donorName: 'Rayan Alwis',
    donorEmail: 'sponsor@example.com',
    amount: 50000,
    currency: 'LKR',
    message: 'Supporting the developer community',
    createdAt: '2024-01-15T10:30:00Z',
    status: 'completed' as const,
    paymentMethod: 'Credit Card',
  },
  {
    id: '2',
    donorName: 'Anonymous',
    donorEmail: null,
    amount: 25000,
    currency: 'LKR',
    message: 'Keep up the great work!',
    createdAt: '2024-01-10T14:20:00Z',
    status: 'completed' as const,
    paymentMethod: 'Bank Transfer',
  },
];

// Mock data for sponsorships (from sponsor-donations-view.tsx)
const mockSponsorSponsorships = [
  {
    id: '1',
    sponsorName: 'Rayan Alwis',
    sponsorEmail: 'sponsor@example.com',
    amount: 30000,
    currency: 'LKR',
    projectId: null,
    projectName: null,
    volunteerId: 'vol-1',
    volunteerName: 'Amal Gamage',
    duration: '3 months',
    createdAt: '2024-01-08T16:30:00Z',
    status: 'active' as const,
    sponsorshipType: 'volunteer' as const,
  },
  {
    id: '2',
    sponsorName: 'Rayan Alwis',
    sponsorEmail: 'sponsor@example.com',
    amount: 150000,
    currency: 'LKR',
    projectId: null,
    projectName: null,
    volunteerId: 'vol-2',
    volunteerName: 'Mike Johnson',
    duration: '6 months',
    createdAt: '2024-01-08T16:30:00Z',
    status: 'active' as const,
    sponsorshipType: 'volunteer' as const,
  },
];

// Calculate active sponsorships
const activeSponsorships = mockSponsorSponsorships.filter(
  (s) => s.status === 'active',
).length;

const SponsorProfile = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  // Fetch profile
  const {
    data: profileResponse,
    isLoading: profileLoading,
    error: profileError,
  } = useSponsorProfile();

  const profile = profileResponse?.data;

  // Update profile mutation
  const updateProfileMutation = useUpdateSponsorProfile({
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
  const uploadLogoMutation = useUploadSponsorLogo({
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
  const uploadCoverMutation = useUploadSponsorCover({
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
    instagram_url: '',
    logo_url: '',
    cover_image_url: '',
  });

  // Handle file select for upload
  const handleFileSelect = (file: File, type: 'logo' | 'cover') => {
    if (file.size > 5 * 1024 * 1024) {
      addNotification({
        type: 'error',
        title: 'File Too Large',
        message: 'Please select an image smaller than 5MB.',
      });
      return;
    }

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
      instagram_url: profile.instagram_url || '',
      logo_url: profile.logo_url || '',
      cover_image_url: profile.cover_image_url || '',
    });
  };

  const handleSaveSection = async () => {
    if (!profile) return;

    let payload: UpdateSponsorProfileInput = {};

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
        instagram_url: editData.instagram_url,
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
              instagram_url: editData.instagram_url,
            }}
            onEditDataChange={(data) => setEditData({ ...editData, ...data })}
            loading={loading}
          />

          {/* Stats Section */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Sponsorships and Donations
              </h2>
              <span className="text-xs text-slate-500">Live data</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Donations</span>
                <span className="font-semibold text-slate-900">
                  {mockSponsorDonations.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  Active Sponsorships
                </span>
                <span className="font-semibold text-green-600">
                  {activeSponsorships}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Donations and Sponsorships */}
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

          {/* Donations Section - Like Active Projects */}
          <div className="rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                Donations ({mockSponsorDonations.length})
              </h2>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => navigate(paths.sponsor.myDonations.getHref())}
                >
                  <div className="flex items-center gap-4">
                    <Plus className="mr-2 size-4" />
                    Make Donation
                  </div>
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate(paths.sponsor.myDonations.getHref())}
                >
                  <div className="flex items-center gap-4">
                    View All Donations
                  </div>
                </Button>
              </div>
            </div>

            {/* Donations Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
              {mockSponsorDonations.slice(0, 6).map((donation) => (
                <DonationCard key={donation.id} donation={donation} />
              ))}
            </div>
          </div>

          {/* Sponsorships Section - Like Active Projects */}
          <div className="rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                Sponsorships ({mockSponsorSponsorships.length})
              </h2>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() =>
                    navigate(paths.sponsor.donationsSponshorships.getHref())
                  }
                >
                  <div className="flex items-center gap-4">
                    <Plus className="mr-2 size-4" />
                    Create Sponsorship
                  </div>
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    navigate(paths.sponsor.donationsSponshorships.getHref())
                  }
                >
                  <div className="flex items-center gap-4">
                    View All Sponsorships
                  </div>
                </Button>
              </div>
            </div>

            {/* Sponsorships Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
              {mockSponsorSponsorships.slice(0, 6).map((sponsorship) => (
                <SponsorshipCard
                  key={sponsorship.id}
                  sponsorship={sponsorship}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorProfile;
