"use client"

import { useState } from "react"
import "./Profile.css"

const Profile = ({ user, token, onLogout }) => {
  const [profile, setProfile] = useState({
    username: user?.username || "",
    email: user?.email || "",
  })
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletePassword, setDeletePassword] = useState("")

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const response = await fetch("http://127.0.0.1:5000/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Profile updated successfully!")
      } else {
        setError(data.error || "Failed to update profile")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New passwords do not match")
      return
    }

    if (passwords.newPassword.length < 6) {
      setError("New password must be at least 6 characters long")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("http://127.0.0.1:5000/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: passwords.currentPassword,
          new_password: passwords.newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Password changed successfully!")
        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        setError(data.error || "Failed to change password")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/user/export-data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        // Create and download JSON file
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `budget-smart-data-${new Date().toISOString().split("T")[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        setSuccess("Data exported successfully!")
      } else {
        setError(data.error || "Failed to export data")
      }
    } catch (err) {
      setError("Failed to export data")
    }
  }

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setError("Please enter your password to confirm account deletion")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("http://127.0.0.1:5000/api/user/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: deletePassword }),
      })

      const data = await response.json()

      if (response.ok) {
        alert("Account deleted successfully")
        onLogout()
      } else {
        setError(data.error || "Failed to delete account")
      }
    } catch (err) {
      setError("Failed to delete account")
    } finally {
      setLoading(false)
      setShowDeleteConfirm(false)
      setDeletePassword("")
    }
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile Settings</h1>
        <p>Manage your account information and preferences</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="profile-sections">
        {/* Profile Information */}
        <div className="profile-section">
          <h2>Profile Information</h2>
          <form onSubmit={handleProfileUpdate} className="profile-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                className="form-input"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className="form-input"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="profile-section">
          <h2>Change Password</h2>
          <form onSubmit={handlePasswordChange} className="profile-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                id="currentPassword"
                type="password"
                className="form-input"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                className="form-input"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                id="confirmPassword"
                type="password"
                className="form-input"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>

        {/* Data Management */}
        <div className="profile-section">
          <h2>Data Management</h2>
          <div className="data-actions">
            <button className="btn btn-secondary" onClick={handleExportData}>
              Export My Data
            </button>
            <p className="help-text">Download all your financial data as a JSON file</p>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="profile-section danger-zone">
          <h2>Danger Zone</h2>
          <div className="danger-actions">
            <button className="btn btn-danger" onClick={() => setShowDeleteConfirm(true)}>
              Delete Account
            </button>
            <p className="help-text">Permanently delete your account and all associated data</p>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Delete Account</h3>
              <button className="modal-close" onClick={() => setShowDeleteConfirm(false)}>
                ×
              </button>
            </div>
            <div className="modal-content">
              <p>
                <strong>Warning:</strong> This action cannot be undone. All your data will be permanently deleted.
              </p>
              <div className="form-group">
                <label htmlFor="deletePassword">Enter your password to confirm:</label>
                <input
                  id="deletePassword"
                  type="password"
                  className="form-input"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeleteAccount} disabled={loading}>
                {loading ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
