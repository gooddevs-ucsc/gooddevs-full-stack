import React from 'react';
import { z } from 'zod';

import { Form, Input } from '@/components/ui/form';
import { useNotifications } from '@/components/ui/notifications';
import { useUpdateEmail } from '@/features/users/api/update-email';
import { useUpdatePassword } from '@/features/users/api/update-password';
import { useUser } from '@/lib/auth';

// Validation schemas
const emailUpdateSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const passwordUpdateSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required'),
    new_password: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .max(100, 'New password must not exceed 100 characters'),
    confirm_password: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'New passwords do not match',
    path: ['confirm_password'],
  })
  .refine((data) => data.current_password !== data.new_password, {
    message: 'New password must be different from current password',
    path: ['new_password'],
  });

const RequesterSettingsRoute = () => {
  const { data: user } = useUser();
  const { addNotification } = useNotifications();

  // API mutations
  const updateEmailMutation = useUpdateEmail({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Email Updated',
          message: 'Your email address has been updated successfully.',
        });
      },
      onError: (error: any) => {
        addNotification({
          type: 'error',
          title: 'Email Update Failed',
          message: error?.message || 'Failed to update email address.',
        });
      },
    },
  });

  const updatePasswordMutation = useUpdatePassword({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Password Updated',
          message: 'Your password has been updated successfully.',
        });
      },
      onError: (error: any) => {
        addNotification({
          type: 'error',
          title: 'Password Update Failed',
          message: error?.message || 'Failed to update password.',
        });
      },
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800">
            ⚙️ Requester Settings
          </h1>
          <p className="mt-2 text-slate-600">
            Manage your account preferences and project settings
          </p>
        </div>

        {/* Current User Info */}
        {user && (
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-indigo-100 p-2">
                <svg
                  className="size-5 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-800">
                Current Account
              </h2>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Name:</strong> {user.firstname} {user.lastname}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
            </div>
          </div>
        )}

        {/* Change Email Form */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-full bg-purple-100 p-2">
              <svg
                className="size-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-800">
              Change Email
            </h2>
          </div>
          <Form
            onSubmit={(data) => {
              if (data.email === user?.email) {
                addNotification({
                  type: 'error',
                  title: 'Invalid Email',
                  message: 'New email must be different from current email.',
                });
                return;
              }
              updateEmailMutation.mutate({ data: { email: data.email } });
            }}
            schema={emailUpdateSchema}
            className="space-y-4"
          >
            {({ register, formState }) => (
              <>
                <Input
                  type="email"
                  label="New Email Address"
                  placeholder="Enter new email"
                  registration={register('email')}
                  error={formState.errors.email}
                  className="w-full rounded-lg border border-purple-100 px-4 py-3 transition focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 active:border-purple-600 active:ring-purple-300"
                />
                <button
                  type="submit"
                  disabled={updateEmailMutation.isPending || !formState.isValid}
                  className="w-full rounded-md bg-purple-600 px-3 py-2 text-sm text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-300 disabled:text-purple-100"
                >
                  {updateEmailMutation.isPending
                    ? 'Updating Email...'
                    : 'Update Email'}
                </button>
              </>
            )}
          </Form>
        </div>

        {/* Change Password Form */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-full bg-orange-100 p-2">
              <svg
                className="size-5 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-800">
              Change Password
            </h2>
          </div>
          <Form
            onSubmit={(data) => {
              updatePasswordMutation.mutate({
                data: {
                  current_password: data.current_password,
                  new_password: data.new_password,
                },
              });
            }}
            schema={passwordUpdateSchema}
            className="space-y-4"
          >
            {({ register, formState }) => (
              <>
                <Input
                  type="password"
                  label="Current Password"
                  placeholder="Enter current password"
                  registration={register('current_password')}
                  error={formState.errors.current_password}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 transition focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
                <Input
                  type="password"
                  label="New Password"
                  placeholder="Enter new password (min 8 characters)"
                  registration={register('new_password')}
                  error={formState.errors.new_password}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 transition focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
                <Input
                  type="password"
                  label="Confirm New Password"
                  placeholder="Confirm new password"
                  registration={register('confirm_password')}
                  error={formState.errors.confirm_password}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 transition focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
                <button
                  type="submit"
                  disabled={
                    updatePasswordMutation.isPending || !formState.isValid
                  }
                  className="w-full rounded-md bg-purple-600 px-3 py-2 text-sm text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-300 disabled:text-purple-100"
                >
                  {updatePasswordMutation.isPending
                    ? 'Updating Password...'
                    : 'Update Password'}
                </button>
              </>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default RequesterSettingsRoute;
