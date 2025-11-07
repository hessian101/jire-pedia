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
    if (!dailyChallenge) {
      // ランダムに用語を選択
      const count = await prisma.term.count()
      const skip = Math.floor(Math.random() * count)

      const randomTerm = await prisma.term.findFirst({
        skip,
        take: 1,
      })

      if (!randomTerm) {
        return NextResponse.json(
          { error: "用語が見つかりません" },
          { status: 404 }
        )
      }

      // ランダムに難易度を選択
      const difficulties = ["EASY", "NORMAL", "HARD"]
      const randomDifficulty =
        difficulties[Math.floor(Math.random() * difficulties.length)]

      dailyChallenge = await prisma.dailyChallenge.create({
        data: {
          termId: randomTerm.id,
          date: today,
          difficulty: randomDifficulty,
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
