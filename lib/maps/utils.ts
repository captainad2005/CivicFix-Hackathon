import { ISSUE_CATEGORIES, ISSUE_STATUSES } from "./constants"

export interface Issue {
  id: string
  title: string
  description: string
  category: string
  status: string
  latitude: number
  longitude: number
  address: string
  image_url?: string
  user_id: string
  created_at: string
  profiles?: {
    full_name: string
    email: string
  }
}

export function getCategoryColor(category: string): string {
  return ISSUE_CATEGORIES[category as keyof typeof ISSUE_CATEGORIES]?.color || "#A8DADC"
}

export function getStatusColor(status: string): string {
  return ISSUE_STATUSES[status as keyof typeof ISSUE_STATUSES]?.color || "#A8DADC"
}

export function getCategoryLabel(category: string): string {
  return ISSUE_CATEGORIES[category as keyof typeof ISSUE_CATEGORIES]?.label || "Other"
}

export function getStatusLabel(status: string): string {
  return ISSUE_STATUSES[status as keyof typeof ISSUE_STATUSES]?.label || "Unknown"
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
