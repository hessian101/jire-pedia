"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { checkNGWords } from "@/lib/ng-word-checker"

interface Term {
  id: string
  word: string
  category: string
  subcategory: string | null
  officialDef: string
  ngWords: string[]
}

export default function PlayTermPage() {
  const params = useParams()
  const router = useRouter()
  const termId = params.termId as string

  const [term, setTerm] = useState<Term | null>(null)
  const [explanation, setExplanation] = useState("")
  const [difficulty, setDifficulty] = useState<"easy" | "normal" | "hard">("normal")
  const [ngWordsFound, setNgWordsFound] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTerm() {
      try {
        const response = await fetch(`/api/terms/${termId}`)
        if (!response.ok) throw new Error("用語の取得に失敗しました")
        const data = await response.json()
        setTerm(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : "エラーが発生しました")
      }
    }
    fetchTerm()
  }, [termId])

  useEffect(() => {
    if (term && explanation) {
      const { foundWords } = checkNGWords(explanation, term.ngWords)
      setNgWordsFound(foundWords)
    } else {
      setNgWordsFound([])
    }
  }, [explanation, term])

  const handleSubmit = async () => {
    if (!term) return

    if (ngWordsFound.length > 0) {
      alert("NGワードが含まれています！")
      return
    }

    if (explanation.trim().length < 10) {
      alert("説明文は10文字以上必要です")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          termId: term.id,
          explanation,
          difficulty,
        }),
      })

      if (!response.ok) {
        throw new Error("判定に失敗しました")
      }

      const result = await response.json()
      router.push(`/play/result/${result.attemptId}`)
    } catch (error) {
      setError(error instanceof Error ? error.message : "エラーが発生しました")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (error && !term) {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>エラー</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!term) {
    return (
      <div className="container py-10">
        <p>読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">{term.word}</h1>
          <p className="text-muted-foreground">
            この用語を説明してAIに推測させよう
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>ルール</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2 text-red-600">❌ NGワード（使用禁止）:</h3>
              <div className="flex flex-wrap gap-2">
                {term.ngWords.map((word, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>説明文を入力</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="explanation">あなたの説明</Label>
              <Textarea
                id="explanation"
                placeholder="この用語を、NGワードを使わずに説明してください..."
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                rows={6}
                disabled={isSubmitting}
              />
              <p className="text-sm text-muted-foreground">
                {explanation.length}文字 (最低10文字必要)
              </p>
              {ngWordsFound.length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700 font-semibold">
                    ⚠️ NGワードが含まれています: {ngWordsFound.join(", ")}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>難易度を選択</Label>
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant={difficulty === "easy" ? "default" : "outline"}
                  onClick={() => setDifficulty("easy")}
                  disabled={isSubmitting}
                >
                  🟢 簡単
                  <span className="text-xs ml-2">+10 XP</span>
                </Button>
                <Button
                  variant={difficulty === "normal" ? "default" : "outline"}
                  onClick={() => setDifficulty("normal")}
                  disabled={isSubmitting}
                >
                  🟡 普通
                  <span className="text-xs ml-2">+20 XP</span>
                </Button>
                <Button
                  variant={difficulty === "hard" ? "default" : "outline"}
                  onClick={() => setDifficulty("hard")}
                  disabled={isSubmitting}
                >
                  🔴 難しい
                  <span className="text-xs ml-2">+30 XP</span>
                </Button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button
              className="w-full"
              size="lg"
              onClick={handleSubmit}
              disabled={isSubmitting || ngWordsFound.length > 0 || explanation.trim().length < 10}
            >
              {isSubmitting ? "AIが判定中..." : "AIに挑戦する"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
