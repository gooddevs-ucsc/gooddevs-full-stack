import React, { useState } from 'react';

import { useUpdateEmail } from '@/features/users/api/update-email';
import { useUpdatePassword } from '@/features/users/api/update-password';
import { useUser } from '@/lib/auth';

const DeveloperSettingsRoute = () => {
  const { data: user } = useUser();

  // Email update state
  const [email, setEmail] = useState('');
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

  // Password update state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Notification state
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // API mutations
  const updateEmailMutation = useUpdateEmail({
    mutationConfig: {
      onSuccess: () => {
        alert('Email updated successfully!');
        setEmail('');
        setIsUpdatingEmail(false);
      },
      onError: (error: any) => {
        alert(error?.message || 'Failed to update email');
        setIsUpdatingEmail(false);
      },
    },
  });

  const updatePasswordMutation = useUpdatePassword({
    mutationConfig: {
      onSuccess: () => {
        alert('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsUpdatingPassword(false);
      },
      onError: (error: any) => {
        alert(error?.message || 'Failed to update password');
        setIsUpdatingPassword(false);
      },
    },
  });

  // Event handlers
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const handleCurrentPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => setCurrentPassword(e.target.value);
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewPassword(e.target.value);
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => setConfirmPassword(e.target.value);

  const handleNotificationsChange = (type: string) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type as keyof typeof prev],
    }));
  };

  const handleNotificationsToggle = () => {
    setNotificationsEnabled((prev) => !prev);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      alert('Please enter a valid email');
      return;
    }

    if (email === user?.email) {
      alert('New email must be different from current email');
      return;
    }

    setIsUpdatingEmail(true);
    updateEmailMutation.mutate({ data: { email } });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      alert('New password must be at least 8 characters');
      return;
    }

    if (currentPassword === newPassword) {
      alert('New password must be different from current password');
      return;
    }

    setIsUpdatingPassword(true);
    updatePasswordMutation.mutate({
      data: {
        current_password: currentPassword,
        new_password: newPassword,
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800">
            ⚙️ Account Settings
          </h1>
          <p className="mt-2 text-slate-600">
            Manage your account preferences and security settings
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
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-800">
              Change Email
            </h2>
          </div>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="change-email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                New Email Address
              </label>
              <input
                id="change-email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter new email"
                className="w-full rounded-lg border border-blue-100 px-4 py-3 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 active:border-blue-600 active:ring-blue-300"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isUpdatingEmail || !email.trim()}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 disabled:text-blue-100"
            >
              {isUpdatingEmail ? 'Updating Email...' : 'Update Email'}
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-full bg-emerald-100 p-2">
              <svg
                className="size-5 text-emerald-600"
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
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="current-password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Current Password
              </label>
              <input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={handleCurrentPasswordChange}
                placeholder="Enter current password"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                required
              />
            </div>
            <div>
              <label
                htmlFor="new-password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={handleNewPasswordChange}
                placeholder="Enter new password (min 8 characters)"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                required
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Confirm new password"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                required
              />
            </div>
            <button
              type="submit"
              disabled={
                isUpdatingPassword ||
                !currentPassword ||
                !newPassword ||
                !confirmPassword
              }
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 disabled:text-blue-100"
            >
              {isUpdatingPassword ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Notification Settings */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2">
              <svg
                className="size-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-5 5v-5zM11 19H6a2 2 0 01-2-2V7a2 2 0 012-2h5m0 0V3a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6m0 0v2a2 2 0 01-2 2H9a2 2 0 01-2-2V7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-800">
              Notification Settings
            </h2>
          </div>
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleNotificationsToggle}
              className={`rounded-lg px-6 py-3 font-medium transition ${notificationsEnabled ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {notificationsEnabled
                ? '🔔 Notifications Enabled'
                : '🔕 Notifications Disabled'}
            </button>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notifications.email && notificationsEnabled}
                  onChange={() => handleNotificationsChange('email')}
                  disabled={!notificationsEnabled}
                  className="mr-2"
                />
                Email Notifications
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notifications.sms && notificationsEnabled}
                  onChange={() => handleNotificationsChange('sms')}
                  disabled={!notificationsEnabled}
                  className="mr-2"
                />
                SMS Notifications
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notifications.push && notificationsEnabled}
                  onChange={() => handleNotificationsChange('push')}
                  disabled={!notificationsEnabled}
                  className="mr-2"
                />
                Push Notifications
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperSettingsRoute;
