import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Crown, Search, Bell, User, Heart, Share2, ThumbsUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import type { Term } from '../App';

interface TermPageProps {
  term: Term;
  onBack: () => void;
  onStartGame: (term: Term) => void;
}

export function TermPage({ term, onBack, onStartGame }: TermPageProps) {
  const [liked, setLiked] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Normal' | 'Hard'>('Normal');
  const throneCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = throneCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    let rotation = 0;
    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      const centerX = canvas.offsetWidth / 2;
      const centerY = canvas.offsetHeight / 2;
      const radius = Math.min(canvas.offsetWidth, canvas.offsetHeight) * 0.3;

      // 光のリング
      for (let i = 0; i < 3; i++) {
        const r = radius + i * 10;
        const alpha = 0.3 - i * 0.1;

        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 215, 0, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // 回転する粒子
      for (let i = 0; i < 8; i++) {
        const angle = (rotation + (i * Math.PI * 2) / 8) % (Math.PI * 2);
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
      }

      rotation += 0.01;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, []);

  const communityPosts = {
    Easy: [
      {
        id: '1',
        author: 'EasyExplainer',
        description: '緑色の生き物が太陽の力を借りて、空気中の気体と水から栄養を作り出す仕組み。',
        score: 92,
        likes: 234,
      },
      {
        id: '2',
        author: 'SimpleScience',
        description: '葉っぱが日光を浴びて、二酸化炭素を吸って酸素を出しながら、栄養を作る過程。',
        score: 88,
        likes: 187,
      },
    ],
    Normal: [
      {
        id: '3',
        author: 'BioMaster',
        description: '葉緑体の中で太陽エネルギーを化学エネルギーに変換し、糖を合成する反応。',
        score: 95,
        likes: 312,
      },
      {
        id: '4',
        author: 'ScienceNerd',
        description: 'CO2とH2Oから、日光のエネルギーを使って有機物とO2を生成するプロセス。',
        score: 91,
        likes: 245,
      },
    ],
    Hard: [
      {
        id: '5',
        author: 'AdvancedBio',
        description: 'カルビン回路と光化学反応を含む、炭素固定と還元の一連の生化学的プロセス。',
        score: 98,
        likes: 456,
      },
      {
        id: '6',
        author: 'PhotosynthesisPro',
        description: 'チラコイド膜での光化学反応とストロマでの暗反応から成る、ATP合成を伴う代謝経路。',
        score: 96,
        likes: 389,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#0f1117] pb-24">
      {/* Header */}
      <header className="border-b border-cyan-500/20 bg-[#0f1117]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg">Jire-pedia</h1>
              <span className="text-sm text-gray-400 ml-4">{term.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-full transition-colors">
              <User className="w-5 h-5" />
              <span className="text-sm">花子</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-[1fr_2fr] gap-8">
          {/* Left Column - Term Info */}
          <div className="space-y-6">
            {/* Term Card */}
            <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-6 text-center space-y-4">
              <h2 className="text-5xl">光合成</h2>
              <div className="text-lg text-gray-400">(Photosynthesis)</div>
              <div className="text-sm text-gray-500">Category: 理系 &gt; 生物</div>
              
              <div className="pt-4 space-y-2">
                <div className="text-sm text-gray-400">Attempt Rate</div>
                <div className="text-3xl text-cyan-400">{term.attempts || 1247}</div>
              </div>
              
              <div className="pt-2">
                <div className="text-sm text-gray-400 mb-2">Success Rate</div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    style={{ width: `${term.successRate}%` }}
                  />
                </div>
                <div className="text-xl text-cyan-400 mt-2">{term.successRate}%</div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => onStartGame(term)}
                className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-xl transition-all hover:scale-105 shadow-lg hover:shadow-cyan-500/50"
              >
                CHALLENGE START
              </button>
              <button className="w-full px-6 py-3 bg-[#1a1d2e]/50 hover:bg-[#1a1d2e] border border-cyan-500/20 hover:border-cyan-500/40 text-white rounded-xl transition-all">
                Contribute
              </button>
            </div>
          </div>

          {/* Right Column - Throne & Community */}
          <div className="space-y-6">
            {/* Throne Explanation */}
            <div className="relative rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 overflow-hidden">
              <canvas
                ref={throneCanvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />
              <div className="relative p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Crown className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-xl text-yellow-400">王座の説明</h3>
                  <div className="ml-auto text-2xl text-yellow-400">98点</div>
                </div>
                <p className="text-lg leading-relaxed">
                  葉緑体の中で太陽エネルギーを化学エネルギーに変換し、二酸化炭素と水から有機物を合成する、生命を支える最も重要な生化学反応。明反応と暗反応の2段階で進行し、酸素を副産物として放出する。
                </p>
                <div className="flex items-center justify-between text-sm text-gray-400 pt-2">
                  <span>保持者: @PhotosynthesisPro</span>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setLiked(!liked)}
                      className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${liked ? 'fill-cyan-400 text-cyan-400' : ''}`} />
                      <span>456</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Definition */}
            <div className="rounded-2xl border border-cyan-500/20 bg-[#1a1d2e]/50 p-6 space-y-4">
              <h3 className="text-lg text-cyan-400">お手本（公式定義）</h3>
              <p className="leading-relaxed text-gray-300">
                {term.officialDefinition}
              </p>
            </div>

            {/* Community Posts */}
            <div className="rounded-2xl border border-cyan-500/20 bg-[#1a1d2e]/50 p-6 space-y-4">
              <h3 className="text-lg text-gray-300">コミュニティの説明</h3>
              
              <Tabs value={selectedDifficulty} onValueChange={(v) => setSelectedDifficulty(v as any)}>
                <TabsList className="grid w-full grid-cols-3 bg-[#0f1117]">
                  <TabsTrigger value="Easy" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
                    Easy
                  </TabsTrigger>
                  <TabsTrigger value="Normal" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
                    Normal
                  </TabsTrigger>
                  <TabsTrigger value="Hard" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
                    Hard
                  </TabsTrigger>
                </TabsList>
                
                {(['Easy', 'Normal', 'Hard'] as const).map((difficulty) => (
                  <TabsContent key={difficulty} value={difficulty} className="space-y-3 mt-4">
                    {communityPosts[difficulty].map((post) => (
                      <div
                        key={post.id}
                        className="rounded-xl border border-cyan-500/10 bg-[#0f1117]/50 p-4 space-y-3 hover:border-cyan-500/30 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">@{post.author}</span>
                          <span className="text-sm text-cyan-400">{post.score}点</span>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-300">{post.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{post.likes}</span>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
