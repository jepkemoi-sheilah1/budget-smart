"use client"

import { useState } from "react"

const Profile = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState("profile")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Profile form
  const [profileForm, setProfileForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
  })

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const updateProfile = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileForm),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Profile updated successfully")
        setUser({ ...user, ...profileForm })
      } else {
        setError(data.error || "Failed to update profile")
      }
    } catch (err) {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match")
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Password changed successfully")
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        setError(data.error || "Failed to change password")
      }
    } catch (err) {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  const exportData = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/user/export-data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `budget-smart-data-${new Date().toISOString().split("T")[0]}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        setSuccess("Data exported successfully")
      } else {
        setError("Failed to export data")
      }
    } catch (err) {
      setError("Network error")
    }
  }

  const deleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/user/delete-account", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        localStorage.removeItem("token")
        window.location.href = "/login"
      } else {
        setError("Failed to delete account")
      }
    } catch (err) {
      setError("Network error")
    }
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">{user?.username?.charAt(0).toUpperCase() || "U"}</div>
          <div className="profile-info">
            <h1>{user?.username}</h1>
            <p>{user?.email}</p>
            <span className="join-date">
              Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Recently"}
            </span>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="profile-nav">
              <button
                className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
                onClick={() => setActiveTab("profile")}
              >
                👤 Profile Information
              </button>
              <button
                className={`nav-item ${activeTab === "security" ? "active" : ""}`}
                onClick={() => setActiveTab("security")}
              >
                🔒 Security
              </button>
              <button
                className={`nav-item ${activeTab === "data" ? "active" : ""}`}
                onClick={() => setActiveTab("data")}
              >
                📊 Data Management
              </button>
              <button
                className={`nav-item ${activeTab === "danger" ? "active" : ""}`}
                onClick={() => setActiveTab("danger")}
              >
                ⚠️ Danger Zone
              </button>
            </div>
          </div>

          <div className="profile-main">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="card">
                <div className="card-header">
                  <h2>Profile Information</h2>
                  <p>Update your account profile information</p>
                </div>
                <div className="card-body">
                  <form onSubmit={updateProfile} className="profile-form">
                    <div className="form-group">
                      <label htmlFor="username" className="form-label">
                        Username
                      </label>
                      <input
                        id="username"
                        type="text"
                        className="form-input"
                        value={profileForm.username}
                        onChange={(e) => setProfileForm((prev) => ({ ...prev, username: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="form-input"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="card">
                <div className="card-header">
                  <h2>Change Password</h2>
                  <p>Update your password to keep your account secure</p>
                </div>
                <div className="card-body">
                  <form onSubmit={changePassword} className="password-form">
                    <div className="form-group">
                      <label htmlFor="currentPassword" className="form-label">
                        Current Password
                      </label>
                      <div className="password-input">
                        <input
                          id="currentPassword"
                          type={showPasswords.current ? "text" : "password"}
                          className="form-input"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                          required
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPasswords((prev) => ({ ...prev, current: !prev.current }))}
                        >
                          {showPasswords.current ? "👁️" : "👁️‍🗨️"}
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="newPassword" className="form-label">
                        New Password
                      </label>
                      <div className="password-input">
                        <input
                          id="newPassword"
                          type={showPasswords.new ? "text" : "password"}
                          className="form-input"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                          required
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                        >
                          {showPasswords.new ? "👁️" : "👁️‍🗨️"}
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirmPassword" className="form-label">
                        Confirm New Password
                      </label>
                      <div className="password-input">
                        <input
                          id="confirmPassword"
                          type={showPasswords.confirm ? "text" : "password"}
                          className="form-input"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                          required
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                        >
                          {showPasswords.confirm ? "👁️" : "👁️‍🗨️"}
                        </button>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? "Changing..." : "Change Password"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Data Tab */}
            {activeTab === "data" && (
              <div className="card">
                <div className="card-header">
                  <h2>Data Management</h2>
                  <p>Export or manage your personal data</p>
                </div>
                <div className="card-body">
                  <div className="data-section">
                    <div className="data-item">
                      <div className="data-info">
                        <h3>Export Data</h3>
                        <p>Download all your expenses and budget data as a JSON file</p>
                      </div>
                      <button onClick={exportData} className="btn btn-secondary">
                        📥 Export Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Danger Zone Tab */}
            {activeTab === "danger" && (
              <div className="card danger-card">
                <div className="card-header">
                  <h2>Danger Zone</h2>
                  <p>Irreversible and destructive actions</p>
                </div>
                <div className="card-body">
                  <div className="danger-section">
                    <div className="danger-item">
                      <div className="danger-info">
                        <h3>Delete Account</h3>
                        <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
                      </div>
                      <button onClick={deleteAccount} className="btn btn-danger">
                        🗑️ Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
