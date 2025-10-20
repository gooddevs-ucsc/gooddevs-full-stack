import { ContentLayout } from '@/components/layouts';
import { AdminWithdrawalsView } from '@/features/sponsorships';

const AdminWithdrawalsRoute = () => {
  return (
    <ContentLayout title="Withdrawal Management">
      <AdminWithdrawalsView />
    </ContentLayout>
  );
};

export default AdminWithdrawalsRoute;
