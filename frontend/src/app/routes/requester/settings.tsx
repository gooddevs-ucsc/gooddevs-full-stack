import { Key, Mail, Bell, Settings, Palette, Code } from 'lucide-react'; // Importing icons from lucide-react
import React, { useState } from 'react';

// Main App component to encapsulate the DeveloperSettingsRoute
const App: React.FC = () => {
  return <DeveloperSettingsRoute />;
};

// Developer Settings Route Component
const DeveloperSettingsRoute: React.FC = () => {
  const [activeSection, setActiveSection] = useState('password'); // State to manage active settings section

  // Dummy state for form inputs
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const [apiKey, setApiKey] = useState('sk-********************'); // Dummy API Key - kept for state but not displayed
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [theme, setTheme] = useState('light'); // Dummy theme state - defaulting to light

  // Handle form submissions (dummy functions for now)
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Change Password:', {
      currentPassword,
      newPassword,
      confirmNewPassword,
    });
    // Add actual password change logic here
    // In a real app, replace alert with a custom modal/toast notification.
    // alert('Password change initiated (dummy)');
  };

  const handleChangeEmail = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Change Email:', { currentEmail, newEmail });
    // Add actual email change logic here
    // In a real app, replace alert with a custom modal/toast notification.
    // alert('Email change initiated (dummy)');
  };

  const handleGenerateApiKey = () => {
    const newKey = 'sk-' + Math.random().toString(36).substring(2, 22);
    setApiKey(newKey);
    // In a real app, replace alert with a custom modal/toast notification.
    // alert('New API Key generated (dummy)');
  };

  const handleCopyApiKey = () => {
    // This is a workaround for clipboard access in iframes
    const el = document.createElement('textarea');
    el.value = apiKey;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    // In a real app, replace alert with a custom modal/toast notification.
    // alert('API Key copied to clipboard!');
  };

  // Helper component for input fields
  const InputField: React.FC<{
    label: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
  }> = ({ label, type, value, onChange, placeholder }) => (
    <div className="mb-4">
      <label
        className="mb-2 block text-sm font-bold text-gray-700"
        htmlFor={label}
      >
        {label}
      </label>
      <input
        className="focus:shadow-outline w-full appearance-none rounded-lg border px-3 py-2 leading-tight text-gray-700 shadow focus:border-blue-500 focus:outline-none"
        id={label}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
      />
    </div>
  );

  // Section content based on activeSection state
  const renderSection = () => {
    switch (activeSection) {
      case 'password':
        return (
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
              Change Password
            </h2>
            <form onSubmit={handleChangePassword}>
              <InputField
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
              />
              <InputField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter a new password"
              />
              <InputField
                label="Confirm New Password"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm your new password"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-5 py-2.5 font-bold text-white shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              >
                Update Password
              </button>
            </form>
          </div>
        );
      case 'email':
        return (
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
              Change Email
            </h2>
            <form onSubmit={handleChangeEmail}>
              <InputField
                label="Current Email"
                type="email"
                value={currentEmail}
                onChange={(e) => setCurrentEmail(e.target.value)}
                placeholder="your.current@example.com"
              />
              <InputField
                label="New Email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="your.new@example.com"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-5 py-2.5 font-bold text-white shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              >
                Update Email
              </button>
            </form>
          </div>
        );
      case 'notifications':
        return (
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
              Notification Settings
            </h2>
            <div className="mb-4 flex items-center justify-between">
              <label htmlFor="notifications-toggle" className="text-gray-700">
                Enable Email Notifications
              </label>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  id="notifications-toggle"
                  className="peer sr-only"
                  checked={notificationsEnabled}
                  onChange={() =>
                    setNotificationsEnabled(!notificationsEnabled)
                  }
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
              </label>
            </div>
            <p className="text-sm text-gray-500">
              Receive important updates and alerts via email.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 px-4 py-8 font-sans antialiased">
      {/* Tailwind CSS CDN for styling */}
      <script src="https://cdn.tailwindcss.com"></script>
      {/* Inter font for better typography */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <style>
        {`
          body {
            font-family: 'Inter', sans-serif;
          }
          /* Removed dark mode specific styles for a light background */
        `}
      </style>

      {/* Settings header, now styled as a top bar */}
      <div className="mb-8 w-full max-w-6xl rounded-t-xl border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
        <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
      </div>

      <div className="w-full max-w-6xl overflow-hidden rounded-b-xl bg-white shadow-lg md:flex">
        {/* Sidebar Navigation */}
        <nav className="border-r border-gray-200 bg-gray-50 p-6 md:w-1/4">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">
            Developer Settings
          </h1>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveSection('password')}
                className={`flex w-full items-center rounded-lg p-3 text-left transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
                  activeSection === 'password'
                    ? 'border border-blue-300 bg-blue-100 font-semibold text-blue-700'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Key className="mr-3 size-5" /> Change Password
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('email')}
                className={`flex w-full items-center rounded-lg p-3 text-left transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
                  activeSection === 'email'
                    ? 'border border-blue-300 bg-blue-100 font-semibold text-blue-700'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Mail className="mr-3 size-5" /> Change Email
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('notifications')}
                className={`flex w-full items-center rounded-lg p-3 text-left transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
                  activeSection === 'notifications'
                    ? 'border border-blue-300 bg-blue-100 font-semibold text-blue-700'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Bell className="mr-3 size-5" /> Notifications
              </button>
            </li>
            {/* Removed API Keys and Theme sections */}
          </ul>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8">{renderSection()}</main>
      </div>
    </div>
  );
};

export default App; // Export App as default for Canvas
