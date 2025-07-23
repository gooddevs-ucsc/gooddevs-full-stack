import { Home, Folder, Settings, User } from 'lucide-react';
import { Outlet } from 'react-router';

import { DashboardLayout, type SideNavigationItem } from '@/components/layouts';
import { ForbiddenFallback } from '@/components/ui/forbidden-fallback';
import { paths } from '@/config/paths';
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
      icon: Folder,
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
      <DashboardLayout navigation={navigation}>
        <Outlet />
      </DashboardLayout>
    </Authorization>
  );
};

export default DeveloperRoot;
