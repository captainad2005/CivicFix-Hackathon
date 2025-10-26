"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">CivicFix</h1>
          <div className="flex gap-4">
            {!isLoading && user ? (
              <>
                <span className="text-sm text-gray-600 py-2">Welcome, {user.email}</span>
                <Button onClick={handleLogout} variant="outline">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Report Civic Issues Transparently</h2>
          <p className="text-xl text-gray-600 mb-8">
            Help improve your community by reporting issues and tracking their resolution in real-time
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                Report an Issue
              </Button>
            </Link>
            <Link href="/dashboard/public">
              <Button size="lg" variant="outline">
                View Issues
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Report Issues</CardTitle>
              <CardDescription>Submit civic issues with photos and location</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Easily report potholes, street lights, garbage, water issues, and more with precise location data.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Track Progress</CardTitle>
              <CardDescription>Monitor issue resolution in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                See the status of reported issues from pending to in-progress to resolved.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transparency</CardTitle>
              <CardDescription>View all civic issues on an interactive map</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Access the public dashboard to see all reported issues and their current status.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
