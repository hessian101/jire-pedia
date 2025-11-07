import { Flame, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import type { Term } from '../App';

interface TrendingTermsProps {
  onNavigateToTerm: (term: Term) => void;
  onStartGame: (term: Term) => void;
}

export function TrendingTerms({ onNavigateToTerm, onStartGame }: TrendingTermsProps) {
  const trendingTerms: Term[] = [
    {
      id: '1',
      name: 'アジャイル開発',
      category: 'ソフトウェア開発',
      officialDefinition: '短い開発サイクルを繰り返し、顧客との対話を重視する開発手法。',
      throneHolder: 'DevMaster_2024',
      throneScore: 98,
      attempts: 2341,
      successRate: 38,
      trending: true,
    },
    {
      id: '2',
      name: 'マルチスレッド',
      category: 'コンピュータサイエンス',
      officialDefinition: '1つのプログラム内で複数の処理を同時に実行する技術。',
      throneHolder: 'CodeNinja',
      throneScore: 95,
      attempts: 1829,
      successRate: 31,
      trending: true,
    },
    {
      id: '3',
      name: 'REST API',
      category: 'Web開発',
      officialDefinition: 'HTTPプロトコルを使用してデータをやり取りするためのアーキテクチャスタイル。',
      throneHolder: 'APIExpert',
      throneScore: 96,
      attempts: 3104,
      successRate: 45,
      trending: true,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Flame className="w-5 h-5 text-[#FF3366]" />
        <h2 className="text-xl">白熱ワード</h2>
      </div>
      
      <div className="space-y-3">
        {trendingTerms.map((term, index) => (
          <Card
            key={term.id}
            className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-[#0077FF]/50 transition-all cursor-pointer hover:scale-[1.02]"
            onClick={() => onNavigateToTerm(term)}
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-[#FF3366]">#{index + 1}</span>
                    <h3 className="text-lg">{term.name}</h3>
                    <TrendingUp className="w-4 h-4 text-[#00FF88]" />
                  </div>
                  <p className="text-sm text-gray-400">{term.category}</p>
                </div>
                {term.throneHolder && (
                  <div className="text-right">
                    <div className="text-xs text-gray-400">王座</div>
                    <div className="text-sm text-[#FFD700]">{term.throneScore}点</div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                <span>{term.attempts}人が挑戦</span>
                <span>成功率 {term.successRate}%</span>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStartGame(term);
                }}
                className="w-full bg-[#0077FF]/20 hover:bg-[#0077FF]/30 text-[#0077FF] py-2 rounded-lg text-sm transition-colors border border-[#0077FF]/30"
              >
                挑戦する
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
