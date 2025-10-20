import {
  Edit2,
  ExternalLink,
  Github,
  Globe,
  Linkedin,
  Mail,
  Phone,
  Save,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { VolunteerProfile } from '../api/get-volunteer-profile';

interface ContactInfoCardProps {
  profile: VolunteerProfile;
  onEdit: (section: string) => void;
  onSave: () => void;
  onCancel: () => void;
  editingSection: string | null;
  editData: {
    website: string;
    contact_phone: string;
    github_url: string;
    linkedin_url: string;
    portfolio_url: string;
  };
  onEditDataChange: (data: {
    website: string;
    contact_phone: string;
    github_url: string;
    linkedin_url: string;
    portfolio_url: string;
  }) => void;
  loading: boolean;
  isOwner: boolean;
}

export const ContactInfoCard = ({
  profile,
  onEdit,
  onSave,
  onCancel,
  editingSection,
  editData,
  onEditDataChange,
  loading,
  isOwner,
}: ContactInfoCardProps) => {
  const volunteerEmail = profile.user?.email || '';

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          Contact Information
        </h2>
        {isOwner && (
          <>
            {editingSection === 'contact' ? (
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
                onClick={() => onEdit('contact')}
                disabled={loading}
              >
                <Edit2 className="size-4" />
              </Button>
            )}
          </>
        )}
      </div>

      <div className="space-y-4">
        {/* Email */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-lg bg-green-100 p-2">
            <Mail className="size-4 text-green-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-900">Email</p>
            <p className="text-sm text-slate-600">{volunteerEmail}</p>
          </div>
        </div>

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
                  onEditDataChange({ ...editData, website: e.target.value })
                }
                placeholder="https://yourwebsite.com"
                className="mt-1"
              />
            ) : (
              <p className="text-sm text-slate-600">
                {profile.website ? (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 break-all text-primary hover:text-primary/80"
                  >
                    {profile.website}
                    <ExternalLink className="size-3 shrink-0" />
                  </a>
                ) : (
                  'Not provided'
                )}
              </p>
            )}
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
                  onEditDataChange({
                    ...editData,
                    contact_phone: e.target.value,
                  })
                }
                placeholder="+1 (555) 123-4567"
                className="mt-1"
              />
            ) : (
              <p className="text-sm text-slate-600">
                {profile.contact_phone || 'Not provided'}
              </p>
            )}
          </div>
        </div>

        {/* GitHub */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-lg bg-gray-100 p-2">
            <Github className="size-4 text-gray-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-900">GitHub</p>
            {editingSection === 'contact' ? (
              <Input
                value={editData.github_url}
                onChange={(e) =>
                  onEditDataChange({ ...editData, github_url: e.target.value })
                }
                placeholder="https://github.com/username"
                className="mt-1"
              />
            ) : (
              <p className="text-sm text-slate-600">
                {profile.github_url ? (
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 break-all text-primary hover:text-primary/80"
                  >
                    {profile.github_url}
                    <ExternalLink className="size-3 shrink-0" />
                  </a>
                ) : (
                  'Not provided'
                )}
              </p>
            )}
          </div>
        </div>

        {/* LinkedIn */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-lg bg-blue-100 p-2">
            <Linkedin className="size-4 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-900">LinkedIn</p>
            {editingSection === 'contact' ? (
              <Input
                value={editData.linkedin_url}
                onChange={(e) =>
                  onEditDataChange({
                    ...editData,
                    linkedin_url: e.target.value,
                  })
                }
                placeholder="https://linkedin.com/in/username"
                className="mt-1"
              />
            ) : (
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
                  'Not provided'
                )}
              </p>
            )}
          </div>
        </div>

        {/* Portfolio */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-lg bg-indigo-100 p-2">
            <Globe className="size-4 text-indigo-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-900">Portfolio</p>
            {editingSection === 'contact' ? (
              <Input
                value={editData.portfolio_url}
                onChange={(e) =>
                  onEditDataChange({
                    ...editData,
                    portfolio_url: e.target.value,
                  })
                }
                placeholder="https://yourportfolio.com"
                className="mt-1"
              />
            ) : (
              <p className="text-sm text-slate-600">
                {profile.portfolio_url ? (
                  <a
                    href={profile.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 break-all text-primary hover:text-primary/80"
                  >
                    {profile.portfolio_url}
                    <ExternalLink className="size-3 shrink-0" />
                  </a>
                ) : (
                  'Not provided'
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
