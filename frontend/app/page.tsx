"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token")
    if (token) {
      router.push("/dashboard")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Budget Smart</h1>
            </div>
            <div className="flex space-x-4">
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Take Control of Your
            <span className="text-blue-600"> Finances</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Budget Smart helps you track expenses, set budgets, and achieve your financial goals with ease. Start your
            journey to financial freedom today.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free Trial
                </Button>
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-2xl mr-2">💰</span>
                  Expense Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Easily track and categorize your daily expenses with our intuitive interface.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-2xl mr-2">📊</span>
                  Budget Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Set monthly budgets for different categories and monitor your spending habits.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-2xl mr-2">📈</span>
                  Financial Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get insights into your spending patterns with detailed reports and visualizations.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Demo Section */}
        <div className="mt-20 bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Try the Demo</h2>
            <p className="mt-4 text-lg text-gray-600">Experience Budget Smart with our demo account</p>
            <div className="mt-8 p-6 bg-blue-50 rounded-lg max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">Demo Credentials</h3>
              <div className="text-left space-y-2">
                <p className="text-blue-700">
                  <strong>Email:</strong> admin@gmail.com
                </p>
                <p className="text-blue-700">
                  <strong>Password:</strong> 12345
                </p>
              </div>
              <Link href="/login" className="mt-4 inline-block">
                <Button className="w-full">Try Demo Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 Budget Smart. Built with Next.js and Flask.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
