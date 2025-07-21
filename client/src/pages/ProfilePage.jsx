import React, { useState } from "react";
import "./ProfilePage.css";
import Navbar from "./Navbar"; // The persistent dashboard navbar

// Mock user data - in a real app, this would come from context or a fetch call
const mockUser = {
  firstName: "Akshat",
  lastName: "S.",
  username: "akshat_s",
  email: "akshat.s@example.com",
  avatarUrl: "", // Intentionally left blank to use the placeholder SVG
};

// Simple placeholder avatar
const UserAvatar = ({ size = 100 }) => (
  <div className="profile-avatar" style={{ width: size, height: size }}>
    <svg
      className="profile-avatar-icon"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
        clipRule="evenodd"
      ></path>
    </svg>
  </div>
);

const ProfilePage = () => {
  const [userDetails, setUserDetails] = useState({
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    username: mockUser.username,
    email: mockUser.email,
  });

  const [passwordDetails, setPasswordDetails] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleUserChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordDetails({ ...passwordDetails, [e.target.name]: e.target.value });
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    console.log("Updating user details:", userDetails);
    alert("Profile details updated!");
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordDetails.newPassword !== passwordDetails.confirmNewPassword) {
      alert("New passwords do not match.");
      return;
    }
    console.log("Changing password...");
    alert("Password changed successfully!");
  };

  const handleDeleteAccount = () => {
    // IMPORTANT: In a real app, use a modal confirmation, not window.confirm
    const isConfirmed = true; // Simulating confirmation
    if (isConfirmed) {
      console.log("DELETING ACCOUNT...");
      alert("Account deleted.");
    }
  };

  return (
    <div className="profile-page-wrapper">
      <Navbar />
      <div className="profile-container">
        <header className="profile-header">
          <UserAvatar size={120} />
          <div className="header-text">
            <h2>
              {mockUser.firstName} {mockUser.lastName}
            </h2>
            <p>{mockUser.email}</p>
          </div>
        </header>

        <div className="profile-content">
          {/* Edit Profile Section */}
          <div className="profile-section-card">
            <h3>Edit Profile</h3>
            <form onSubmit={handleUserSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={userDetails.firstName}
                    onChange={handleUserChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={userDetails.lastName}
                    onChange={handleUserChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={userDetails.username}
                  onChange={handleUserChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userDetails.email}
                  onChange={handleUserChange}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-accent">
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Section */}
          <div className="profile-section-card">
            <h3>Change Password</h3>
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordDetails.currentPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordDetails.newPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmNewPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  value={passwordDetails.confirmNewPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-accent">
                  Update Password
                </button>
              </div>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="profile-section-card danger-zone">
            <h3>Danger Zone</h3>
            <div className="danger-zone-content">
              <p>
                Deleting your account is a permanent action and cannot be
                undone.
              </p>
              <button className="btn btn-danger" onClick={handleDeleteAccount}>
                Delete My Account
              </button>
            </div>
          </div>
        </div>
      </div>
      <footer className="dashboard-footer">
        <a href="#">About</a>
        <a href="#">Contact</a>
        <a href="#">Terms</a>
        <a href="#">Privacy</a>
        <a href="https://github.com/AkshatPS" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </footer>
    </div>
  );
};

export default ProfilePage;
