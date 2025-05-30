import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { data } = body

    if (!data) {
      return NextResponse.json({ error: "Invalid entry data" }, { status: 400 })
    }

    const entry = await db.createEntry({ formId: params.id, data })
    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    console.error("Error creating entry:", error)
    return NextResponse.json({ error: "Failed to create entry" }, { status: 500 })
  }
}
