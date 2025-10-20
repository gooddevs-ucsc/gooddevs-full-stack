import { NavLink, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';
import { useUser } from '@/lib/auth';
import { ROLES } from '@/lib/roles';
import { cn } from '@/utils/cn';

type NavItem = {
  name: string;
  to: string;
  href?: string;
};

export const Navbar = () => {
  const navigate = useNavigate();
  const user = useUser();

  const getDashboardPath = () => {
    if (!user.data) return paths.app.dashboard.getHref();

    switch (user.data.role) {
      case ROLES.ADMIN:
        return paths.admin.dashboard.getHref();
      case ROLES.SPONSOR:
        return paths.sponsor.dashboard.getHref();
      case ROLES.REQUESTER:
        return paths.requester.dashboard.getHref();
      case ROLES.VOLUNTEER:
        return paths.developer.dashboard.getHref();
      default:
        return paths.home.getHref();
    }
  };

  const handleAuthClick = (path: string) => {
    navigate(path);
  };

  const navigation: NavItem[] = [
    { name: 'Home', to: paths.home.getHref() },
    { name: 'Projects', to: paths.projects.getHref() },
    { name: 'About Us', to: paths.aboutUs.getHref() },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <div className="shrink-0">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-2xl font-bold text-transparent">
                GoodDevs
              </span>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'relative font-medium transition-all duration-200',
                      'after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300',
                      isActive
                        ? 'text-primary after:w-full'
                        : 'text-slate-600 hover:text-primary hover:after:w-full',
                    )
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user.data ? (
              <Button
                onClick={() => navigate(getDashboardPath())}
                variant="default"
                className="bg-gradient-to-r from-primary to-primary/90 shadow-lg hover:from-primary/90 hover:to-primary/80 hover:shadow-xl"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => handleAuthClick(paths.auth.login.getHref())}
                  variant="ghost"
                  className="text-slate-700 hover:bg-slate-100 hover:text-primary"
                >
                  Login
                </Button>
                <Button
                  onClick={() => handleAuthClick(paths.auth.register.getHref())}
                  variant="default"
                  className="bg-gradient-to-r from-primary to-primary/90 shadow-lg hover:from-primary/90 hover:to-primary/80 hover:shadow-xl"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
