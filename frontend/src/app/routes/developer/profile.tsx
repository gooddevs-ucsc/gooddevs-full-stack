import React, { useState, useEffect } from 'react';

import {
  useMyVolunteerProfile,
  useVolunteerProfileExists,
  useCreateVolunteerProfile,
  useUpdateVolunteerProfile,
  VolunteerProfile,
  VolunteerExperienceCreate,
  VolunteerProjectCreate,
} from '@/features/profiles/api';

// Interfaces for structured data
interface Project {
  title: string;
  description: string;
  link: string;
}

interface Experience {
  title: string;
  company: string;
  years: string;
  description: string;
}

export interface ProfileData {
  name: string;
  age: number;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  profilePhoto: string;
  skills: string[];
  experience: Experience[];
  projects: Project[];
  linkedinProfileUrl: string;
  githubProfileUrl?: string;
}

const DeveloperProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

  // API hooks
  const { data: profileExists, isLoading: checkingExists } =
    useVolunteerProfileExists();
  const {
    data: profileResponse,
    isLoading: loadingProfile,
    error: profileError,
  } = useMyVolunteerProfile();
  const createProfile = useCreateVolunteerProfile();
  const updateProfile = useUpdateVolunteerProfile();

  const profile = profileResponse?.data;
  const hasProfile = profileExists?.exists ?? false;

  // Form state for creating/editing profile
  const [formData, setFormData] = useState<{
    profile: {
      age?: number;
      title?: string;
      bio?: string;
      phone?: string;
      location?: string;
      profile_photo_url?: string;
      linkedin_profile_url?: string;
      github_profile_url?: string;
    };
    skills: string[];
    experiences: VolunteerExperienceCreate[];
    projects: VolunteerProjectCreate[];
  }>({
    profile: {},
    skills: [],
    experiences: [],
    projects: [],
  });

  // Local state for form inputs
  const [newSkill, setNewSkill] = useState<string>('');
  const [newExperience, setNewExperience] = useState<VolunteerExperienceCreate>(
    {
      title: '',
      company: '',
      years: '',
      description: '',
    },
  );
  const [newProject, setNewProject] = useState<VolunteerProjectCreate>({
    title: '',
    description: '',
    link: '',
  });

  // Initialize form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        profile: {
          age: profile.age,
          title: profile.title,
          bio: profile.bio,
          phone: profile.phone,
          location: profile.location,
          profile_photo_url: profile.profile_photo_url,
          linkedin_profile_url: profile.linkedin_profile_url,
          github_profile_url: profile.github_profile_url,
        },
        skills: profile.skills.map((skill) => skill.name),
        experiences: profile.experiences.map((exp) => ({
          title: exp.title,
          company: exp.company,
          years: exp.years,
          description: exp.description || '',
        })),
        projects: profile.projects.map((proj) => ({
          title: proj.title,
          description: proj.description || '',
          link: proj.link || '',
        })),
      });
    }
  }, [profile]);

  // Loading state
  if (checkingExists || loadingProfile) {
    return (
      <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-gray-200 bg-white p-10 shadow-lg">
        <div className="flex items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
          <span className="ml-3">Loading profile...</span>
        </div>
      </div>
    );
  }

  // No profile exists - show create button
  if (
    !hasProfile ||
    (profileError && 'status' in profileError && profileError.status === 404)
  ) {
    const handleCreateProfile = async () => {
      try {
        await createProfile.mutateAsync(formData);
        setShowCreateForm(false);
      } catch (error) {
        console.error('Failed to create profile:', error);
      }
    };

    if (!showCreateForm) {
      return (
        <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-gray-200 bg-white p-10 text-center shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            Create Your Developer Profile
          </h2>
          <p className="mb-6 text-gray-600">
            You haven&#39;t created a developer profile yet. Create one to
            showcase your skills and experience.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="rounded-lg bg-blue-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-600"
          >
            Create Profile
          </button>
        </div>
      );
    }

    // Show create form
    return (
      <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-gray-200 bg-white p-10 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            Create Your Profile
          </h2>
          <button
            onClick={() => setShowCreateForm(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
        {/* Create form will go here */}
        <ProfileForm
          formData={formData}
          setFormData={setFormData}
          newSkill={newSkill}
          setNewSkill={setNewSkill}
          newExperience={newExperience}
          setNewExperience={setNewExperience}
          newProject={newProject}
          setNewProject={setNewProject}
          onSubmit={handleCreateProfile}
          isSubmitting={createProfile.isPending}
          submitButtonText="Create Profile"
        />
      </div>
    );
  }

  // Profile exists - show profile view/edit
  const user = profile?.user;
  const displayName = user
    ? `${user.firstname || ''} ${user.lastname || ''}`.trim() || user.email
    : 'Unknown User';

  const handleUpdateProfile = async () => {
    try {
      await updateProfile.mutateAsync(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form data to original profile data
    if (profile) {
      setFormData({
        profile: {
          age: profile.age,
          title: profile.title,
          bio: profile.bio,
          phone: profile.phone,
          location: profile.location,
          profile_photo_url: profile.profile_photo_url,
          linkedin_profile_url: profile.linkedin_profile_url,
          github_profile_url: profile.github_profile_url,
        },
        skills: profile.skills.map((skill) => skill.name),
        experiences: profile.experiences.map((exp) => ({
          title: exp.title,
          company: exp.company,
          years: exp.years,
          description: exp.description || '',
        })),
        projects: profile.projects.map((proj) => ({
          title: proj.title,
          description: proj.description || '',
          link: proj.link || '',
        })),
      });
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-gray-200 bg-white p-10 shadow-lg">
      <div className="mb-4 flex justify-end gap-2">
        {isEditing ? (
          <>
            <button
              onClick={handleCancelEdit}
              className="rounded-lg bg-gray-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateProfile}
              disabled={updateProfile.isPending}
              className="rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600 disabled:bg-blue-300"
            >
              {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        ) : (
          <button
            onClick={handleEditToggle}
            className="rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600"
          >
            Edit Profile
          </button>
        )}
      </div>

      {isEditing ? (
        <ProfileForm
          formData={formData}
          setFormData={setFormData}
          newSkill={newSkill}
          setNewSkill={setNewSkill}
          newExperience={newExperience}
          setNewExperience={setNewExperience}
          newProject={newProject}
          setNewProject={setNewProject}
          onSubmit={handleUpdateProfile}
          isSubmitting={updateProfile.isPending}
          submitButtonText="Save Changes"
          user={user}
        />
      ) : (
        profile && <ProfileView profile={profile} displayName={displayName} />
      )}
    </div>
  );
};

// Helper Components
interface ProfileViewProps {
  profile: VolunteerProfile;
  displayName: string;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile, displayName }) => {
  return (
    <>
      {/* Profile Header */}
      <div className="mb-8 flex items-center space-x-8">
        <div className="relative">
          <img
            src={profile.profile_photo_url || '/profile.png'}
            alt="Profile"
            className="size-40 rounded-full border-4 border-blue-500 object-cover shadow-md"
          />
          {profile.age && (
            <span className="absolute bottom-2 right-2 rounded-full bg-blue-600 px-2 py-1 text-xs text-white shadow">
              Age: {profile.age}
            </span>
          )}
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            {displayName}
          </h2>
          {profile.title && (
            <p className="mt-1 text-lg font-semibold text-blue-700">
              {profile.title}
            </p>
          )}
          {profile.location && (
            <p className="text-sm text-gray-500">{profile.location}</p>
          )}
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <div className="mb-6">
          <h3 className="mb-2 font-semibold text-gray-800">Bio</h3>
          <p className="text-gray-700">{profile.bio}</p>
        </div>
      )}

      {/* Contact */}
      <div className="mb-6">
        <h3 className="mb-2 font-semibold text-gray-800">Contact</h3>
        <div className="flex flex-col gap-1">
          <span>
            <span className="font-medium text-gray-700">Email:</span>{' '}
            {profile.user.email}
          </span>
          {profile.phone && (
            <span>
              <span className="font-medium text-gray-700">Phone:</span>{' '}
              {profile.phone}
            </span>
          )}
          {profile.linkedin_profile_url && (
            <a
              href={profile.linkedin_profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 underline"
            >
              LinkedIn
            </a>
          )}
          {profile.github_profile_url && (
            <a
              href={profile.github_profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 underline"
            >
              GitHub
            </a>
          )}
        </div>
      </div>

      {/* Skills */}
      {profile.skills.length > 0 && (
        <>
          <hr className="my-6" />
          <h3 className="mb-2 font-semibold text-gray-800">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill.id}
                className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800 shadow"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </>
      )}

      {/* Experience */}
      {profile.experiences.length > 0 && (
        <>
          <hr className="my-6" />
          <h3 className="mb-2 font-semibold text-gray-800">Experience</h3>
          {profile.experiences.map((exp) => (
            <div
              key={exp.id}
              className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm"
            >
              <p className="font-medium text-blue-700">
                {exp.title}{' '}
                <span className="text-gray-600">- {exp.company}</span>
              </p>
              <p className="text-sm text-gray-500">{exp.years}</p>
              {exp.description && (
                <p className="text-gray-700">{exp.description}</p>
              )}
            </div>
          ))}
        </>
      )}

      {/* Projects */}
      {profile.projects.length > 0 && (
        <>
          <hr className="my-6" />
          <h3 className="mb-2 font-semibold text-gray-800">Projects</h3>
          {profile.projects.map((project) => (
            <div
              key={project.id}
              className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm"
            >
              {project.link ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 underline"
                >
                  {project.title}
                </a>
              ) : (
                <h4 className="font-medium text-gray-800">{project.title}</h4>
              )}
              {project.description && (
                <p className="text-gray-700">{project.description}</p>
              )}
            </div>
          ))}
        </>
      )}
    </>
  );
};

type FormDataType = {
  profile: {
    age?: number;
    title?: string;
    bio?: string;
    phone?: string;
    location?: string;
    profile_photo_url?: string;
    linkedin_profile_url?: string;
    github_profile_url?: string;
  };
  skills: string[];
  experiences: VolunteerExperienceCreate[];
  projects: VolunteerProjectCreate[];
};

interface ProfileFormProps {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  newSkill: string;
  setNewSkill: React.Dispatch<React.SetStateAction<string>>;
  newExperience: VolunteerExperienceCreate;
  setNewExperience: React.Dispatch<
    React.SetStateAction<VolunteerExperienceCreate>
  >;
  newProject: VolunteerProjectCreate;
  setNewProject: React.Dispatch<React.SetStateAction<VolunteerProjectCreate>>;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitButtonText: string;
  user?: {
    firstname?: string;
    lastname?: string;
    email: string;
  };
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  formData,
  setFormData,
  newSkill,
  setNewSkill,
  newExperience,
  setNewExperience,
  newProject,
  setNewProject,
  onSubmit,
  isSubmitting,
  submitButtonText,
  user,
}) => {
  const handleProfileChange = (field: string, value: any) => {
    setFormData((prev: FormDataType) => ({
      ...prev,
      profile: { ...prev.profile, [field]: value },
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev: typeof formData) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    setFormData((prev: FormDataType) => ({
      ...prev,
      skills: prev.skills.filter((skill: string) => skill !== skillToDelete),
    }));
  };

  const handleAddExperience = () => {
    if (newExperience.title.trim() && newExperience.company.trim()) {
      setFormData((prev: FormDataType) => ({
        ...prev,
        experiences: [...prev.experiences, newExperience],
      }));
      setNewExperience({ title: '', company: '', years: '', description: '' });
    }
  };

  const handleDeleteExperience = (index: number) => {
    setFormData((prev: FormDataType) => ({
      ...prev,
      experiences: prev.experiences.filter(
        (_: VolunteerExperienceCreate, i: number) => i !== index,
      ),
    }));
  };

  const handleAddProject = () => {
    if (newProject.title.trim()) {
      setFormData((prev: FormDataType) => ({
        ...prev,
        projects: [...prev.projects, newProject],
      }));
      setNewProject({ title: '', description: '', link: '' });
    }
  };

  const handleDeleteProject = (index: number) => {
    setFormData((prev: FormDataType) => ({
      ...prev,
      projects: prev.projects.filter(
        (_: VolunteerProjectCreate, i: number) => i !== index,
      ),
    }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      {/* Profile Header */}
      <div className="mb-8 flex items-center space-x-8">
        <div className="relative">
          <img
            src={formData.profile.profile_photo_url || '/profile.png'}
            alt="Profile"
            className="size-40 rounded-full border-4 border-blue-500 object-cover shadow-md"
          />
        </div>
        <div className="flex-1">
          {user && (
            <h2 className="mb-2 text-2xl font-bold text-gray-800">
              {`${user.firstname || ''} ${user.lastname || ''}`.trim() ||
                user.email}
            </h2>
          )}
          <div className="space-y-3">
            <input
              type="number"
              value={formData.profile.age || ''}
              onChange={(e) =>
                handleProfileChange(
                  'age',
                  parseInt(e.target.value) || undefined,
                )
              }
              placeholder="Age"
              className="w-full rounded border px-3 py-2"
              min="18"
              max="100"
            />
            <input
              type="text"
              value={formData.profile.title || ''}
              onChange={(e) => handleProfileChange('title', e.target.value)}
              placeholder="Job Title"
              className="w-full rounded border px-3 py-2"
            />
            <input
              type="text"
              value={formData.profile.location || ''}
              onChange={(e) => handleProfileChange('location', e.target.value)}
              placeholder="Location"
              className="w-full rounded border px-3 py-2"
            />
            <input
              type="url"
              value={formData.profile.profile_photo_url || ''}
              onChange={(e) =>
                handleProfileChange('profile_photo_url', e.target.value)
              }
              placeholder="Profile Photo URL"
              className="w-full rounded border px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="mb-6">
        <h3 className="mb-2 font-semibold text-gray-800">Bio</h3>
        <textarea
          value={formData.profile.bio || ''}
          onChange={(e) => handleProfileChange('bio', e.target.value)}
          placeholder="Tell us about yourself..."
          className="w-full rounded border px-3 py-2"
          rows={4}
        />
      </div>

      {/* Contact */}
      <div className="mb-6">
        <h3 className="mb-2 font-semibold text-gray-800">Contact</h3>
        <div className="space-y-3">
          <input
            type="tel"
            value={formData.profile.phone || ''}
            onChange={(e) => handleProfileChange('phone', e.target.value)}
            placeholder="Phone Number"
            className="w-full rounded border px-3 py-2"
          />
          <input
            type="url"
            value={formData.profile.linkedin_profile_url || ''}
            onChange={(e) =>
              handleProfileChange('linkedin_profile_url', e.target.value)
            }
            placeholder="LinkedIn URL"
            className="w-full rounded border px-3 py-2"
          />
          <input
            type="url"
            value={formData.profile.github_profile_url || ''}
            onChange={(e) =>
              handleProfileChange('github_profile_url', e.target.value)
            }
            placeholder="GitHub URL"
            className="w-full rounded border px-3 py-2"
          />
        </div>
      </div>

      {/* Skills */}
      <hr className="my-6" />
      <h3 className="mb-2 font-semibold text-gray-800">Skills</h3>
      <div className="mb-4 flex flex-wrap gap-2">
        {formData.skills.map((skill, idx) => (
          <span
            key={idx}
            className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800"
          >
            {skill}
            <button
              type="button"
              onClick={() => handleDeleteSkill(skill)}
              className="ml-2 text-blue-800 hover:text-blue-900"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add new skill"
          className="flex-1 rounded border px-3 py-2"
        />
        <button
          type="button"
          onClick={handleAddSkill}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      {/* Experience */}
      <hr className="my-6" />
      <h3 className="mb-2 font-semibold text-gray-800">Experience</h3>
      {formData.experiences.map((exp, idx) => (
        <div key={idx} className="mb-4 rounded border bg-gray-50 p-4">
          <div className="mb-3 flex items-start justify-between">
            <h4 className="font-medium">Experience {idx + 1}</h4>
            <button
              type="button"
              onClick={() => handleDeleteExperience(idx)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
          <div className="space-y-2">
            <input
              type="text"
              value={exp.title}
              onChange={(e) => {
                const updated = [...formData.experiences];
                updated[idx] = { ...updated[idx], title: e.target.value };
                setFormData((prev: FormDataType) => ({
                  ...prev,
                  experiences: updated,
                }));
              }}
              placeholder="Job Title"
              className="w-full rounded border px-3 py-2"
            />
            <input
              type="text"
              value={exp.company}
              onChange={(e) => {
                const updated = [...formData.experiences];
                updated[idx] = { ...updated[idx], company: e.target.value };
                setFormData((prev: FormDataType) => ({
                  ...prev,
                  experiences: updated,
                }));
              }}
              placeholder="Company"
              className="w-full rounded border px-3 py-2"
            />
            <input
              type="text"
              value={exp.years}
              onChange={(e) => {
                const updated = [...formData.experiences];
                updated[idx] = { ...updated[idx], years: e.target.value };
                setFormData((prev: FormDataType) => ({
                  ...prev,
                  experiences: updated,
                }));
              }}
              placeholder="Years (e.g., 2020-2023)"
              className="w-full rounded border px-3 py-2"
            />
            <textarea
              value={exp.description || ''}
              onChange={(e) => {
                const updated = [...formData.experiences];
                updated[idx] = { ...updated[idx], description: e.target.value };
                setFormData((prev: FormDataType) => ({
                  ...prev,
                  experiences: updated,
                }));
              }}
              placeholder="Description"
              className="w-full rounded border px-3 py-2"
              rows={3}
            />
          </div>
        </div>
      ))}

      {/* Add New Experience */}
      <div className="mb-6 rounded border bg-gray-50 p-4">
        <h4 className="mb-3 font-medium">Add New Experience</h4>
        <div className="space-y-2">
          <input
            type="text"
            value={newExperience.title}
            onChange={(e) =>
              setNewExperience((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Job Title"
            className="w-full rounded border px-3 py-2"
          />
          <input
            type="text"
            value={newExperience.company}
            onChange={(e) =>
              setNewExperience((prev) => ({ ...prev, company: e.target.value }))
            }
            placeholder="Company"
            className="w-full rounded border px-3 py-2"
          />
          <input
            type="text"
            value={newExperience.years}
            onChange={(e) =>
              setNewExperience((prev) => ({ ...prev, years: e.target.value }))
            }
            placeholder="Years (e.g., 2020-2023)"
            className="w-full rounded border px-3 py-2"
          />
          <textarea
            value={newExperience.description || ''}
            onChange={(e) =>
              setNewExperience((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="Description"
            className="w-full rounded border px-3 py-2"
            rows={2}
          />
          <button
            type="button"
            onClick={handleAddExperience}
            className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Add Experience
          </button>
        </div>
      </div>

      {/* Projects */}
      <hr className="my-6" />
      <h3 className="mb-2 font-semibold text-gray-800">Projects</h3>
      {formData.projects.map((project, idx) => (
        <div key={idx} className="mb-4 rounded border bg-gray-50 p-4">
          <div className="mb-3 flex items-start justify-between">
            <h4 className="font-medium">Project {idx + 1}</h4>
            <button
              type="button"
              onClick={() => handleDeleteProject(idx)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
          <div className="space-y-2">
            <input
              type="text"
              value={project.title}
              onChange={(e) => {
                const updated = [...formData.projects];
                updated[idx] = { ...updated[idx], title: e.target.value };
                setFormData((prev: FormDataType) => ({
                  ...prev,
                  projects: updated,
                }));
              }}
              placeholder="Project Title"
              className="w-full rounded border px-3 py-2"
            />
            <textarea
              value={project.description || ''}
              onChange={(e) => {
                const updated = [...formData.projects];
                updated[idx] = { ...updated[idx], description: e.target.value };
                setFormData((prev: FormDataType) => ({
                  ...prev,
                  projects: updated,
                }));
              }}
              placeholder="Project Description"
              className="w-full rounded border px-3 py-2"
              rows={3}
            />
            <input
              type="url"
              value={project.link || ''}
              onChange={(e) => {
                const updated = [...formData.projects];
                updated[idx] = { ...updated[idx], link: e.target.value };
                setFormData((prev: FormDataType) => ({
                  ...prev,
                  projects: updated,
                }));
              }}
              placeholder="Project Link"
              className="w-full rounded border px-3 py-2"
            />
          </div>
        </div>
      ))}

      {/* Add New Project */}
      <div className="mb-6 rounded border bg-gray-50 p-4">
        <h4 className="mb-3 font-medium">Add New Project</h4>
        <div className="space-y-2">
          <input
            type="text"
            value={newProject.title}
            onChange={(e) =>
              setNewProject((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Project Title"
            className="w-full rounded border px-3 py-2"
          />
          <textarea
            value={newProject.description || ''}
            onChange={(e) =>
              setNewProject((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="Project Description"
            className="w-full rounded border px-3 py-2"
            rows={2}
          />
          <input
            type="url"
            value={newProject.link || ''}
            onChange={(e) =>
              setNewProject((prev) => ({ ...prev, link: e.target.value }))
            }
            placeholder="Project Link"
            className="w-full rounded border px-3 py-2"
          />
          <button
            type="button"
            onClick={handleAddProject}
            className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Add Project
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isSubmitting ? 'Saving...' : submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default DeveloperProfilePage;
