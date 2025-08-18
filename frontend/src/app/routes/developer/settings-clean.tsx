import React, { useState, useEffect } from 'react';

import {
  useMyUserProfile,
  useUpdateMyProfile,
  useUpdatePassword,
} from '@/features/users/api/user-settings-queries';

const DeveloperSettingsRoute = () => {
  // API hooks
  const { data: userProfile, isLoading: profileLoading } = useMyUserProfile();
  const updateProfile = useUpdateMyProfile();
  const updatePassword = useUpdatePassword();

  // Form states
  const [emailForm, setEmailForm] = useState({
    email: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Initialize form with user data
  useEffect(() => {
    if (userProfile) {
      setEmailForm({
        email: userProfile.email,
      });
    }
  }, [userProfile]);

  // Handlers
  const handleEmailChange = (field: string, value: string) => {
    setEmailForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  // Submit handlers
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync(emailForm);
      alert('Email updated successfully!');
    } catch (error: any) {
      console.error('Failed to update email:', error);
      const errorMessage =
        error?.response?.data?.detail || 'Failed to update email';
      alert(errorMessage);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      alert('New password must be at least 8 characters long');
      return;
    }

    try {
      await updatePassword.mutateAsync({
        current_password: passwordForm.oldPassword,
        new_password: passwordForm.newPassword,
      });
      alert('Password updated successfully!');
      setPasswordForm({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      console.error('Failed to update password:', error);
      const errorMessage =
        error?.response?.data?.detail || 'Failed to update password';
      alert(errorMessage);
    }
  };

  if (profileLoading) {
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
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Change Password
          </h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="current_password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Old Password
              </label>
              <input
                id="current_password"
                type="password"
                value={passwordForm.oldPassword}
                onChange={(e) =>
                  handlePasswordChange('oldPassword', e.target.value)
                }
                placeholder="Enter old password"
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="new_password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                id="new_password"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  handlePasswordChange('newPassword', e.target.value)
                }
                placeholder="Enter new password (min 8 characters)"
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="confirm_password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <input
                id="confirm_password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  handlePasswordChange('confirmPassword', e.target.value)
                }
                placeholder="Confirm new password"
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={updatePassword.isPending}
              className="w-full rounded bg-blue-600 py-2 text-white transition hover:bg-blue-700 disabled:bg-blue-300"
            >
              {updatePassword.isPending ? 'Updating...' : 'Update Password'}
            </button>
          </form>

          {/* Email Update Section */}
          <div className="mt-6 border-t pt-6">
            <h3 className="mb-4 text-lg font-medium text-gray-800">
              Update Email
            </h3>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={emailForm.email}
                  onChange={(e) => handleEmailChange('email', e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={updateProfile.isPending}
                className="w-full rounded bg-green-600 py-2 text-white transition hover:bg-green-700 disabled:bg-green-300"
              >
                {updateProfile.isPending ? 'Updating...' : 'Update Email'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperSettingsRoute;
