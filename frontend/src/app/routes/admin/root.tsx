import { Home, Users, Folder, DollarSign } from 'lucide-react';
import { Outlet } from 'react-router';

import { DashboardLayout, type SideNavigationItem } from '@/components/layouts';
import { paths } from '@/config/paths';
import { useAuthorization } from '@/lib/authorization';
import { ROLES } from '@/lib/roles';

export const ErrorBoundary = () => {
  return <div>Something went wrong!</div>;
};

const AdminRoot = () => {
  const { checkAccess } = useAuthorization();

  if (!checkAccess({ allowedRoles: [ROLES.ADMIN] })) {
    return <div>Access denied. Admin privileges required.</div>;
  }

  const navigation = [
    { name: 'Dashboard', to: paths.admin.dashboard.getHref(), icon: Home },
    { name: 'Discussions', to: paths.admin.discussions.getHref(), icon: Folder },
    { name: 'Users', to: paths.admin.users.getHref(), icon: Users },
    { 
      name: 'Donations & Sponsorships', 
      to: paths.admin.donationsSponshorships.getHref(),
      icon: DollarSign 
    },
  ] as SideNavigationItem[];

  return (
    <DashboardLayout navigation={navigation}>
      <Outlet />
    </DashboardLayout>
  );
};

export default AdminRoot;
