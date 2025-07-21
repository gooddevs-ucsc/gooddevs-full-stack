import { Home, Folder, Settings, User } from 'lucide-react';
import { Outlet } from 'react-router';

import { DashboardLayout, type SideNavigationItem } from '@/components/layouts';
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
      forbiddenFallback={
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
            <p className="mt-2 text-gray-600">
              This area is only accessible to requesters.
            </p>
            <p className="mt-4">
              <a
                href="/app"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Go back to main dashboard
              </a>
            </p>
          </div>
        </div>
      }
    >
      <DashboardLayout navigation={navigation}>
        <Outlet />
      </DashboardLayout>
    </Authorization>
  );
};

export default DeveloperRoot;
