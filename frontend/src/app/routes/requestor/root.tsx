import { Home, Folder, Settings } from 'lucide-react';
import { Outlet } from 'react-router';

import { DashboardLayout, type SideNavigationItem } from '@/components/layouts';
import { paths } from '@/config/paths';

export const ErrorBoundary = () => {
  return <div>Something went wrong!</div>;
};

const RequestorRoot = () => {
  const navigation = [
    { name: 'Dashboard', to: paths.app.dashboard.getHref(), icon: Home },
    { name: 'Projects', to: paths.app.discussions.getHref(), icon: Folder },
    { name: 'Settings', to: paths.app.discussions.getHref(), icon: Settings },
  ] as SideNavigationItem[];

  return (
    <DashboardLayout navigation={navigation}>
      <Outlet />
    </DashboardLayout>
  );
};

export default RequestorRoot;
