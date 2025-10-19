import { QueryClient } from '@tanstack/react-query';

import { ContentLayout } from '@/components/layouts';
import { AdminDonationsView } from '@/features/donations/components';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const clientLoader = (queryClient: QueryClient) => async () => {
  return {};
};

const AllDonationsRoute = () => {
  return (
    <ContentLayout title="All Donations & Reports">
      <AdminDonationsView />
    </ContentLayout>
  );
};

export default AllDonationsRoute;
