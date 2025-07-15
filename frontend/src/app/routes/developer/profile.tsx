// c:/Users/Dell/gooddevs-full-stack/frontend/src/app/routes/developer/profile.tsx

import React from 'react';
import { ContentLayout } from '@/components/layouts';
import { Mail, Phone, MapPin, User, Briefcase, Link, Linkedin, UserCircle } from 'lucide-react';

// ⛔️ This line should remain commented out or removed
// import userProfileImage from '/img/profile1.png';

/**
 * Developer Profile Page Component
 */
const DeveloperProfilePage = () => {
  const profileData = {
    name: 'Jane Doe',
    title: 'Senior Frontend Developer',
    bio: 'Passionate about crafting intuitive and performant user interfaces. Experienced in React, TypeScript, and modern web development practices, committed to delivering high-quality, user-centric applications.',
    email: 'jane.doe@example.com',
    phone: '+94 77 123 4567', // Sri Lankan number example
    location: 'Colombo, Sri Lanka',

    // 🌟 CORRECT PATH FOR IMAGE DIRECTLY IN 'public' FOLDER 🌟
    // If your image is at C:/Users/Dell/gooddevs-full-stack/frontend/public/profile1.png
    profilePhoto: '/profile1.png', // <--- UPDATED PATH HERE

    // ⛔️ Keep these commented out:
    // profilePhoto: 'https://via.placeholder.com/180/E0F2F7/2196F3?text=JD',
    // profilePhoto: '',

    skills: [
      'React', 'TypeScript', 'JavaScript', 'Next.js', 'Tailwind CSS',
      'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Git', 'AWS Basics', 'UI/UX Design', 'Agile Methodologies'
    ],
    experience: [
      {
        title: 'Senior Frontend Developer',
        company: 'Innovate Tech Solutions',
        years: 'Jan 2022 - Present',
        description: 'Led development of scalable web applications using React and Next.js, mentored junior developers, and optimized application performance by 25%. Collaborated cross-functionally to define project requirements.',
      },
      {
        title: 'Frontend Developer',
        company: 'Creative Web Works',
        years: 'Mar 2019 - Dec 2021',
        description: 'Developed responsive user interfaces from design mockups, integrated with various RESTful APIs, and contributed to component library development.',
      },
    ],
    portfolioLink: 'https://www.example.com/jane-portfolio',
    linkedinLink: 'https://www.linkedin.com/in/janedoe',
  };

  return (
    <ContentLayout title="Developer Profile">
      <div className="bg-white rounded-xl shadow-lg p-6 lg:p-10 max-w-5xl mx-auto my-8 border border-gray-100">

        {/* Profile Header Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 pb-8 border-b border-gray-200 mb-8">
          {/* Conditional Rendering for Profile Photo or Icon */}
          {profileData.profilePhoto ? (
            <img
              src={profileData.profilePhoto}
              alt={`${profileData.name}'s profile`}
              className="w-40 h-40 rounded-full object-cover border-4 border-blue-50 shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-lg flex-shrink-0"
            />
          ) : (
            <div
              className="w-40 h-40 rounded-full flex items-center justify-center bg-blue-100 border-4 border-blue-50 shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-lg flex-shrink-0"
              title="No profile photo available"
            >
              <UserCircle size={100} className="text-blue-400" />
            </div>
          )}

          <div className="text-center md:text-left flex-grow">
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-1">
              {profileData.name}
            </h1>
            <p className="text-2xl text-blue-700 font-semibold mb-3">
              {profileData.title}
            </p>
            <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto md:mx-0">
              {profileData.bio}
            </p>

            {/* Contact & Social Links */}
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-6 gap-y-3 mt-5 text-gray-600 text-base">
              <span className="flex items-center gap-2"><Mail size={18} className="text-blue-500" /> {profileData.email}</span>
              <span className="flex items-center gap-2"><Phone size={18} className="text-blue-500" /> {profileData.phone}</span>
              <span className="flex items-center gap-2"><MapPin size={18} className="text-blue-500" /> {profileData.location}</span>
            </div>

            <div className="flex justify-center md:justify-start gap-4 mt-6">
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
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-3">
            <User size={26} className="text-blue-600" /> Skills & Expertise
          </h2>
          <div className="flex flex-wrap gap-3">
            {profileData.skills.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-1.5 bg-blue-100 text-blue-800 text-sm font-medium rounded-full shadow-sm hover:bg-blue-200 transition-colors cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Experience Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-3">
            <Briefcase size={26} className="text-blue-600" /> Professional Experience
          </h2>
          <div className="space-y-7">
            {profileData.experience.map((job, index) => (
              <div key={index} className="border-l-4 border-blue-400 pl-5 pt-1 pb-1 transition-all duration-300 hover:border-blue-600">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
                <p className="text-blue-600 text-lg font-medium">{job.company}</p>
                <p className="text-gray-500 text-sm italic mb-2">{job.years}</p>
                <p className="text-gray-700 leading-relaxed">{job.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action/Footer */}
        <div className="pt-8 border-t border-gray-200 text-center text-gray-500 text-md italic">
          <p>"Committed to building impactful solutions."</p>
          <p className="mt-2 text-blue-600 font-semibold">Ready to collaborate? Let's connect!</p>
        </div>
      </div>
    </ContentLayout>
  );
};

export default DeveloperProfilePage;