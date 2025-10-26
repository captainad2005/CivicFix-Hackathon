"use client"

import { Marker, InfoWindow } from "@react-google-maps/api"
import { getCategoryColor, type Issue } from "@/lib/maps/utils"
import { useState } from "react"

interface IssueMarkerProps {
  issue: Issue
  onClick?: (issue: Issue) => void
}

export function IssueMarker({ issue, onClick }: IssueMarkerProps) {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <>
      <Marker
        position={{
          lat: issue.latitude,
          lng: issue.longitude,
        }}
        onClick={() => {
          setShowInfo(true)
          onClick?.(issue)
        }}
        icon={{
          path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z",
          fillColor: getCategoryColor(issue.category),
          fillOpacity: 1,
          strokeColor: "#fff",
          strokeWeight: 2,
          scale: 1.5,
        }}
      />
      {showInfo && (
        <InfoWindow
          position={{
            lat: issue.latitude,
            lng: issue.longitude,
          }}
          onCloseClick={() => setShowInfo(false)}
        >
          <div className="w-64 p-3">
            <h3 className="font-semibold text-sm mb-1">{issue.title}</h3>
            <p className="text-xs text-gray-600 mb-2">{issue.address}</p>
            <div className="flex gap-2 mb-2">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">{issue.category}</span>
              <span className="text-xs bg-blue-100 px-2 py-1 rounded">{issue.status}</span>
            </div>
            <p className="text-xs text-gray-700">{issue.description.substring(0, 100)}...</p>
          </div>
        </InfoWindow>
      )}
    </>
  )
}
