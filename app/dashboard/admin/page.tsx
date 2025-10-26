"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/dashboard/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getStatusColor, getStatusLabel, getCategoryLabel, type Issue } from "@/lib/maps/utils"
import Link from "next/link"

export default function AdminDashboard() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

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

      try {
        const response = await fetch("/api/issues")
        const allIssues = await response.json()

        if (allIssues.error) {
          console.error("API Error:", allIssues.error)
          setIssues([])
        } else {
          setIssues(allIssues || [])
        }
      } catch (error) {
        console.error("Failed to fetch issues:", error)
        setIssues([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredIssues = filter === "all" ? issues : issues.filter((issue) => issue.status === filter)

  const stats = {
    total: issues.length,
    pending: issues.filter((i) => i.status === "pending").length,
    inProgress: issues.filter((i) => i.status === "in_progress").length,
    resolved: issues.filter((i) => i.status === "resolved").length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="admin" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>All Issues</CardTitle>
                <CardDescription>Manage and update issue statuses</CardDescription>
              </div>
              <div className="flex gap-2">
                {["all", "pending", "in_progress", "resolved"].map((status) => (
                  <Button
                    key={status}
                    variant={filter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter(status)}
                  >
                    {status === "all" ? "All" : status.replace("_", " ")}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-gray-500">Loading...</p>
            ) : filteredIssues.length === 0 ? (
              <p className="text-gray-500">No issues found.</p>
            ) : (
              <div className="space-y-4">
                {filteredIssues.map((issue) => (
                  <div key={issue.id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{issue.title}</h3>
                        <p className="text-sm text-gray-600">{issue.address}</p>
                      </div>
                      <Badge style={{ backgroundColor: getStatusColor(issue.status) }}>
                        {getStatusLabel(issue.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{issue.description}</p>
                    <div className="flex gap-2 mb-3">
                      <Badge variant="outline">{getCategoryLabel(issue.category)}</Badge>
                      <Badge variant="outline">Reported by: {issue.profiles?.full_name || "Unknown"}</Badge>
                    </div>
                    <Link href={`/dashboard/issue/${issue.id}`}>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
