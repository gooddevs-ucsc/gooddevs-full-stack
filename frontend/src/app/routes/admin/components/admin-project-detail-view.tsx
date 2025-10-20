import {
  Calendar,
  Clock,
  Tag,
  User,
  Briefcase,
  ExternalLink,
} from 'lucide-react';
import { useNavigate } from 'react-router';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { PROJECT_TYPE_STYLES } from '@/lib/constants/ui';
import { usePublicUserProfile } from '@/lib/public-profile-api';
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
  const navigate = useNavigate();

  // Fetch requester's public profile data
  const {
    data: requesterProfile,
    isLoading: requesterLoading,
    error: requesterError,
  } = usePublicUserProfile({
    userId: project.requester_id,
    queryConfig: {
      enabled: !!project.requester_id,
    },
  });

  const handleViewProfile = () => {
    navigate(`/profile/${project.requester_id}`);
  };

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

            <div className="grid grid-cols-3 gap-4 pt-4">
              {/* Created Date */}
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="size-4" />
                <div>
                  <div className="font-medium">Created</div>
                  <div>{formatDate(project.created_at)}</div>
                </div>
              </div>

              {/* Last Updated */}
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="size-4" />
                <div>
                  <div className="font-medium text-slate-900">Last Updated</div>
                  <div className="mt-1 text-slate-600">
                    {new Date(project.updated_at).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="size-4" />
                <div>
                  <div className="font-medium">Timeline</div>
                  <div>
                    {project.estimated_timeline
                      ? formatEstimatedTimeline(project.estimated_timeline)
                      : 'Not specified'}
                  </div>
                </div>
              </div>
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
            {requesterLoading ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm" />
                <span className="text-sm text-slate-500">
                  Loading requester information...
                </span>
              </div>
            ) : requesterError ? (
              <div className="text-sm text-red-600">
                Failed to load requester information
              </div>
            ) : requesterProfile?.data ? (
              <div className="space-y-3">
                <div>
                  <h4 className="mb-2 font-medium text-slate-900">
                    Requester Name
                  </h4>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-left font-normal"
                    onClick={handleViewProfile}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900">
                        {`${requesterProfile.data.firstname} ${requesterProfile.data.lastname}`}
                      </span>
                      <ExternalLink className="size-3" />
                    </div>
                  </Button>
                </div>
                <div>
                  <h4 className="mb-2 font-medium text-slate-900">Email</h4>
                  <span className="text-slate-600">
                    {requesterProfile.data.email}
                  </span>
                </div>
              </div>
            ) : null}

            {!requesterProfile?.data &&
              !requesterLoading &&
              !requesterError && (
                <div className="text-sm text-slate-500">
                  <p>
                    Detailed requester information can be viewed by searching
                    the user ID in the admin panel.
                  </p>
                </div>
              )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
