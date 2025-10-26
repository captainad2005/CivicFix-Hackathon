"use client"

import { GoogleMap, LoadScript } from "@react-google-maps/api"
import { IssueMarker } from "./issue-marker"
import { DEFAULT_MAP_CENTER } from "@/lib/maps/constants"
import type { Issue } from "@/lib/maps/utils"
import { useState, useCallback } from "react"
import type { google } from "google-maps"

interface CivicMapClientProps {
  issues: Issue[]
  onMarkerClick?: (issue: Issue) => void
  height?: string
  zoom?: number
  apiKey: string
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
}

export function CivicMapClient({ issues, onMarkerClick, height = "600px", zoom = 12, apiKey }: CivicMapClientProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)
    setMapError(null)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  const handleLoadScriptError = (error: Error) => {
    console.error("[v0] Google Maps LoadScript error:", error)
    setMapError(error.message)
  }

  if (mapError) {
    return (
      <div
        style={{ height }}
        className="w-full flex items-center justify-center bg-red-50 rounded-lg border border-red-200"
      >
        <div className="text-center">
          <p className="text-red-600 font-semibold">Map Loading Error</p>
          <p className="text-red-500 text-sm mt-1">{mapError}</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ height }}>
      <LoadScript googleMapsApiKey={apiKey} onError={handleLoadScriptError}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={DEFAULT_MAP_CENTER}
          zoom={zoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
          }}
        >
          {issues.map((issue) => (
            <IssueMarker key={issue.id} issue={issue} onClick={onMarkerClick} />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  )
}
