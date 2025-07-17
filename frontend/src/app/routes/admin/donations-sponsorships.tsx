import { QueryClient } from '@tanstack/react-query';

import { ContentLayout } from '@/components/layouts';
import { DonationsSponsorshipsList } from '@/features/donations/components/donations-sponsorships-list';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const clientLoader = (queryClient: QueryClient) => async () => {
  return {};
};

const DonationsSponsorshipsRoute = () => {
  return (
    <ContentLayout title="Donations & Sponsorships">
      <DonationsSponsorshipsList />
    </ContentLayout>
  );
};

export default DonationsSponsorshipsRoute;
