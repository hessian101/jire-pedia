import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { message: "認証が必要です" },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const attemptId = formData.get("attemptId") as string

    if (!attemptId) {
      return NextResponse.json(
        { message: "attemptIdが必要です" },
        { status: 400 }
      )
    }

    // Attemptを取得
    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
    })

    if (!attempt) {
      return NextResponse.json(
        { message: "挑戦記録が見つかりません" },
        { status: 404 }
      )
    }

    if (attempt.userId !== session.user.id) {
      return NextResponse.json(
        { message: "権限がありません" },
        { status: 403 }
      )
    }

    if (!attempt.success) {
      return NextResponse.json(
        { message: "成功した挑戦のみ投稿できます" },
        { status: 400 }
      )
    }

    // すでにエントリーが存在するかチェック
    const existingEntry = await prisma.entry.findFirst({
      where: {
        userId: session.user.id,
        termId: attempt.termId,
      },
    })

    if (existingEntry) {
      // 既存のエントリーを更新
      await prisma.entry.update({
        where: { id: existingEntry.id },
        data: {
          explanation: attempt.explanation,
          difficulty: attempt.difficulty,
          confidence: attempt.confidence,
          version: { increment: 1 },
        },
      })
    } else {
      // 新しいエントリーを作成
      const entry = await prisma.entry.create({
        data: {
          userId: session.user.id,
          termId: attempt.termId,
          explanation: attempt.explanation,
          difficulty: attempt.difficulty,
          confidence: attempt.confidence,
        },
      })

      // 現在のクラウンエントリーをチェック
      const currentCrown = await prisma.entry.findFirst({
        where: {
          termId: attempt.termId,
          isCrown: true,
        },
      })

      // クラウンがないか、新しいエントリーの確信度が高い場合、クラウンを更新
      if (!currentCrown || entry.confidence > currentCrown.confidence) {
        // 既存のクラウンを解除
        if (currentCrown) {
          await prisma.entry.update({
            where: { id: currentCrown.id },
            data: { isCrown: false },
          })
        }

        // 新しいクラウンを設定
        await prisma.entry.update({
          where: { id: entry.id },
          data: {
            isCrown: true,
            crownStartDate: new Date(),
          },
        })
      }
    }

    return NextResponse.redirect(new URL(`/dictionary/${attempt.termId}`, request.url))
  } catch (error) {
    console.error("Entry creation error:", error)
    return NextResponse.json(
      { message: "エントリーの作成に失敗しました" },
      { status: 500 }
    )
  }
}
