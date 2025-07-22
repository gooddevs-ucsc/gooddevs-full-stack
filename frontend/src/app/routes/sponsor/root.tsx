import { Home, DollarSign } from 'lucide-react';
import { Outlet } from 'react-router';

import { DashboardLayout, type SideNavigationItem } from '@/components/layouts';
import { paths } from '@/config/paths';

export const ErrorBoundary = () => {
  return <div>Something went wrong!</div>;
};

const SponsorRoot = () => {
  const navigation = [
    { name: 'Dashboard', to: paths.sponsor.dashboard.getHref(), icon: Home },
    {
      name: 'My Donations & Sponsorships',
      to: paths.sponsor.donationsSponshorships.getHref(),
      icon: DollarSign,
    },
  ] as SideNavigationItem[];

  return (
    <DashboardLayout navigation={navigation}>
      <Outlet />
    </DashboardLayout>
  );
};

export default SponsorRoot;
