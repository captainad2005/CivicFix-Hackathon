"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/dashboard/navbar"
import { ReportIssueForm } from "@/components/dashboard/report-issue-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getStatusColor, getStatusLabel, getCategoryLabel, type Issue } from "@/lib/maps/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CitizenDashboard() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const fetchIssues = async (userId: string) => {
    try {
      const response = await fetch("/api/issues")
      const allIssues = await response.json()

      if (allIssues.error) {
        console.error("API Error:", allIssues.error)
        setIssues([])
      } else {
        const userIssues = (allIssues || []).filter((issue: Issue) => issue.user_id === userId)
        setIssues(userIssues)
      }
    } catch (error) {
      console.error("Failed to fetch issues:", error)
      setIssues([])
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = "/auth/login"
        return
      }

      setUser(user)
      await fetchIssues(user.id)
      setIsLoading(false)
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="citizen" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <ReportIssueForm onSuccess={() => user && fetchIssues(user.id)} />
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Reported Issues</CardTitle>
                <CardDescription>Track the status of issues you&apos;ve reported</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-gray-500">Loading...</p>
                ) : issues.length === 0 ? (
                  <p className="text-gray-500">You haven&apos;t reported any issues yet.</p>
                ) : (
                  <div className="space-y-4">
                    {issues.map((issue) => (
                      <div key={issue.id} className="border rounded-lg p-4 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">{issue.title}</h3>
                          <Badge style={{ backgroundColor: getStatusColor(issue.status) }}>
                            {getStatusLabel(issue.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{issue.address}</p>
                        <p className="text-sm text-gray-700 mb-3">{issue.description}</p>
                        <div className="flex gap-2 mb-3">
                          <Badge variant="outline">{getCategoryLabel(issue.category)}</Badge>
                          <Badge variant="outline">{new Date(issue.created_at).toLocaleDateString()}</Badge>
                        </div>
                        <Link href={`/dashboard/issue/${issue.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
