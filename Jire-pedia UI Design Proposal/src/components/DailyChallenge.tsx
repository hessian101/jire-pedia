import { useEffect, useRef } from 'react';
import type { Term } from '../App';

interface DailyChallengeProps {
  onStartGame: (term: Term) => void;
}

export function DailyChallenge({ onStartGame }: DailyChallengeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
    }> = [];

    // Create particles with cyan and purple colors
    for (let i = 0; i < 150; i++) {
      const isCyan = Math.random() > 0.5;
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 3 + 1,
        color: isCyan ? '#00ffff' : '#ff00ff',
        alpha: Math.random() * 0.6 + 0.2,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.offsetWidth) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.offsetHeight) particle.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + Math.floor(particle.alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();

        // Add glow effect
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 3
        );
        gradient.addColorStop(0, particle.color + '40');
        gradient.addColorStop(1, particle.color + '00');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, []);

  const dailyTerm: Term = {
    id: 'daily-1',
    name: '光合成',
    category: '理系 > 生物',
    officialDefinition: '植物が光エネルギーを使って二酸化炭素と水から有機物を合成する過程。',
    attempts: 1247,
    successRate: 42,
    trending: true,
  };

  return (
    <div className="relative rounded-2xl border border-cyan-500/30 bg-[#1a1d2e]/50 overflow-hidden shadow-[0_0_30px_rgba(0,255,255,0.1)]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      <div className="relative z-10 p-12 text-center space-y-6">
        <div className="space-y-2">
          <div className="text-sm tracking-wider text-cyan-400 uppercase">Daily Challenge</div>
          <h2 className="text-5xl">光合成</h2>
          <div className="text-lg text-gray-400">(Photoshythesis)</div>
        </div>

        <div className="text-sm text-gray-400">
          Category: {dailyTerm.category}
        </div>

        <button
          onClick={() => onStartGame(dailyTerm)}
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-full transition-all hover:scale-105 shadow-lg hover:shadow-cyan-500/50"
        >
          CHALLENGE START
        </button>
      </div>
    </div>
  );
}
