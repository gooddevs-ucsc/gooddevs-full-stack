import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { Head } from '@/components/seo';
import { Link } from '@/components/ui/link';
import { paths } from '@/config/paths';
import { useUser } from '@/lib/auth';

type LayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const AuthLayout = ({ children, title }: LayoutProps) => {
  const user = useUser();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  const navigate = useNavigate();

  useEffect(() => {
    if (user.data) {
      navigate(redirectTo ? redirectTo : paths.home.getHref(), {
        replace: true,
      });
    }
  }, [user.data, navigate, redirectTo]);

  return (
    <>
      <Head title={title} />
      <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Link
              className="flex items-center text-white"
              to={paths.home.getHref()}
            >
              <div className="flex items-center">
                <div className="shrink-0">
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-6xl font-bold text-transparent">
                    GoodDevs
                  </span>
                </div>
              </div>
            </Link>
          </div>

          <h2 className="mt-3 text-center text-3xl font-extrabold text-gray-900">
            {title}
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};
