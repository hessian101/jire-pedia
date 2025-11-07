import { RegisterForm } from "@/components/auth/register-form"
import Link from "next/link"
import { Sparkles } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 w-full">
        {/* Desktop Layout - 2 columns */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 lg:max-w-6xl lg:mx-auto lg:px-8">
          {/* Left Column - Welcome Message */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Jire-pedia
                </h1>
              </div>
              <h2 className="text-5xl leading-tight font-bold">
                Join Us Today!
              </h2>
              <p className="text-xl text-gray-400 leading-relaxed">
                新しい辞書体験を始めよう。<br />
                あなたの説明力でAIに挑戦！
              </p>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="relative rounded-[3rem] p-[2px] bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 shadow-[0_0_60px_rgba(0,255,255,0.3)]">
                <div className="rounded-[3rem] bg-[#0f1117] p-10">
                  <h2 className="text-3xl text-center mb-8 font-bold">Create Your Account</h2>
                  <RegisterForm />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden max-w-md mx-4 sm:mx-auto">
          <div className="relative rounded-[3rem] p-[2px] bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 shadow-[0_0_60px_rgba(0,255,255,0.3)]">
            <div className="rounded-[3rem] bg-[#0f1117] p-10">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Jire-pedia
                </h1>
              </div>
              <h2 className="text-3xl text-center mb-8 font-bold">Create Your Account</h2>
              <RegisterForm />
            </div>
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center mt-8">
          <span className="text-sm text-gray-400">Already have an account? </span>
          <Link
            href="/login"
            className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors underline"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}
