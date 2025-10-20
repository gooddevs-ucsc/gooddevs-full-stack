import { Briefcase, Edit2, Plus, Save, Trash2, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { ExperienceItem, VolunteerProfile } from '../api/get-volunteer-profile';

interface ExperienceCardProps {
  profile: VolunteerProfile;
  onEdit: (section: string) => void;
  onSave: () => void;
  onCancel: () => void;
  editingSection: string | null;
  editData: {
    experience: ExperienceItem[];
  };
  onEditDataChange: (data: { experience: ExperienceItem[] }) => void;
  loading: boolean;
  isOwner: boolean;
}

export const ExperienceCard = ({
  profile,
  onEdit,
  onSave,
  onCancel,
  editingSection,
  editData,
  onEditDataChange,
  loading,
  isOwner,
}: ExperienceCardProps) => {
  const [newExperience, setNewExperience] = useState<ExperienceItem>({
    id: '',
    title: '',
    company: '',
    duration: '',
    description: '',
    technologies: [],
    current: false,
  });

  const handleAddExperience = () => {
    if (newExperience.title.trim() && newExperience.company.trim()) {
      const experienceToAdd = {
        ...newExperience,
        id: `exp_${Date.now()}`, // Temporary ID for new experiences
      };

      onEditDataChange({
        experience: [...editData.experience, experienceToAdd],
      });

      setNewExperience({
        id: '',
        title: '',
        company: '',
        duration: '',
        description: '',
        technologies: [],
        current: false,
      });
    }
  };

  const handleRemoveExperience = (index: number) => {
    const updatedExperience = editData.experience.filter((_, i) => i !== index);
    onEditDataChange({ experience: updatedExperience });
  };

  const handleUpdateExperience = (
    index: number,
    field: keyof ExperienceItem,
    value: any,
  ) => {
    const updatedExperience = editData.experience.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp,
    );
    onEditDataChange({ experience: updatedExperience });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Experience</h2>
        {isOwner && (
          <>
            {editingSection === 'experience' ? (
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
                onClick={() => onEdit('experience')}
                disabled={loading}
              >
                <Edit2 className="size-4" />
              </Button>
            )}
          </>
        )}
      </div>

      {editingSection === 'experience' ? (
        <div className="space-y-6">
          {/* Existing experiences */}
          {editData.experience.map((exp, index) => (
            <div
              key={index}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <div className="mb-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveExperience(index)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  value={exp.title}
                  onChange={(e) =>
                    handleUpdateExperience(index, 'title', e.target.value)
                  }
                  placeholder="Job Title"
                />
                <Input
                  value={exp.company}
                  onChange={(e) =>
                    handleUpdateExperience(index, 'company', e.target.value)
                  }
                  placeholder="Company"
                />
                <Input
                  value={exp.duration}
                  onChange={(e) =>
                    handleUpdateExperience(index, 'duration', e.target.value)
                  }
                  placeholder="Duration (e.g., Jan 2020 - Present)"
                />
                <div className="flex items-center gap-2">
                  <input
                    id={`current-${index}`}
                    type="checkbox"
                    checked={exp.current || false}
                    onChange={(e) =>
                      handleUpdateExperience(index, 'current', e.target.checked)
                    }
                    className="rounded border-gray-300"
                  />
                  <label
                    htmlFor={`current-${index}`}
                    className="text-sm text-slate-600"
                  >
                    Current position
                  </label>
                </div>
              </div>

              <textarea
                value={exp.description}
                onChange={(e) =>
                  handleUpdateExperience(index, 'description', e.target.value)
                }
                placeholder="Describe your responsibilities and achievements..."
                className="mt-4 w-full rounded-md border border-slate-300 p-3"
                rows={3}
              />
            </div>
          ))}

          {/* Add new experience form */}
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
            <h4 className="mb-4 font-medium text-slate-900">
              Add New Experience
            </h4>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                value={newExperience.title}
                onChange={(e) =>
                  setNewExperience({ ...newExperience, title: e.target.value })
                }
                placeholder="Job Title"
              />
              <Input
                value={newExperience.company}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    company: e.target.value,
                  })
                }
                placeholder="Company"
              />
              <Input
                value={newExperience.duration}
                onChange={(e) =>
                  setNewExperience({
                    ...newExperience,
                    duration: e.target.value,
                  })
                }
                placeholder="Duration (e.g., Jan 2020 - Present)"
              />
              <div className="flex items-center gap-2">
                <input
                  id="new-current"
                  type="checkbox"
                  checked={newExperience.current}
                  onChange={(e) =>
                    setNewExperience({
                      ...newExperience,
                      current: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300"
                />
                <label htmlFor="new-current" className="text-sm text-slate-600">
                  Current position
                </label>
              </div>
            </div>

            <textarea
              value={newExperience.description}
              onChange={(e) =>
                setNewExperience({
                  ...newExperience,
                  description: e.target.value,
                })
              }
              placeholder="Describe your responsibilities and achievements..."
              className="mt-4 w-full rounded-md border border-slate-300 p-3"
              rows={3}
            />

            <Button
              onClick={handleAddExperience}
              className="mt-4"
              disabled={
                !newExperience.title.trim() || !newExperience.company.trim()
              }
            >
              <Plus className="mr-2 size-4" />
              Add Experience
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {profile.experience && profile.experience.length > 0 ? (
            profile.experience.map((exp: any, index) => (
              <div
                key={index}
                className="flex gap-4 rounded-lg border border-slate-200 p-4"
              >
                <div className="mt-1 rounded-lg bg-blue-100 p-2">
                  <Briefcase className="size-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {exp.title}
                      </h3>
                      <p className="text-slate-600">{exp.company}</p>
                      <p className="text-sm text-slate-500">{exp.duration}</p>
                    </div>
                    {exp.current && (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        Current
                      </span>
                    )}
                  </div>
                  {exp.description && (
                    <p className="mt-2 text-sm text-slate-600">
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-slate-500">
              {isOwner
                ? 'Add your work experience to showcase your professional background.'
                : 'No experience listed yet.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
