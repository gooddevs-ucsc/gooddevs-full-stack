import {
  Edit2,
  ExternalLink,
  Facebook,
  Instagram,
  Linkedin,
  Save,
  Twitter,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { SponsorProfile } from '../api/get-sponsor-profile';

interface SocialMediaCardProps {
  profile: SponsorProfile;
  onEdit: (section: string) => void;
  onSave: () => void;
  onCancel: () => void;
  editingSection: string | null;
  editData: {
    linkedin_url: string;
    twitter_url: string;
    facebook_url: string;
    instagram_url: string;
  };
  onEditDataChange: (data: {
    linkedin_url: string;
    twitter_url: string;
    facebook_url: string;
    instagram_url: string;
  }) => void;
  loading: boolean;
}

export const SocialMediaCard = ({
  profile,
  onEdit,
  onSave,
  onCancel,
  editingSection,
  editData,
  onEditDataChange,
  loading,
}: SocialMediaCardProps) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-900">Connect With Us</h3>
        {editingSection === 'social' ? (
          <div className="flex gap-2">
            <Button size="sm" onClick={onSave} disabled={loading}>
              <Save className="size-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={loading}
            >
              <X className="size-3" />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit('social')}
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
              <p className="text-sm font-medium text-slate-900">LinkedIn</p>
              <Input
                value={editData.linkedin_url}
                onChange={(e) =>
                  onEditDataChange({
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
              <p className="text-sm font-medium text-slate-900">Twitter</p>
              <Input
                value={editData.twitter_url}
                onChange={(e) =>
                  onEditDataChange({
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
              <p className="text-sm font-medium text-slate-900">Facebook</p>
              <Input
                value={editData.facebook_url}
                onChange={(e) =>
                  onEditDataChange({
                    ...editData,
                    facebook_url: e.target.value,
                  })
                }
                placeholder="https://facebook.com/your-org"
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg bg-pink-100 p-2">
              <Instagram className="size-4 text-pink-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900">Instagram</p>
              <Input
                value={editData.instagram_url}
                onChange={(e) =>
                  onEditDataChange({
                    ...editData,
                    instagram_url: e.target.value,
                  })
                }
                placeholder="https://instagram.com/your-org"
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
              <p className="text-sm font-medium text-slate-900">LinkedIn</p>
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
              <p className="text-sm font-medium text-slate-900">Twitter</p>
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
              <p className="text-sm font-medium text-slate-900">Facebook</p>
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
          {/* Instagram */}
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg bg-pink-100 p-2">
              <Instagram className="size-4 text-pink-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900">Instagram</p>
              <p className="text-sm text-slate-600">
                {profile.instagram_url ? (
                  <a
                    href={profile.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 break-all text-primary hover:text-primary/80"
                  >
                    {profile.instagram_url}
                    <ExternalLink className="size-3 shrink-0" />
                  </a>
                ) : (
                  'Add Instagram profile'
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
