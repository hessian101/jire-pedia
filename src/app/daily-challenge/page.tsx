"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Trophy, Flame, Target } from "lucide-react"
import { useSession } from "next-auth/react"

type DailyChallenge = {
  id: string
  termId: string
  date: string
  difficulty: string
  term: {
    id: string
    word: string
    category: string
    subcategory: string | null
  }
}

type UserChallenge = {
  id: string
  completed: boolean
  success: boolean | null
  score: number | null
}

export default function DailyChallengePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null)
  const [userChallenge, setUserChallenge] = useState<UserChallenge | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDailyChallenge()
  }, [])

  const fetchDailyChallenge = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/daily-challenge")
      const data = await response.json()
      setChallenge(data.challenge)
      setUserChallenge(data.userChallenge)
    } catch (error) {
      console.error("Failed to fetch daily challenge:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartChallenge = () => {
    if (!session) {
      router.push("/login")
      return
    }
    if (challenge) {
      router.push(`/play/${challenge.termId}?mode=daily&difficulty=${challenge.difficulty}`)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "text-green-400"
      case "NORMAL":
        return "text-yellow-400"
      case "HARD":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-500/20 border-green-500/30"
      case "NORMAL":
        return "bg-yellow-500/20 border-yellow-500/30"
      case "HARD":
        return "bg-red-500/20 border-red-500/30"
      default:
        return "bg-gray-500/20 border-gray-500/30"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
          <p className="text-gray-400 mt-4">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar className="w-10 h-10 text-cyan-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              デイリーチャレンジ
            </h1>
          </div>
          <p className="text-gray-400">毎日新しいチャレンジに挑戦しよう</p>
        </div>

        {challenge && (
          <div className="space-y-6">
            {/* Challenge Card */}
            <div className="relative rounded-3xl p-[2px] bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 shadow-[0_0_60px_rgba(0,255,255,0.3)]">
              <div className="rounded-3xl bg-[#0f1117] p-8">
                {/* Challenge Status */}
                {userChallenge?.completed && (
                  <div className="absolute top-4 right-4">
                    {userChallenge.success ? (
                      <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
                        <Trophy className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 font-bold">完了</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full">
                        <Target className="w-5 h-5 text-red-400" />
                        <span className="text-red-400 font-bold">挑戦済み</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Date */}
                <div className="flex items-center gap-2 mb-4">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <span className="text-gray-400">
                    {new Date(challenge.date).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {/* Term */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-gray-400">今日の用語</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${getDifficultyBg(
                        challenge.difficulty
                      )} ${getDifficultyColor(challenge.difficulty)}`}
                    >
                      {challenge.difficulty}
                    </span>
                  </div>
                  <h2 className="text-5xl font-bold text-white mb-2">
                    {challenge.term.word}
                  </h2>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="px-3 py-1 bg-white/5 rounded-full text-sm">
                      {challenge.term.category}
                    </span>
                    {challenge.term.subcategory && (
                      <span className="px-3 py-1 bg-white/5 rounded-full text-sm">
                        {challenge.term.subcategory}
                      </span>
                    )}
                  </div>
                </div>

                {/* Challenge Info */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-cyan-400">+100</div>
                    <div className="text-xs text-gray-400">ボーナスXP</div>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">1回</div>
                    <div className="text-xs text-gray-400">チャンス</div>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">24時間</div>
                    <div className="text-xs text-gray-400">制限時間</div>
                  </div>
                </div>

                {/* Action Button */}
                {!userChallenge?.completed ? (
                  <button
                    onClick={handleStartChallenge}
                    className="w-full h-14 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white text-lg font-bold rounded-full transition-all hover:scale-105 shadow-lg shadow-cyan-500/50"
                  >
                    {session ? "チャレンジを開始" : "ログインしてチャレンジ"}
                  </button>
                ) : (
                  <div className="text-center p-6 bg-white/5 rounded-xl">
                    <p className="text-gray-400">
                      {userChallenge.success
                        ? "おめでとうございます！今日のチャレンジをクリアしました！"
                        : "今日のチャレンジは終了しました。明日また挑戦してください。"}
                    </p>
                    {userChallenge.score && (
                      <div className="mt-4">
                        <span className="text-3xl font-bold text-cyan-400">
                          {Math.round(userChallenge.score * 100)}点
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" />
                チャレンジのヒント
              </h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>デイリーチャレンジは1日1回のみ挑戦できます</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>成功すると通常の2倍のXPを獲得できます</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>連続でクリアするとストリークボーナスがもらえます</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
