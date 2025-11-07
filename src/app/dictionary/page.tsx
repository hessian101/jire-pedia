import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { FileText, Target } from "lucide-react"

export default async function DictionaryPage() {
  const terms = await prisma.term.findMany({
    orderBy: { word: "asc" },
    include: {
      _count: {
        select: {
          entries: true,
          attempts: true,
        },
      },
    },
  })

  // カテゴリごとにグループ化
  const termsByCategory = terms.reduce((acc, term) => {
    if (!acc[term.category]) {
      acc[term.category] = []
    }
    acc[term.category].push(term)
    return acc
  }, {} as Record<string, typeof terms>)

  return (
    <div className="min-h-screen pb-40 py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            用語辞書
          </h1>
          <p className="text-gray-400">
            みんなで作る、最もわかりやすい用語辞書
          </p>
        </div>

        <div className="space-y-8">
          {Object.entries(termsByCategory).map(([category, categoryTerms]) => (
            <div key={category}>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">{category}</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categoryTerms.map((term) => (
                  <Link key={term.id} href={`/dictionary/${term.id}`}>
                    <div className="h-full p-6 rounded-2xl border border-cyan-500/20 bg-[#1a1d2e]/50 hover:bg-[#1a1d2e] hover:border-cyan-500/40 transition-all cursor-pointer space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                          {term.word}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {term.subcategory && `${term.subcategory} • `}
                          {term.tags.slice(0, 2).join(", ")}
                        </p>
                      </div>
                      <p className="text-sm text-gray-300 line-clamp-2">
                        {term.officialDef}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {term._count.entries}件の説明
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {term._count.attempts}回挑戦
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
