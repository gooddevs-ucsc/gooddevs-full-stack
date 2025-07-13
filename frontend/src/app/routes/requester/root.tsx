import { Folder, Home, Settings } from 'lucide-react';
import { Outlet } from 'react-router';

import { DashboardLayout, type SideNavigationItem } from '@/components/layouts';
import { paths } from '@/config/paths';
import { Authorization } from '@/lib/authorization';
import { ROLES } from '@/lib/roles';

export const ErrorBoundary = () => {
  return <div>Something went wrong!</div>;
};

const RequesterRoot = () => {
  const navigation = [
    { name: 'Dashboard', to: paths.requester.dashboard.getHref(), icon: Home },
    { name: 'Projects', to: paths.requester.projects.getHref(), icon: Folder },
    { name: 'Settings', to: paths.app.discussions.getHref(), icon: Settings },
  ] as SideNavigationItem[];

  return (
    <Authorization
      allowedRoles={[ROLES.REQUESTER]}
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

export default RequesterRoot;
