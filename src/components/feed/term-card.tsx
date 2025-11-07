"use client"

import { Crown, TrendingUp, Target, Heart, MessageCircle, Share2, Swords } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

interface TermCardProps {
  term: {
    id: string
    word: string
    category: string
    subcategory?: string | null
    officialDef: string
    tags: string[]
    entries: Array<{
      id: string
      explanation: string
      confidence: number
      difficulty: string
      isCrown: boolean
      crownDays?: number | null
      user: {
        name: string
        level: number
        rank: string
      }
      _count?: {
        likes?: number
      }
    }>
    _count: {
      attempts: number
      entries: number
    }
  }
}

export function TermCard({ term }: TermCardProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const crownEntry = term.entries.find(e => e.isCrown)
  const bestEntry = crownEntry || term.entries[0]

  const getDifficultyInfo = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return { color: "bg-green-400", width: "33%", label: "初級" }
      case "normal":
        return { color: "bg-yellow-400", width: "66%", label: "中級" }
      case "hard":
        return { color: "bg-red-400", width: "100%", label: "上級" }
      default:
        return { color: "bg-gray-400", width: "50%", label: difficulty }
    }
  }

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(prev => liked ? prev - 1 : prev + 1)
  }

  return (
    <div className={`relative w-full h-screen snap-start flex items-center justify-center p-6 pb-24 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f1117] via-[#1a1d2e] to-[#0f1117]" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-2xl h-[85vh] rounded-3xl border-2 border-cyan-500/30 bg-[#1a1d2e]/80 backdrop-blur-xl overflow-hidden shadow-[0_0_60px_rgba(0,255,255,0.2)]">

        {/* Header */}
        <div className="p-8 pb-6 space-y-4">
          {/* Category Badge */}
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400">
              {term.category}
              {term.subcategory && ` > ${term.subcategory}`}
            </span>
          </div>

          {/* Term Title */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {term.word}
              </h1>
              {crownEntry && (
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm text-yellow-400 font-medium">王座</span>
                </div>
              )}
            </div>

            {/* Tags */}
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
        </div>

        {/* Content Area - Scrollable */}
        <div className="px-8 pb-8 h-[calc(85vh-280px)] overflow-y-auto custom-scrollbar">
          {/* Official Definition */}
          <div className="mb-6 p-4 rounded-xl bg-[#0f1117]/50 border border-cyan-500/20">
            <h3 className="text-sm text-cyan-400 mb-2">公式定義</h3>
            <p className="text-gray-300 leading-relaxed">{term.officialDef}</p>
          </div>

          {/* Best Explanation */}
          {bestEntry && (
            <div className={`p-6 rounded-xl ${
              crownEntry
                ? 'bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-2 border-yellow-500/30'
                : 'bg-[#0f1117]/50 border border-purple-500/20'
            }`}>
              <div className="flex items-center gap-2 mb-4">
                {crownEntry && <Crown className="w-5 h-5 text-yellow-400" />}
                <h3 className={`text-lg font-bold ${crownEntry ? 'text-yellow-400' : 'text-purple-400'}`}>
                  {crownEntry ? '王座の説明' : 'ベスト説明'}
                </h3>
              </div>

              <p className="text-lg text-gray-200 leading-relaxed mb-4">
                {bestEntry.explanation}
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{bestEntry.user.name}</span>
                  <span>•</span>
                  <span>Lv.{bestEntry.user.level}</span>
                  <span>{bestEntry.user.rank}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">難易度: {getDifficultyInfo(bestEntry.difficulty).label}</span>
                    <span className="flex items-center gap-1 text-gray-400">
                      <TrendingUp className="w-4 h-4" />
                      {bestEntry.confidence}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getDifficultyInfo(bestEntry.difficulty).color} transition-all duration-500 rounded-full`}
                      style={{ width: getDifficultyInfo(bestEntry.difficulty).width }}
                    />
                  </div>
                </div>

                {crownEntry && crownEntry.crownDays && (
                  <span className="text-sm text-yellow-400">
                    {crownEntry.crownDays}日間王座
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#0f1117]/50 border border-cyan-500/20 text-center">
              <div className="text-3xl font-bold text-cyan-400">{term._count.entries}</div>
              <div className="text-sm text-gray-400">説明数</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0f1117]/50 border border-cyan-500/20 text-center">
              <div className="text-3xl font-bold text-purple-400">{term._count.attempts}</div>
              <div className="text-sm text-gray-400">挑戦回数</div>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Action Button */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#1a1d2e] via-[#1a1d2e]/95 to-transparent">
          <Link
            href={`/play/${term.id}`}
            className="block w-full text-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-full transition-all hover:scale-105 shadow-lg hover:shadow-cyan-500/50 font-medium"
          >
            挑戦を開始
          </Link>
        </div>
      </div>

      {/* TikTok-style Right Side Action Bar */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-6">
        <button
          onClick={handleLike}
          className="flex flex-col items-center gap-2 transition-all hover:scale-110 active:scale-95 group"
          aria-label="いいね"
        >
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all">
            <Heart className={`w-6 h-6 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-gray-300 group-hover:text-red-400'}`} />
          </div>
          <span className="text-xs text-gray-400 font-medium">{likeCount}</span>
        </button>

        <button
          className="flex flex-col items-center gap-2 transition-all hover:scale-110 active:scale-95 group"
          aria-label="コメント"
        >
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all">
            <MessageCircle className="w-6 h-6 text-gray-300 group-hover:text-blue-400 transition-colors" />
          </div>
          <span className="text-xs text-gray-400 font-medium">0</span>
        </button>

        <button
          className="flex flex-col items-center gap-2 transition-all hover:scale-110 active:scale-95 group"
          aria-label="シェア"
        >
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all">
            <Share2 className="w-6 h-6 text-gray-300 group-hover:text-green-400 transition-colors" />
          </div>
        </button>

        <Link
          href={`/play/${term.id}?mode=challenge`}
          className="flex flex-col items-center gap-2 transition-all hover:scale-110 active:scale-95 group"
          aria-label="チャレンジ"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-blue-500/30 border border-cyan-400/30 transition-all">
            <Swords className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
          </div>
        </Link>
      </div>

      {/* Scroll Hint */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 text-gray-500 text-sm animate-bounce">
        ↓ スワイプして次へ
      </div>
    </div>
  )
}
