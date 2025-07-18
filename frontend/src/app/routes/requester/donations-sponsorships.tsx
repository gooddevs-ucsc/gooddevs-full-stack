import { ContentLayout } from '@/components/layouts';
import { SponsorDonationsView } from '@/features/donations';

export const clientLoader = () => async () => {
  return {};
};

const RequesterDonationsSponsorshipsRoute = () => {
  return (
    <ContentLayout title="My Donations & Sponsorships">
      <SponsorDonationsView />
    </ContentLayout>
  );
};

export default RequesterDonationsSponsorshipsRoute;
