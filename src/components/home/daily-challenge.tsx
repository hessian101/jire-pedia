'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Trophy } from 'lucide-react'
import { MotionButton } from '@/components/ui/motion-button'
import { runSingleBurst } from '@/lib/confetti'

export function DailyChallenge() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      color: string
      alpha: number
    }> = []

    // Create particles with cyan and purple colors
    for (let i = 0; i < 150; i++) {
      const isCyan = Math.random() > 0.5
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 3 + 1,
        color: isCyan ? '#00ffff' : '#ff00ff',
        alpha: Math.random() * 0.6 + 0.2,
      })
    }

    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.offsetWidth) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.offsetHeight) particle.vy *= -1

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color + Math.floor(particle.alpha * 255).toString(16).padStart(2, '0')
        ctx.fill()

        // Add glow effect
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 3
        )
        gradient.addColorStop(0, particle.color + '40')
        gradient.addColorStop(1, particle.color + '00')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <div className="relative group rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-[#1a1d2e]/80 to-[#0f111a]/80 overflow-hidden shadow-[0_0_40px_rgba(0,255,255,0.15)] hover:shadow-[0_0_60px_rgba(0,255,255,0.25)] transition-all duration-500 h-[600px] flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-60"
      />

      {/* Overlay Gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-transparent to-transparent opacity-80" />

      <div className="relative z-10 p-8 md:p-12 text-center space-y-8 max-w-2xl mx-auto">

        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-md cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => runSingleBurst()}
        >
          <Trophy className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-semibold tracking-wider text-cyan-400 uppercase">Daily Challenge</span>
        </div>

        <div className="space-y-4">
          <h2 className="text-6xl md:text-7xl font-bold text-white tracking-tight drop-shadow-lg">
            光合成
          </h2>
          <div className="text-2xl md:text-3xl text-gray-400 font-light tracking-wide font-serif italic">
            (Photosynthesis)
          </div>
        </div>

        <div className="text-gray-400 text-sm md:text-base bg-white/5 inline-block px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
          Category: <span className="text-cyan-300">理系</span> &gt; <span className="text-cyan-300">生物</span>
        </div>

        <div className="pt-4">
          <Link href="/play/select">
            <MotionButton
              size="lg"
              className="group/btn relative inline-flex items-center gap-3 px-10 py-8 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full transition-all shadow-xl hover:shadow-cyan-500/50 font-bold text-lg overflow-hidden border-0"
            >
              <span className="relative z-10">今すぐ挑戦する</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover/btn:translate-x-1 transition-transform" />

              {/* Button Shine Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
            </MotionButton>
          </Link>
          <p className="mt-4 text-xs text-gray-500">
            残り時間: 12時間 34分
          </p>
        </div>
      </div>
    </div>
  )
}
