import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const commentSchema = z.object({
  content: z.string().min(1).max(500),
})

// コメント一覧を取得
export async function GET(
  request: NextRequest,
  { params }: { params: { entryId: string } }
) {
  try {
    const { entryId } = params

    const comments = await prisma.comment.findMany({
      where: { entryId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            level: true,
            rank: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ comments }, { status: 200 })
  } catch (error) {
    console.error("Get comments error:", error)
    return NextResponse.json(
      { error: "コメントの取得に失敗しました" },
      { status: 500 }
    )
  }
}

// コメントを投稿
export async function POST(
  request: NextRequest,
  { params }: { params: { entryId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    const { entryId } = params
    const body = await request.json()
    const { content } = commentSchema.parse(body)

    // コメントを作成 & Entryのcomment countを更新
    const [comment, entry] = await prisma.$transaction([
      prisma.comment.create({
        data: {
          userId: session.user.id,
          entryId,
          content,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              level: true,
              rank: true,
            },
          },
        },
      }),
      prisma.entry.update({
        where: { id: entryId },
        data: {
          commentCount: { increment: 1 },
        },
        include: {
          user: true,
        },
      }),
    ])

    // 通知を作成（自分自身へのコメントは通知しない）
    if (entry.userId !== session.user.id) {
      await prisma.notification.create({
        data: {
          userId: entry.userId,
          type: "comment",
          title: "コメントが投稿されました",
          message: `${session.user.name}さんがコメントしました: ${content.substring(0, 50)}${content.length > 50 ? "..." : ""}`,
          link: `/entries/${entryId}`,
        },
      })
    }

    return NextResponse.json({ comment }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "コメント内容が不正です" },
        { status: 400 }
      )
    }
    console.error("Post comment error:", error)
    return NextResponse.json(
      { error: "コメントの投稿に失敗しました" },
      { status: 500 }
    )
  }
}
