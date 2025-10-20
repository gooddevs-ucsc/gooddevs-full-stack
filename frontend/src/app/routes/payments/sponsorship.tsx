import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

import { ContentLayout } from '@/components/layouts/content-layout';
import { Button } from '@/components/ui/button';
import { InitiateSponsorship } from '@/features/sponsorships';

const SponsorshipRoute = () => {
  const { recipientId } = useParams<{ recipientId: string }>();
  const navigate = useNavigate();

  if (!recipientId) {
    return (
      <ContentLayout title="Sponsor Volunteer">
        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-red-800">Invalid volunteer ID</p>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Sponsor a Volunteer">
      <div className="mx-auto max-w-2xl">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2"
        >
          <div className="flex items-center">
            <ArrowLeft className="mr-2 size-4" />
            Back
          </div>
        </Button>
        <InitiateSponsorship recipientId={recipientId} />
      </div>
    </ContentLayout>
  );
};

export default SponsorshipRoute;
