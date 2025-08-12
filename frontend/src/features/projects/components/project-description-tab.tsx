import {
  ArrowLeft,
  Award,
  Calendar,
  CheckCircle,
  Clock,
  Code,
  Eye,
  GitBranch,
  Heart,
  Lightbulb,
  MapPin,
  MessageCircle,
  Star,
  Target,
  Users,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { useUser } from '@/lib/auth';
import { ROLES } from '@/lib/roles';
import { formatDate, formatEstimatedTimeline } from '@/utils/format';

import ProjectApplicationForm from './project-application-form-final';

interface ProjectDescriptionTabProps {
  project: any; // Replace with proper type
}

export const ProjectDescriptionTab = ({
  project,
}: ProjectDescriptionTabProps) => {
  const navigate = useNavigate();
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const user = useUser();

  return (
    <>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Project Overview */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-900">
                Project Overview
              </h2>
              <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                <CheckCircle className="size-4" />
                Approved
              </div>
            </div>
            <div className="prose prose-slate max-w-none">
              <p className="text-lg leading-relaxed text-slate-700">
                {project.description ||
                  'This project aims to create a meaningful solution that addresses real community needs while providing volunteer developers with valuable learning opportunities and portfolio contributions.'}
              </p>
            </div>
          </div>

          {/* About the Organization */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-emerald-100 p-2">
                <Users className="size-5 text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">
                About the Organization
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-medium text-slate-900">
                  Organization Details
                </h4>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-slate-600">
                      <strong>Type:</strong>{' '}
                      {project.organization_type || 'Non-profit Organization'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-slate-600">
                      <strong>Founded:</strong>{' '}
                      {project.organization_founded || '2018'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-purple-500"></div>
                    <span className="text-sm text-slate-600">
                      <strong>Location:</strong>{' '}
                      {project.organization_location || 'Sri Lanka, Colombo'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-orange-500"></div>
                    <span className="text-sm text-slate-600">
                      <strong>Size:</strong>{' '}
                      {project.organization_size || '50-100 staff members'}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="mb-2 font-medium text-slate-900">
                  Mission & Impact
                </h4>
                <p className="text-sm leading-relaxed text-slate-600">
                  {project.organization_mission ||
                    'Dedicated to creating positive social impact through technology solutions. Our organization has helped over 10,000 individuals access essential services and resources through digital platforms.'}
                </p>
              </div>
            </div>
          </div>

          {/* Current Team Members */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-full bg-indigo-100 p-2">
                <Users className="size-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">
                Current Team Members
              </h2>
            </div>
            <div className="space-y-4">
              {/* Project Lead */}
              <div className="flex items-start gap-4 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face&auto=format"
                  alt="Alex Kumar"
                  className="size-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h4 className="font-semibold text-slate-900">
                      Ravindra Fernando
                    </h4>
                    <span className="rounded-full bg-indigo-200 px-2 py-1 text-xs font-medium text-indigo-800">
                      Project Lead
                    </span>
                  </div>
                  <p className="mb-3 text-sm text-slate-600">
                    Full-stack developer with 5+ years experience leading
                    nonprofit tech projects
                  </p>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="rounded bg-indigo-200 px-2 py-1 text-xs text-indigo-800">
                      Leadership
                    </span>
                    <span className="rounded bg-indigo-200 px-2 py-1 text-xs text-indigo-800">
                      React
                    </span>
                    <span className="rounded bg-indigo-200 px-2 py-1 text-xs text-indigo-800">
                      Node.js
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    View Profile
                  </Button>
                </div>
              </div>

              {/* Developer 1 */}
              <div className="flex items-start gap-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face&auto=format"
                  alt="Sarah Patel"
                  className="size-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h4 className="font-semibold text-slate-900">
                      Aksha Kumarasooriya
                    </h4>
                    <span className="rounded-full bg-emerald-200 px-2 py-1 text-xs font-medium text-emerald-800">
                      Frontend Developer
                    </span>
                  </div>
                  <p className="mb-3 text-sm text-slate-600">
                    UI/UX focused developer passionate about creating accessible
                    and beautiful interfaces
                  </p>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="rounded bg-emerald-200 px-2 py-1 text-xs text-emerald-800">
                      React
                    </span>
                    <span className="rounded bg-emerald-200 px-2 py-1 text-xs text-emerald-800">
                      TypeScript
                    </span>
                    <span className="rounded bg-emerald-200 px-2 py-1 text-xs text-emerald-800">
                      Design
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    View Profile
                  </Button>
                </div>
              </div>

              {/* Developer 2 */}
              <div className="flex items-start gap-4 rounded-lg border border-purple-200 bg-purple-50 p-4">
                <img
                  src="https://images.unsplash.com/photo-1556157382-97eda2d62296?w=150&h=150&fit=crop&crop=face&auto=format"
                  alt="Mike Rodriguez"
                  className="size-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h4 className="font-semibold text-slate-900">
                      Mahesh Withanage
                    </h4>
                    <span className="rounded-full bg-purple-200 px-2 py-1 text-xs font-medium text-purple-800">
                      Backend Developer
                    </span>
                  </div>
                  <p className="mb-3 text-sm text-slate-600">
                    Database and API specialist with expertise in scalable
                    backend architecture
                  </p>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="rounded bg-purple-200 px-2 py-1 text-xs text-purple-800">
                      Python
                    </span>
                    <span className="rounded bg-purple-200 px-2 py-1 text-xs text-purple-800">
                      FastAPI
                    </span>
                    <span className="rounded bg-purple-200 px-2 py-1 text-xs text-purple-800">
                      PostgreSQL
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Project Goals & Impact */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <Target className="size-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">
                Goals & Expected Impact
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-green-100 p-1">
                    <CheckCircle className="size-3 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">
                      Community Impact
                    </h4>
                    <p className="text-sm text-slate-600">
                      Address real needs of nonprofit organizations and their
                      beneficiaries
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-blue-100 p-1">
                    <Lightbulb className="size-3 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Innovation</h4>
                    <p className="text-sm text-slate-600">
                      Implement modern solutions using cutting-edge technologies
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-purple-100 p-1">
                    <Users className="size-3 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Team Growth</h4>
                    <p className="text-sm text-slate-600">
                      Provide learning opportunities and skill development for
                      volunteers
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-orange-100 p-1">
                    <Award className="size-3 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">
                      Sustainability
                    </h4>
                    <p className="text-sm text-slate-600">
                      Create maintainable solutions for long-term community
                      benefit
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Roles We Need */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-indigo-100 p-2">
                <Users className="size-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">
                Open Positions & Roles Needed
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {/* UI/UX Designer */}
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <div className="rounded-full bg-blue-600 p-1.5">
                    <Target className="size-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-slate-900">
                    UI/UX Designer
                  </h4>
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                    2 spots open
                  </span>
                </div>
                <ul className="space-y-1 text-sm text-slate-700">
                  <li>• User research and persona development</li>
                  <li>• Wireframing and prototyping</li>
                  <li>• Visual design and branding</li>
                  <li>• Accessibility and usability testing</li>
                  <li>• Design system creation</li>
                </ul>
                <div className="mt-3 flex flex-wrap gap-1">
                  <span className="rounded bg-blue-200 px-2 py-1 text-xs text-blue-800">
                    Figma
                  </span>
                  <span className="rounded bg-blue-200 px-2 py-1 text-xs text-blue-800">
                    Adobe XD
                  </span>
                  <span className="rounded bg-blue-200 px-2 py-1 text-xs text-blue-800">
                    Sketch
                  </span>
                </div>
              </div>

              {/* Frontend Developer */}
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <div className="rounded-full bg-green-600 p-1.5">
                    <Code className="size-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-slate-900">
                    Frontend Developer
                  </h4>
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                    3 spots open
                  </span>
                </div>
                <ul className="space-y-1 text-sm text-slate-700">
                  <li>• React component development</li>
                  <li>• Responsive UI implementation</li>
                  <li>• State management (Redux/Zustand)</li>
                  <li>• API integration and data fetching</li>
                  <li>• Performance optimization</li>
                </ul>
                <div className="mt-3 flex flex-wrap gap-1">
                  <span className="rounded bg-green-200 px-2 py-1 text-xs text-green-800">
                    React
                  </span>
                  <span className="rounded bg-green-200 px-2 py-1 text-xs text-green-800">
                    TypeScript
                  </span>
                  <span className="rounded bg-green-200 px-2 py-1 text-xs text-green-800">
                    Tailwind
                  </span>
                </div>
              </div>

              {/* Backend Developer */}
              <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <div className="rounded-full bg-purple-600 p-1.5">
                    <GitBranch className="size-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-slate-900">
                    Backend Developer
                  </h4>
                  <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                    2 spots open
                  </span>
                </div>
                <ul className="space-y-1 text-sm text-slate-700">
                  <li>• REST API design and development</li>
                  <li>• Database design and optimization</li>
                  <li>• Authentication and authorization</li>
                  <li>• Data validation and security</li>
                  <li>• Performance monitoring</li>
                </ul>
                <div className="mt-3 flex flex-wrap gap-1">
                  <span className="rounded bg-purple-200 px-2 py-1 text-xs text-purple-800">
                    FastAPI
                  </span>
                  <span className="rounded bg-purple-200 px-2 py-1 text-xs text-purple-800">
                    Python
                  </span>
                  <span className="rounded bg-purple-200 px-2 py-1 text-xs text-purple-800">
                    PostgreSQL
                  </span>
                </div>
              </div>

              {/* Full-Stack Developer */}
              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <div className="rounded-full bg-orange-600 p-1.5">
                    <Zap className="size-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-slate-900">
                    Full-Stack Developer
                  </h4>
                  <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">
                    1 spot open
                  </span>
                </div>
                <ul className="space-y-1 text-sm text-slate-700">
                  <li>• End-to-end feature development</li>
                  <li>• Frontend-backend integration</li>
                  <li>• DevOps and deployment</li>
                  <li>• Code review and mentoring</li>
                  <li>• Architecture decisions</li>
                </ul>
                <div className="mt-3 flex flex-wrap gap-1">
                  <span className="rounded bg-orange-200 px-2 py-1 text-xs text-orange-800">
                    React
                  </span>
                  <span className="rounded bg-orange-200 px-2 py-1 text-xs text-orange-800">
                    FastAPI
                  </span>
                  <span className="rounded bg-orange-200 px-2 py-1 text-xs text-orange-800">
                    Docker
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Project Scope & Features */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-emerald-100 p-2">
                <Lightbulb className="size-5 text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">
                Project Scope & Key Features
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="mb-3 font-medium text-slate-900">
                  Core Features
                </h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 size-3 text-green-500" />
                    <span>User authentication and profile management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 size-3 text-green-500" />
                    <span>Interactive dashboard with real-time data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 size-3 text-green-500" />
                    <span>Document upload and management system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 size-3 text-green-500" />
                    <span>Notification and alert system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 size-3 text-green-500" />
                    <span>Reporting and analytics module</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-3 font-medium text-slate-900">
                  Technical Requirements
                </h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 size-3 text-blue-500" />
                    <span>Responsive design for mobile and desktop</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 size-3 text-blue-500" />
                    <span>WCAG accessibility compliance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 size-3 text-blue-500" />
                    <span>Data security and privacy protection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 size-3 text-blue-500" />
                    <span>Performance optimization (&lt; 3s load time)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 size-3 text-blue-500" />
                    <span>Cross-browser compatibility</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Requirements & Skills */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2">
                <Zap className="size-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">
                Skills & Requirements
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-3 font-medium text-slate-900">
                  Required Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.preferred_technologies
                    ?.split(',')
                    .map((tech: string, index: number) => (
                      <span
                        key={index}
                        className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800"
                      >
                        {tech.trim()}
                      </span>
                    )) || (
                    <>
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                        React
                      </span>
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                        TypeScript
                      </span>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                        FastAPI
                      </span>
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
                        PostgreSQL
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div>
                <h4 className="mb-3 font-medium text-slate-900">
                  Experience Level
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-slate-600">
                      Beginner friendly - mentorship available
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-slate-600">
                      Collaborative learning environment
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-purple-500"></div>
                    <span className="text-sm text-slate-600">
                      Portfolio building opportunity
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Apply to Project */}
          <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
            <div className="mb-4 text-center">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-blue-600 text-white">
                <Heart className="size-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Ready to Make an Impact?
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Join this meaningful project and help create positive change
              </p>
            </div>
            <div className="space-y-3">
              {!user.data ? (
                // Not authenticated
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 text-center">
                  <p className="text-sm font-medium text-orange-800">
                    Please sign in as a developer to apply for this project
                  </p>
                  <p className="mt-1 text-xs text-orange-600">
                    Only registered developers can submit applications
                  </p>
                </div>
              ) : user.data.role === ROLES.VOLUNTEER ? (
                // Authenticated developer/volunteer
                <Button
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => setIsApplicationFormOpen(true)}
                >
                  Apply to Join Project
                </Button>
              ) : (
                // Authenticated but not a developer
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 text-center">
                  <p className="text-sm font-medium text-orange-800">
                    Only developers can apply for projects
                  </p>
                  <p className="mt-1 text-xs text-orange-600">
                    Please register as a developer to submit applications
                  </p>
                </div>
              )}
              <Button
                variant="outline"
                className="flex w-full items-center justify-center"
              >
                <div className="flex items-center gap-2">
                  <Heart className="size-4" />
                  <span>Save for Later</span>
                </div>
              </Button>
            </div>
          </div>

          {/* Project Details */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Project Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-3 flex size-8 items-center justify-center rounded-full bg-blue-100">
                  <Users className="size-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Organization</p>
                  <p className="text-sm text-slate-600">
                    {project.organization || 'GoodDevs Community'}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-3 flex size-8 items-center justify-center rounded-full bg-green-100">
                  <Clock className="size-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Timeline</p>
                  <p className="text-sm text-slate-600">
                    {project.estimated_timeline
                      ? formatEstimatedTimeline(project.estimated_timeline)
                      : '12-16 weeks'}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-3 flex size-8 items-center justify-center rounded-full bg-purple-100">
                  <MapPin className="size-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Status</p>
                  <p className="text-sm text-slate-600">
                    {project.status?.charAt(0).toUpperCase() +
                      project.status?.slice(1).toLowerCase() || 'Active'}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-3 flex size-8 items-center justify-center rounded-full bg-orange-100">
                  <Calendar className="size-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Posted</p>
                  <p className="text-sm text-slate-600">
                    {project.created_at
                      ? formatDate(new Date(project.created_at).getTime())
                      : 'Recently'}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-3 flex size-8 items-center justify-center rounded-full bg-red-100">
                  <Eye className="size-4 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Last Updated</p>
                  <p className="text-sm text-slate-600">
                    {project.updated_at
                      ? formatDate(new Date(project.updated_at).getTime())
                      : 'Recently'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Formation & Open Positions */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Team Formation & Open Positions
            </h3>
            <div className="space-y-4">
              {/* Project Lead - Assigned */}
              <div className="rounded-lg bg-gradient-to-r from-indigo-50 to-indigo-100 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-indigo-600">
                      <Users className="size-4 text-white" />
                    </div>
                    <span className="font-medium text-indigo-900">
                      Project Lead
                    </span>
                  </div>
                  <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white">
                    ✓ Assigned
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="flex size-6 items-center justify-center rounded-full bg-indigo-500">
                    <span className="text-[10px] font-bold text-white">1</span>
                  </div>
                  <div className="ml-2 h-2 flex-1 rounded-full bg-green-200">
                    <div className="h-2 w-full rounded-full bg-green-500"></div>
                  </div>
                  <span className="ml-2 text-xs text-indigo-700">
                    1/1 filled
                  </span>
                </div>
              </div>

              {/* Frontend Developer - Partially Assigned */}
              <div className="rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-100 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-emerald-600">
                      <Code className="size-4 text-white" />
                    </div>
                    <span className="font-medium text-emerald-900">
                      Frontend Dev
                    </span>
                  </div>
                  <span className="rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-white">
                    2 more needed
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="flex space-x-1">
                    <div className="flex size-6 items-center justify-center rounded-full bg-emerald-500">
                      <span className="text-[10px] font-bold text-white">
                        1
                      </span>
                    </div>
                    <div className="flex size-6 items-center justify-center rounded-full border-2 border-dashed border-emerald-300 bg-emerald-50">
                      <span className="text-[10px] font-bold text-emerald-400">
                        ?
                      </span>
                    </div>
                    <div className="flex size-6 items-center justify-center rounded-full border-2 border-dashed border-emerald-300 bg-emerald-50">
                      <span className="text-[10px] font-bold text-emerald-400">
                        ?
                      </span>
                    </div>
                  </div>
                  <div className="ml-3 h-2 flex-1 rounded-full bg-emerald-200">
                    <div className="h-2 w-1/3 rounded-full bg-emerald-500"></div>
                  </div>
                  <span className="ml-2 text-xs text-emerald-700">
                    1/3 filled
                  </span>
                </div>
              </div>

              {/* Backend Developer - Partially Assigned */}
              <div className="rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-purple-600">
                      <GitBranch className="size-4 text-white" />
                    </div>
                    <span className="font-medium text-purple-900">
                      Backend Dev
                    </span>
                  </div>
                  <span className="rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-white">
                    1 more needed
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="flex space-x-1">
                    <div className="flex size-6 items-center justify-center rounded-full bg-purple-500">
                      <span className="text-[10px] font-bold text-white">
                        1
                      </span>
                    </div>
                    <div className="flex size-6 items-center justify-center rounded-full border-2 border-dashed border-purple-300 bg-purple-50">
                      <span className="text-[10px] font-bold text-purple-400">
                        ?
                      </span>
                    </div>
                  </div>
                  <div className="ml-3 h-2 flex-1 rounded-full bg-purple-200">
                    <div className="h-2 w-1/2 rounded-full bg-purple-500"></div>
                  </div>
                  <span className="ml-2 text-xs text-purple-700">
                    1/2 filled
                  </span>
                </div>
              </div>

              {/* UI/UX Designer - Open */}
              <div className="rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-blue-600">
                      <Target className="size-4 text-white" />
                    </div>
                    <span className="font-medium text-blue-900">
                      UI/UX Designer
                    </span>
                  </div>
                  <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                    2 open spots
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="flex space-x-1">
                    <div className="flex size-6 items-center justify-center rounded-full border-2 border-dashed border-blue-300 bg-blue-50">
                      <span className="text-[10px] font-bold text-blue-400">
                        ?
                      </span>
                    </div>
                    <div className="flex size-6 items-center justify-center rounded-full border-2 border-dashed border-blue-300 bg-blue-50">
                      <span className="text-[10px] font-bold text-blue-400">
                        ?
                      </span>
                    </div>
                  </div>
                  <div className="ml-3 h-2 flex-1 rounded-full bg-blue-200">
                    <div className="h-2 w-0 rounded-full bg-blue-500"></div>
                  </div>
                  <span className="ml-2 text-xs text-blue-700">0/2 filled</span>
                </div>
              </div>

              {/* Full-Stack Developer - Open */}
              <div className="rounded-lg bg-gradient-to-r from-orange-50 to-orange-100 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-orange-600">
                      <Zap className="size-4 text-white" />
                    </div>
                    <span className="font-medium text-orange-900">
                      Full-Stack Dev
                    </span>
                  </div>
                  <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                    1 open spot
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="flex space-x-1">
                    <div className="flex size-6 items-center justify-center rounded-full border-2 border-dashed border-orange-300 bg-orange-50">
                      <span className="text-[10px] font-bold text-orange-400">
                        ?
                      </span>
                    </div>
                  </div>
                  <div className="ml-3 h-2 flex-1 rounded-full bg-orange-200">
                    <div className="h-2 w-0 rounded-full bg-orange-500"></div>
                  </div>
                  <span className="ml-2 text-xs text-orange-700">
                    0/1 filled
                  </span>
                </div>
              </div>

              {/* Team Progress Summary */}
              <div className="mt-6 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-900">
                    Overall Team Progress
                  </span>
                  <span className="text-xs text-slate-600">
                    3/9 positions filled
                  </span>
                </div>
                <div className="h-3 rounded-full bg-slate-200">
                  <div className="h-3 w-1/3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                </div>
                <div className="mt-2 text-center text-xs text-slate-600">
                  🎯 Ready to welcome 6 more talented developers!
                </div>
              </div>
            </div>
          </div>

          {/* Project Metrics */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Project Engagement
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="size-4 text-slate-500" />
                  <span className="text-sm text-slate-600">Views</span>
                </div>
                <span className="font-medium text-slate-900">247</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="size-4 text-red-500" />
                  <span className="text-sm text-slate-600">Interested</span>
                </div>
                <span className="font-medium text-slate-900">18</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="size-4 text-blue-500" />
                  <span className="text-sm text-slate-600">Discussions</span>
                </div>
                <span className="font-medium text-slate-900">7</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="size-4 text-yellow-500" />
                  <span className="text-sm text-slate-600">Rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-slate-900">4.8</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`size-3 ${
                          star <= 5
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Recent Updates
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex size-6 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="size-3 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    Project approved
                  </p>
                  <p className="text-xs text-slate-500">
                    Ready for development
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex size-6 items-center justify-center rounded-full bg-blue-100">
                  <GitBranch className="size-3 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    Repository created
                  </p>
                  <p className="text-xs text-slate-500">
                    Development environment ready
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex size-6 items-center justify-center rounded-full bg-purple-100">
                  <Users className="size-3 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    Team lead assigned
                  </p>
                  <p className="text-xs text-slate-500">
                    Project mentor available
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline & Commitment - Moved to Sidebar */}
          <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-orange-50 to-yellow-50 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 p-2">
                <Calendar className="size-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Timeline & Commitment
              </h3>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg bg-white p-4 text-center shadow-sm">
                <div className="mb-2 text-2xl font-bold text-blue-600">
                  {project.estimated_timeline
                    ? formatEstimatedTimeline(project.estimated_timeline)
                    : '12-16 weeks'}
                </div>
                <div className="text-sm text-slate-600">Project Duration</div>
              </div>
              <div className="rounded-lg bg-white p-4 text-center shadow-sm">
                <div className="mb-2 text-2xl font-bold text-green-600">
                  5-10
                </div>
                <div className="text-sm text-slate-600">Hours per week</div>
              </div>
              <div className="rounded-lg bg-white p-4 text-center shadow-sm">
                <div className="mb-2 text-2xl font-bold text-purple-600">
                  Remote
                </div>
                <div className="text-sm text-slate-600">Work Style</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/projects')}
            >
              <ArrowLeft className="mr-2 size-4" />
              Back to All Projects
            </Button>
          </div>
        </div>
      </div>

      {/* Project Application Form */}
      <ProjectApplicationForm
        isOpen={isApplicationFormOpen}
        onClose={() => setIsApplicationFormOpen(false)}
        project={project}
      />
    </>
  );
};
