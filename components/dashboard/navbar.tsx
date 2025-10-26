"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface NavbarProps {
  userRole?: string
}

export function Navbar({ userRole }: NavbarProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          CivicFix
        </Link>
        <div className="flex gap-4 items-center">
          {userRole === "admin" && (
            <>
              <Link href="/dashboard/admin">
                <Button variant="ghost">Admin Dashboard</Button>
              </Link>
              <Link href="/dashboard/public">
                <Button variant="ghost">Public View</Button>
              </Link>
            </>
          )}
          {userRole === "citizen" && (
            <>
              <Link href="/dashboard/citizen">
                <Button variant="ghost">My Issues</Button>
              </Link>
              <Link href="/dashboard/public">
                <Button variant="ghost">View All Issues</Button>
              </Link>
            </>
          )}
          <Button variant="outline" onClick={handleLogout} disabled={isLoading}>
            {isLoading ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </nav>
  )
}
