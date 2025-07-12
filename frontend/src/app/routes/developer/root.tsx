import { Home, Folder, Settings } from 'lucide-react';
import { Outlet } from 'react-router';

import { DashboardLayout, type SideNavigationItem } from '@/components/layouts';
import { paths } from '@/config/paths';

export const ErrorBoundary = () => {
  return <div>Something went wrong!</div>;
};

const DeveloperRoot = () => {
  const navigation = [
    { name: 'Dashboard', to: paths.developer.dashboard.getHref(), icon: Home },
    { name: 'Projects', to: paths.developer.projects.getHref(), icon: Folder },
    { name: 'Settings', to: paths.developer.settings.getHref(), icon: Settings },
  ].filter(Boolean) as SideNavigationItem[];

  return (
    <DashboardLayout navigation={navigation}>
      <Outlet />
    </DashboardLayout>
  );
};

export default DeveloperRoot;
