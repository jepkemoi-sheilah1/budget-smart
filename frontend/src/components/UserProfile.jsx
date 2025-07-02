import React from 'react';

const UserProfile = ({ user, onClose, logout }) => {
  if (!user) return null;

  return (
    <div className="user-profile-dropdown">
      <button className="close-button" onClick={onClose}>×</button>
      <h3>User Profile</h3>
      <p><strong>Name:</strong> {user.name || user.username}</p>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <button onClick={logout} className="logout-button" style={{ marginTop: '15px', padding: '8px 12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
        Logout
      </button>
    </div>
  );
};

export default UserProfile;
