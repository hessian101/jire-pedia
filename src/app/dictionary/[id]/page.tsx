import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Crown, Target, Calendar, TrendingUp, AlertCircle } from "lucide-react"

export default async function DictionaryDetailPage({ params }: { params: { id: string } }) {
  const term = await prisma.term.findUnique({
    where: { id: params.id },
    include: {
      entries: {
        include: {
          user: {
            select: {
              name: true,
              level: true,
              rank: true,
            },
          },
        },
        orderBy: [
          { isCrown: "desc" },
          { confidence: "desc" },
          { createdAt: "desc" },
        ],
      },
    },
  })

  if (!term) {
    return (
      <div className="min-h-screen pb-40 py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 rounded-2xl border border-cyan-500/20 bg-[#1a1d2e]/50 text-center">
            <h1 className="text-2xl font-bold">用語が見つかりません</h1>
          </div>
        </div>
      </div>
    )
  }

  const crownEntry = term.entries.find((e) => e.isCrown)
  const otherEntries = term.entries.filter((e) => !e.isCrown)

  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return { color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", label: "簡単" }
      case "normal":
        return { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", label: "普通" }
      default:
        return { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", label: "難しい" }
    }
  }

  return (
    <div className="min-h-screen pb-40 py-10 px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {term.word}
          </h1>
          <p className="text-gray-400 flex items-center gap-2">
            <Target className="w-4 h-4" />
            {term.category}
            {term.subcategory && ` > ${term.subcategory}`}
          </p>
          <div className="flex flex-wrap gap-2">
            {term.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Official Definition */}
        <div className="p-6 rounded-2xl border border-cyan-500/20 bg-[#1a1d2e]/50 space-y-3">
          <h2 className="text-xl font-bold text-cyan-400">公式定義</h2>
          <p className="text-gray-300 leading-relaxed">{term.officialDef}</p>
        </div>

        {/* NG Words */}
        <div className="p-6 rounded-2xl border border-red-500/20 bg-[#1a1d2e]/50 space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <h2 className="text-xl font-bold text-red-400">NGワード</h2>
          </div>
          <p className="text-sm text-gray-400">ゲームで使用禁止の言葉</p>
          <div className="flex flex-wrap gap-2">
            {term.ngWords.map((word, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-sm font-medium"
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* Crown Entry */}
        {crownEntry && (
          <div className="p-6 rounded-2xl border-2 border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-amber-500/5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-yellow-500/20">
                <Crown className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-yellow-400">王座の説明</h2>
                <p className="text-sm text-gray-400">
                  投稿者: {crownEntry.user.name} • Lv.{crownEntry.user.level} {crownEntry.user.rank}
                </p>
              </div>
            </div>
            <p className="text-lg p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-gray-200 leading-relaxed">
              {crownEntry.explanation}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {(() => {
                const config = getDifficultyConfig(crownEntry.difficulty)
                return (
                  <span className={`px-3 py-1 ${config.bg} border ${config.border} ${config.color} rounded-full`}>
                    難易度: {config.label}
                  </span>
                )
              })()}
              <span className="flex items-center gap-1 text-cyan-400">
                <TrendingUp className="w-4 h-4" />
                確信度: {crownEntry.confidence}%
              </span>
              <span className="flex items-center gap-1 text-yellow-400">
                <Calendar className="w-4 h-4" />
                {crownEntry.crownDays}日間王座
              </span>
            </div>
          </div>
        )}

        {/* Other Entries */}
        {otherEntries.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">その他の説明 ({otherEntries.length}件)</h2>
            {otherEntries.map((entry) => (
              <div key={entry.id} className="p-6 rounded-2xl border border-cyan-500/20 bg-[#1a1d2e]/50 space-y-3">
                <p className="text-sm text-gray-400">
                  投稿者: {entry.user.name} • Lv.{entry.user.level} {entry.user.rank} •{" "}
                  {new Date(entry.createdAt).toLocaleDateString("ja-JP")}
                </p>
                <p className="p-4 bg-[#0f1117]/50 rounded-lg text-gray-300 leading-relaxed">
                  {entry.explanation}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  {(() => {
                    const config = getDifficultyConfig(entry.difficulty)
                    return (
                      <span className={`px-3 py-1 ${config.bg} border ${config.border} ${config.color} rounded-full`}>
                        難易度: {config.label}
                      </span>
                    )
                  })()}
                  <span className="flex items-center gap-1 text-cyan-400">
                    <TrendingUp className="w-4 h-4" />
                    確信度: {entry.confidence}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Entries */}
        {term.entries.length === 0 && (
          <div className="p-8 rounded-2xl border border-cyan-500/20 bg-[#1a1d2e]/50 text-center space-y-3">
            <h2 className="text-2xl font-bold">まだ説明がありません</h2>
            <p className="text-gray-400">
              最初の説明を投稿して、この用語の王座を獲得しよう！
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sticky bottom-24 z-40">
          <Link
            href={`/play/${term.id}`}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white text-center rounded-full transition-all hover:scale-105 shadow-lg hover:shadow-cyan-500/50 font-medium"
          >
            挑戦を開始
          </Link>
          <Link
            href="/dictionary"
            className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border-2 border-cyan-500/50 hover:border-cyan-500 text-white text-center rounded-full transition-all backdrop-blur-sm font-medium"
          >
            辞書一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  )
}
