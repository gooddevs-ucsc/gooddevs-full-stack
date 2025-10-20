import {
  //  DollarSign,
  Home,
  Settings,
  User,
  Ribbon,
  Heart,
} from 'lucide-react';
import { Outlet } from 'react-router';

import { DashboardLayout, type SideNavigationItem } from '@/components/layouts';
import { ForbiddenFallback } from '@/components/ui/forbidden-fallback';
import { paths } from '@/config/paths';
import { NotificationBell } from '@/features/notifications';
import { Authorization } from '@/lib/authorization';
import { ROLES } from '@/lib/roles';

export const ErrorBoundary = () => {
  return <div>Something went wrong!</div>;
};

const SponsorRoot = () => {
  const navigation = [
    { name: 'Dashboard', to: paths.sponsor.dashboard.getHref(), icon: Home },
    // TODO: Remove this path and related code
    // {
    //   name: 'My Donations & Sponsorships',
    //   to: paths.sponsor.donationsSponshorships.getHref(),
    //   icon: DollarSign,
    // },
    {
      name: 'My Donations',
      to: paths.sponsor.myDonations.getHref(),
      icon: Ribbon,
    },
    {
      name: 'My Sponsorships',
      to: paths.sponsor.mySponsorships.getHref(),
      icon: Heart,
    },
    {
      name: 'Profile',
      to: paths.sponsor.profile.getHref(),
      icon: User,
    },
    {
      name: 'Settings',
      to: paths.sponsor.settings.getHref(),
      icon: Settings,
    },
  ] as SideNavigationItem[];

  return (
    <Authorization
      forbiddenFallback={<ForbiddenFallback roles={[ROLES.SPONSOR]} />}
      allowedRoles={[ROLES.SPONSOR]}
    >
      <DashboardLayout
        navigation={navigation}
        headerExtras={<NotificationBell />}
      >
        <Outlet />
      </DashboardLayout>
    </Authorization>
  );
};

export default SponsorRoot;
