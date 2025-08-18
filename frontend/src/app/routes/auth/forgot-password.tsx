import React, { useState } from 'react';

import { useForgotPassword } from '@/features/users/api/user-settings-queries';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const forgotPassword = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      alert('Please enter your email address');
      return;
    }

    try {
      await forgotPassword.mutateAsync({ email });
      setIsSubmitted(true);
    } catch (error: any) {
      console.error('Failed to send password reset:', error);
      const errorMessage =
        error?.response?.data?.detail || 'Failed to send password reset email';
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
              Check your email
            </h2>
            <p className="mb-6 text-sm text-gray-600">
              We&#39;ve sent a password reset link to{' '}
              <span className="font-medium">{email}</span>
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail('');
                }}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
              >
                Send another email
              </button>
              <a
                href="/auth/login"
                className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-center text-gray-700 transition hover:bg-gray-50"
              >
                Back to login
              </a>
            </div>
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
            Forgot your password?
          </h2>
          <p className="mb-6 text-sm text-gray-600">
            No worries! Enter your email address and we&#39;ll send you a link
            to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={forgotPassword.isPending}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:bg-blue-300"
          >
            {forgotPassword.isPending ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/auth/login"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Remember your password? Sign in
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
