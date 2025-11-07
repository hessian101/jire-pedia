"use client"

import { Flame } from 'lucide-react'
import Link from 'next/link'

export function TrendingWords() {
  const trendingTerms = [
    {
      id: '1',
      name: '睡眠薬',
      attempts: 456,
    },
    {
      id: '2',
      name: '三権分立',
      attempts: 234,
    },
    {
      id: '3',
      name: '電脳所',
      attempts: 189,
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-lg text-gray-300">Trending Words</h2>
      <div className="space-y-3">
        {trendingTerms.map((term) => (
          <Link
            key={term.id}
            href={`/dictionary/${term.id}`}
            className="w-full flex items-center gap-3 p-3 rounded-lg border border-cyan-500/20 bg-[#1a1d2e]/50 hover:bg-[#1a1d2e] hover:border-cyan-500/40 transition-all text-left group"
          >
            <Flame className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white group-hover:text-cyan-400 transition-colors truncate">
                {term.name}
              </div>
              <div className="text-xs text-gray-500">({term.attempts})</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
