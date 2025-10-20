import { Edit2, ExternalLink, Globe, Mail, Phone, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { RequesterProfile } from '../api/get-requester-profile';

interface ContactInfoCardProps {
  profile: RequesterProfile;
  onEdit: (section: string) => void;
  onSave: () => void;
  onCancel: () => void;
  editingSection: string | null;
  editData: {
    website: string;
    contact_phone: string;
  };
  onEditDataChange: (data: { website: string; contact_phone: string }) => void;
  loading: boolean;
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
}: ContactInfoCardProps) => {
  const organizationEmail = profile.user?.email || '';

  const [errors, setErrors] = useState<{
    website?: string;
    contact_phone?: string;
  }>({});

  const validate = (data: { website: string; contact_phone: string }) => {
    const errs: { website?: string; contact_phone?: string } = {};

    // Phone validation: allow digits, spaces, +, -, parentheses; require 7-15 digits
    const rawPhone = (data.contact_phone || '').trim();
    if (rawPhone) {
      const normalized = rawPhone.replace(/[\s-]/g, '');
      if (!/^\0\d{9}$/.test(normalized)) {
        errs.contact_phone = 'Must contain 10 digits';
      }
    }

    // Website validation: accept with or without scheme
    const rawSite = (data.website || '').trim();
    if (rawSite) {
      try {
        const candidate = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(rawSite)
          ? rawSite
          : `https://${rawSite}`;
        // URL constructor will throw if invalid
        // eslint-disable-next-line no-new
        new URL(candidate);
      } catch {
        errs.website = 'Enter a valid website URL.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  useEffect(() => {
    validate(editData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData.website, editData.contact_phone]);

  const handleSave = () => {
    const cleaned = {
      website: editData.website?.trim() ?? '',
      contact_phone: editData.contact_phone?.trim() ?? '',
    };
    const isValid = validate(cleaned);
    if (!isValid) return;
    // propagate cleaned values then call onSave
    onEditDataChange(cleaned);
    onSave();
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          Contact Information
        </h2>
        {editingSection === 'contact' ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={loading || Object.keys(errors).length > 0}
            >
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
              <>
                <Input
                  value={editData.website}
                  onChange={(e) =>
                    onEditDataChange({ ...editData, website: e.target.value })
                  }
                  placeholder="Add a website"
                  className="mt-1"
                />
                {errors.website && (
                  <p className="mt-1 text-sm text-red-600">{errors.website}</p>
                )}
              </>
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
              <>
                <Input
                  value={editData.contact_phone}
                  onChange={(e) =>
                    onEditDataChange({
                      ...editData,
                      contact_phone: e.target.value,
                    })
                  }
                  placeholder="Phone must be in 0XXXXXXXXX format"
                  className="mt-1"
                />
                {errors.contact_phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.contact_phone}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-600">
                {profile.contact_phone || 'Phone must be in 0XXXXXXXXX format'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
