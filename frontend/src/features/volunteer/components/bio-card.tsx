import { Edit2, Save, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { VolunteerProfile } from '../api/get-volunteer-profile';

interface BioCardProps {
  profile: VolunteerProfile;
  onEdit: (section: string) => void;
  onSave: () => void;
  onCancel: () => void;
  editingSection: string | null;
  editData: {
    bio: string;
  };
  onEditDataChange: (data: { bio: string }) => void;
  loading: boolean;
  isOwner: boolean;
}

export const BioCard = ({
  profile,
  onEdit,
  onSave,
  onCancel,
  editingSection,
  editData,
  onEditDataChange,
  loading,
  isOwner,
}: BioCardProps) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">About</h2>
        {isOwner && (
          <>
            {editingSection === 'bio' ? (
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
                onClick={() => onEdit('bio')}
                disabled={loading}
              >
                <Edit2 className="size-4" />
              </Button>
            )}
          </>
        )}
      </div>

      <div className="prose prose-slate max-w-none">
        {editingSection === 'bio' ? (
          <textarea
            value={editData.bio}
            onChange={(e) => onEditDataChange({ bio: e.target.value })}
            placeholder="Tell us about yourself, your passion for development, and what drives you..."
            className="min-h-[150px] w-full resize-y rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <p className="leading-relaxed text-slate-600">
            {profile.bio ||
              (isOwner
                ? 'Add a bio to tell others about yourself and your passion for development.'
                : 'No bio available.')}
          </p>
        )}
      </div>
    </div>
  );
};
