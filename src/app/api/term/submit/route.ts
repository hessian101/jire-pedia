import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(req: Request) {
    try {
        const session = await auth()
        const { word, reading, category, difficulty, officialDef, ngWords } = await req.json()

        // バリデーション
        if (!word || !reading || !category || !officialDef) {
            return NextResponse.json(
                { error: "必須項目が不足しています" },
                { status: 400 }
            )
        }

        // 重複チェック
        const existing = await prisma.term.findUnique({
            where: { word }
        })

        if (existing) {
            return NextResponse.json(
                { message: "この用語は既に登録されています" },
                { status: 409 }
            )
        }

        // DB登録
        const newTerm = await prisma.term.create({
            data: {
                word,
                category,
                officialDef,
                ngWords, // 配列であることを想定
                difficulty: difficulty || "NORMAL",
                creatorId: session?.user?.id, // ログインしていればID紐付け
                status: "APPROVED", // 簡易的に即時承認
                tags: [reading] // 読みをタグとして保存（検索用）
            }
        })

        return NextResponse.json(newTerm, { status: 201 })

    } catch (error) {
        console.error("Submit Term Error:", error)
        return NextResponse.json(
            { error: "用語の登録に失敗しました" },
            { status: 500 }
        )
    }
}
