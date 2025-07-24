import { ContentLayout } from '@/components/layouts';
import { RequesterDonationsView } from '@/features/donations/components/requester-sponsorships-view';

export const clientLoader = () => async () => {
  return {};
};

const RequesterSponsorshipsRoute = () => {
  return (
    <ContentLayout title="My Sponsorships">
      <RequesterDonationsView />
    </ContentLayout>
  );
};

export default RequesterSponsorshipsRoute;
