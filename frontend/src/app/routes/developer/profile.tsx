// c:/Users/Dell/gooddevs-full-stack/frontend/src/app/routes/developer/profile.tsx

import {
  Mail,
  Phone,
  MapPin,
  User,
  Briefcase,
  Link,
  Linkedin,
  UserCircle,
  FolderKanban,
} from 'lucide-react'; // Added FolderKanban icon
import React from 'react';

import { ContentLayout } from '@/components/layouts';

/**
 * Developer Profile Page Component
 */
const DeveloperProfilePage = () => {
  const profileData = {
    name: 'Samuel Winskey',
    title: 'Senior Frontend Developer',
    bio: 'Passionate about crafting intuitive and performant user interfaces. Experienced in React, TypeScript, and modern web development practices, committed to delivering high-quality, user-centric applications.',
    email: 'samuelwinskey@gmail.com',
    phone: '+94 77 123 4567', // Sri Lankan number example
    location: 'Colombo, Sri Lanka',

    // 🌟 CORRECT PATH FOR IMAGE DIRECTLY IN 'public' FOLDER 🌟
    // If your image is at C:/Users/Dell/gooddevs-full-stack/frontend/public/profile1.png
    profilePhoto: '/profile1.png', // <--- UPDATED PATH HERE

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
          'Led development of scalable web applications using React and Next.js, mentored junior developers, and optimized application performance by 25%. Collaborated cross-functionally to define project requirements.',
      },
      {
        title: 'Frontend Developer',
        company: 'Creative Web Works',
        years: 'Mar 2019 - Dec 2021',
        description:
          'Developed responsive user interfaces from design mockups, integrated with various RESTful APIs, and contributed to component library development.',
      },
    ],
    // Removed portfolioLink and linkedinLink from here

    // 🆕 Added a section for done projects
    projects: [
      {
        title: 'E-commerce Platform Redesign',
        description:
          'Led the frontend redesign of a high-traffic e-commerce site, resulting in a 15% increase in conversion rates through improved UX and performance optimizations.',
        link: 'https://www.example.com/project-ecommerce', // Replace with actual project link
      },
      {
        title: 'Real-time Chat Application',
        description:
          'Developed a real-time chat application using WebSockets and React, featuring group chats, private messaging, and notification systems.',
        link: 'https://www.example.com/project-chat', // Replace with actual project link
      },
      {
        title: 'Dashboard Analytics Tool',
        description:
          'Built an interactive data visualization dashboard for business intelligence, allowing users to filter, sort, and analyze complex datasets.',
        link: 'https://www.example.com/project-dashboard', // Replace with actual project link
      },
    ],
    // 🆕 Added a dedicated LinkedIn profile URL for a simple icon link
    linkedinProfileUrl: 'https://www.linkedin.com/in/janedoe', // Keep this if you want a subtle LinkedIn link
  };

  return (
    <ContentLayout title="Developer Profile">
      <div className="mx-auto my-8 max-w-5xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg lg:p-10">
        {/* Profile Header Section */}
        <div className="mb-8 flex flex-col items-center gap-8 border-b border-gray-200 pb-8 md:flex-row md:items-start">
          {/* Conditional Rendering for Profile Photo or Icon */}
          {profileData.profilePhoto ? (
            <img
              src={profileData.profilePhoto}
              alt={`${profileData.name}'s profile`}
              className="size-40 shrink-0 rounded-full border-4 border-blue-50 object-cover shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            />
          ) : (
            <div
              className="flex size-40 shrink-0 items-center justify-center rounded-full border-4 border-blue-50 bg-blue-100 shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg"
              title="No profile photo available"
            >
              <UserCircle size={100} className="text-blue-400" />
            </div>
          )}

          <div className="grow text-center md:text-left">
            <h1 className="mb-1 text-4xl font-extrabold leading-tight text-gray-900">
              {profileData.name}
            </h1>
            <p className="mb-3 text-2xl font-semibold text-blue-700">
              {profileData.title}
            </p>
            <p className="mx-auto max-w-2xl leading-relaxed text-gray-700 md:mx-0">
              {profileData.bio}
            </p>

            {/* Contact & Social Links (Modified) */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-base text-gray-600 md:justify-start">
              <span className="flex items-center gap-2">
                <Mail size={18} className="text-blue-500" /> {profileData.email}
              </span>
              <span className="flex items-center gap-2">
                <Phone size={18} className="text-blue-500" />{' '}
                {profileData.phone}
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={18} className="text-blue-500" />{' '}
                {profileData.location}
              </span>
              {/* LinkedIn icon link added here */}
              {profileData.linkedinProfileUrl && (
                <a
                  href={profileData.linkedinProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 transition-colors hover:text-blue-800"
                  title="View LinkedIn Profile"
                >
                  <Linkedin size={18} className="text-blue-500" />{' '}
                  https://www.linkedin.com/in/samuel-winskey-a79394567/
                </a>
              )}
            </div>

            {/* Removed the large portfolio and linkedin buttons here */}
            {/* <div className="flex justify-center md:justify-start gap-4 mt-6">
              <a
                href={profileData.portfolioLink}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Link size={20} className="mr-2" /> View Portfolio
              </a>
              <a
                href={profileData.linkedinLink}
                className="inline-flex items-center px-6 py-3 border border-blue-500 text-base font-medium rounded-lg text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={20} className="mr-2" /> LinkedIn Profile
              </a>
            </div> */}
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-8">
          <h2 className="mb-5 flex items-center gap-3 text-2xl font-bold text-gray-800">
            <User size={26} className="text-blue-600" /> Skills & Expertise
          </h2>
          <div className="flex flex-wrap gap-3">
            {profileData.skills.map((skill, index) => (
              <span
                key={index}
                className="cursor-default rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-800 shadow-sm transition-colors hover:bg-blue-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Experience Section */}
        <div className="mb-8">
          <h2 className="mb-5 flex items-center gap-3 text-2xl font-bold text-gray-800">
            <Briefcase size={26} className="text-blue-600" /> Professional
            Experience
          </h2>
          <div className="space-y-7">
            {profileData.experience.map((job, index) => (
              <div
                key={index}
                className="border-l-4 border-blue-400 py-1 pl-5 transition-all duration-300 hover:border-blue-600"
              >
                <h3 className="mb-1 text-xl font-semibold text-gray-900">
                  {job.title}
                </h3>
                <p className="text-lg font-medium text-blue-600">
                  {job.company}
                </p>
                <p className="mb-2 text-sm italic text-gray-500">{job.years}</p>
                <p className="leading-relaxed text-gray-700">
                  {job.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 🆕 Projects Section */}
        <div className="mb-8">
          <h2 className="mb-5 flex items-center gap-3 text-2xl font-bold text-gray-800">
            <FolderKanban size={26} className="text-blue-600" />
            Projects
          </h2>
          <div className="space-y-6">
            {profileData.projects.map((project, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {project.title}
                </h3>
                <p className="mb-3 text-gray-700">{project.description}</p>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center font-medium text-blue-600 transition-colors hover:text-blue-800"
                  >
                    <Link size={16} className="mr-1" /> View Project
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action/Footer */}
        <div className="border-t border-gray-200 pt-8 text-center text-base italic text-gray-500">
          <p>{'Committed to building impactful solutions.'}</p>
          <p className="mt-2 font-semibold text-blue-600">
            {"Ready to collaborate? Let's connect!"}
          </p>
        </div>
      </div>
    </ContentLayout>
  );
};

export default DeveloperProfilePage;
