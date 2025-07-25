import {
  ArrowLeft,
  Folder,
  Home,
  Settings,
  User,
  DollarSign,
} from 'lucide-react';
import { D } from 'node_modules/react-router/dist/development/fog-of-war-BkI3XFdx.mjs';
import { Outlet, useLocation } from 'react-router';

import { DashboardLayout, type SideNavigationItem } from '@/components/layouts';
import { ForbiddenFallback } from '@/components/ui/forbidden-fallback';
import { paths } from '@/config/paths';
import { Authorization } from '@/lib/authorization';
import { ROLES } from '@/lib/roles';

export const ErrorBoundary = () => {
  return <div>Something went wrong!</div>;
};

const RequesterRoot = () => {
  const location = useLocation();

  const isCreateProjectPage =
    location.pathname === paths.requester.createProject.getHref();

  const defaultNavigation = [
    { name: 'Dashboard', to: paths.requester.dashboard.getHref(), icon: Home },
    { name: 'Projects', to: paths.requester.projects.getHref(), icon: Folder },
    {
      name: 'Sponsorships',
      to: paths.requester.sponsorships.getHref(),
      icon: DollarSign,
    },
    { name: 'Profile', to: paths.requester.profile.getHref(), icon: User },
    {
      name: 'Settings',
      to: paths.requester.settings.getHref(),
      icon: Settings,
    },
  ] as SideNavigationItem[];

  const createProjectNavigation = [
    {
      name: 'Back to Projects',
      to: paths.requester.projects.getHref(),
      icon: ArrowLeft,
    },
  ] as SideNavigationItem[];

  const navigation = isCreateProjectPage
    ? createProjectNavigation
    : defaultNavigation;

  return (
    <Authorization
      allowedRoles={[ROLES.REQUESTER]}
      forbiddenFallback={<ForbiddenFallback roles={[ROLES.REQUESTER]} />}
    >
      <DashboardLayout navigation={navigation}>
        <Outlet />
      </DashboardLayout>
    </Authorization>
  );
};

export default RequesterRoot;
