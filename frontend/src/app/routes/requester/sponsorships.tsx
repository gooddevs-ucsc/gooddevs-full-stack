import { ContentLayout } from '@/components/layouts';
import { DeveloperSponsorshipsView } from '@/features/donations/components/developer-sponsorships-view';

export const clientLoader = () => async () => {
  return {};
};

const RequesterSponsorshipsRoute = () => {
  return (
    <ContentLayout title="My Sponsorships">
      <DeveloperSponsorshipsView />
    </ContentLayout>
  );
};

export default RequesterSponsorshipsRoute;
