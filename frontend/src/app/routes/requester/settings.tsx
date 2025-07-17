import React, { useState } from 'react';

const RequesterSettingsRoute = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const handleNotificationsChange = (type: string) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type as keyof typeof prev],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle save logic here
  };

  return (
    <div className="mx-auto mt-10 max-w-xl rounded-lg bg-white p-8 shadow">
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Change Email */}
        <div>
          <label
            htmlFor="change-email"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Change Email
          </label>
          <input
            id="change-email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter new email"
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        {/* Change Password */}
        <div>
          <label
            htmlFor="change-password"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Change Password
          </label>
          <input
            id="change-password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter new password"
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        {/* Notification Settings */}
        <div>
          <label
            htmlFor="notification-settings-group"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Notification Settings
          </label>
          <div id="notification-settings-group" className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={() => handleNotificationsChange('email')}
                className="mr-2"
              />
              Email Notifications
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={() => handleNotificationsChange('sms')}
                className="mr-2"
              />
              SMS Notifications
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={() => handleNotificationsChange('push')}
                className="mr-2"
              />
              Push Notifications
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="w-full rounded bg-blue-600 py-2 text-white transition hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default RequesterSettingsRoute;
