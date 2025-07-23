import React, { useState } from 'react';

const SponsorSettingsRoute = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewPassword(e.target.value);

  const handleNotificationsChange = (type: string) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type as keyof typeof prev],
    }));
  };

  const handleNotificationsToggle = () => {
    setNotificationsEnabled((prev) => !prev);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle save logic here
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-xl rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Sponsor Settings
        </h1>
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
              htmlFor="new-password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Change Password
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
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
            <button
              type="button"
              onClick={handleNotificationsToggle}
              className={`mb-4 rounded px-4 py-2 ${notificationsEnabled ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              {notificationsEnabled
                ? 'Disable Notifications'
                : 'Enable Notifications'}
            </button>
            <div id="notification-settings-group" className="space-y-2">
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
          <button
            type="submit"
            className="w-full rounded bg-blue-600 py-2 text-white transition hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default SponsorSettingsRoute;
