import {
  DollarSign,
  Folder,
  Home,
  Settings,
  User,
  Ribbon,
  Heart,
  Gift,
} from 'lucide-react';
import { Outlet } from 'react-router';

import { DashboardLayout, type SideNavigationItem } from '@/components/layouts';
import { ForbiddenFallback } from '@/components/ui/forbidden-fallback';
import { paths } from '@/config/paths';
import { NotificationBell } from '@/features/notifications'; // Import here (allowed in routes/)
import { Authorization } from '@/lib/authorization';
import { ROLES } from '@/lib/roles';

export const ErrorBoundary = () => {
  return <div>Something went wrong!</div>;
};

const DeveloperRoot = () => {
  const navigation = [
    { name: 'Dashboard', to: paths.developer.dashboard.getHref(), icon: Home },
    { name: 'Projects', to: paths.developer.projects.getHref(), icon: Folder },
    {
      name: 'Sponsorships',
      to: paths.developer.sponsorships.getHref(),
      icon: DollarSign,
    },
    {
      name: 'My Donations',
      to: paths.developer.myDonations.getHref(),
      icon: Ribbon,
    },
    {
      name: 'My Sponsorships',
      to: paths.developer.mySponsorships.getHref(),
      icon: Heart,
    },
    {
      name: 'Sponsorships Received',
      to: paths.developer.receivedSponsorships.getHref(),
      icon: Gift,
    },
    {
      name: 'Profile',
      to: paths.developer.profile.getHref(),
      icon: User,
    },
    {
      name: 'Settings',
      to: paths.developer.settings.getHref(),
      icon: Settings,
    },
  ].filter(Boolean) as SideNavigationItem[];

  return (
    <Authorization
      allowedRoles={[ROLES.VOLUNTEER]}
      forbiddenFallback={<ForbiddenFallback roles={[ROLES.VOLUNTEER]} />}
    >
      <DashboardLayout
        navigation={navigation}
        headerExtras={<NotificationBell />}
      >
        {' '}
        {/* Pass the bell here */}
        <Outlet />
      </DashboardLayout>
    </Authorization>
  );
};

export default DeveloperRoot;
