import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getRequiredXP } from "@/lib/xp"
import {
  Trophy, TrendingUp, Target, Award,
  Flame, Calendar, Star, Zap
} from "lucide-react"

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
      badges: {
        include: {
          badge: true,
        },
        orderBy: { earnedAt: "desc" },
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

  // カテゴリー別統計
  const categoryStats = await prisma.attempt.groupBy({
    by: ["termId"],
    where: {
      userId: user.id,
      success: true,
    },
    _count: true,
  })

  const termsWithCategory = await prisma.term.findMany({
    where: {
      id: {
        in: categoryStats.map((s) => s.termId),
      },
    },
    select: {
      id: true,
      category: true,
    },
  })

  const categoryMap = new Map(termsWithCategory.map((t) => [t.id, t.category]))
  const categoryCounts: Record<string, number> = {}

  categoryStats.forEach((stat) => {
    const category = categoryMap.get(stat.termId)
    if (category) {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1
    }
  })

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "from-purple-500 to-pink-500"
      case "epic":
        return "from-purple-400 to-blue-500"
      case "rare":
        return "from-blue-400 to-cyan-400"
      default:
        return "from-gray-400 to-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            マイページ
          </h1>
          <p className="text-gray-400">{user.name}</p>
        </div>

        {/* User Stats Card */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-8 h-8 text-cyan-400" />
              <div>
                <p className="text-sm text-gray-400">レベル</p>
                <p className="text-3xl font-bold text-white">Lv.{user.level}</p>
              </div>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>{user.xp} XP</span>
                <span>{requiredXP} XP</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                  style={{ width: `${(user.xp / requiredXP) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">ランク</p>
                <p className="text-3xl font-bold text-white">{user.rank}</p>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              <div className="flex justify-between mb-1">
                <span>バッジ獲得</span>
                <span className="text-white font-bold">{user.badges.length}個</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Flame className="w-8 h-8 text-orange-400" />
              <div>
                <p className="text-sm text-gray-400">ストリーク</p>
                <p className="text-3xl font-bold text-white">{user.streak}日</p>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              <div className="flex justify-between mb-1">
                <span>最長記録</span>
                <span className="text-white font-bold">{user.longestStreak}日</span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
            統計情報
          </h2>
          <div className="grid gap-6 md:grid-cols-4">
            <div>
              <p className="text-sm text-gray-400 mb-2">総挑戦回数</p>
              <p className="text-4xl font-bold text-white">{totalAttempts}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">成功回数</p>
              <p className="text-4xl font-bold text-green-400">{successfulAttempts}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">成功率</p>
              <p className="text-4xl font-bold text-blue-400">{successRate.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">投稿数</p>
              <p className="text-4xl font-bold text-purple-400">{user.entries.length}</p>
            </div>
          </div>

          {Object.keys(categoryCounts).length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-sm text-gray-400 mb-4">カテゴリー別成功数</p>
              <div className="flex gap-4">
                {Object.entries(categoryCounts).map(([category, count]) => (
                  <div key={category} className="px-4 py-2 bg-white/5 rounded-lg">
                    <span className="text-gray-400 text-sm">{category}</span>
                    <span className="ml-2 text-white font-bold">{count}回</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-cyan-400" />
            獲得バッジ ({user.badges.length})
          </h2>
          {user.badges.length > 0 ? (
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
              {user.badges.map(({ badge, earnedAt }) => (
                <div
                  key={badge.id}
                  className={`relative rounded-xl p-4 bg-gradient-to-br ${getRarityColor(
                    badge.rarity
                  )} bg-opacity-10 border-2 border-opacity-30 hover:scale-105 transition-transform group`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">{badge.iconName}</div>
                    <h3 className="text-sm font-bold text-white mb-1">
                      {badge.name}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {badge.description}
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      {new Date(earnedAt).toLocaleDateString("ja-JP")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">まだバッジを獲得していません</p>
              <p className="text-sm text-gray-500 mt-2">
                プレイして最初のバッジを手に入れよう！
              </p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-cyan-400" />
            最近の挑戦
          </h2>
          {user.attempts.length > 0 ? (
            <div className="space-y-3">
              {user.attempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-white">{attempt.term.word}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(attempt.createdAt).toLocaleDateString("ja-JP")}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        attempt.difficulty === "EASY"
                          ? "bg-green-500/20 text-green-400"
                          : attempt.difficulty === "NORMAL"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {attempt.difficulty}
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        attempt.success ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {attempt.success ? "✓ 成功" : "✗ 失敗"}
                    </span>
                    <span className="text-sm text-cyan-400 font-bold">
                      +{attempt.xpEarned} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">まだ挑戦していません</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Link
            href="/play/select"
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white text-lg font-bold rounded-full transition-all hover:scale-105 shadow-lg shadow-cyan-500/50"
          >
            プレイを始める
          </Link>
          <Link
            href="/leaderboard"
            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white text-lg font-bold rounded-full transition-all hover:scale-105 border border-white/20"
          >
            ランキングを見る
          </Link>
        </div>
      </div>
    </div>
  )
}
