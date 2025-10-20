import { ContentLayout } from '@/components/layouts/content-layout';
import { MySponsorshipsView } from '@/features/sponsorships';

const AdminMySponsorshipsRoute = () => {
  return (
    <ContentLayout title="My Sponsorships">
      <MySponsorshipsView />
    </ContentLayout>
  );
};

export default AdminMySponsorshipsRoute;
