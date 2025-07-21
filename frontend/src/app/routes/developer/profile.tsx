import React from 'react';

const DeveloperProfilePage = () => {
  const profileData = {
    name: 'Samuel Winskey',
    age: 29,
    title: 'Senior Frontend Developer',
    bio: 'Passionate about crafting intuitive and performant user interfaces. Experienced in React, TypeScript, and modern web development practices.',
    email: 'samuelwinskey@gmail.com',
    phone: '+94 77 123 4567',
    location: 'Colombo, Sri Lanka',
    profilePhoto: '/public/profile.png',
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
  };

  return (
    <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-gray-200 bg-white p-10 shadow-lg">
      <div className="mb-8 flex items-center space-x-8">
        <div className="relative">
          <img
            src={profileData.profilePhoto}
            alt="Profile"
            className="size-32 rounded-full border-4 border-blue-500 object-cover shadow-md"
          />
          <span className="absolute bottom-2 right-2 rounded-full bg-blue-600 px-2 py-1 text-xs text-white shadow">
            Age: {profileData.age}
          </span>
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            {profileData.name}
          </h2>
          <p className="mt-1 text-lg font-semibold text-blue-700">
            {profileData.title}
          </p>
          <p className="text-sm text-gray-500">{profileData.location}</p>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="mb-2 font-semibold text-gray-800">Bio</h3>
        <p className="text-gray-700">{profileData.bio}</p>
      </div>
      <div className="mb-6">
        <h3 className="mb-2 font-semibold text-gray-800">Contact</h3>
        <div className="flex flex-col gap-1">
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
        </div>
      </div>
      <div className="mb-6">
        <h3 className="mb-2 font-semibold text-gray-800">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {profileData.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800 shadow"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <h3 className="mb-2 font-semibold text-gray-800">Experience</h3>
        {profileData.experience.map((exp, idx) => (
          <div
            key={idx}
            className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm"
          >
            <p className="font-medium text-blue-700">
              {exp.title} <span className="text-gray-600">- {exp.company}</span>
            </p>
            <p className="text-sm text-gray-500">{exp.years}</p>
            <p className="text-gray-700">{exp.description}</p>
          </div>
        ))}
      </div>
      <div>
        <h3 className="mb-2 font-semibold text-gray-800">Projects</h3>
        {profileData.projects.map((project, idx) => (
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
        ))}
      </div>
    </div>
  );
};

export default DeveloperProfilePage;
