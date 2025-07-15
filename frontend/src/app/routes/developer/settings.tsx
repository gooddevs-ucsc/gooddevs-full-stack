import React, { useState } from 'react';
import {
  Key, Mail, Bell, Settings, Palette, Code
} from 'lucide-react'; // Importing icons from lucide-react

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
    console.log('Change Password:', { currentPassword, newPassword, confirmNewPassword });
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
    <div className="mb-3"> {/* Reduced margin-bottom */}
      <label className="block text-gray-600 text-xs font-medium mb-1" htmlFor={label}> {/* Smaller and lighter label */}
        {label}
      </label>
      <input
        className="shadow-sm appearance-none border border-gray-200 rounded-md w-full py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline focus:border-blue-400" // Smaller text, rounded-md, lighter border, smaller shadow
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
          <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100"> {/* Reduced padding, added border */}
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Change Password</h2> {/* Smaller and lighter heading */}
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
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition duration-300 ease-in-out transform hover:scale-[1.02]" // Smaller padding, font-medium, rounded-md, lighter blue, subtle scale
              >
                Update Password
              </button>
            </form>
          </div>
        );
      case 'email':
        return (
          <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Change Email</h2>
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
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition duration-300 ease-in-out transform hover:scale-[1.02]"
              >
                Update Email
              </button>
            </form>
          </div>
        );
      case 'notifications':
        return (
          <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Notification Settings</h2>
            <div className="flex items-center justify-between mb-3"> {/* Reduced margin-bottom */}
              <label htmlFor="notifications-toggle" className="text-gray-600 text-sm"> {/* Smaller and lighter text */}
                Enable Email Notifications
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="notifications-toggle"
                  className="sr-only peer"
                  checked={notificationsEnabled}
                  onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                />
                <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-3 peer-focus:ring-blue-200 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white"></div> {/* Smaller toggle, lighter blue focus ring */}
              </label>
            </div>
            <p className="text-xs text-gray-500"> {/* Smaller and lighter text */}
              Receive important updates and alerts via email.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased flex flex-col items-center py-6 px-3"> {/* Reduced padding */}
      {/* Tailwind CSS CDN for styling */}
      <script src="https://cdn.tailwindcss.com"></script>
      {/* Inter font for better typography */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" /> {/* Lighter font weights for Inter */}
      <style>
        {`
          body {
            font-family: 'Inter', sans-serif;
            font-weight: 400; /* Default to regular weight */
          }
          /* Removed dark mode specific styles for a light background */
        `}
      </style>

      {/* Settings header, now styled as a top bar */}
      <div className="w-full max-w-6xl bg-white border-b border-gray-200 py-3 px-5 rounded-t-xl shadow-sm mb-6"> {/* Reduced padding, margin-bottom */}
        <h2 className="text-2xl font-semibold text-gray-800">Settings</h2> {/* Smaller and lighter heading */}
      </div>

      <div className="w-full max-w-6xl bg-white rounded-b-xl shadow-lg overflow-hidden md:flex">
        {/* Sidebar Navigation */}
        <nav className="md:w-1/4 bg-gray-50 p-5 border-r border-gray-100"> {/* Reduced padding, lighter border */}
          <h1 className="text-xl font-semibold mb-5 text-gray-800">Developer Settings</h1> {/* Smaller and lighter heading */}
          <ul className="space-y-1.5"> {/* Reduced space between list items */}
            <li>
              <button
                onClick={() => setActiveSection('password')}
                className={`flex items-center w-full text-left p-2.5 rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 ${ /* Reduced padding, rounded-md, lighter focus ring */
                  activeSection === 'password'
                    ? 'bg-blue-100 text-blue-700 font-medium border border-blue-200' // Lighter active state border
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600' // Lighter default text, lighter hover bg
                }`}
              >
                <Key className="mr-2 w-4 h-4" /> Change Password {/* Smaller icon */}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('email')}
                className={`flex items-center w-full text-left p-2.5 rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 ${
                  activeSection === 'email'
                    ? 'bg-blue-100 text-blue-700 font-medium border border-blue-200'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Mail className="mr-2 w-4 h-4" /> Change Email
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('notifications')}
                className={`flex items-center w-full text-left p-2.5 rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 ${
                  activeSection === 'notifications'
                    ? 'bg-blue-100 text-blue-700 font-medium border border-blue-200'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Bell className="mr-2 w-4 h-4" /> Notifications
              </button>
            </li>
            {/* Removed API Keys and Theme sections */}
          </ul>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-7"> {/* Reduced padding */}
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default App; // Export App as default for Canvas