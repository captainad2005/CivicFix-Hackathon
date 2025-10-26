"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/dashboard/navbar"
import { CivicMapWrapper } from "@/components/map/civic-map-wrapper"
import { MapFilter } from "@/components/map/map-filter"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getStatusColor, getStatusLabel, getCategoryLabel, type Issue } from "@/lib/maps/utils"

export default function PublicDashboard() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [filters, setFilters] = useState<{ category?: string; status?: string }>({})

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetch("/api/issues")
        const data = await response.json()

        if (data.error) {
          console.error("API Error:", data.error)
          setIssues([])
          setFilteredIssues([])
        } else {
          setIssues(data || [])
          setFilteredIssues(data || [])
        }
      } catch (error) {
        console.error("Failed to fetch issues:", error)
        setIssues([])
        setFilteredIssues([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchIssues()
  }, [])

  useEffect(() => {
    let filtered = issues

    if (filters.category) {
      filtered = filtered.filter((issue) => issue.category === filters.category)
    }

    if (filters.status) {
      filtered = filtered.filter((issue) => issue.status === filters.status)
    }

    setFilteredIssues(filtered)
  }, [filters, issues])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Civic Issues Map</h1>
          <p className="text-gray-600">View all reported civic issues and their resolution status</p>
        </div>

        <MapFilter onFilterChange={setFilters} />

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="h-96 flex items-center justify-center">
                    <p className="text-gray-500">Loading map...</p>
                  </div>
                ) : (
                  <CivicMapWrapper issues={filteredIssues} onMarkerClick={setSelectedIssue} height="600px" />
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Issue Details</CardTitle>
                <CardDescription>Click a marker to view details</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedIssue ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{selectedIssue.title}</h3>
                      <Badge style={{ backgroundColor: getStatusColor(selectedIssue.status) }}>
                        {getStatusLabel(selectedIssue.status)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Address</p>
                      <p className="text-sm">{selectedIssue.address}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Category</p>
                      <p className="text-sm">{getCategoryLabel(selectedIssue.category)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Description</p>
                      <p className="text-sm">{selectedIssue.description}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Reported</p>
                      <p className="text-sm">{new Date(selectedIssue.created_at).toLocaleDateString()}</p>
                    </div>
                    {selectedIssue.profiles && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">Reported by</p>
                        <p className="text-sm">{selectedIssue.profiles.full_name}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Select an issue on the map to view details</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
