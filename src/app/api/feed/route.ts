import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const cursor = searchParams.get("cursor")
  const limit = parseInt(searchParams.get("limit") || "10")

  try {
    const terms = await prisma.term.findMany({
      take: limit + 1, // Take one extra to determine if there are more
      skip: cursor ? 1 : 0,
      ...(cursor && { cursor: { id: cursor } }),
      orderBy: { createdAt: "desc" },
      include: {
        entries: {
          take: 3,
          include: {
            user: {
              select: {
                name: true,
                level: true,
                rank: true,
              },
            },
            _count: {
              select: {
                likes: true,
              },
            },
          },
          orderBy: [
            { isCrown: "desc" },
            { confidence: "desc" },
          ],
        },
        _count: {
          select: {
            attempts: true,
            entries: true,
          },
        },
      },
    })

    let hasMore = false
    let nextCursor: string | undefined = undefined

    if (terms.length > limit) {
      hasMore = true
      terms.pop() // Remove the extra item
      nextCursor = terms[terms.length - 1].id
    }

    return NextResponse.json({
      terms,
      nextCursor,
      hasMore,
    })
  } catch (error) {
    console.error("Error fetching feed:", error)
    return NextResponse.json(
      { error: "Failed to fetch feed" },
      { status: 500 }
    )
  }
}
