"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ISSUE_CATEGORIES, ISSUE_STATUSES } from "@/lib/maps/constants"

interface MapFilterProps {
  onFilterChange: (filters: { category?: string; status?: string }) => void
}

export function MapFilter({ onFilterChange }: MapFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>()
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>()

  const handleCategoryChange = (category: string | undefined) => {
    setSelectedCategory(category)
    onFilterChange({ category, status: selectedStatus })
  }

  const handleStatusChange = (status: string | undefined) => {
    setSelectedStatus(status)
    onFilterChange({ category: selectedCategory, status })
  }

  const handleReset = () => {
    setSelectedCategory(undefined)
    setSelectedStatus(undefined)
    onFilterChange({})
  }

  return (
    <div className="flex flex-wrap gap-3 p-4 bg-white rounded-lg shadow">
      <div className="flex gap-2 flex-wrap">
        <span className="text-sm font-semibold self-center">Category:</span>
        <Button
          variant={selectedCategory === undefined ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryChange(undefined)}
        >
          All
        </Button>
        {Object.entries(ISSUE_CATEGORIES).map(([key, { label }]) => (
          <Button
            key={key}
            variant={selectedCategory === key ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        <span className="text-sm font-semibold self-center">Status:</span>
        <Button
          variant={selectedStatus === undefined ? "default" : "outline"}
          size="sm"
          onClick={() => handleStatusChange(undefined)}
        >
          All
        </Button>
        {Object.entries(ISSUE_STATUSES).map(([key, { label }]) => (
          <Button
            key={key}
            variant={selectedStatus === key ? "default" : "outline"}
            size="sm"
            onClick={() => handleStatusChange(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      <Button variant="ghost" size="sm" onClick={handleReset} className="ml-auto">
        Reset Filters
      </Button>
    </div>
  )
}
