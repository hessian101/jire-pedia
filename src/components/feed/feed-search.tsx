"use client"

import { Search, X, ArrowLeft } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface FeedSearchProps {
  onSearch: (query: string) => void
  onClear: () => void
}

export function FeedSearch({ onSearch, onClear }: FeedSearchProps) {
  const [query, setQuery] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const router = useRouter()

  const handleSearch = (value: string) => {
    setQuery(value)
    if (value.trim()) {
      onSearch(value.trim())
    } else {
      onClear()
    }
  }

  const handleClear = () => {
    setQuery("")
    setIsExpanded(false)
    onClear()
  }

  return (
    <>
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="fixed top-6 left-6 z-50 p-3 bg-[#1a1d2e]/90 backdrop-blur-xl border border-cyan-500/30 rounded-full hover:border-cyan-500/50 hover:bg-[#1a1d2e] transition-all shadow-lg"
      >
        <ArrowLeft className="w-5 h-5 text-cyan-400" />
      </button>

      {/* Search Bar */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <div className="pointer-events-auto">
          {!isExpanded ? (
            <button
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#1a1d2e]/90 backdrop-blur-xl border border-cyan-500/30 rounded-full hover:border-cyan-500/50 transition-all shadow-lg"
            >
              <Search className="w-5 h-5 text-cyan-400" />
              <span className="text-gray-400 text-sm">用語を検索...</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1d2e]/95 backdrop-blur-xl border border-cyan-500/30 rounded-full shadow-lg w-96">
              <Search className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="用語を検索..."
                autoFocus
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-gray-500"
              />
              <button
                onClick={handleClear}
                className="flex-shrink-0 p-1 hover:bg-cyan-500/10 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
