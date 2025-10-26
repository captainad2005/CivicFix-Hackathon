import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")
  const next = searchParams.get("next") ?? "/dashboard/citizen"

  if (error) {
    const errorUrl = new URL("/auth/error", request.url)
    errorUrl.searchParams.set("error", error)
    if (errorDescription) {
      errorUrl.searchParams.set("error_description", errorDescription)
    }
    return NextResponse.redirect(errorUrl)
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (!exchangeError) {
      const forwardedHost = request.headers.get("x-forwarded-host")
      const proto = request.headers.get("x-forwarded-proto")
      const host = forwardedHost || request.headers.get("host") || ""
      const redirectUrl = proto ? `${proto}://${host}${next}` : next
      return NextResponse.redirect(redirectUrl)
    }

    const errorUrl = new URL("/auth/error", request.url)
    errorUrl.searchParams.set("error", "exchange_failed")
    errorUrl.searchParams.set("error_description", exchangeError?.message || "Failed to exchange code for session")
    return NextResponse.redirect(errorUrl)
  }

  return NextResponse.redirect(new URL("/auth/error?error=invalid_request", request.url))
}
