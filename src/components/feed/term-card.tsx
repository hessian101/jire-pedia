"use client"

import { Crown, TrendingUp, Target, Heart, MessageCircle, Share2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

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

  const crownEntry = term.entries.find(e => e.isCrown)
  const bestEntry = crownEntry || term.entries[0]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-400"
      case "normal": return "text-yellow-400"
      default: return "text-red-400"
    }
  }

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(prev => liked ? prev - 1 : prev + 1)
  }

  return (
    <div className="relative w-full h-screen snap-start flex items-center justify-center p-6">
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

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{bestEntry.user.name}</span>
                  <span>•</span>
                  <span>Lv.{bestEntry.user.level}</span>
                  <span>{bestEntry.user.rank}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`flex items-center gap-1 text-sm ${getDifficultyColor(bestEntry.difficulty)}`}>
                    <TrendingUp className="w-4 h-4" />
                    {bestEntry.confidence}%
                  </span>
                  {crownEntry && crownEntry.crownDays && (
                    <span className="text-sm text-yellow-400">
                      {crownEntry.crownDays}日間王座
                    </span>
                  )}
                </div>
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

        {/* Fixed Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#1a1d2e] via-[#1a1d2e]/95 to-transparent">
          <div className="flex items-center justify-between mb-4">
            {/* Interaction Buttons */}
            <div className="flex items-center gap-6">
              <button
                onClick={handleLike}
                className="flex flex-col items-center gap-1 transition-transform hover:scale-110"
              >
                <Heart className={`w-7 h-7 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                <span className="text-xs text-gray-400">{likeCount}</span>
              </button>

              <button className="flex flex-col items-center gap-1 transition-transform hover:scale-110">
                <MessageCircle className="w-7 h-7 text-gray-400" />
                <span className="text-xs text-gray-400">0</span>
              </button>

              <button className="flex flex-col items-center gap-1 transition-transform hover:scale-110">
                <Share2 className="w-7 h-7 text-gray-400" />
              </button>
            </div>

            {/* Action Button */}
            <Link
              href={`/play/${term.id}`}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-full transition-all hover:scale-105 shadow-lg hover:shadow-cyan-500/50 font-medium"
            >
              挑戦を開始
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500 text-sm animate-bounce">
        ↓ スワイプして次へ
      </div>
    </div>
  )
}
