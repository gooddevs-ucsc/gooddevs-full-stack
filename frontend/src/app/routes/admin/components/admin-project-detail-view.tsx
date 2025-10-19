import { Calendar, Clock, Tag, User, Briefcase } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PROJECT_TYPE_STYLES } from '@/lib/constants/ui';
import { Project, ProjectType } from '@/types/api';
import { formatDate, formatEstimatedTimeline } from '@/utils/format';

const getProjectTypeColor = (type: ProjectType) => {
  return PROJECT_TYPE_STYLES[type] || PROJECT_TYPE_STYLES.OTHER;
};

interface AdminProjectDetailViewProps {
  project: Project;
}

export const AdminProjectDetailView = ({
  project,
}: AdminProjectDetailViewProps) => {
  return (
    <div className="space-y-6">
      {/* Project Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold">
                {project.title}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={getProjectTypeColor(project.project_type)}
                >
                  <Tag className="mr-1 size-3" />
                  {project.project_type.replace('_', ' ')}
                </Badge>
                <Badge
                  variant={
                    project.status === 'PENDING' ? 'destructive' : 'secondary'
                  }
                >
                  {project.status}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Project Information Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Project Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="size-5" />
              Project Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2 font-medium text-slate-900">Description</h4>
              <p className="leading-relaxed text-slate-600">
                {project.description || 'No description provided'}
              </p>
            </div>

            {project.preferred_technologies && (
              <div>
                <h4 className="mb-2 font-medium text-slate-900">
                  Preferred Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.preferred_technologies
                    .split(',')
                    .map((tech, index) => (
                      <Badge key={index} variant="outline">
                        {tech.trim()}
                      </Badge>
                    ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="size-4" />
                <div>
                  <div className="font-medium">Created</div>
                  <div>{formatDate(project.created_at)}</div>
                </div>
              </div>

              {project.estimated_timeline && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="size-4" />
                  <div>
                    <div className="font-medium">Timeline</div>
                    <div>
                      {formatEstimatedTimeline(project.estimated_timeline)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Requester Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5" />
              Project Owner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-t pt-4">
              <h4 className="mb-2 font-medium text-slate-900">Requester ID</h4>
              <code className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">
                {project.requester_id}
              </code>
            </div>
            <div className="text-sm text-slate-500">
              <p>
                Detailed requester information can be viewed by searching the
                user ID in the admin panel.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Project Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
            <div>
              <div className="font-medium text-slate-900">Project ID</div>
              <code className="mt-1 block rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">
                {project.id}
              </code>
            </div>
            <div>
              <div className="font-medium text-slate-900">Created At</div>
              <div className="mt-1 text-slate-600">
                {new Date(project.created_at).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="font-medium text-slate-900">Last Updated</div>
              <div className="mt-1 text-slate-600">
                {new Date(project.updated_at).toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
