import { useMutation } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, Input, Label } from '@/components/ui/form';
import { api } from '@/lib/api-client';
import { useUser } from '@/lib/auth';

// Validation schemas
const emailUpdateSchema = z.object({
  newEmail: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
});

const passwordUpdateSchema = z
  .object({
    oldPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type EmailUpdateInput = z.infer<typeof emailUpdateSchema>;
type PasswordUpdateInput = z.infer<typeof passwordUpdateSchema>;

const DeveloperSettingsRoute = () => {
  // Get current user data
  const { data: userProfile, refetch: refetchUser } = useUser();

  // Form states
  const [emailForm, setEmailForm] = useState({
    currentEmail: '',
  });

  // Initialize form with user data
  useEffect(() => {
    if (userProfile) {
      setEmailForm({
        currentEmail: userProfile.email,
      });
    }
  }, [userProfile]);

  // Mutation for updating email
  const updateEmailMutation = useMutation({
    mutationFn: async (email: string) => {
      return api.patch('/users/me', { email });
    },
    onSuccess: () => {
      alert('Email updated successfully!');
      refetchUser();
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.detail || 'Failed to update email';
      alert(errorMessage);
    },
  });

  // Mutation for updating password
  const updatePasswordMutation = useMutation({
    mutationFn: async (data: {
      current_password: string;
      new_password: string;
    }) => {
      return api.patch('/users/me/password', data);
    },
    onSuccess: () => {
      alert('Password updated successfully!');
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.detail || 'Failed to update password';
      alert(errorMessage);
    },
  });

  if (!userProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center">
          <div className="size-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
          <span className="ml-3">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-900">
          Account Settings
        </h1>

        <div className="rounded-lg bg-white p-6 shadow-lg">
          {/* Password Change Section */}
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Change Password
          </h2>
          <Form
            onSubmit={(values: PasswordUpdateInput) => {
              updatePasswordMutation.mutate({
                current_password: values.oldPassword,
                new_password: values.newPassword,
              });
            }}
            schema={passwordUpdateSchema}
            options={{
              shouldUnregister: true,
            }}
          >
            {({ register, formState }) => (
              <>
                <Input
                  type="password"
                  label="Current Password"
                  error={formState.errors['oldPassword']}
                  registration={register('oldPassword')}
                />
                <Input
                  type="password"
                  label="New Password"
                  error={formState.errors['newPassword']}
                  registration={register('newPassword')}
                />
                <Input
                  type="password"
                  label="Confirm Password"
                  error={formState.errors['confirmPassword']}
                  registration={register('confirmPassword')}
                />
                <Button
                  isLoading={updatePasswordMutation.isPending}
                  type="submit"
                  className="w-full"
                >
                  Update Password
                </Button>
              </>
            )}
          </Form>

          {/* Email Update Section */}
          <div className="mt-6 border-t pt-6">
            <h3 className="mb-4 text-lg font-medium text-gray-800">
              Update Email
            </h3>
            <div className="mb-4">
              <Label>Current Email</Label>
              <div className="mt-1 rounded border border-gray-300 bg-gray-50 px-3 py-2 text-gray-600">
                {emailForm.currentEmail}
              </div>
            </div>
            <Form
              onSubmit={(values: EmailUpdateInput) => {
                updateEmailMutation.mutate(values.newEmail);
              }}
              schema={emailUpdateSchema}
              options={{
                shouldUnregister: true,
              }}
            >
              {({ register, formState }) => (
                <>
                  <Input
                    type="email"
                    label="New Email Address"
                    error={formState.errors['newEmail']}
                    registration={register('newEmail')}
                  />
                  <Button
                    isLoading={updateEmailMutation.isPending}
                    type="submit"
                    className="w-full"
                  >
                    Update Email
                  </Button>
                </>
              )}
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperSettingsRoute;
