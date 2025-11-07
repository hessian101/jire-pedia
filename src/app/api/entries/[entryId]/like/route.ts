import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// いいねする
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

    // 既にいいねしているかチェック
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_entryId: {
          userId: session.user.id,
          entryId,
        },
      },
    })

    if (existingLike) {
      return NextResponse.json({ error: "既にいいね済みです" }, { status: 400 })
    }

    // いいねを追加 & Entryのlike countを更新
    const [like, entry] = await prisma.$transaction([
      prisma.like.create({
        data: {
          userId: session.user.id,
          entryId,
        },
      }),
      prisma.entry.update({
        where: { id: entryId },
        data: {
          likeCount: { increment: 1 },
        },
        include: {
          user: true,
        },
      }),
    ])

    // 通知を作成（自分自身へのいいねは通知しない）
    if (entry.userId !== session.user.id) {
      await prisma.notification.create({
        data: {
          userId: entry.userId,
          type: "like",
          title: "いいねされました",
          message: `${session.user.name}さんがあなたの説明にいいねしました`,
          link: `/entries/${entryId}`,
        },
      })
    }

    return NextResponse.json({ success: true, like }, { status: 201 })
  } catch (error) {
    console.error("Like error:", error)
    return NextResponse.json(
      { error: "いいねに失敗しました" },
      { status: 500 }
    )
  }
}

// いいねを取り消す
export async function DELETE(
  request: NextRequest,
  { params }: { params: { entryId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    const { entryId } = params

    // いいねを削除 & Entryのlike countを更新
    await prisma.$transaction([
      prisma.like.delete({
        where: {
          userId_entryId: {
            userId: session.user.id,
            entryId,
          },
        },
      }),
      prisma.entry.update({
        where: { id: entryId },
        data: {
          likeCount: { decrement: 1 },
        },
      }),
    ])

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Unlike error:", error)
    return NextResponse.json(
      { error: "いいね取り消しに失敗しました" },
      { status: 500 }
    )
  }
}

// いいね状態をチェック
export async function GET(
  request: NextRequest,
  { params }: { params: { entryId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ liked: false }, { status: 200 })
    }

    const { entryId } = params

    const like = await prisma.like.findUnique({
      where: {
        userId_entryId: {
          userId: session.user.id,
          entryId,
        },
      },
    })

    return NextResponse.json({ liked: !!like }, { status: 200 })
  } catch (error) {
    console.error("Check like error:", error)
    return NextResponse.json(
      { error: "いいね状態の確認に失敗しました" },
      { status: 500 }
    )
  }
}
