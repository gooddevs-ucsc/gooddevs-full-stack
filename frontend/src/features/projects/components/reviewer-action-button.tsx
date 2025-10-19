import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';
import { useCanReviewProject } from '@/features/projects/api/can-review-project';

interface ReviewerActionButtonProps {
  projectId: string;
}

export const ReviewerActionButton = ({
  projectId,
}: ReviewerActionButtonProps) => {
  const navigate = useNavigate();
  const { data: canReviewData, isLoading } = useCanReviewProject({
    projectId,
  });

  if (isLoading || !canReviewData?.can_review) {
    return null;
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={(e) => {
        e.stopPropagation();
        navigate(paths.developer.reviewApplications.getHref(projectId));
      }}
      className="border-blue-500 text-blue-600 hover:bg-blue-50"
    >
      <div className="flex items-center">
        <Shield className="size-4" />
        Manage Applications
      </div>
    </Button>
  );
};
