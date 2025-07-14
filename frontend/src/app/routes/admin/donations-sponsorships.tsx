import { QueryClient } from '@tanstack/react-query';

import { ContentLayout } from '@/components/layouts';
import { DonationsSponsorshipsList } from '@/features/donations/components/donations-sponsorships-list';
import { Authorization } from '@/lib/authorization';
import { ROLES } from '@/lib/roles';

export const clientLoader = (queryClient: QueryClient) => async () => {
  return {};
};

const DonationsSponsorshipsRoute = () => {
  return (
    <ContentLayout title="Donations & Sponsorships">
      <Authorization
        forbiddenFallback={<div>Only admin can view this.</div>}
        allowedRoles={[ROLES.ADMIN]}
      >
        <DonationsSponsorshipsList />
      </Authorization>
    </ContentLayout>
  );
};

export default DonationsSponsorshipsRoute;