import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, Bell, User } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import type { Term } from '../App';

interface GamePlayProps {
  term: Term;
  onBack: () => void;
  onComplete: (term: Term) => void;
}

type Difficulty = 'Easy' | 'Normal' | 'Hard';

export function GamePlay({ term, onBack, onComplete }: GamePlayProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('Normal');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ngWords, setNgWords] = useState<string[]>([]);
  const [detectedNgWords, setDetectedNgWords] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // NGワードの設定（難易度による）
    if (difficulty === 'Easy') {
      setNgWords(['植物', '光', 'オシエポー']);
    } else if (difficulty === 'Normal') {
      setNgWords(['植物', '光', 'オシエポー', '葉', '緑']);
    } else {
      setNgWords(['植物', '光', 'オシエポー', '葉', '緑', '太陽', 'エネルギー']);
    }
  }, [difficulty, term.name]);

  useEffect(() => {
    // リアルタイムNGワードチェック
    const detected: string[] = [];
    ngWords.forEach((word) => {
      if (description.includes(word)) {
        detected.push(word);
      }
    });
    setDetectedNgWords(detected);
  }, [description, ngWords]);

  const handleSubmit = async () => {
    if (detectedNgWords.length > 0) {
      toast.error('NGワードが含まれています');
      return;
    }

    if (description.length < 10) {
      toast.error('もう少し詳しく説明してください（最低10文字）');
      return;
    }

    setIsSubmitting(true);

    // AI判定のシミュレーション
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // ランダムなスコアを生成（実際のAI判定の代わり）
    const score = Math.floor(Math.random() * 30) + 70;
    const success = score >= 80;

    setIsSubmitting(false);

    if (success) {
      showSuccessAnimation();
      toast.success(`成功！AIの確信度: ${score}%`);
      setTimeout(() => {
        onComplete({ ...term, throneScore: score });
      }, 2000);
    } else {
      toast.error(`惜しい！AIの確信度: ${score}% (80%以上で成功)`);
    }
  };

  const showSuccessAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
    }> = [];

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10 - 5,
        life: 1,
        color: Math.random() > 0.5 ? '#00ffff' : '#ff00ff',
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.2; // gravity
        particle.life -= 0.02;

        if (particle.life > 0) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = particle.color + Math.floor(particle.life * 255).toString(16).padStart(2, '0');
          ctx.fill();
        } else {
          particles.splice(index, 1);
        }
      });

      if (particles.length > 0) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animate();
  };

  const difficultyConfig = {
    Easy: { color: 'border-green-500 bg-green-500/20 text-green-400', activeColor: 'bg-green-500' },
    Normal: { color: 'border-blue-500 bg-blue-500/20 text-blue-400', activeColor: 'bg-blue-500' },
    Hard: { color: 'border-red-500 bg-red-500/20 text-red-400', activeColor: 'bg-red-500' },
  };

  return (
    <div className="min-h-screen bg-[#0f1117] pb-24">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50"
      />

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-lg">AIが推測中...</p>
            <p className="text-sm text-gray-400">あなたの説明を分析しています</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-cyan-500/20 bg-[#0f1117]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg">Jire-pedia</h1>
              <span className="text-sm text-gray-400 ml-4">じれったいミッション</span>
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
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-[1fr_1.5fr_1fr] gap-6">
          {/* Left Column - Daily Challenge + Difficulty */}
          <div className="space-y-6">
            {/* Daily Challenge Card */}
            <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-6 text-center space-y-3">
              <div className="text-xs tracking-wider text-gray-400 uppercase">Daily Challenge</div>
              <h2 className="text-4xl">光合成</h2>
              <div className="text-sm text-gray-400">(Photoshyesis)</div>
              <div className="text-xs text-gray-500">Category: 理系 &gt; 生物</div>
            </div>

            {/* Difficulty Selection */}
            <div className="space-y-3">
              {(['Easy', 'Normal', 'Hard'] as Difficulty[]).map((d) => {
                const isActive = difficulty === d;
                const config = difficultyConfig[d];
                return (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`w-full py-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                      isActive ? config.color : 'bg-[#1a1d2e]/50 border-gray-700 text-gray-400'
                    }`}
                  >
                    <span>{d}</span>
                    {isActive && (
                      <div className={`w-4 h-4 rounded-full ${config.activeColor}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center Column - Text Area */}
          <div className="space-y-4">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ここに説明を入力してください..."
              className="min-h-[400px] bg-[#1a1d2e]/50 border-cyan-500/20 focus:border-cyan-500/50 resize-none text-base"
              maxLength={500}
            />
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>{description.length} / 500</span>
              {detectedNgWords.length > 0 && (
                <span className="text-red-400">NGワード検出: {detectedNgWords.join(', ')}</span>
              )}
            </div>
          </div>

          {/* Right Column - NG Words + Submit */}
          <div className="space-y-6">
            {/* NG Words */}
            <div className="space-y-3">
              <h3 className="text-sm text-gray-400">NG Words</h3>
              <div className="space-y-2">
                {ngWords.map((word) => (
                  <div
                    key={word}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      detectedNgWords.includes(word)
                        ? 'border-red-500 bg-red-500/20 text-red-400'
                        : 'border-gray-700 bg-[#1a1d2e]/50 text-gray-400'
                    }`}
                  >
                    {word}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={detectedNgWords.length > 0 || description.length < 10}
              className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl transition-all hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-cyan-500/50 disabled:shadow-none"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
