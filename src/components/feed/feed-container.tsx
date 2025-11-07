"use client"

import { useState, useMemo, useEffect, useRef, useCallback } from "react"
import { TermCard } from "./term-card"
import { FeedSearch } from "./feed-search"
import { Loader2 } from "lucide-react"

interface Term {
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

interface FeedContainerProps {
  initialTerms: Term[]
}

export function FeedContainer({ initialTerms }: FeedContainerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [terms, setTerms] = useState<Term[]>(initialTerms)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [cursor, setCursor] = useState<string | undefined>(
    initialTerms[initialTerms.length - 1]?.id
  )

  const observerTarget = useRef<HTMLDivElement>(null)

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore || searchQuery) return

    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/feed?cursor=${cursor}&limit=10`
      )
      const data = await response.json()

      if (data.terms && data.terms.length > 0) {
        setTerms((prev) => [...prev, ...data.terms])
        setCursor(data.nextCursor)
        setHasMore(data.hasMore)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Error loading more terms:", error)
    } finally {
      setIsLoading(false)
    }
  }, [cursor, isLoading, hasMore, searchQuery])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [loadMore, hasMore, isLoading])

  const filteredTerms = useMemo(() => {
    if (!searchQuery) return terms

    const query = searchQuery.toLowerCase()
    return terms.filter((term) => {
      return (
        term.word.toLowerCase().includes(query) ||
        term.category.toLowerCase().includes(query) ||
        term.subcategory?.toLowerCase().includes(query) ||
        term.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        term.officialDef.toLowerCase().includes(query)
      )
    })
  }, [terms, searchQuery])

  return (
    <>
      <FeedSearch
        onSearch={setSearchQuery}
        onClear={() => setSearchQuery("")}
      />
      <div className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar">
        {filteredTerms.length > 0 ? (
          <>
            {filteredTerms.map((term) => (
              <TermCard key={term.id} term={term} />
            ))}
            {/* Loading trigger and indicator */}
            {!searchQuery && (
              <div ref={observerTarget} className="h-screen snap-start flex items-center justify-center">
                {isLoading ? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                    <p className="text-gray-400">読み込み中...</p>
                  </div>
                ) : hasMore ? (
                  <div className="text-gray-500">スクロールして次の用語を読み込む</div>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-xl font-bold text-gray-400">
                      すべての用語を表示しました
                    </p>
                    <p className="text-gray-500">
                      また後で戻ってきてください
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
              <p className="text-2xl font-bold text-gray-400">
                検索結果がありません
              </p>
              <p className="text-gray-500">
                別のキーワードで検索してみてください
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
