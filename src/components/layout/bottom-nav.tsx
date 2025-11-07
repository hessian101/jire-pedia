"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Gamepad2, BookOpen, Swords, User } from 'lucide-react'

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { id: 'play', icon: Gamepad2, label: 'ミッション', href: '/play/select' },
    { id: 'home', icon: Home, label: 'ホーム', href: '/' },
    { id: 'feed', icon: BookOpen, label: 'Jire-pedia', href: '/feed', isCenter: true },
    { id: 'battle', icon: Swords, label: 'バトル', href: '/play/select' },
    { id: 'profile', icon: User, label: 'マイページ', href: '/profile' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div className="max-w-7xl mx-auto px-6 pb-6 pointer-events-auto">
        <div className="bg-[#1a1d2e]/95 backdrop-blur-xl border border-cyan-500/20 rounded-2xl shadow-[0_0_30px_rgba(0,255,255,0.2)]">
          <div className="flex items-center justify-around px-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              if (item.isCenter) {
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="relative -mt-8"
                  >
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-gradient-to-br from-cyan-500 to-blue-500 shadow-[0_0_30px_rgba(0,255,255,0.5)]'
                        : 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30'
                    }`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className={`text-xs text-center mt-2 ${
                      isActive ? 'text-cyan-400' : 'text-gray-400'
                    }`}>
                      {item.label}
                    </div>
                  </Link>
                )
              }

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex flex-col items-center gap-1 py-4 px-4 transition-all"
                >
                  <Icon className={`w-6 h-6 ${
                    isActive ? 'text-cyan-400' : 'text-gray-400'
                  }`} />
                  <span className={`text-xs ${
                    isActive ? 'text-cyan-400' : 'text-gray-400'
                  }`}>
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
