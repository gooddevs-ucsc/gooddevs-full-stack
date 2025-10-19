import { Edit2, Plus, Save, X } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { VolunteerProfile } from '../api/get-volunteer-profile';

interface SkillsCardProps {
  profile: VolunteerProfile;
  onEdit: (section: string) => void;
  onSave: () => void;
  onCancel: () => void;
  editingSection: string | null;
  editData: {
    skills: string[];
  };
  onEditDataChange: (data: { skills: string[] }) => void;
  loading: boolean;
  isOwner: boolean;
}

export const SkillsCard = ({
  profile,
  onEdit,
  onSave,
  onCancel,
  editingSection,
  editData,
  onEditDataChange,
  loading,
  isOwner,
}: SkillsCardProps) => {
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim() && !editData.skills.includes(newSkill.trim())) {
      onEditDataChange({
        skills: [...editData.skills, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onEditDataChange({
      skills: editData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          Skills & Technologies
        </h2>
        {isOwner && (
          <>
            {editingSection === 'skills' ? (
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
                onClick={() => onEdit('skills')}
                disabled={loading}
              >
                <Edit2 className="size-4" />
              </Button>
            )}
          </>
        )}
      </div>

      {editingSection === 'skills' ? (
        <div className="space-y-4">
          {/* Add new skill input */}
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a skill (e.g., React, Python, etc.)"
              className="flex-1"
            />
            <Button onClick={handleAddSkill} disabled={!newSkill.trim()}>
              <Plus className="size-4" />
            </Button>
          </div>

          {/* Skills list */}
          <div className="flex flex-wrap gap-2">
            {editData.skills.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-2 px-3 py-1 text-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-1 hover:text-red-600"
                  aria-label={`Remove ${skill}`}
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>

          {editData.skills.length === 0 && (
            <p className="text-sm text-slate-500">
              No skills added yet. Add your first skill above.
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {profile.skills && profile.skills.length > 0 ? (
            profile.skills.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-3 py-1 text-sm"
              >
                {skill}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-slate-500">
              {isOwner
                ? 'Add your skills to showcase your expertise.'
                : 'No skills listed yet.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
