import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 今日のデイリーチャレンジを取得
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    // 今日の日付（0時）
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // 明日の日付（0時）
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // 今日のチャレンジを取得または作成
    let dailyChallenge = await prisma.dailyChallenge.findFirst({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        term: true,
      },
    })

    // 今日のチャレンジがまだない場合は作成
    // 今日のチャレンジがまだない場合は作成
    if (!dailyChallenge) {
      // 1. 前回のチャレンジを取得してカテゴリを確認
      const lastChallenge = await prisma.dailyChallenge.findFirst({
        orderBy: { date: "desc" },
        include: { term: true },
      })
      const lastCategory = lastChallenge?.term.category

      // 2. 難易度を決定（曜日による変動）
      const dayOfWeek = today.getDay() // 0: Sun, 1: Mon, ..., 6: Sat
      let targetDifficulty = "NORMAL"

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        targetDifficulty = "HARD" // 週末は難しい
      } else if (dayOfWeek === 1) {
        targetDifficulty = "EASY" // 月曜は易しい
      } else {
        const difficulties = ["EASY", "NORMAL", "HARD"]
        targetDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)]
      }

      // 3. 用語を選定（カテゴリローテーション）
      let candidateTerm = null

      // 前回と違うカテゴリの用語を優先的に探す
      const termsCount = await prisma.term.count({
        where: lastCategory ? { category: { not: lastCategory } } : undefined
      })

      if (termsCount > 0) {
        const skip = Math.floor(Math.random() * termsCount)
        candidateTerm = await prisma.term.findFirst({
          where: lastCategory ? { category: { not: lastCategory } } : undefined,
          skip,
        })
      }

      // 見つからなければ（または初回なら）完全にランダムで取得
      if (!candidateTerm) {
        const totalCount = await prisma.term.count()
        const skip = Math.floor(Math.random() * totalCount)
        candidateTerm = await prisma.term.findFirst({ skip })
      }

      if (!candidateTerm) {
        return NextResponse.json(
          { error: "用語が見つかりません（データ不足）" },
          { status: 404 }
        )
      }

      dailyChallenge = await prisma.dailyChallenge.create({
        data: {
          termId: candidateTerm.id,
          date: today,
          difficulty: targetDifficulty,
        },
        include: {
          term: true,
        },
      })
    }

    // ユーザーがログインしている場合、挑戦状況を取得
    let userChallenge = null
    if (session?.user) {
      userChallenge = await prisma.userChallenge.findUnique({
        where: {
          userId_dailyChallengeId: {
            userId: session.user.id,
            dailyChallengeId: dailyChallenge.id,
          },
        },
      })
    }

    return NextResponse.json(
      {
        challenge: dailyChallenge,
        userChallenge,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Daily challenge error:", error)
    return NextResponse.json(
      { error: "デイリーチャレンジの取得に失敗しました" },
      { status: 500 }
    )
  }
}

// デイリーチャレンジの結果を記録
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    const body = await request.json()
    const { dailyChallengeId, success, score } = body

    // チャレンジ結果を記録
    const userChallenge = await prisma.userChallenge.upsert({
      where: {
        userId_dailyChallengeId: {
          userId: session.user.id,
          dailyChallengeId,
        },
      },
      update: {
        completed: true,
        success,
        score,
      },
      create: {
        userId: session.user.id,
        dailyChallengeId,
        completed: true,
        success,
        score,
      },
    })

    // 成功した場合、通知を作成
    if (success) {
      await prisma.notification.create({
        data: {
          userId: session.user.id,
          type: "challenge_complete",
          title: "デイリーチャレンジ完了！",
          message: "今日のデイリーチャレンジをクリアしました！",
          link: "/daily-challenge",
        },
      })
    }

    return NextResponse.json({ userChallenge }, { status: 200 })
  } catch (error) {
    console.error("Record challenge error:", error)
    return NextResponse.json(
      { error: "チャレンジの記録に失敗しました" },
      { status: 500 }
    )
  }
}
