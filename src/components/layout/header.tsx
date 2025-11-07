"use client"

import Link from "next/link"
import { UserNav } from "./user-nav"
import { Bell, Search } from "lucide-react"
import { Session } from "next-auth"

interface HeaderProps {
  session: Session | null
}

export function Header({ session }: HeaderProps) {

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-[#0f1117]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-blue-400 transition-all">
              Jire-pedia
            </span>
          </Link>

          {session && (
            <nav className="hidden md:flex gap-6">
              <Link
                href="/play/select"
                className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors"
              >
                プレイ
              </Link>
              <Link
                href="/dictionary"
                className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors"
              >
                辞書
              </Link>
              <Link
                href="/profile"
                className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors"
              >
                プロフィール
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <Search className="w-5 h-5 text-gray-300" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors relative">
                <Bell className="w-5 h-5 text-gray-300" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF3366] rounded-full"></span>
              </button>
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
    </header>
  )
}
