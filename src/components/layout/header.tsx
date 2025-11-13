"use client"

import { useState } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { UserNav } from "./user-nav"
import { Search } from "lucide-react"
import { Session } from "next-auth"
import { NotificationCenter } from "../notifications/notification-center"

// Dynamically import KnowledgeSphere with SSR disabled to avoid Three.js SSR issues
const KnowledgeSphere = dynamic(
  () => import("../common/KnowledgeSphere").then((mod) => mod.KnowledgeSphere),
  { ssr: false }
)

interface HeaderProps {
  session: Session | null
}

export function Header({ session }: HeaderProps) {
  const [showSphere, setShowSphere] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-[#0f1117]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left section - Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-blue-400 transition-all">
                Jire-pedia
              </span>
            </Link>
          </div>

          {/* Center section - Navigation with emphasized Dictionary link */}
          {session && (
            <nav className="hidden md:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
              <Link
                href="/play/select"
                className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors"
              >
                プレイ
              </Link>
              <Link
                href="/daily-challenge"
                className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors"
              >
                デイリー
              </Link>

              {/* Enhanced Dictionary Link with KnowledgeSphere */}
              <div
                className="relative"
                onMouseEnter={() => setShowSphere(true)}
                onMouseLeave={() => setShowSphere(false)}
              >
                <Link
                  href="/dictionary"
                  className="dictionary-link text-cyan-300 hover:text-cyan-100"
                >
                  辞書
                </Link>

                {/* Knowledge Sphere appears on hover */}
                {showSphere && <KnowledgeSphere />}
              </div>

              <Link
                href="/leaderboard"
                className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors"
              >
                ランキング
              </Link>
              <Link
                href="/profile"
                className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors"
              >
                プロフィール
              </Link>
            </nav>
          )}

          {/* Right section - User controls */}
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <Search className="w-5 h-5 text-gray-300" />
                </button>
                <NotificationCenter />
                <UserNav user={session.user} />
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  className="px-6 py-2 text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors"
                >
                  ログイン
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white text-sm font-medium rounded-full transition-all hover:scale-105"
                >
                  新規登録
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
