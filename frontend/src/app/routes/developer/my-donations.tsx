import { ContentLayout } from '@/components/layouts';
import { MyDonationsView } from '@/features/donations/components';

export const clientLoader = () => async () => {
  return {};
};

const MyDonationsRoute = () => {
  return (
    <ContentLayout title="My Donations">
      <MyDonationsView />
    </ContentLayout>
  );
};

export default MyDonationsRoute;
