import { Home, Folder, Users, DollarSign } from 'lucide-react';
import { Outlet } from 'react-router';

import { DashboardLayout, type SideNavigationItem } from '@/components/layouts';
import { paths } from '@/config/paths';
import { useAuthorization } from '@/lib/authorization';
import { ROLES } from '@/lib/roles';

export const ErrorBoundary = () => {
  return <div>Something went wrong!</div>;
};

const AppRoot = () => {
  const { checkAccess } = useAuthorization();

  const navigation = [
    { name: 'Dashboard', to: paths.app.dashboard.getHref(), icon: Home },
    { name: 'Discussions', to: paths.app.discussions.getHref(), icon: Folder },
    checkAccess({ allowedRoles: [ROLES.ADMIN] }) && {
      name: 'Users',
      to: paths.app.users.getHref(),
      icon: Users,
    },
     checkAccess({ allowedRoles: [ROLES.ADMIN] }) && {
      name: 'Donations & Sponsorships',
      to: paths.app.donationsSponshorships.getHref(),
      icon: DollarSign,
    },
  ].filter(Boolean) as SideNavigationItem[];

  return (
    <DashboardLayout navigation={navigation}>
      <Outlet />
    </DashboardLayout>
  );
};

export default AppRoot;
