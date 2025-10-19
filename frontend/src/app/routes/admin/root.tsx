import {
  ClipboardCheck,
  // Users, Folder,
  DollarSign,
  Home,
  Settings,
  Ribbon,
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

const AdminRoot = () => {
  const navigation = [
    { name: 'Dashboard', to: paths.admin.dashboard.getHref(), icon: Home },
    /**
     * TODO: Refactor or remove this component if no longer needed.
     */
    // { name: 'Users', to: paths.admin.users.getHref(), icon: Users },
    {
      name: 'Project Approvals',
      to: paths.admin.projectApprovals.getHref(),
      icon: ClipboardCheck,
    },
    {
      name: 'Donations & Sponsorships',
      to: paths.admin.donationsSponshorships.getHref(),
      icon: DollarSign,
    },
    {
      name: 'My Donations',
      to: paths.admin.myDonations.getHref(),
      icon: Ribbon,
    },
    {
      name: 'Settings',
      to: paths.admin.settings.getHref(),
      icon: Settings,
    },
  ].filter(Boolean) as SideNavigationItem[];

  return (
    <Authorization
      forbiddenFallback={<ForbiddenFallback roles={[ROLES.ADMIN]} />}
      allowedRoles={[ROLES.ADMIN]}
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

export default AdminRoot;
