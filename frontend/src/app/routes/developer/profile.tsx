import React, { useState } from 'react';

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
}

const DeveloperProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'Vihan Perera',
    age: 29,
    title: 'Senior Frontend Developer',
    bio: 'Passionate about crafting intuitive and performant user interfaces. Experienced in React, TypeScript, and modern web development practices.',
    email: 'vihan@gmail.com',
    phone: '+94 77 123 4567',
    location: 'Colombo, Sri Lanka',
    profilePhoto: '/profile.png',
    skills: [
      'React',
      'TypeScript',
      'JavaScript',
      'Next.js',
      'Tailwind CSS',
      'Node.js',
      'Express',
      'MongoDB',
      'PostgreSQL',
      'Git',
      'AWS Basics',
      'UI/UX Design',
      'Agile Methodologies',
    ],
    experience: [
      {
        title: 'Senior Frontend Developer',
        company: 'Innovate Tech Solutions',
        years: 'Jan 2022 - Present',
        description:
          'Led development of scalable web applications using React and Next.js, mentored junior developers, and optimized application performance by 25%.',
      },
      {
        title: 'Frontend Developer',
        company: 'Creative Web Works',
        years: 'Mar 2019 - Dec 2021',
        description:
          'Developed responsive user interfaces from design mockups, integrated with various RESTful APIs, and contributed to component library development.',
      },
    ],
    projects: [
      {
        title: 'E-commerce Platform Redesign',
        description:
          'Led the frontend redesign of a high-traffic e-commerce site, resulting in a 15% increase in conversion rates.',
        link: 'https://www.example.com/project-ecommerce',
      },
      {
        title: 'Real-time Chat Application',
        description:
          'Developed a real-time chat application using WebSockets and React.',
        link: 'https://www.example.com/project-chat',
      },
      {
        title: 'Dashboard Analytics Tool',
        description:
          'Built an interactive data visualization dashboard for business intelligence.',
        link: 'https://www.example.com/project-dashboard',
      },
    ],
    linkedinProfileUrl: 'https://www.linkedin.com/in/janedoe',
  });

  // State for new skill input
  const [newSkill, setNewSkill] = useState<string>('');
  // State for new experience input
  const [newExperience, setNewExperience] = useState<Experience>({
    title: '',
    company: '',
    years: '',
    description: '',
  });
  // State for new project input
  const [newProject, setNewProject] = useState<Project>({
    title: '',
    description: '',
    link: '',
  });

  // --- Handlers for general input fields ---
  const handleGenericChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleEditToggle = () => setIsEditing((prev) => !prev);

  // --- Save/Cancel for the entire form ---
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // In a real application, you would send profileData to your backend API here
    console.log('Profile data saved:', profileData);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Optionally, reset profileData to its original state before editing if you track it
    // For this example, we just exit edit mode without changing data if not saved.
  };

  // --- Skills Handlers ---
  const handleAddSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData((prevData) => ({
        ...prevData,
        skills: [...prevData.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    setProfileData((prevData) => ({
      ...prevData,
      skills: prevData.skills.filter((skill) => skill !== skillToDelete),
    }));
  };

  // --- Experience Handlers ---
  const handleExperienceInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    field: keyof Experience,
  ) => {
    const updatedExperience = profileData.experience.map((exp, i) =>
      i === index ? { ...exp, [field]: e.target.value } : exp,
    );
    setProfileData((prevData) => ({
      ...prevData,
      experience: updatedExperience,
    }));
  };

  const handleAddExperience = () => {
    if (newExperience.title.trim() && newExperience.company.trim()) {
      setProfileData((prevData) => ({
        ...prevData,
        experience: [...prevData.experience, newExperience],
      }));
      setNewExperience({ title: '', company: '', years: '', description: '' });
    } else {
      alert(
        'Please fill at least the title and company for the new experience.',
      );
    }
  };

  const handleDeleteExperience = (index: number) => {
    setProfileData((prevData) => ({
      ...prevData,
      experience: prevData.experience.filter((_, i) => i !== index),
    }));
  };

  // --- Project Handlers ---
  const handleProjectInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    field: keyof Project,
  ) => {
    const updatedProjects = profileData.projects.map((proj, i) =>
      i === index ? { ...proj, [field]: e.target.value } : proj,
    );
    setProfileData((prevData) => ({
      ...prevData,
      projects: updatedProjects,
    }));
  };

  const handleAddProject = () => {
    if (newProject.title.trim()) {
      setProfileData((prevData) => ({
        ...prevData,
        projects: [...prevData.projects, newProject],
      }));
      setNewProject({ title: '', description: '', link: '' });
    } else {
      alert('Please fill at least the title for the new project.');
    }
  };

  const handleDeleteProject = (index: number) => {
    setProfileData((prevData) => ({
      ...prevData,
      projects: prevData.projects.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-gray-200 bg-white p-10 shadow-lg">
      <form onSubmit={handleSave}>
        <div className="mb-4 flex justify-end gap-2">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 shadow hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-green-600 px-4 py-2 text-white shadow hover:bg-green-700"
              >
                Save Changes ✅
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleEditToggle}
              className="rounded-md bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
            >
              Edit Profile ✏️
            </button>
          )}
        </div>
        {/* --- Profile Header Section --- */}
        <div className="mb-8 flex items-center space-x-8">
          <div className="relative">
            <img
              src={profileData.profilePhoto}
              alt="Profile"
              className="size-40 rounded-full border-4 border-blue-500 object-cover shadow-md"
            />
            <span className="absolute bottom-2 right-2 rounded-full bg-blue-600 px-2 py-1 text-xs text-white shadow">
              Age: {profileData.age}
            </span>
          </div>
          <div>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleGenericChange}
                  className="w-full rounded border px-2 py-1 text-2xl font-bold"
                />
                <input
                  type="number"
                  name="age"
                  value={profileData.age}
                  onChange={handleGenericChange}
                  className="mt-1 w-full rounded border px-2 py-1"
                  min={0}
                />
                <input
                  type="text"
                  name="title"
                  value={profileData.title}
                  onChange={handleGenericChange}
                  className="mt-1 w-full rounded border px-2 py-1 font-semibold text-blue-700"
                />
                <input
                  type="text"
                  name="location"
                  value={profileData.location}
                  onChange={handleGenericChange}
                  className="mt-1 w-full rounded border px-2 py-1 text-sm text-gray-500"
                />
                <input
                  type="text"
                  name="profilePhoto"
                  value={profileData.profilePhoto}
                  onChange={handleGenericChange}
                  className="mt-1 w-full rounded border px-2 py-1 text-sm text-gray-500"
                  placeholder="Profile photo URL"
                />
              </>
            ) : (
              <>
                <h2 className="text-3xl font-extrabold text-gray-900">
                  {profileData.name}
                </h2>
                <p className="mt-1 text-lg font-semibold text-blue-700">
                  {profileData.title}
                </p>
                <p className="text-sm text-gray-500">{profileData.location}</p>
              </>
            )}
          </div>
        </div>
        {/* --- Bio Section --- */}
        <div className="mb-6">
          <h3 className="mb-2 font-semibold text-gray-800">Bio</h3>
          {isEditing ? (
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleGenericChange}
              className="w-full rounded border px-2 py-1 text-gray-700"
              rows={4}
            />
          ) : (
            <p className="text-gray-700">{profileData.bio}</p>
          )}
        </div>
        {/* --- Contact Section --- */}
        <div className="mb-6">
          <h3 className="mb-2 font-semibold text-gray-800">Contact</h3>
          <div className="flex flex-col gap-1">
            {isEditing ? (
              <>
                <label
                  htmlFor="profile-email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email:
                </label>
                <input
                  id="profile-email"
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleGenericChange}
                  className="w-full rounded border px-2 py-1"
                />
                <label
                  htmlFor="profile-phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone:
                </label>
                <input
                  id="profile-phone"
                  type="text"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleGenericChange}
                  className="w-full rounded border px-2 py-1"
                />
                <label
                  htmlFor="profile-linkedin-url"
                  className="block text-sm font-medium text-gray-700"
                >
                  LinkedIn URL:
                </label>
                <input
                  id="profile-linkedin-url"
                  type="url"
                  name="linkedinProfileUrl"
                  value={profileData.linkedinProfileUrl}
                  onChange={handleGenericChange}
                  className="w-full rounded border px-2 py-1"
                />
              </>
            ) : (
              <>
                <span>
                  <span className="font-medium text-gray-700">Email:</span>{' '}
                  {profileData.email}
                </span>
                <span>
                  <span className="font-medium text-gray-700">Phone:</span>{' '}
                  {profileData.phone}
                </span>
                <a
                  href={profileData.linkedinProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 underline"
                >
                  LinkedIn
                </a>
              </>
            )}
          </div>
        </div>
        {/* --- Skills Section --- */}
        <hr className="my-6" />
        <h3 className="mb-2 font-semibold text-gray-800">Skills</h3>
        {isEditing ? (
          <>
            <div className="mb-4 flex flex-wrap gap-2">
              {profileData.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800 shadow"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleDeleteSkill(skill)}
                    className="ml-2 text-blue-800 hover:text-blue-900 focus:outline-none"
                  >
                    &times;
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
                className="grow rounded-md border border-gray-300 p-2"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-wrap gap-2">
            {profileData.skills.map((skill, idx) => (
              <span
                key={idx}
                className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800 shadow"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
        {/* --- Experience Section --- */}
        <hr className="my-6" />
        <h3 className="mb-2 font-semibold text-gray-800">Experience</h3>
        {isEditing ? (
          <>
            {profileData.experience.map((exp, idx) => (
              <div
                key={idx}
                className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm"
              >
                <div className="mb-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleDeleteExperience(idx)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    Delete Experience
                  </button>
                </div>
                <div className="mb-2">
                  <label
                    htmlFor={`experience-title-${idx}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Title
                  </label>
                  <input
                    id={`experience-title-${idx}`}
                    type="text"
                    value={exp.title}
                    onChange={(e) =>
                      handleExperienceInputChange(e, idx, 'title')
                    }
                    className="w-full rounded-md border border-gray-300 p-2"
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor={`experience-company-${idx}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Company
                  </label>
                  <input
                    id={`experience-company-${idx}`}
                    type="text"
                    value={exp.company}
                    onChange={(e) =>
                      handleExperienceInputChange(e, idx, 'company')
                    }
                    className="w-full rounded-md border border-gray-300 p-2"
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor={`experience-years-${idx}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Years
                  </label>
                  <input
                    id={`experience-years-${idx}`}
                    type="text"
                    value={exp.years}
                    onChange={(e) =>
                      handleExperienceInputChange(e, idx, 'years')
                    }
                    className="w-full rounded-md border border-gray-300 p-2"
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor={`experience-description-${idx}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id={`experience-description-${idx}`}
                    value={exp.description}
                    onChange={(e) =>
                      handleExperienceInputChange(e, idx, 'description')
                    }
                    rows={3}
                    className="w-full rounded-md border border-gray-300 p-2"
                  ></textarea>
                </div>
              </div>
            ))}
            {/* Add New Experience Form */}
            <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm">
              <h4 className="mb-2 text-base font-semibold text-gray-800">
                Add New Experience
              </h4>
              <div className="mb-2">
                <label
                  htmlFor="new-experience-title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  id="new-experience-title"
                  type="text"
                  value={newExperience.title}
                  onChange={(e) =>
                    setNewExperience((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 p-2"
                  placeholder="e.g., Software Engineer"
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="new-experience-company"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company
                </label>
                <input
                  id="new-experience-company"
                  type="text"
                  value={newExperience.company}
                  onChange={(e) =>
                    setNewExperience((prev) => ({
                      ...prev,
                      company: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 p-2"
                  placeholder="e.g., Tech Innovations"
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="new-experience-years"
                  className="block text-sm font-medium text-gray-700"
                >
                  Years
                </label>
                <input
                  id="new-experience-years"
                  type="text"
                  value={newExperience.years}
                  onChange={(e) =>
                    setNewExperience((prev) => ({
                      ...prev,
                      years: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 p-2"
                  placeholder="e.g., 2020 - 2023"
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="new-experience-description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="new-experience-description"
                  value={newExperience.description}
                  onChange={(e) =>
                    setNewExperience((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={2}
                  className="w-full rounded-md border border-gray-300 p-2"
                  placeholder="Brief description of responsibilities..."
                ></textarea>
              </div>
              <button
                type="button"
                onClick={handleAddExperience}
                className="mt-2 rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              >
                Add New Experience
              </button>
            </div>
          </>
        ) : (
          profileData.experience.map((exp, idx) => (
            <div
              key={idx}
              className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm"
            >
              <p className="font-medium text-blue-700">
                {exp.title}{' '}
                <span className="text-gray-600">- {exp.company}</span>
              </p>
              <p className="text-sm text-gray-500">{exp.years}</p>
              <p className="text-gray-700">{exp.description}</p>
            </div>
          ))
        )}
        {/* --- Projects Section --- */}
        <hr className="my-6" />
        <h3 className="mb-2 font-semibold text-gray-800">Projects</h3>
        {isEditing ? (
          <>
            {profileData.projects.map((project, idx) => (
              <div
                key={idx}
                className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm"
              >
                <div className="mb-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleDeleteProject(idx)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    Delete Project
                  </button>
                </div>
                <div className="mb-2">
                  <label
                    htmlFor={`project-title-${idx}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Title
                  </label>
                  <input
                    id={`project-title-${idx}`}
                    type="text"
                    value={project.title}
                    onChange={(e) => handleProjectInputChange(e, idx, 'title')}
                    className="w-full rounded-md border border-gray-300 p-2"
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor={`project-description-${idx}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id={`project-description-${idx}`}
                    value={project.description}
                    onChange={(e) =>
                      handleProjectInputChange(e, idx, 'description')
                    }
                    rows={3}
                    className="w-full rounded-md border border-gray-300 p-2"
                  ></textarea>
                </div>
                <div className="mb-2">
                  <label
                    htmlFor={`project-link-${idx}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Link
                  </label>
                  <input
                    id={`project-link-${idx}`}
                    type="url"
                    value={project.link}
                    onChange={(e) => handleProjectInputChange(e, idx, 'link')}
                    className="w-full rounded-md border border-gray-300 p-2"
                  />
                </div>
              </div>
            ))}
            {/* Add New Project Form */}
            <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm">
              <h4 className="mb-2 text-base font-semibold text-gray-800">
                Add New Project
              </h4>
              <div className="mb-2">
                <label
                  htmlFor="new-project-title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  id="new-project-title"
                  type="text"
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 p-2"
                  placeholder="e.g., My Awesome App"
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="new-project-description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="new-project-description"
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={2}
                  className="w-full rounded-md border border-gray-300 p-2"
                  placeholder="Brief description of the project..."
                ></textarea>
              </div>
              <div className="mb-2">
                <label
                  htmlFor="new-project-link"
                  className="block text-sm font-medium text-gray-700"
                >
                  Link
                </label>
                <input
                  id="new-project-link"
                  type="url"
                  value={newProject.link}
                  onChange={(e) =>
                    setNewProject((prev) => ({ ...prev, link: e.target.value }))
                  }
                  className="w-full rounded-md border border-gray-300 p-2"
                  placeholder="https://your-project-link.com"
                />
              </div>
              <button
                type="button"
                onClick={handleAddProject}
                className="mt-2 rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              >
                Add New Project
              </button>
            </div>
          </>
        ) : (
          profileData.projects.map((project, idx) => (
            <div
              key={idx}
              className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm"
            >
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 underline"
              >
                {project.title}
              </a>
              <p className="text-gray-700">{project.description}</p>
            </div>
          ))
        )}
      </form>
    </div>
  );
};

export default DeveloperProfilePage;
