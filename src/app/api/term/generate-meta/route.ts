import { NextResponse } from "next/server"
import { generateTermMeta } from "@/lib/ai"

export async function POST(req: Request) {
    try {
        const { word, category } = await req.json()

        if (!word) {
            return NextResponse.json(
                { error: "Word is required" },
                { status: 400 }
            )
        }

        const data = await generateTermMeta(word, category)
        return NextResponse.json(data)

    } catch (error) {
        console.error("Generate Meta Error:", error)
        return NextResponse.json(
            { error: "Failed to generate metadata" },
            { status: 500 }
        )
    }
}
