import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { judgeWithGemini, judgeWithGroq, checkNGWithAI } from "@/lib/ai"
import { calculateXP, checkLevelUp, getRankFromLevel } from "@/lib/xp"
import { checkNGWords } from "@/lib/ng-word-checker"
import { z } from "zod"

const judgeSchema = z.object({
  termId: z.string(),
  explanation: z.string().min(10),
  difficulty: z.enum(["easy", "normal", "hard"]),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { message: "認証が必要です" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { termId, explanation, difficulty } = judgeSchema.parse(body)

    // 用語を取得
    const term = await prisma.term.findUnique({
      where: { id: termId },
    })

    if (!term) {
      return NextResponse.json(
        { message: "用語が見つかりません" },
        { status: 404 }
      )
    }

    // NGワードチェック
    const { hasNGWord, foundWords } = checkNGWords(explanation, term.ngWords)
    if (hasNGWord) {
      return NextResponse.json(
        { message: `NGワードが含まれています: ${foundWords.join(", ")}` },
        { status: 400 }
      )
    }

    // AIによる公平性の詳細チェック
    const aiNGResult = await checkNGWithAI(explanation, term.word)
    if (aiNGResult.isNG) {
      return NextResponse.json(
        { message: `説明が不適切です: ${aiNGResult.reason}` },
        { status: 400 }
      )
    }

    // AI判定を実行
    let aiResult
    let aiModel = ""

    try {
      if (difficulty === "easy") {
        aiModel = "gemini-1.5-flash"
        aiResult = await judgeWithGemini(explanation, term.word)
      } else if (difficulty === "normal") {
        aiModel = "llama-3.1-8b-instant"
        aiResult = await judgeWithGroq(explanation, term.word, "llama-3.1-8b-instant")
      } else {
        aiModel = "llama-3-70b-8192"
        aiResult = await judgeWithGroq(explanation, term.word, "llama-3-70b-8192")
      }
    } catch (error) {
      console.error("AI judgment error:", error)
      return NextResponse.json(
        { message: "AI判定に失敗しました" },
        { status: 500 }
      )
    }

    // XP計算
    const xpEarned = aiResult.success ? calculateXP(difficulty, aiResult.confidence) : 0

    // ユーザー情報を取得
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json(
        { message: "ユーザーが見つかりません" },
        { status: 404 }
      )
    }

    // Attemptレコードを作成
    const attempt = await prisma.attempt.create({
      data: {
        userId: session.user.id,
        termId: term.id,
        difficulty,
        aiModel,
        explanation,
        success: aiResult.success,
        confidence: aiResult.confidence,
        aiResponse: aiResult.aiGuess,
        aiComment: aiResult.reasoning,
        xpEarned,
      },
    })

    // ユーザーのXPとレベルを更新
    if (aiResult.success) {
      let newXP = user.xp + xpEarned
      let newLevel = user.level
      let newRank = user.rank

      const levelUpResult = checkLevelUp(newXP, user.level)
      if (levelUpResult.leveledUp) {
        newLevel = levelUpResult.newLevel
        newXP = levelUpResult.remainingXP
        newRank = getRankFromLevel(newLevel)
      }

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          xp: newXP,
          level: newLevel,
          rank: newRank,
        },
      })
    }

    // 用語の統計を更新
    await prisma.term.update({
      where: { id: term.id },
      data: {
        totalAttempts: { increment: 1 },
        totalSuccess: aiResult.success ? { increment: 1 } : undefined,
      },
    })

    return NextResponse.json({
      attemptId: attempt.id,
      success: aiResult.success,
      xpEarned,
    })
  } catch (error) {
    console.error("Judge error:", error)
    return NextResponse.json(
      { message: "判定処理に失敗しました" },
      { status: 500 }
    )
  }
}
