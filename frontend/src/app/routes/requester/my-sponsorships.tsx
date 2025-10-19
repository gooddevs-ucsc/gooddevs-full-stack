import { ContentLayout } from '@/components/layouts/content-layout';
import { MySponsorshipsView } from '@/features/sponsorships';

const RequesterMySponsorshipsRoute = () => {
  return (
    <ContentLayout title="My Sponsorships">
      <MySponsorshipsView />
    </ContentLayout>
  );
};

export default RequesterMySponsorshipsRoute;
