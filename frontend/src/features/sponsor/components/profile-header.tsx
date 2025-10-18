import { Building2, Calendar, Edit2, MapPin, Save, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { SponsorProfile } from '../api/get-sponsor-profile';

interface ProfileHeaderProps {
  profile: SponsorProfile;
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
}: ProfileHeaderProps) => {
  const organizationName = profile.user
    ? `${profile.user.firstname} ${profile.user.lastname}`
    : 'Unknown Organization';

  return (
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
          {/* Logo Edit Button - Add this */}
          <Button
            size="icon"
            variant="outline"
            className="absolute right-2 top-2 z-10 rounded-full bg-white/80 p-1 shadow"
            onClick={() => onEdit('logo')}
            disabled={loading}
            aria-label="Edit Logo"
          >
            <Edit2 className="size-4 text-slate-700" />
          </Button>
          <div className="absolute -bottom-2 -right-2 rounded-full bg-green-500 p-2">
            <Building2 className="size-4 text-white" />
          </div>
        </div>
      </div>

      {/* Edit Button */}
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

      {/* Organization Info */}
      <div className="ml-48 mt-8 space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">
          {organizationName}
        </h1>

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
                  onEditDataChange({ ...editData, location: e.target.value })
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
  );
};
