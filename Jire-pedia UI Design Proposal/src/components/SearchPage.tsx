import { useState } from 'react';
import { Search, Filter, TrendingUp } from 'lucide-react';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import type { Term } from '../App';

interface SearchPageProps {
  onNavigateToTerm: (term: Term) => void;
}

export function SearchPage({ onNavigateToTerm }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    'すべて',
    'プログラミング',
    'Web開発',
    'データサイエンス',
    'セキュリティ',
    'デザイン',
  ];

  const allTerms: Term[] = [
    {
      id: '1',
      name: 'リファクタリング',
      category: 'プログラミング',
      officialDefinition: 'プログラムの外部から見た動作を変えずに、内部の構造を整理すること。',
      throneHolder: 'RefactorPro',
      throneScore: 96,
      attempts: 1247,
      successRate: 42,
      trending: true,
    },
    {
      id: '2',
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
      id: '3',
      name: 'REST API',
      category: 'Web開発',
      officialDefinition: 'HTTPプロトコルを使用してデータをやり取りするためのアーキテクチャスタイル。',
      throneHolder: 'APIExpert',
      throneScore: 96,
      attempts: 3104,
      successRate: 45,
    },
    {
      id: '4',
      name: '機械学習',
      category: 'データサイエンス',
      officialDefinition: 'データからパターンを学習し、予測や判断を行うコンピュータ技術。',
      attempts: 1876,
      successRate: 28,
    },
    {
      id: '5',
      name: 'XSS攻撃',
      category: 'セキュリティ',
      officialDefinition: 'Webサイトに悪意のあるスクリプトを注入する攻撃手法。',
      throneHolder: 'SecurityNinja',
      throneScore: 94,
      attempts: 982,
      successRate: 35,
    },
  ];

  const filteredTerms = allTerms.filter((term) => {
    const matchesSearch =
      searchQuery === '' ||
      term.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      !selectedCategory ||
      selectedCategory === 'すべて' ||
      term.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-[#1A1A1A]/80 backdrop-blur-xl border-b border-white/10 z-30">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl mb-4">Jire-pedia 検索</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="用語を検索..."
              className="pl-10 bg-white/5 border-white/10 focus:border-[#0077FF]"
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* カテゴリーフィルター */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <h3>カテゴリー</h3>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === category || (!selectedCategory && category === 'すべて')
                    ? 'bg-[#0077FF] text-white'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 結果 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3>{filteredTerms.length}件の用語</h3>
          </div>
          
          {filteredTerms.map((term) => (
            <Card
              key={term.id}
              onClick={() => onNavigateToTerm(term)}
              className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-[#0077FF]/50 transition-all cursor-pointer"
            >
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg">{term.name}</h3>
                      {term.trending && <TrendingUp className="w-4 h-4 text-[#00FF88]" />}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {term.category}
                    </Badge>
                  </div>
                  {term.throneHolder && (
                    <div className="text-right">
                      <div className="text-xs text-[#FFD700]">👑 王座</div>
                      <div className="text-sm">{term.throneScore}点</div>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-400 line-clamp-2">
                  {term.officialDefinition}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>{term.attempts}人が挑戦</span>
                  <span>成功率 {term.successRate}%</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
