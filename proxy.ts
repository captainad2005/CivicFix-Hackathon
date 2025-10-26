import { updateSession } from "@/lib/supabase/middleware"
import type { NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  try {
    return await updateSession(request)
  } catch (error) {
    console.log("[v0] Proxy error:", error)
    // Allow request to proceed even if proxy fails
    return undefined
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
