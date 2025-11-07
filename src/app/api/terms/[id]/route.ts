import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const term = await prisma.term.findUnique({
      where: { id: params.id },
    })

    if (!term) {
      return NextResponse.json(
        { message: "用語が見つかりません" },
        { status: 404 }
      )
    }

    return NextResponse.json(term)
  } catch (error) {
    console.error("Error fetching term:", error)
    return NextResponse.json(
      { message: "用語の取得に失敗しました" },
      { status: 500 }
    )
  }
}
