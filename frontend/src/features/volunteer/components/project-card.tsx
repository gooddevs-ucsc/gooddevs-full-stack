import { Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Badge } from '@/components/ui/badge';

export interface VolunteerProjectCardData {
  id: string;
  title: string;
  description: string;
  status: 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED';
  project_type: string;
  preferred_technologies: string | null;
  created_at: string;
  updated_at: string;
}

interface ProjectCardProps {
  project: VolunteerProjectCardData;
  isOwner?: boolean;
  onEdit?: (section: string) => void;
  onDelete?: () => void;
}

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'APPROVED':
      return {
        label: 'Active',
        className: 'bg-green-100 text-green-800 border-green-200',
      };
    case 'IN_PROGRESS':
      return {
        label: 'In Progress',
        className: 'bg-blue-100 text-blue-800 border-blue-200',
      };
    case 'COMPLETED':
      return {
        label: 'Completed',
        className: 'bg-gray-100 text-gray-800 border-gray-200',
      };
    default:
      return {
        label: status,
        className: 'bg-gray-100 text-gray-800 border-gray-200',
      };
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();
  const statusInfo = getStatusInfo(project.status);

  const handleViewProject = () => {
    navigate(`/projects/${project.id}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleViewProject();
    }
  };

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/20"
      onClick={handleViewProject}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View project: ${project.title}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/30 to-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

      <div className="relative p-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="line-clamp-1 text-lg font-semibold text-slate-900 group-hover:text-blue-600">
              {project.title}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {project.project_type.replace('_', ' ')}
            </p>
          </div>
          <Badge className={statusInfo.className} variant="outline">
            {statusInfo.label}
          </Badge>
        </div>

        {/* Description */}
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-600">
          {project.description}
        </p>

        {/* Technologies */}
        {project.preferred_technologies && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {project.preferred_technologies
                .split(',')
                .slice(0, 3)
                .map((tech, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tech.trim()}
                  </Badge>
                ))}
              {project.preferred_technologies.split(',').length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{project.preferred_technologies.split(',').length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar className="size-3" />
            <span>Joined {formatDate(project.created_at)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="size-3" />
            <span>Team project</span>
          </div>
        </div>
      </div>
    </div>
  );
};
