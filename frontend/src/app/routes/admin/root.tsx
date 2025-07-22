import { Home, Users, Folder, DollarSign, ClipboardCheck } from 'lucide-react';
import { Outlet } from 'react-router';

import { DashboardLayout, type SideNavigationItem } from '@/components/layouts';
import { ForbiddenFallback } from '@/components/ui/forbidden-fallback';
import { paths } from '@/config/paths';
import { Authorization } from '@/lib/authorization';
import { ROLES } from '@/lib/roles';

export const ErrorBoundary = () => {
  return <div>Something went wrong!</div>;
};

const AdminRoot = () => {
  const navigation = [
    { name: 'Dashboard', to: paths.admin.dashboard.getHref(), icon: Home },
    { name: 'Users', to: paths.admin.users.getHref(), icon: Users },
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
  ].filter(Boolean) as SideNavigationItem[];

  return (
    <Authorization
      forbiddenFallback={<ForbiddenFallback roles={[ROLES.ADMIN]} />}
      allowedRoles={[ROLES.ADMIN]}
    >
      <DashboardLayout navigation={navigation}>
        <Outlet />
      </DashboardLayout>
    </Authorization>
  );
};

export default AdminRoot;
