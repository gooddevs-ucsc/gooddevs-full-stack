import { PanelLeft, Settings, User2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useNavigation } from 'react-router';

import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { paths } from '@/config/paths';
import { useUser, useLogout } from '@/lib/auth';
import { cn } from '@/utils/cn';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown';
import { Link } from '../ui/link';

export type SideNavigationItem = {
  name: string;
  to: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
};

const Logo = () => {
  return (
    <Link className="flex items-center text-white" to={paths.home.getHref()}>
      <span className="ml-2 bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-lg font-semibold text-transparent">
        GoodDevs
      </span>
    </Link>
  );
};

const Progress = () => {
  const { state, location } = useNavigation();

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
  }, [location?.pathname]);

  useEffect(() => {
    if (state === 'loading') {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(timer);
            return 100;
          }
          const newProgress = oldProgress + 10;
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 300);

      return () => {
        clearInterval(timer);
      };
    }
  }, [state]);

  if (state !== 'loading') {
    return null;
  }

  return (
    <div
      className="fixed left-0 top-0 z-50 h-1 bg-primary transition-all duration-200 ease-in-out"
      style={{ width: `${progress}%` }}
    ></div>
  );
};

type DashboardLayoutProps = {
  children: React.ReactNode;
  navigation: SideNavigationItem[];
  headerExtras?: React.ReactNode; // Add this prop for custom header items like NotificationBell
};

export function DashboardLayout({
  children,
  navigation,
  headerExtras, // Accept the prop
}: DashboardLayoutProps) {
  const navigate = useNavigate();
  const user = useUser();
  const logout = useLogout({
    onSuccess: () => navigate(paths.auth.login.getHref()),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Progress />

      {/* Modern Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Drawer>
              <DrawerTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full hover:bg-slate-100/80 sm:hidden"
                >
                  <PanelLeft className="size-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent
                side="left"
                className="border-r border-slate-200/60 bg-white/95 pt-10 text-slate-900 backdrop-blur-xl sm:max-w-64"
              >
                <nav className="grid gap-2 px-4 text-sm font-medium">
                  <div className="flex h-16 shrink-0 items-center px-4">
                    <Logo />
                  </div>
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.to}
                      end
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-slate-600 transition-all hover:bg-slate-100/80 hover:text-slate-900',
                          isActive && 'bg-primary/10 text-primary shadow-sm',
                        )
                      }
                    >
                      <item.icon className="size-5" />
                      {item.name}
                    </NavLink>
                  ))}
                </nav>
              </DrawerContent>
            </Drawer>

            <Link
              to={paths.home.getHref()}
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-xl font-bold text-transparent">
                GoodDevs
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {headerExtras}{' '}
            {/* Render the passed-in extras (e.g., NotificationBell) here */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-slate-100/80"
                >
                  <span className="sr-only">Open user menu</span>
                  <User2 className="size-5 text-slate-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => {
                    const role = user.data?.role?.toLowerCase();
                    if (role === 'requester') {
                      navigate(paths.requester.profile.getHref());
                    } else if (role === 'volunteer') {
                      navigate(paths.developer.profile.getHref());
                    } else if (role === 'sponsor') {
                      navigate(paths.sponsor.profile.getHref());
                    } else if (role === 'admin') {
                      navigate(paths.admin.profile.getHref());
                    } else {
                      navigate(paths.app.profile.getHref());
                    }
                  }}
                  className="cursor-pointer"
                >
                  <User2 className="mr-2 size-4" />
                  Your Profile
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    const role = user.data?.role?.toLowerCase();
                    if (role === 'requester') {
                      navigate(paths.requester.settings.getHref());
                    } else if (role === 'volunteer') {
                      // <-- changed from 'developer' to 'volunteer'
                      navigate(paths.developer.settings.getHref());
                    } else if (role === 'sponsor') {
                      navigate(paths.sponsor.settings.getHref());
                    } else if (role === 'admin') {
                      navigate(paths.admin.settings.getHref());
                    }
                    // For other roles or no role, do nothing or navigate to a default
                  }}
                  className="cursor-pointer"
                >
                  <Settings className="mr-2 size-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => logout.mutate({})}
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Modern Sidebar */}
        <aside className="fixed left-0 top-16 z-30 hidden h-[calc(100vh-4rem)] w-64 border-r border-slate-200/60 bg-white/40 backdrop-blur-xl sm:block">
          <nav className="flex h-full flex-col gap-2 p-4">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                end={item.name !== 'Discussions'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all hover:bg-white/60 hover:shadow-sm',
                    isActive
                      ? 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary shadow-sm border border-primary/20'
                      : 'text-slate-600 hover:text-slate-900',
                  )
                }
              >
                <item.icon className="size-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 sm:ml-64">
          <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
