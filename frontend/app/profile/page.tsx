"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Calendar, Shield, Eye, EyeOff, Save, Trash2, Download } from "lucide-react"
import { apiClient } from "@/lib/api"

interface UserProfile {
  id: number
  username: string
  email: string
  created_at: string
}

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Profile update form
  const [profileForm, setProfileForm] = useState({
    username: "",
    email: "",
  })

  // Password change form
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

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const userData = await apiClient.getUserProfile()
      setUser(userData)
      setProfileForm({
        username: userData.username,
        email: userData.email,
      })
    } catch (err: any) {
      setError(err.message || "Failed to load profile")
      if (err.message.includes("Token") || err.message.includes("401")) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = "/login"
      }
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      await apiClient.updateProfile(profileForm)
      setSuccess("Profile updated successfully")
      setUser({ ...user!, ...profileForm })
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
    }
  }

  const changePassword = async (e: React.FormEvent) => {
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

    try {
      await apiClient.changePassword(passwordForm.currentPassword, passwordForm.newPassword)
      setSuccess("Password changed successfully")
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (err: any) {
      setError(err.message || "Failed to change password")
    }
  }

  const exportData = async () => {
    try {
      const blob = await apiClient.exportData()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `budget-smart-data-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      setSuccess("Data exported successfully")
    } catch (err: any) {
      setError(err.message || "Failed to export data")
    }
  }

  const deleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return
    }

    try {
      await apiClient.deleteAccount()
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login?message=Account deleted successfully"
    } catch (err: any) {
      setError(err.message || "Failed to delete account")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Failed to load profile</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="profile-container">
          <div className="profile-header bg-gradient-to-r from-blue-500 to-purple-500 text-white p-8 rounded-lg shadow-md mb-6">
            <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
            <p className="text-lg opacity-80">Manage your account settings and preferences</p>
          </div>

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Profile Overview */}
            <Card className="lg:col-span-1">
              <CardHeader className="text-center">
                <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <User className="w-10 h-10 text-blue-600" />
                </div>
                <CardTitle>{user.username}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                </div>
                <Badge variant="outline" className="w-full justify-center">
                  <Shield className="w-4 h-4 mr-1" />
                  Verified Account
                </Badge>
              </CardContent>
            </Card>

            {/* Settings Tabs */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="data">Data</TabsTrigger>
                  <TabsTrigger value="danger">Account</TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>Update your account profile information</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={updateProfile} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            value={profileForm.username}
                            onChange={(e) => setProfileForm((prev) => ({ ...prev, username: e.target.value }))}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
                            required
                          />
                        </div>

                        <Button type="submit">
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security">
                  <Card>
                    <CardHeader>
                      <CardTitle>Change Password</CardTitle>
                      <CardDescription>Update your password to keep your account secure</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={changePassword} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              type={showPasswords.current ? "text" : "password"}
                              value={passwordForm.currentPassword}
                              onChange={(e) =>
                                setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
                              }
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPasswords((prev) => ({ ...prev, current: !prev.current }))}
                            >
                              {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              type={showPasswords.new ? "text" : "password"}
                              value={passwordForm.newPassword}
                              onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                            >
                              {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              type={showPasswords.confirm ? "text" : "password"}
                              value={passwordForm.confirmPassword}
                              onChange={(e) =>
                                setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                              }
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                            >
                              {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <Button type="submit">
                          <Shield className="w-4 h-4 mr-2" />
                          Change Password
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Data Tab */}
                <TabsContent value="data">
                  <Card>
                    <CardHeader>
                      <CardTitle>Data Management</CardTitle>
                      <CardDescription>Export or manage your personal data</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Export Data</h4>
                          <p className="text-sm text-gray-600">Download all your expenses and budget data</p>
                        </div>
                        <Button onClick={exportData} variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Danger Zone Tab */}
                <TabsContent value="danger">
                  <Card className="border-red-200">
                    <CardHeader>
                      <CardTitle className="text-red-600">Danger Zone</CardTitle>
                      <CardDescription>Irreversible and destructive actions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Separator />
                        <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                          <div>
                            <h4 className="font-medium text-red-800">Delete Account</h4>
                            <p className="text-sm text-red-600">
                              Permanently delete your account and all associated data
                            </p>
                          </div>
                          <Button onClick={deleteAccount} variant="destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
