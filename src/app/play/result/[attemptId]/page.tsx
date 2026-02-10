import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ResultPage({ params }: { params: { attemptId: string } }) {
  const session = await auth()



  const attempt = await prisma.attempt.findUnique({
    where: { id: params.attemptId },
    include: {
      term: true,
      user: true,
    },
  })

  // ユーザーIDが一致するか、ゲスト（userIdがnull）の場合のみ表示
  if (!attempt || (attempt.userId && attempt.userId !== session?.user?.id)) {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>エラー</CardTitle>
            <CardDescription>結果が見つかりません、またはアクセス権がありません</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // すでにエントリーが存在するかチェック (ログイン時のみ)
  let existingEntry = null
  if (session?.user?.id && attempt.userId) {
    existingEntry = await prisma.entry.findFirst({
      where: {
        userId: session.user.id,
        termId: attempt.termId,
      },
    })
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="text-center space-y-4">
          {attempt.success ? (
            <>
              <div className="text-6xl">🎉</div>
              <h1 className="text-4xl font-bold text-green-600">成功！</h1>
              <p className="text-xl">AIがあなたの説明から正しく推測しました！</p>
            </>
          ) : (
            <>
              <div className="text-6xl">😅</div>
              <h1 className="text-4xl font-bold text-orange-600">惜しい！</h1>
              <p className="text-xl">AIは推測できませんでした。もう一度挑戦してみよう！</p>
            </>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>結果詳細</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">正解の用語:</h3>
              <p className="text-2xl font-bold">{attempt.term.word}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">あなたの説明:</h3>
              <p className="p-4 bg-muted rounded-md">{attempt.explanation}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">AIの推測:</h3>
              <p className="text-xl font-semibold text-primary">{attempt.aiResponse}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">AIの確信度:</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full ${attempt.confidence >= 80
                      ? "bg-green-500"
                      : attempt.confidence >= 50
                        ? "bg-yellow-500"
                        : "bg-red-500"
                      }`}
                    style={{ width: `${attempt.confidence}%` }}
                  />
                </div>
                <span className="font-bold text-lg">{attempt.confidence}%</span>
              </div>
            </div>

            {attempt.aiComment && (
              <div>
                <h3 className="font-semibold mb-2">AIのコメント:</h3>
                <p className="p-4 bg-muted rounded-md text-sm">{attempt.aiComment}</p>
              </div>
            )}

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">獲得XP</p>
                  <p className="text-3xl font-bold text-green-600">+{attempt.xpEarned} XP</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">難易度</p>
                  <p className="text-xl font-semibold">
                    {attempt.difficulty === "easy" && "🟢 簡単"}
                    {attempt.difficulty === "normal" && "🟡 普通"}
                    {attempt.difficulty === "hard" && "🔴 難しい"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {attempt.success && !existingEntry && (
          <Card className="border-green-500">
            <CardHeader>
              <CardTitle>辞書に投稿しますか？</CardTitle>
              <CardDescription>
                あなたの説明を辞書に投稿して、みんなの学習に役立てましょう！
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={`/api/entries/create`} method="POST">
                <input type="hidden" name="attemptId" value={attempt.id} />
                <Button type="submit" className="w-full" size="lg">
                  📚 辞書に投稿する
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4">
          <Button asChild className="flex-1" variant="outline">
            <Link href="/play/select">もう一度プレイ</Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href={`/dictionary/${attempt.termId}`}>辞書を見る</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
