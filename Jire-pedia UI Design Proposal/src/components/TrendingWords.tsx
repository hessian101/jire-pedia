import { Flame } from 'lucide-react';
import type { Term } from '../App';

interface TrendingWordsProps {
  onNavigateToTerm: (term: Term) => void;
}

export function TrendingWords({ onNavigateToTerm }: TrendingWordsProps) {
  const trendingTerms: Term[] = [
    {
      id: '1',
      name: '睡眠薬',
      category: '医学',
      officialDefinition: '睡眠を促進するために使用される薬物。',
      attempts: 456,
      successRate: 38,
      trending: true,
    },
    {
      id: '2',
      name: '三権分立',
      category: '政治',
      officialDefinition: '立法・行政・司法の三つの権力が相互に抑制し合う政治システム。',
      attempts: 234,
      successRate: 42,
      trending: true,
    },
    {
      id: '3',
      name: '電脳所',
      category: '技術',
      officialDefinition: 'コンピュータネットワークの中心となる施設。',
      attempts: 189,
      successRate: 35,
      trending: true,
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg text-gray-300">Trending Words</h2>
      <div className="space-y-3">
        {trendingTerms.map((term) => (
          <button
            key={term.id}
            onClick={() => onNavigateToTerm(term)}
            className="w-full flex items-center gap-3 p-3 rounded-lg border border-cyan-500/20 bg-[#1a1d2e]/50 hover:bg-[#1a1d2e] hover:border-cyan-500/40 transition-all text-left group"
          >
            <Flame className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white group-hover:text-cyan-400 transition-colors truncate">
                {term.name}
              </div>
              <div className="text-xs text-gray-500">({term.attempts})</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
