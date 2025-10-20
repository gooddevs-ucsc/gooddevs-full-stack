import { ContentLayout } from '@/components/layouts';
import { ReceivedSponsorshipsView } from '@/features/sponsorships';

export default function ReceivedSponsorshipsPage() {
  return (
    <ContentLayout title="Sponsorships Received">
      <ReceivedSponsorshipsView />
    </ContentLayout>
  );
}
