import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "all-time" // weekly, monthly, all-time
    const limit = parseInt(searchParams.get("limit") || "100")

    let dateFilter = {}

    const now = new Date()

    if (period === "weekly") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      dateFilter = {
        createdAt: {
          gte: weekAgo,
        },
      }
    } else if (period === "monthly") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      dateFilter = {
        createdAt: {
          gte: monthAgo,
        },
      }
    }

    // 期間によってランキングを計算
    if (period === "all-time") {
      // 全期間ランキング - XPベース
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          image: true,
          level: true,
          xp: true,
          rank: true,
          _count: {
            select: {
              attempts: {
                where: { success: true },
              },
              badges: true,
            },
          },
        },
        orderBy: [
          { xp: "desc" },
          { level: "desc" },
        ],
        take: limit,
      })

      const leaderboard = users.map((user, index) => ({
        rank: index + 1,
        userId: user.id,
        name: user.name,
        image: user.image,
        level: user.level,
        xp: user.xp,
        userRank: user.rank,
        successCount: user._count.attempts,
        badgeCount: user._count.badges,
      }))

      return NextResponse.json({ leaderboard, period }, { status: 200 })
    } else {
      // 週間/月間ランキング - 期間内の成功数ベース
      const attempts = await prisma.attempt.groupBy({
        by: ["userId"],
        where: {
          success: true,
          ...dateFilter,
        },
        _count: {
          id: true,
        },
        _sum: {
          xpEarned: true,
        },
        orderBy: {
          _count: {
            id: "desc",
          },
        },
        take: limit,
      })

      const userIds = attempts.map((a) => a.userId)

      const users = await prisma.user.findMany({
        where: {
          id: {
            in: userIds,
          },
        },
        select: {
          id: true,
          name: true,
          image: true,
          level: true,
          rank: true,
        },
      })

      const userMap = new Map(users.map((u) => [u.id, u]))

      const leaderboard = attempts.map((attempt, index) => {
        const user = userMap.get(attempt.userId)
        return {
          rank: index + 1,
          userId: attempt.userId,
          name: user?.name,
          image: user?.image,
          level: user?.level,
          userRank: user?.rank,
          successCount: attempt._count.id,
          xpEarned: attempt._sum.xpEarned || 0,
        }
      })

      return NextResponse.json({ leaderboard, period }, { status: 200 })
    }
  } catch (error) {
    console.error("Leaderboard error:", error)
    return NextResponse.json(
      { error: "ランキングの取得に失敗しました" },
      { status: 500 }
    )
  }
}
