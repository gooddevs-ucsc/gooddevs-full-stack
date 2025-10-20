import { Calendar, Edit2, MapPin, Save, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { VolunteerProfile } from '../api/get-volunteer-profile';

interface ProfileHeaderProps {
  profile: VolunteerProfile;
  onEdit: (section: string) => void;
  onSave: () => void;
  onCancel: () => void;
  editingSection: string | null;
  editData: {
    tagline: string;
    location: string;
  };
  onEditDataChange: (data: { tagline: string; location: string }) => void;
  loading: boolean;
  isOwner: boolean;
}

export const ProfileHeader = ({
  profile,
  onEdit,
  onSave,
  onCancel,
  editingSection,
  editData,
  onEditDataChange,
  loading,
  isOwner,
}: ProfileHeaderProps) => {
  const volunteerName = profile.user
    ? `${profile.user.firstname} ${profile.user.lastname}`
    : 'Unknown Developer';

  return (
    <div className="relative px-8 pb-8">
      {/* Profile Image */}
      <div className="absolute -top-16 left-8">
        <div className="relative">
          <img
            src={
              profile.profile_image_url ||
              `https://placehold.co/128x128/E2E8F0/475569?text=${volunteerName.charAt(0)}`
            }
            alt={volunteerName}
            className="size-32 rounded-2xl border-4 border-white bg-white object-cover shadow-lg"
          />
          {isOwner && (
            <Button
              size="icon"
              variant="outline"
              className="absolute right-2 top-2 z-10 rounded-full bg-white/80 p-1 shadow"
              onClick={() => onEdit('profile-image')}
              disabled={loading}
              aria-label="Edit Profile Image"
            >
              <Edit2 className="size-4 text-slate-700" />
            </Button>
          )}
        </div>
      </div>

      {/* Edit Button */}
      {isOwner && (
        <div className="absolute right-8 top-4">
          {editingSection === 'header' ? (
            <div className="flex gap-2">
              <Button size="sm" onClick={onSave} disabled={loading}>
                <Save className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                disabled={loading}
              >
                <X className="size-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit('header')}
              disabled={loading}
            >
              <Edit2 className="size-4" />
            </Button>
          )}
        </div>
      )}

      {/* Developer Info */}
      <div className="ml-40 mt-8 space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">{volunteerName}</h1>

        {editingSection === 'header' ? (
          <Input
            value={editData.tagline}
            onChange={(e) =>
              onEditDataChange({ ...editData, tagline: e.target.value })
            }
            className="max-w-2xl border-2 border-blue-300 bg-white text-lg"
            placeholder="Add a tagline"
          />
        ) : (
          <p className="text-xl text-slate-600">
            {profile.tagline || 'Add a professional tagline'}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm text-slate-500">
          {editingSection === 'header' ? (
            <div className="flex items-center gap-2">
              <MapPin className="size-4" />
              <Input
                value={editData.location}
                onChange={(e) =>
                  onEditDataChange({ ...editData, location: e.target.value })
                }
                className="max-w-xs border-2 border-blue-300 bg-white"
                placeholder="Add location"
              />
            </div>
          ) : (
            profile.location && (
              <div className="flex items-center gap-1">
                <MapPin className="size-4" />
                <span>{profile.location}</span>
              </div>
            )
          )}
          <div className="flex items-center gap-1">
            <Calendar className="size-4" />
            <span>
              Member since{' '}
              {new Date(profile.created_at).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
