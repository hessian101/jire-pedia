import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section with Glassmorphism */}
        <section className="relative rounded-3xl border border-cyan-500/30 bg-[#1a1d2e]/50 overflow-hidden shadow-[0_0_50px_rgba(0,255,255,0.15)] backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10"></div>

          <div className="relative z-10 px-8 py-20 md:py-32 text-center space-y-8">
            <div className="space-y-4">
              <div className="text-sm tracking-wider text-cyan-400 uppercase font-medium">
                Welcome to Jire-pedia
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                AIを攻略する
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  説明力ゲーム
                </span>
              </h1>
              <p className="mx-auto max-w-[700px] text-lg md:text-xl text-gray-300 leading-relaxed">
                専門用語を「その言葉を使わずに」説明し、AIに推測させよう。
                <br />
                成功した説明は、みんなで作る最高の辞書になる。
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link
                href="/register"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white text-lg font-medium rounded-full transition-all hover:scale-105 shadow-lg hover:shadow-cyan-500/50"
              >
                無料で始める
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border-2 border-cyan-500/50 hover:border-cyan-500 text-white text-lg font-medium rounded-full transition-all backdrop-blur-sm"
              >
                ログイン
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="group p-8 rounded-2xl border border-cyan-500/20 bg-[#1a1d2e]/30 hover:bg-[#1a1d2e]/50 hover:border-cyan-500/40 transition-all backdrop-blur-sm">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-cyan-400">説明力を鍛える</h3>
              <p className="text-gray-400 leading-relaxed">
                NGワードを避けながら、わかりやすく説明する力が身につきます。
              </p>
            </div>
          </div>

          <div className="group p-8 rounded-2xl border border-cyan-500/20 bg-[#1a1d2e]/30 hover:bg-[#1a1d2e]/50 hover:border-cyan-500/40 transition-all backdrop-blur-sm">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-purple-400">AIと対戦</h3>
              <p className="text-gray-400 leading-relaxed">
                あなたの説明をAIが推測。難易度を上げて挑戦しよう。
              </p>
            </div>
          </div>

          <div className="group p-8 rounded-2xl border border-cyan-500/20 bg-[#1a1d2e]/30 hover:bg-[#1a1d2e]/50 hover:border-cyan-500/40 transition-all backdrop-blur-sm">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-blue-400">辞書を作る</h3>
              <p className="text-gray-400 leading-relaxed">
                成功した説明が辞書に。みんなで最高の説明を作り上げよう。
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
