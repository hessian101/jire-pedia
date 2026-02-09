"use client"

import { Flame, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export function TrendingWords() {
  const trendingTerms = [
    {
      id: '1',
      name: '睡眠薬',
      attempts: 456,
      rank: 1,
    },
    {
      id: '2',
      name: '三権分立',
      attempts: 234,
      rank: 2,
    },
    {
      id: '3',
      name: '電脳所',
      attempts: 189,
      rank: 3,
    },
    {
      id: '4',
      name: '量子もつれ',
      attempts: 150,
      rank: 4,
    },
    {
      id: '5',
      name: 'シュレディンガーの猫',
      attempts: 120,
      rank: 5,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp className="w-5 h-5 text-cyan-400" />
        <h2 className="text-lg font-semibold text-white">Trending Words</h2>
      </div>

      <div className="grid gap-2">
        {trendingTerms.map((term) => (
          <Link
            key={term.id}
            href={`/dictionary/${term.id}`}
            className="group relative flex items-center gap-3 p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300"
          >
            <div className={`
              flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
              ${term.rank <= 3 ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-800 text-gray-400'}
            `}>
              {term.rank}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-200 group-hover:text-cyan-400 transition-colors truncate">
                {term.name}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-gray-500">
                <Flame className="w-3 h-3 text-orange-400" />
                <span>{term.attempts} attempts</span>
              </div>
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-1/2 -translate-y-1/2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
