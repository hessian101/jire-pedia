"use client"

import { useEffect, useState } from "react"
import { Trophy, Medal, Award, TrendingUp } from "lucide-react"

type LeaderboardEntry = {
  rank: number
  userId: string
  name: string | null
  image: string | null
  level: number
  xp?: number
  userRank: string
  successCount: number
  badgeCount?: number
  xpEarned?: number
}

type Period = "weekly" | "monthly" | "all-time"

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [period, setPeriod] = useState<Period>("all-time")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/leaderboard?period=${period}`)
        const data = await response.json()
        setLeaderboard(data.leaderboard)
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [period])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-gray-400">#{rank}</span>
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30"
      case 2:
        return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30"
      case 3:
        return "bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/30"
      default:
        return "bg-white/5 border-white/10"
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-10 h-10 text-cyan-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              ランキング
            </h1>
          </div>
          <p className="text-gray-400">トップユーザーと競い合おう</p>
        </div>

        {/* Period Selector */}
        <div className="flex justify-center gap-4 mb-8">
          {[
            { value: "weekly", label: "週間" },
            { value: "monthly", label: "月間" },
            { value: "all-time", label: "全期間" },
          ].map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value as Period)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${period === p.value
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Leaderboard */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
            <p className="text-gray-400 mt-4">読み込み中...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry) => (
              <div
                key={entry.userId}
                className={`rounded-2xl border-2 p-4 transition-all hover:scale-[1.02] ${getRankColor(
                  entry.rank
                )}`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="w-12 flex justify-center">
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-white truncate">
                        {entry.name || "Unknown User"}
                      </h3>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${entry.userRank === "Bronze"
                            ? "bg-amber-900/30 text-amber-500"
                            : entry.userRank === "Silver"
                              ? "bg-gray-700/30 text-gray-300"
                              : entry.userRank === "Gold"
                                ? "bg-yellow-900/30 text-yellow-400"
                                : entry.userRank === "Platinum"
                                  ? "bg-cyan-900/30 text-cyan-400"
                                  : "bg-purple-900/30 text-purple-400"
                          }`}
                      >
                        {entry.userRank}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>Lv.{entry.level}</span>
                      {period === "all-time" && entry.xp !== undefined && (
                        <span>{entry.xp.toLocaleString()} XP</span>
                      )}
                      <span>成功: {entry.successCount}回</span>
                      {entry.badgeCount !== undefined && (
                        <span>🏅 {entry.badgeCount}</span>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  {period !== "all-time" && entry.xpEarned !== undefined && (
                    <div className="text-right">
                      <div className="text-sm text-gray-400">獲得XP</div>
                      <div className="text-xl font-bold text-cyan-400">
                        +{entry.xpEarned}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && leaderboard.length === 0 && (
          <div className="text-center py-20">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">まだランキングデータがありません</p>
          </div>
        )}
      </div>
    </div>
  )
}
