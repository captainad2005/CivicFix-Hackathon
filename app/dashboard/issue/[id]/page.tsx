"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/dashboard/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { getStatusColor, getStatusLabel, getCategoryLabel, type Issue } from "@/lib/maps/utils"
import { ISSUE_STATUSES } from "@/lib/maps/constants"

export default function IssueDetailPage() {
  const params = useParams()
  const issueId = params.id as string
  const [issue, setIssue] = useState<Issue | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState("")
  const [user, setUser] = useState<any>(null)

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

      try {
        const response = await fetch(`/api/issues/${issueId}`)
        const data = await response.json()
        setIssue(data)
        setNewStatus(data.status)
        setComments(data.comments || [])
      } catch (error) {
        console.error("Failed to fetch issue:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [issueId])

  const handleStatusUpdate = async () => {
    if (!issue || newStatus === issue.status) return

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/issues/${issueId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update status")

      const updated = await response.json()
      setIssue(updated)
    } catch (error) {
      console.error("Failed to update status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issue_id: issueId,
          content: newComment,
        }),
      })

      if (!response.ok) throw new Error("Failed to add comment")

      const comment = await response.json()
      setComments([...comments, comment])
      setNewComment("")
    } catch (error) {
      console.error("Failed to add comment:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-gray-500">Loading...</p>
        </main>
      </div>
    )
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-gray-500">Issue not found</p>
        </main>
      </div>
    )
  }

  const isIssueOwner = user?.id === issue.user_id

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{issue.title}</CardTitle>
                    <CardDescription>{issue.address}</CardDescription>
                  </div>
                  <Badge style={{ backgroundColor: getStatusColor(issue.status) }}>
                    {getStatusLabel(issue.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{issue.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Category</p>
                    <p className="text-sm">{getCategoryLabel(issue.category)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Reported</p>
                    <p className="text-sm">{new Date(issue.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Location</p>
                    <p className="text-sm">
                      {issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Reported by</p>
                    <p className="text-sm">{issue.profiles?.full_name || "Unknown"}</p>
                  </div>
                </div>

                {isIssueOwner && (
                  <div className="space-y-3 pt-4 border-t">
                    <h3 className="font-semibold">Update Status</h3>
                    <div className="flex gap-2">
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {Object.entries(ISSUE_STATUSES).map(([key, { label }]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                      <Button onClick={handleStatusUpdate} disabled={isUpdating || newStatus === issue.status}>
                        {isUpdating ? "Updating..." : "Update"}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-semibold">Comments</h3>
                  <div className="space-y-3">
                    {comments.length === 0 ? (
                      <p className="text-sm text-gray-500">No comments yet</p>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 p-3 rounded">
                          <p className="text-sm font-medium">{comment.profiles?.full_name || "Unknown"}</p>
                          <p className="text-sm text-gray-700">{comment.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="space-y-2 pt-3 border-t">
                    <Label htmlFor="comment">Add a comment</Label>
                    <textarea
                      id="comment"
                      placeholder="Share an update or comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={3}
                    />
                    <Button onClick={handleAddComment} className="w-full">
                      Post Comment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <Badge style={{ backgroundColor: getStatusColor(issue.status) }} className="mt-1">
                    {getStatusLabel(issue.status)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Category</p>
                  <Badge variant="outline" className="mt-1">
                    {getCategoryLabel(issue.category)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Days Open</p>
                  <p className="text-sm mt-1">
                    {Math.floor((Date.now() - new Date(issue.created_at).getTime()) / (1000 * 60 * 60 * 24))} days
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
