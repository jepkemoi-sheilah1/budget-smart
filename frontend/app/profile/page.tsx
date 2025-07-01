"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { userAPI } from "@/lib/api"

interface User {
  id: number
  username: string
  email: string
  created_at: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Profile form
  const [profileForm, setProfileForm] = useState({
    username: "",
    email: "",
  })

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Delete account form
  const [deleteForm, setDeleteForm] = useState({
    password: "",
    confirmDelete: false,
  })

  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    loadProfile()
  }, [router])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const response = await userAPI.getProfile()
      setUser(response.user)
      setProfileForm({
        username: response.user.username,
        email: response.user.email,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile")
      if (err instanceof Error && err.message.includes("401")) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        router.push("/login")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setError("")
      setSuccess("")

      const response = await userAPI.updateProfile(profileForm)
      setUser(response.user)
      localStorage.setItem("user", JSON.stringify(response.user))
      setSuccess("Profile updated successfully")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile")
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match")
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setError("New password must be at least 6 characters long")
      return
    }

    try {
      setError("")
      setSuccess("")

      await userAPI.changePassword(passwordForm.currentPassword, passwordForm.newPassword)
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setSuccess("Password changed successfully")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password")
    }
  }

  const handleExportData = async () => {
    try {
      setError("")
      const response = await userAPI.exportData()

      // Create and download JSON file
      const dataStr = JSON.stringify(response, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `budget-smart-data-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setSuccess("Data exported successfully")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to export data")
    }
  }

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!deleteForm.confirmDelete) {
      setError("Please confirm account deletion")
      return
    }

    try {
      setError("")
      await userAPI.deleteAccount(deleteForm.password)

      // Clear local storage and redirect
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      router.push("/login")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete account")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="danger">Danger Zone</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account profile information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={profileForm.username}
                      onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                      required
                      minLength={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      required
                    />
                  </div>

                  {user && (
                    <div className="space-y-2">
                      <Label>Account Created</Label>
                      <p className="text-sm text-gray-600">{new Date(user.created_at).toLocaleDateString()}</p>
                    </div>
                  )}

                  <Button type="submit">Update Profile</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      required
                      minLength={6}
                    />
                  </div>

                  <Button type="submit">Change Password</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Export your data or manage your information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Export Data</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Download all your expenses, budgets, and profile information as a JSON file.
                  </p>
                  <Button onClick={handleExportData}>Export My Data</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="danger">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                <CardDescription>Permanently delete your account and all associated data</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDeleteAccount} className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">
                      <strong>Warning:</strong> This action cannot be undone. This will permanently delete your account
                      and all associated data including expenses, budgets, and profile information.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deletePassword">Enter your password to confirm</Label>
                    <Input
                      id="deletePassword"
                      type="password"
                      value={deleteForm.password}
                      onChange={(e) => setDeleteForm({ ...deleteForm, password: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="confirmDelete"
                      checked={deleteForm.confirmDelete}
                      onChange={(e) => setDeleteForm({ ...deleteForm, confirmDelete: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="confirmDelete" className="text-sm">
                      I understand that this action cannot be undone
                    </Label>
                  </div>

                  <Button type="submit" variant="destructive" disabled={!deleteForm.confirmDelete}>
                    Delete Account
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
