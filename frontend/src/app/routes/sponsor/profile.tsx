import React, { useState } from 'react';

const SponsorProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Rayan Alwis',
    email: 'rayanalwis@gmail.com',
    organization: 'GoodDevs Foundation',
    phone: '071 123 4567',
    location: 'Galle, Sri Lanka',
    profilePhoto: '/sponsor-profile.jpg',
    bio: 'Committed to supporting impactful projects and making a difference in the community.',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleEditToggle = () => setIsEditing((prev) => !prev);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // Save logic here (API call, etc.)
  };

  return (
    <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
      <form onSubmit={handleSave}>
        <div className="mb-4 flex justify-end gap-2">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleEditToggle}
                className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 shadow hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-green-600 px-4 py-2 text-white shadow hover:bg-green-700"
              >
                Save Changes ✅
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleEditToggle}
              className="rounded-md bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
            >
              Edit Profile ✏️
            </button>
          )}
        </div>
        <div className="mb-8 flex items-center space-x-6">
          <img
            src={profile.profilePhoto}
            alt="Profile"
            className="size-24 rounded-full border-4 border-blue-500 object-cover shadow-md"
          />
          <div>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="w-full rounded border px-2 py-1 text-2xl font-bold"
                />
                <input
                  type="text"
                  name="organization"
                  value={profile.organization}
                  onChange={handleChange}
                  className="mt-1 w-full rounded border px-2 py-1 font-semibold text-blue-700"
                />
                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  className="mt-1 w-full rounded border px-2 py-1 text-sm text-gray-500"
                />
                <input
                  type="text"
                  name="profilePhoto"
                  value={profile.profilePhoto}
                  onChange={handleChange}
                  className="mt-1 w-full rounded border px-2 py-1 text-sm text-gray-500"
                  placeholder="Profile photo URL"
                />
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile.name}
                </h2>
                <p className="text-gray-600">{profile.organization}</p>
                <p className="text-sm text-gray-500">{profile.location}</p>
              </>
            )}
          </div>
        </div>
        <div className="mb-6">
          <h3 className="mb-2 font-semibold text-gray-800">Bio</h3>
          {isEditing ? (
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              className="w-full rounded border px-2 py-1 text-gray-700"
              rows={4}
            />
          ) : (
            <p className="text-gray-700">{profile.bio}</p>
          )}
        </div>
        <div className="mb-6">
          <h3 className="mb-2 font-semibold text-gray-800">Contact</h3>
          <div className="flex flex-col gap-1">
            {isEditing ? (
              <>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full rounded border px-2 py-1"
                />
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="w-full rounded border px-2 py-1"
                />
              </>
            ) : (
              <>
                <p>
                  <span className="font-medium text-gray-700">Email:</span>{' '}
                  {profile.email}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Phone:</span>{' '}
                  {profile.phone}
                </p>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default SponsorProfilePage;
