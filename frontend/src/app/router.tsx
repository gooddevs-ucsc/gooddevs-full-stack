import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { paths } from '@/config/paths';
import { ProtectedRoute } from '@/lib/auth';

import {
  default as AppRoot,
  ErrorBoundary as AppRootErrorBoundary,
} from './routes/app/root';
import {
  default as DeveloperRoot,
  ErrorBoundary as DeveloperRootErrorBoundary,
} from './routes/developer/root';
import {
  default as RequesterRoot,
  ErrorBoundary as RequestorRootErrorBoundary,
} from './routes/requester/root';

const convert = (queryClient: QueryClient) => (m: any) => {
  const { clientLoader, clientAction, default: Component, ...rest } = m;
  return {
    ...rest,
    loader: clientLoader?.(queryClient),
    action: clientAction?.(queryClient),
    Component,
  };
};

export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: paths.home.path,
      lazy: () => import('./routes/home').then(convert(queryClient)),
    },
    {
      path: paths.projects.path,
      lazy: () => import('./routes/projects').then(convert(queryClient)),
    },
    {
      path: paths.projectDetail.path,
      lazy: () => import('./routes/project-detail').then(convert(queryClient)),
    },
    {
      path: paths.aboutUs.path,
      lazy: () => import('./routes/about-us').then(convert(queryClient)),
    },
    {
      path: paths.auth.register.path,
      lazy: () => import('./routes/auth/register').then(convert(queryClient)),
    },
    {
      path: paths.auth.login.path,
      lazy: () => import('./routes/auth/login').then(convert(queryClient)),
    },
    {
      path: paths.app.root.path,
      element: (
        <ProtectedRoute>
          <AppRoot />
        </ProtectedRoute>
      ),
      ErrorBoundary: AppRootErrorBoundary,
      children: [
        {
          path: paths.app.discussions.path,
          lazy: () =>
            import('./routes/app/discussions/discussions').then(
              convert(queryClient),
            ),
        },
        {
          path: paths.app.discussion.path,
          lazy: () =>
            import('./routes/app/discussions/discussion').then(
              convert(queryClient),
            ),
        },
        {
          path: paths.app.users.path,
          lazy: () => import('./routes/app/users').then(convert(queryClient)),
        },
        {
          path: paths.app.profile.path,
          lazy: () => import('./routes/app/profile').then(convert(queryClient)),
        },
        {
          path: paths.app.dashboard.path,
          lazy: () =>
            import('./routes/app/dashboard').then(convert(queryClient)),
        },
      ],
    },
    {
      path: paths.admin.root.path,
      lazy: () => import('./routes/admin/root').then(convert(queryClient)),
      children: [
        {
          path: paths.admin.donationsSponshorships.path,
          lazy: () => import('./routes/admin/donations-sponsorships').then(convert(queryClient)),
        },
      ],
    },
    {
      path: paths.sponsor.root.path,
      lazy: () => import('./routes/sponsor/root').then(convert(queryClient)), // Change this line
      children: [
        {
          path: paths.sponsor.donationsSponshorships.path,
          lazy: () => import('./routes/sponsor/donations-sponsorships').then(convert(queryClient)), // Change this line
        },
      ],
    },
    {
      path: paths.requester.root.path,
      element: (
        <ProtectedRoute>
          <RequesterRoot />
        </ProtectedRoute>
      ),
      ErrorBoundary: RequestorRootErrorBoundary,
      children: [
        {
          path: paths.requester.dashboard.path,
          lazy: () =>
            import('./routes/requester/dashboard').then(convert(queryClient)),
        },
        {
          path: paths.requester.projects.path,
          lazy: () =>
            import('./routes/requester/projects').then(convert(queryClient)),
        },
        {
          path: paths.requester.createProject.path,
          lazy: () =>
            import('./routes/requester/submitnewproject').then(
              convert(queryClient),
            ),
        },
        {
          path: paths.requester.settings.path,
          lazy: () =>
            import('./routes/requester/settings').then(convert(queryClient)),
        },
      ],
    },
    {
      path: paths.developer.root.path,
      element: (
        <ProtectedRoute>
          <DeveloperRoot />
        </ProtectedRoute>
      ),
      ErrorBoundary: DeveloperRootErrorBoundary,
      children: [
        {
          path: paths.developer.dashboard.path,
          lazy: () =>
            import('./routes/developer/dashboard').then(convert(queryClient)),
        },
        {
          path: paths.developer.projects.path,
          lazy: () =>
            import('./routes/developer/projects').then(convert(queryClient)),
        },
        {
          path: paths.developer.settings.path,
          lazy: () =>
            import('./routes/developer/settings').then(convert(queryClient)),
        },
      ],
    },
    {
      path: '*',
      lazy: () => import('./routes/not-found').then(convert(queryClient)),
    },
  ]);

export const AppRouter = () => {
  const queryClient = useQueryClient();

  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  return <RouterProvider router={router} />;
};
