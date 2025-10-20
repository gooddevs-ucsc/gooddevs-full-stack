import { ContentLayout } from '@/components/layouts/content-layout';
import { MySponsorshipsView } from '@/features/sponsorships';

const SponsorMySponsorshipsRoute = () => {
  return (
    <ContentLayout title="My Sponsorships">
      <MySponsorshipsView />
    </ContentLayout>
  );
};

export default SponsorMySponsorshipsRoute;
