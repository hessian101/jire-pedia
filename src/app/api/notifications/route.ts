import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 通知一覧を取得
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get("unreadOnly") === "true"
    const limit = parseInt(searchParams.get("limit") || "50")

    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
        ...(unreadOnly ? { read: false } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    })

    const unreadCount = await prisma.notification.count({
      where: {
        userId: session.user.id,
        read: false,
      },
    })

    return NextResponse.json(
      { notifications, unreadCount },
      { status: 200 }
    )
  } catch (error) {
    console.error("Get notifications error:", error)
    return NextResponse.json(
      { error: "通知の取得に失敗しました" },
      { status: 500 }
    )
  }
}

// 通知を既読にする
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    const body = await request.json()
    const { notificationId, markAllAsRead } = body

    if (markAllAsRead) {
      // 全ての通知を既読にする
      await prisma.notification.updateMany({
        where: {
          userId: session.user.id,
          read: false,
        },
        data: {
          read: true,
        },
      })

      return NextResponse.json(
        { message: "全ての通知を既読にしました" },
        { status: 200 }
      )
    } else if (notificationId) {
      // 特定の通知を既読にする
      await prisma.notification.update({
        where: {
          id: notificationId,
          userId: session.user.id,
        },
        data: {
          read: true,
        },
      })

      return NextResponse.json(
        { message: "通知を既読にしました" },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { error: "パラメータが不足しています" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Mark notification as read error:", error)
    return NextResponse.json(
      { error: "通知の更新に失敗しました" },
      { status: 500 }
    )
  }
}

// 通知を削除
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const notificationId = searchParams.get("id")

    if (!notificationId) {
      return NextResponse.json(
        { error: "通知IDが必要です" },
        { status: 400 }
      )
    }

    await prisma.notification.delete({
      where: {
        id: notificationId,
        userId: session.user.id,
      },
    })

    return NextResponse.json(
      { message: "通知を削除しました" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Delete notification error:", error)
    return NextResponse.json(
      { error: "通知の削除に失敗しました" },
      { status: 500 }
    )
  }
}
