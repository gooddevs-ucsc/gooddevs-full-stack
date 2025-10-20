import {
  Calendar,
  Clock,
  Edit,
  ExternalLink,
  MoreVertical,
  Trash2,
  Users,
  UserCheck,
} from 'lucide-react';
import { FC } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { paths } from '@/config/paths';

export interface RequesterProject {
  id: string;
  title: string;
  description: string;
  status: 'Active' | 'Completed' | 'Pending' | 'Rejected';
  createdAt: string;
  teamSize: number;
  estimatedCompletion: string | null; // Now holds timeline text (e.g., "1-3 months"), not a date
  projectType: string;
  technologies: string[];
}

interface ProjectCardProps {
  project: RequesterProject;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'border-green-200 bg-green-50 text-green-700';
    case 'Completed':
      return 'border-blue-200 bg-blue-50 text-blue-700';
    case 'Pending':
      return 'border-orange-200 bg-orange-50 text-orange-700';
    case 'Rejected':
      return 'border-red-200 bg-red-50 text-red-700';
    default:
      return 'border-slate-200 bg-slate-50 text-slate-700';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const ProjectCard: FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    console.log('Edit project:', project.id);
    // Implement edit functionality
  };

  const handleDelete = () => {
    console.log('Delete project:', project.id);
    // Implement delete functionality
  };

  const handleViewDetails = () => {
    console.log('View project details:', project.id);
    // Implement view details functionality
    navigate(`/projects/${project.id}`);
  };

  const handleViewApplications = () => {
    navigate(paths.requester.projectApplications.getHref(project.id));
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/20">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/30 to-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

      <div className="relative p-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold text-slate-900 transition-colors duration-200 group-hover:text-primary">
              {project.title}
            </h3>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusColor(project.status)}`}
            >
              {project.status}
            </span>
          </div>

          {/* Options Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="size-8 rounded-full p-0 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <MoreVertical className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={handleViewDetails}
                className="cursor-pointer"
              >
                <ExternalLink className="mr-2 size-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleViewApplications}
                className="cursor-pointer"
              >
                <UserCheck className="mr-2 size-4" />
                View Applications
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                <Edit className="mr-2 size-4" />
                Edit Project
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                className="cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="mr-2 size-4" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description */}
        <p className="mb-4 line-clamp-1 text-sm leading-relaxed text-slate-600">
          {project.description}
        </p>

        {/* Project Details */}
        <div className="space-y-3 text-sm text-slate-500">
          <div className="flex items-center">
            <div className="mr-3 flex size-6 items-center justify-center rounded-full bg-blue-100">
              <Users className="size-3 text-blue-600" />
            </div>
            <span className="font-medium">Team:</span>
            <span className="ml-2 text-slate-700">
              {project.teamSize}{' '}
              {project.teamSize === 1 ? 'developer' : 'developers'}
            </span>
          </div>

          <div className="flex items-center">
            <div className="mr-3 flex size-6 items-center justify-center rounded-full bg-green-100">
              <Calendar className="size-3 text-green-600" />
            </div>
            <span className="font-medium">Created:</span>
            <span className="ml-2 text-slate-700">
              {formatDate(project.createdAt)}
            </span>
          </div>

          <div className="flex items-center">
            <div className="mr-3 flex size-6 items-center justify-center rounded-full bg-amber-100">
              <Clock className="size-3 text-amber-600" />
            </div>
            <span className="font-medium">Timeline:</span>
            <span className="ml-2 text-slate-700">
              {project.estimatedCompletion || 'Not specified'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewApplications}
            className="border-blue-300/50 bg-white text-blue-600 shadow-sm transition-all duration-200 hover:border-blue-400 hover:bg-blue-50"
          >
            <div className="flex items-center gap-4">
              <UserCheck className="mr-2 size-4" />
              Applications
            </div>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetails}
            className="border-primary/20 text-primary shadow-sm transition-all duration-200 hover:bg-primary hover:text-white hover:shadow-lg group-hover:translate-x-1"
          >
            <div className="flex items-center gap-2">
              View Project
              <ExternalLink className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};
