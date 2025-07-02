import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { updateUser, deleteUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { user, setUser, logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const updatedUser = await updateUser(user.id, formData);
      setUser(updatedUser);
      alert('User information updated successfully.');
    } catch (err) {
      setError('Failed to update user information.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    setLoading(true);
    setError('');
    try {
      await deleteUser(user.id);
      alert('Account deleted successfully.');
      logout();
      navigate('/');
    } catch (err) {
      setError('Failed to delete account.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="user-profile-page" style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h2>User Profile</h2>
      {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
      <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </label>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </label>
        <button type="submit" disabled={loading} style={{ padding: '10px 15px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
      <hr style={{ margin: '20px 0' }} />
      <button
        onClick={handleDelete}
        disabled={loading}
        style={{ padding: '10px 15px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
      >
        {loading ? 'Processing...' : 'Delete Account'}
      </button>
    </div>
  );
};

export default UserProfile;
