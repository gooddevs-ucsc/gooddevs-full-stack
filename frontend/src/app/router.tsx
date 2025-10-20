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
import DeveloperRoot, {
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
      children: [
        {
          path: paths.projectDetail.threadList.path,
          lazy: () =>
            import('./routes/project-thread-list').then(convert(queryClient)),
        },
        {
          path: 'threads/:threadId',
          lazy: () =>
            import('./routes/project-thread-detail').then(convert(queryClient)),
        },
      ],
    },
    {
      path: paths.aboutUs.path,
      lazy: () => import('./routes/about-us').then(convert(queryClient)),
    },
    {
      path: paths.profile.path,
      lazy: () => import('./routes/public-profile').then(convert(queryClient)),
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
        {
          path: paths.app.notifications.path,
          lazy: () =>
            import('./routes/app/notifications').then(convert(queryClient)),
        },
      ],
    },
    {
      path: paths.admin.root.path,
      lazy: () => import('./routes/admin/root').then(convert(queryClient)),
      children: [
        {
          path: paths.admin.dashboard.path,
          lazy: () =>
            import('./routes/admin/dashboard').then(convert(queryClient)),
        },
        {
          path: paths.admin.donationsSponshorships.path,
          lazy: () =>
            import('./routes/admin/donations-sponsorships').then(
              convert(queryClient),
            ),
        },
        {
          path: paths.admin.projectApprovals.path,
          lazy: () =>
            import('./routes/admin/project-approvals').then(
              convert(queryClient),
            ),
        },
        {
          path: paths.admin.myDonations.path,
          lazy: () =>
            import('./routes/admin/my-donations').then(convert(queryClient)),
        },
        {
          path: paths.admin.mySponsorships.path,
          lazy: () =>
            import('./routes/admin/my-sponsorships').then(convert(queryClient)),
        },
        {
          path: paths.admin.allDonations.path,
          lazy: () =>
            import('./routes/admin/all-donations').then(convert(queryClient)),
        },
        {
          path: paths.admin.projectDetail.path,
          lazy: () =>
            import('./routes/admin/project-detail').then(convert(queryClient)),
        },
        {
          path: paths.admin.settings.path,
          lazy: () =>
            import('./routes/admin/settings').then(convert(queryClient)),
        },
      ],
    },
    {
      path: paths.sponsor.root.path,
      lazy: () => import('./routes/sponsor/root').then(convert(queryClient)),
      children: [
        {
          path: paths.sponsor.dashboard.path,
          lazy: () =>
            import('./routes/sponsor/dashboard').then(convert(queryClient)),
        },
        {
          path: paths.sponsor.donationsSponshorships.path,
          lazy: () =>
            import('./routes/sponsor/donations-sponsorships').then(
              convert(queryClient),
            ),
        },
        {
          path: paths.sponsor.myDonations.path,
          lazy: () =>
            import('./routes/sponsor/my-donations').then(convert(queryClient)),
        },
        {
          path: paths.sponsor.mySponsorships.path,
          lazy: () =>
            import('./routes/sponsor/my-sponsorships').then(
              convert(queryClient),
            ),
        },
        {
          path: paths.sponsor.profile.path,
          lazy: () =>
            import('./routes/sponsor/profile').then(convert(queryClient)),
        },
        {
          path: paths.sponsor.settings.path,
          lazy: () =>
            import('./routes/sponsor/settings').then(convert(queryClient)),
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
            import('./routes/requester/project-create').then(
              convert(queryClient),
            ),
        },
        {
          path: paths.requester.projectApplications.path,
          lazy: () =>
            import('./routes/requester/project-applications').then(
              convert(queryClient),
            ),
        },

        {
          path: paths.requester.sponsorships.path,
          lazy: () =>
            import('./routes/requester/sponsorships').then(
              convert(queryClient),
            ),
        },
        {
          path: paths.requester.myDonations.path,
          lazy: () =>
            import('./routes/requester/my-donations').then(
              convert(queryClient),
            ),
        },
        {
          path: paths.requester.mySponsorships.path,
          lazy: () =>
            import('./routes/requester/my-sponsorships').then(
              convert(queryClient),
            ),
        },
        {
          path: paths.requester.profile.path,
          lazy: () =>
            import('./routes/requester/profile').then(convert(queryClient)),
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
          path: paths.developer.reviewApplications.path,
          lazy: () =>
            import('./routes/developer/review-applications').then(
              convert(queryClient),
            ),
        },
        {
          path: paths.developer.sponsorships.path,
          lazy: () =>
            import('./routes/developer/sponsorships').then(
              convert(queryClient),
            ),
        },
        {
          path: paths.developer.myDonations.path,
          lazy: () =>
            import('./routes/developer/my-donations').then(
              convert(queryClient),
            ),
        },
        {
          path: paths.developer.mySponsorships.path,
          lazy: () =>
            import('./routes/developer/my-sponsorships').then(
              convert(queryClient),
            ),
        },
        {
          path: paths.developer.receivedSponsorships.path,
          lazy: () =>
            import('./routes/developer/received-sponsorships').then(
              convert(queryClient),
            ),
        },
        {
          path: paths.developer.settings.path,
          lazy: () =>
            import('./routes/developer/settings').then(convert(queryClient)),
        },
        {
          path: paths.developer.profile.path,
          lazy: () =>
            import('./routes/developer/profile').then(convert(queryClient)),
        },
      ],
    },
    {
      path: paths.payments.root.path,
      children: [
        {
          path: paths.payments.testPayment.path,
          lazy: () =>
            import('./routes/payments/test-payment').then(convert(queryClient)),
        },
        {
          path: paths.payments.donation.path,
          lazy: () =>
            import('./routes/payments/donation').then(convert(queryClient)),
        },
        {
          path: paths.payments.sponsorship.path,
          lazy: () =>
            import('./routes/payments/sponsorship').then(convert(queryClient)),
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
