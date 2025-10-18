import {
  User,
  MapPin,
  Calendar,
  Mail,
  Globe,
  Github,
  Linkedin,
  Twitter,
  ArrowLeft,
  Phone,
  ExternalLink,
  ProjectorIcon,
} from 'lucide-react';
import React from 'react';
import { useParams, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { formatDate } from '@/utils/format';

export const PublicProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  // Mock data for demonstration - replace with real API calls when backend is ready
  const loading = false;
  const error = null;

  // Mock profile data
  const profile = {
    id: userId || '',
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com',
    role: 'REQUESTER',
    created_at: '2024-01-15T00:00:00Z',
    requester_profile: {
      about:
        'I am a project manager with over 5 years of experience in leading cross-functional teams to deliver impactful software solutions. I believe in the power of technology to solve real-world problems and am committed to creating opportunities for developers to contribute to meaningful projects.',
      location: 'San Francisco, CA',
      website_url: 'https://johndoe.dev',
      linkedin_url: 'https://linkedin.com/in/johndoe',
      github_url: 'https://github.com/johndoe',
      twitter_url: 'https://twitter.com/johndoe',
      phone_number: '+1 (555) 123-4567',
    },
  };

  // Mock projects data
  const projects = [
    {
      id: '1',
      title: 'Community Health Tracker',
      description:
        'A web application to help local health clinics track patient wellness metrics and appointments.',
      project_type: 'WEBSITE',
      status: 'APPROVED',
      created_at: '2024-02-15T00:00:00Z',
      preferred_technologies: 'React, Node.js, PostgreSQL',
    },
    {
      id: '2',
      title: 'Education Resource Platform',
      description:
        'Mobile app connecting students with educational resources and mentorship opportunities.',
      project_type: 'MOBILE_APP',
      status: 'IN_PROGRESS',
      created_at: '2024-01-30T00:00:00Z',
      preferred_technologies: 'React Native, Firebase',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <div className="flex min-h-96 items-center justify-center">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="mt-4 text-slate-600">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <div className="flex min-h-96 items-center justify-center">
            <div className="text-center">
              <h2 className="mb-2 text-2xl font-bold text-slate-900">
                Profile Not Found
              </h2>
              <p className="mb-4 text-slate-600">
                The profile you are looking for does not exist.
              </p>
              <Button onClick={() => navigate('/projects')} variant="outline">
                <ArrowLeft className="mr-2 size-4" />
                Back to Projects
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const requesterProfile = profile.requester_profile;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="mx-auto max-w-4xl px-4 py-16">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
        </div>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="overflow-hidden rounded-lg bg-white shadow-md">
            <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>
            <div className="relative px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
                <div className="-mt-12 mb-4 flex size-24 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white sm:mb-0">
                  <User className="size-12" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-slate-900">
                    {profile.firstname} {profile.lastname}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    {requesterProfile?.location && (
                      <div className="flex items-center">
                        <MapPin className="mr-1 size-4" />
                        {requesterProfile.location}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="mr-1 size-4" />
                      Joined{' '}
                      {formatDate(new Date(profile.created_at).getTime())}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          {requesterProfile?.about && (
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-semibold">About</h2>
              <p className="leading-relaxed text-slate-700">
                {requesterProfile.about}
              </p>
            </div>
          )}

          {/* Contact & Social Links */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Connect</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100"
              >
                <Mail className="mr-3 size-5 text-slate-600" />
                <span className="text-slate-700">{profile.email}</span>
              </a>
              {requesterProfile?.phone_number && (
                <a
                  href={`tel:${requesterProfile.phone_number}`}
                  className="flex items-center rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100"
                >
                  <Phone className="mr-3 size-5 text-slate-600" />
                  <span className="text-slate-700">
                    {requesterProfile.phone_number}
                  </span>
                </a>
              )}
              {requesterProfile?.website_url && (
                <a
                  href={requesterProfile.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100"
                >
                  <Globe className="mr-3 size-5 text-slate-600" />
                  <span className="text-slate-700">Website</span>
                  <ExternalLink className="ml-auto size-4 text-slate-400" />
                </a>
              )}
              {requesterProfile?.linkedin_url && (
                <a
                  href={requesterProfile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100"
                >
                  <Linkedin className="mr-3 size-5 text-blue-600" />
                  <span className="text-slate-700">LinkedIn</span>
                  <ExternalLink className="ml-auto size-4 text-slate-400" />
                </a>
              )}
              {requesterProfile?.github_url && (
                <a
                  href={requesterProfile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100"
                >
                  <Github className="mr-3 size-5 text-slate-800" />
                  <span className="text-slate-700">GitHub</span>
                  <ExternalLink className="ml-auto size-4 text-slate-400" />
                </a>
              )}
              {requesterProfile?.twitter_url && (
                <a
                  href={requesterProfile.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100"
                >
                  <Twitter className="mr-3 size-5 text-blue-500" />
                  <span className="text-slate-700">Twitter</span>
                  <ExternalLink className="ml-auto size-4 text-slate-400" />
                </a>
              )}
            </div>
          </div>

          {/* Projects */}
          {projects.length > 0 && (
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 flex items-center text-xl font-semibold">
                <ProjectorIcon className="mr-2 size-5" />
                Projects ({projects.length})
              </h2>
              <div className="grid gap-4">
                {projects.map((project) => (
                  <button
                    type="button"
                    key={project.id}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    aria-label={`Open project ${project.title}`}
                    className="w-full cursor-pointer rounded-lg border border-slate-200 p-4 text-left transition-shadow hover:shadow-md"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="font-semibold text-slate-900 hover:text-blue-600">
                        {project.title}
                      </h3>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          project.status === 'APPROVED'
                            ? 'bg-green-100 text-green-800'
                            : project.status === 'IN_PROGRESS'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="mb-3 line-clamp-2 text-sm text-slate-600">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{project.project_type.replace('_', ' ')}</span>
                      <span>
                        Created{' '}
                        {formatDate(new Date(project.created_at).getTime())}
                      </span>
                    </div>
                    {project.preferred_technologies && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {project.preferred_technologies
                          .split(',')
                          .map((tech, index) => (
                            <span
                              key={index}
                              className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600"
                            >
                              {tech.trim()}
                            </span>
                          ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
