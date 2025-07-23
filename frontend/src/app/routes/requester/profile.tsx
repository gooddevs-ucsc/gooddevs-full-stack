import {
  Building2,
  Calendar,
  Edit2,
  ExternalLink,
  Facebook,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Twitter,
  Users,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const organization = {
  name: 'Lanka Social Impact Initiative',
  tagline: 'Leveraging technology to empower Sri Lankan communities.',
  logoUrl: 'https://placehold.co/100x100/E2E8F0/475569?text=LSII',
  coverImageUrl: 'https://placehold.co/1200x300/475569/FFFFFF?text=+',
  website: 'lankaimpact.org',
  email: 'contact@lankaimpact.org',
  location: 'Colombo, Sri Lanka',
  socials: {
    linkedin: '#',
    twitter: '#',
    facebook: '#',
  },
  about:
    'The Lanka Social Impact Initiative is a non-profit dedicated to creating positive social change through technology. We connect skilled volunteers with organizations that need technical assistance to amplify their impact and serve their communities more effectively.',
  activeProjects: [
    {
      id: 1,
      title: 'Digital Literacy Program for Rural Schools',
      status: 'Active',
    },
    { id: 2, title: 'Healthcare Access Mobile App', status: 'Planning' },
    {
      id: 3,
      title: 'Community Resource Management Platform',
      status: 'Accepting Volunteers',
    },
  ],
};

const OrganizationProfile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Planning':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Accepting Volunteers':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Profile Header */}
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm">
        {/* Cover Image */}
        <div className="relative h-72 bg-gradient-to-r from-slate-500 to-slate-600">
          <img
            src={organization.coverImageUrl}
            alt="Cover"
            className="size-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Profile Content */}
        <div className="relative px-8 pb-8">
          {/* Organization Logo */}
          <div className="absolute -top-12 left-8">
            <div className="relative">
              <img
                src={organization.logoUrl}
                alt={organization.name}
                className="size-24 rounded-2xl border-4 border-white bg-white object-cover shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 rounded-full bg-green-500 p-1.5">
                <Building2 className="size-3 text-white" />
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <div className="absolute right-8 top-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEditProfile}
              className="bg-white/90 backdrop-blur-sm hover:bg-white"
            >
              <Edit2 className="mr-2 size-4" />
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </Button>
          </div>

          {/* Organization Info */}
          <div className="mt-16 space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">
              {organization.name}
            </h1>
            <p className="max-w-2xl text-lg text-slate-600">
              {organization.tagline}
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <MapPin className="size-4" />
                {organization.location}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="size-4" />
                Member since 2023
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Quick Info Card */}
        <div className="space-y-6 lg:col-span-1">
          {/* Contact Information Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-slate-900">
              Contact Information
            </h2>

            <div className="space-y-4">
              {/* Website */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-blue-100 p-2">
                  <Globe className="size-4 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900">Website</p>
                  <a
                    href={`https://${organization.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 break-all text-sm text-primary hover:text-primary/80"
                  >
                    {organization.website}
                    <ExternalLink className="size-3 shrink-0" />
                  </a>
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
                    href={`mailto:${organization.email}`}
                    className="break-all text-sm text-slate-600 hover:text-primary"
                  >
                    {organization.email}
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-orange-100 p-2">
                  <MapPin className="size-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Location</p>
                  <p className="text-sm text-slate-600">
                    {organization.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-6 border-t border-slate-200 pt-6">
              <h3 className="mb-4 text-sm font-medium text-slate-900">
                Connect With Us
              </h3>
              <div className="flex gap-3">
                <a
                  href={organization.socials.linkedin}
                  className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-colors hover:bg-blue-200"
                >
                  <Linkedin className="size-4" />
                </a>
                <a
                  href={organization.socials.twitter}
                  className="flex size-10 items-center justify-center rounded-lg bg-sky-100 text-sky-600 transition-colors hover:bg-sky-200"
                >
                  <Twitter className="size-4" />
                </a>
                <a
                  href={organization.socials.facebook}
                  className="flex size-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 transition-colors hover:bg-indigo-200"
                >
                  <Facebook className="size-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Organization Stats
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Total Projects</span>
                <span className="font-semibold text-slate-900">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Active Projects</span>
                <span className="font-semibold text-green-600">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  Volunteers Worked
                </span>
                <span className="font-semibold text-slate-900">28</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Success Rate</span>
                <span className="font-semibold text-primary">94%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Detailed Information */}
        <div className="space-y-8 lg:col-span-2">
          {/* About Us Section */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              About Us
            </h2>
            <div className="prose prose-slate max-w-none">
              <p className="leading-relaxed text-slate-600">
                {organization.about}
              </p>
            </div>

            {/* Organization Highlights */}
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="rounded-full bg-blue-100 p-2">
                  <Users className="size-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">
                    Community Focus
                  </h3>
                  <p className="text-sm text-slate-600">
                    Dedicated to serving local communities across Sri Lanka
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="rounded-full bg-green-100 p-2">
                  <Building2 className="size-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">
                    Tech Innovation
                  </h3>
                  <p className="text-sm text-slate-600">
                    Leveraging technology for sustainable social impact
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Active Projects Section */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                Active Projects on GoodDevs
              </h2>
              <Button variant="outline" size="sm">
                View All Projects
              </Button>
            </div>

            <div className="space-y-4">
              {organization.activeProjects.map((project) => (
                <div
                  key={project.id}
                  className="group cursor-pointer rounded-lg border border-slate-200 p-4 transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900 transition-colors group-hover:text-primary">
                        {project.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        Click to view project details and requirements
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`shrink-0 ${getStatusColor(project.status)}`}
                    >
                      {project.status}
                    </Badge>
                  </div>

                  <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users className="size-3" />3 volunteers needed
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      Posted 2 days ago
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="mt-6 rounded-lg border border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 p-4">
              <div className="text-center">
                <h3 className="font-medium text-slate-900">
                  Want to collaborate with us?
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Join our projects and help create positive impact in
                  communities
                </p>
                <Button size="sm" className="mt-3">
                  Browse Our Projects
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationProfile;
