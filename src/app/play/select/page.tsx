import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SelectTermPage() {


  // ランダムに用語を取得
  const termCount = await prisma.term.count()
  const skip = Math.floor(Math.random() * termCount)
  const randomTerm = await prisma.term.findFirst({
    skip,
    take: 1,
  })

  if (!randomTerm) {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>用語が見つかりません</CardTitle>
            <CardDescription>
              用語が登録されていません。管理者にお問い合わせください。
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">用語を選択</h1>
          <p className="text-muted-foreground">
            ランダムに選ばれた用語に挑戦しよう
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{randomTerm.word}</CardTitle>
            <CardDescription>
              カテゴリ: {randomTerm.category}
              {randomTerm.subcategory && ` > ${randomTerm.subcategory}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">公式定義:</h3>
              <p className="text-muted-foreground">{randomTerm.officialDef}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-red-600">NGワード:</h3>
              <div className="flex flex-wrap gap-2">
                {randomTerm.ngWords.map((word, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Button asChild className="w-full" size="lg">
                <Link href={`/play/${randomTerm.id}`}>この用語で挑戦する</Link>
              </Button>
            </div>

            <div className="text-center">
              <Button asChild variant="ghost">
                <Link href="/play/select">別の用語を選ぶ</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
