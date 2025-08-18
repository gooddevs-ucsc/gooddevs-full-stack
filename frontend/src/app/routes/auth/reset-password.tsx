import React, { useState } from 'react';

import { useResetPassword } from '@/features/users/api/user-settings-queries';

const ResetPasswordPage: React.FC = () => {
  const [formData, setFormData] = useState({
    token: '',
    new_password: '',
    confirm_password: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const resetPassword = useResetPassword();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.token.trim()) {
      alert('Reset token is required');
      return;
    }

    if (formData.new_password.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      alert('Passwords do not match');
      return;
    }

    try {
      await resetPassword.mutateAsync({
        token: formData.token,
        new_password: formData.new_password,
      });
      setIsSubmitted(true);
    } catch (error: any) {
      console.error('Failed to reset password:', error);
      const errorMessage =
        error?.response?.data?.detail ||
        'Failed to reset password. The token may be expired or invalid.';
      alert(errorMessage);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <div className="text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-green-100">
              <svg
                className="size-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              Password reset successful!
            </h2>
            <p className="mb-6 text-sm text-gray-600">
              Your password has been reset successfully. You can now sign in
              with your new password.
            </p>
            <a
              href="/auth/login"
              className="inline-block w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-white transition hover:bg-blue-700"
            >
              Sign in
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Reset your password
          </h2>
          <p className="mb-6 text-sm text-gray-600">
            Enter your new password below to complete the reset process.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="token"
              className="block text-sm font-medium text-gray-700"
            >
              Reset Token
            </label>
            <input
              id="token"
              type="text"
              required
              value={formData.token}
              onChange={(e) => handleChange('token', e.target.value)}
              placeholder="Enter the reset token from your email"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="new_password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              id="new_password"
              type="password"
              required
              value={formData.new_password}
              onChange={(e) => handleChange('new_password', e.target.value)}
              placeholder="Enter your new password (min 8 characters)"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="confirm_password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <input
              id="confirm_password"
              type="password"
              required
              value={formData.confirm_password}
              onChange={(e) => handleChange('confirm_password', e.target.value)}
              placeholder="Confirm your new password"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={resetPassword.isPending}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:bg-blue-300"
          >
            {resetPassword.isPending ? 'Resetting...' : 'Reset password'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/auth/login"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Back to sign in
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
