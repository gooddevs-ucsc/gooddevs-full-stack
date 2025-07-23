import { Home, DollarSign } from 'lucide-react';
import { Outlet } from 'react-router';

import { DashboardLayout, type SideNavigationItem } from '@/components/layouts';
import { ForbiddenFallback } from '@/components/ui/forbidden-fallback';
import { paths } from '@/config/paths';
import { Authorization } from '@/lib/authorization';
import { ROLES } from '@/lib/roles';

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
    <Authorization
      forbiddenFallback={<ForbiddenFallback roles={[ROLES.SPONSOR]} />}
      allowedRoles={[ROLES.SPONSOR]}
    >
      <DashboardLayout navigation={navigation}>
        <Outlet />
      </DashboardLayout>
    </Authorization>
  );
};

export default SponsorRoot;
