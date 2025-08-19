import { ContentLayout } from '@/components/layouts';
import { SponsorDonationsView } from '@/features/donations';

export const clientLoader = () => async () => {
  return {};
};

const SponsorDonationsSponsorshipsRoute = () => {
  return (
    <ContentLayout title="My Donations & Sponsorships">
      <SponsorDonationsView />
    </ContentLayout>
  );
};

export default SponsorDonationsSponsorshipsRoute;
