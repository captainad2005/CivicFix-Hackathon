"use client"

import { CivicMapClient } from "./civic-map-client"
import type { Issue } from "@/lib/maps/utils"
import { useEffect, useState } from "react"

interface CivicMapWrapperProps {
  issues: Issue[]
  onMarkerClick?: (issue: Issue) => void
  height?: string
  zoom?: number
}

export function CivicMapWrapper({ issues, onMarkerClick, height = "600px", zoom = 12 }: CivicMapWrapperProps) {
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await fetch("/api/maps/api-key")
        if (!response.ok) {
          throw new Error(`Failed to fetch API key: ${response.statusText}`)
        }
        const data = await response.json()
        if (!data.apiKey) {
          throw new Error("API key not found in response")
        }
        setApiKey(data.apiKey)
        setError(null)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error"
        console.error("[v0] Failed to fetch Google Maps API key:", errorMessage)
        setError(errorMessage)
        setApiKey(null)
      } finally {
        setLoading(false)
      }
    }

    fetchApiKey()
  }, [])

  if (loading) {
    return (
      <div style={{ height }} className="w-full flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-600">Loading map...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{ height }}
        className="w-full flex items-center justify-center bg-red-50 rounded-lg border border-red-200"
      >
        <div className="text-center">
          <p className="text-red-600 font-semibold">Map Error</p>
          <p className="text-red-500 text-sm mt-1">{error}</p>
          <p className="text-gray-600 text-xs mt-2">
            Please ensure GOOGLE_MAPS_API_KEY is set in environment variables
          </p>
        </div>
      </div>
    )
  }

  if (!apiKey) {
    return (
      <div style={{ height }} className="w-full flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-600">
          Google Maps API key is not configured. Please add GOOGLE_MAPS_API_KEY to your environment variables.
        </p>
      </div>
    )
  }

  return <CivicMapClient issues={issues} onMarkerClick={onMarkerClick} height={height} zoom={zoom} apiKey={apiKey} />
}
