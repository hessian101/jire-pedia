import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getRequiredXP } from "@/lib/xp"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function ProfilePage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      attempts: {
        include: {
          term: true,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      entries: {
        include: {
          term: true,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  })

  if (!user) {
    redirect("/login")
  }

  const totalAttempts = await prisma.attempt.count({
    where: { userId: user.id },
  })

  const successfulAttempts = await prisma.attempt.count({
    where: { userId: user.id, success: true },
  })

  const successRate = totalAttempts > 0 ? (successfulAttempts / totalAttempts) * 100 : 0

  const requiredXP = getRequiredXP(user.level)

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">プロフィール</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>ユーザー情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">名前</p>
                <p className="text-xl font-semibold">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">メールアドレス</p>
                <p className="text-lg">{user.email}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">レベル</p>
                  <p className="text-2xl font-bold text-blue-600">Lv.{user.level}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ランク</p>
                  <p className="text-2xl font-bold text-purple-600">{user.rank}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">XP</p>
                  <p className="text-2xl font-bold text-green-600">{user.xp}/{requiredXP}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">次のレベルまで</p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="h-4 rounded-full bg-green-500"
                    style={{ width: `${(user.xp / requiredXP) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>統計情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">総挑戦回数</p>
                  <p className="text-3xl font-bold">{totalAttempts}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">成功回数</p>
                  <p className="text-3xl font-bold text-green-600">{successfulAttempts}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">成功率</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div
                      className="h-4 rounded-full bg-blue-500"
                      style={{ width: `${successRate}%` }}
                    />
                  </div>
                  <span className="text-xl font-bold">{successRate.toFixed(1)}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">投稿したエントリー</p>
                <p className="text-3xl font-bold text-purple-600">{user.entries.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>最近の挑戦</CardTitle>
            <CardDescription>直近10件の挑戦履歴</CardDescription>
          </CardHeader>
          <CardContent>
            {user.attempts.length > 0 ? (
              <div className="space-y-3">
                {user.attempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex-1">
                      <p className="font-semibold">{attempt.term.word}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(attempt.createdAt).toLocaleDateString("ja-JP")}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm">
                        {attempt.difficulty === "easy" && "🟢 簡単"}
                        {attempt.difficulty === "normal" && "🟡 普通"}
                        {attempt.difficulty === "hard" && "🔴 難しい"}
                      </span>
                      <span className={`text-sm font-semibold ${attempt.success ? "text-green-600" : "text-red-600"}`}>
                        {attempt.success ? "✓ 成功" : "✗ 失敗"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        +{attempt.xpEarned} XP
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">まだ挑戦していません</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>投稿したエントリー</CardTitle>
            <CardDescription>辞書に投稿した説明文</CardDescription>
          </CardHeader>
          <CardContent>
            {user.entries.length > 0 ? (
              <div className="space-y-3">
                {user.entries.map((entry) => (
                  <Link key={entry.id} href={`/dictionary/${entry.termId}`}>
                    <div className="p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-lg">{entry.term.word}</p>
                          {entry.isCrown && (
                            <span className="text-sm text-yellow-600 font-semibold">
                              👑 クラウン獲得中
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(entry.createdAt).toLocaleDateString("ja-JP")}
                        </span>
                      </div>
                      <p className="text-sm p-3 bg-muted rounded-md line-clamp-2">
                        {entry.explanation}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>確信度: {entry.confidence}%</span>
                        <span>{entry.difficulty === "easy" ? "🟢 簡単" : entry.difficulty === "normal" ? "🟡 普通" : "🔴 難しい"}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">まだエントリーを投稿していません</p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button asChild size="lg">
            <Link href="/play/select">プレイを始める</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
