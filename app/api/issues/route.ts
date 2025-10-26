import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const category = searchParams.get("category")

    let query = supabase
      .from("issues")
      .select("*, profiles(full_name, email)")
      .order("created_at", { ascending: false })

    if (status) {
      query = query.eq("status", status)
    }
    if (category) {
      query = query.eq("category", category)
    }

    const { data, error } = await query

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch issues" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, category, latitude, longitude, address, image_url } = body

    const { data, error } = await supabase
      .from("issues")
      .insert({
        title,
        description,
        category,
        latitude,
        longitude,
        address,
        image_url,
        user_id: user.id,
      })
      .select()

    if (error) throw error
    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create issue" },
      { status: 500 },
    )
  }
}
