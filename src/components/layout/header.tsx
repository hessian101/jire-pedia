"use client"

import { useState } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { UserNav } from "./user-nav"
import { Search, Menu, ChevronDown, Gamepad2, Flame, Calendar, Book, PlusCircle } from "lucide-react"
import { Session } from "next-auth"
import { NotificationCenter } from "../notifications/notification-center"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-[#0f1117]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left section - Logo */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-gray-400 hover:text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] border-r border-white/10 bg-[#0f1117]">
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-left text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Jire-pedia
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <h4 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Play</h4>
                    <Link
                      href="/play/select"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-2 py-2 text-gray-300 hover:text-cyan-400 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <Gamepad2 className="w-4 h-4" />
                      <span>モード選択</span>
                    </Link>
                    <Link
                      href="/daily-challenge"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-2 py-2 text-gray-300 hover:text-cyan-400 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>デイリーチャレンジ</span>
                    </Link>
                  </div>

                  <div className="space-y-2">
                    <h4 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Learn</h4>
                    <Link
                      href="/dictionary"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-2 py-2 text-gray-300 hover:text-cyan-400 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <Book className="w-4 h-4" />
                      <span>用語辞書</span>
                    </Link>
                    <Link
                      href="/leaderboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-2 py-2 text-gray-300 hover:text-cyan-400 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <Flame className="w-4 h-4" />
                      <span>ランキング</span>
                    </Link>
                    {session && (
                      <>
                        <Link
                          href="/profile"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-2 py-2 text-gray-300 hover:text-cyan-400 hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <span>プロフィール</span>
                        </Link>
                        <Link
                          href="/term/submit"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-2 py-2 text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-lg transition-colors border border-cyan-500/20"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>用語を追加する</span>
                        </Link>
                      </>
                    )}
                  </div>
                  {!session && (
                    <div className="flex flex-col gap-2 mt-4">
                      <Link
                        href="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-4 py-2 text-center text-sm font-medium text-gray-300 border border-gray-700 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        ログイン
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-4 py-2 text-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-medium rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all"
                      >
                        新規登録
                      </Link>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center space-x-2 group">
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-blue-400 transition-all">
                Jire-pedia
              </span>
            </Link>
          </div>

          {/* Center section - Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">

            {/* Play Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors focus:outline-none">
                プレイ
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-[#1a1d2e] border-cyan-500/20 text-gray-200">
                <DropdownMenuItem asChild>
                  <Link href="/play/select" className="flex items-center gap-2 cursor-pointer hover:bg-white/5 hover:text-cyan-400 focus:bg-white/5 focus:text-cyan-400">
                    <Gamepad2 className="w-4 h-4" />
                    モード選択
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/daily-challenge" className="flex items-center gap-2 cursor-pointer hover:bg-white/5 hover:text-cyan-400 focus:bg-white/5 focus:text-cyan-400">
                    <Calendar className="w-4 h-4" />
                    デイリーチャレンジ
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dictionary/trending" className="flex items-center gap-2 cursor-pointer hover:bg-white/5 hover:text-cyan-400 focus:bg-white/5 focus:text-cyan-400">
                    <Flame className="w-4 h-4" />
                    急上昇ワード
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Enhanced Dictionary Link with KnowledgeSphere */}
            <div
              className="relative group"
              onMouseEnter={() => setShowSphere(true)}
              onMouseLeave={() => setShowSphere(false)}
            >
              <Link
                href="/dictionary"
                className="relative z-10 flex items-center gap-1 text-sm font-medium text-gray-300 group-hover:text-cyan-400 transition-colors"
              >
                辞書
              </Link>

              {/* Knowledge Sphere appears on hover - fixed positioning to avoid layout shift */}
              {showSphere && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 pointer-events-none">
                  <KnowledgeSphere />
                </div>
              )}
            </div>

            <Link
              href="/leaderboard"
              className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors"
            >
              ランキング
            </Link>

            {session && (
              <Link
                href="/profile"
                className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors"
              >
                プロフィール
              </Link>
            )}
          </nav>

          {/* Right section - User controls */}
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link
                  href="/term/submit"
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 border border-cyan-500/20 text-cyan-400 rounded-full transition-all hover:scale-105"
                  title="用語を追加"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="text-xs font-bold">ADD</span>
                </Link>
                <button className="hidden md:block p-2 hover:bg-white/10 rounded-full transition-colors">
                  <Search className="w-5 h-5 text-gray-300" />
                </button>
                <NotificationCenter />
                <div className="hidden md:block">
                  <UserNav user={session.user} />
                </div>
                {/* Mobile User Nav is integrated into Sheet? Or just keep UserNav visible? 
                    Keep UserNav visible on mobile is good for quick access. 
                    But maybe UserNav is too big. Let's keep it visible for now. */}
                <div className="md:hidden">
                  <UserNav user={session.user} />
                </div>
              </>
            ) : (
              <div className="hidden md:flex gap-2">
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
