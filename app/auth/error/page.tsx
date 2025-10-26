"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")

  const getErrorMessage = () => {
    switch (error) {
      case "otp_expired":
        return "Your email link has expired. Please request a new one."
      case "access_denied":
        return "Access was denied. Please try again."
      case "invalid_grant":
        return "Invalid credentials. Please try again."
      default:
        return errorDescription || "An authentication error occurred. Please try again."
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>Something went wrong during sign in</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">{getErrorMessage()}</div>
          <div className="flex gap-2">
            <Link href="/auth/sign-up" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                Sign Up
              </Button>
            </Link>
            <Link href="/auth/login" className="flex-1">
              <Button className="w-full">Try Again</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
