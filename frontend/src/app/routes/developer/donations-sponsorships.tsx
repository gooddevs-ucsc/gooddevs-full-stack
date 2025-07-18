import { ContentLayout } from '@/components/layouts';
import { SponsorDonationsView } from '@/features/donations';

export const clientLoader = () => async () => {
  return {};
};

const DeveloperDonationsSponsorshipsRoute = () => {
  return (
    <ContentLayout title="My Donations & Sponsorships">
      <SponsorDonationsView />
    </ContentLayout>
  );
};

export default DeveloperDonationsSponsorshipsRoute;
