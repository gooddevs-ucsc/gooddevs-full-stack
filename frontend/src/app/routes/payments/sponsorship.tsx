import { useParams } from 'react-router';

import { ContentLayout } from '@/components/layouts/content-layout';
import { InitiateSponsorship } from '@/features/sponsorships';

const SponsorshipRoute = () => {
  const { recipientId } = useParams<{ recipientId: string }>();

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
        <InitiateSponsorship recipientId={recipientId} />
      </div>
    </ContentLayout>
  );
};

export default SponsorshipRoute;
