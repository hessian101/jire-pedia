"use client"

import { usePathname } from "next/navigation"
import { Header } from "./header"
import { BottomNav } from "./bottom-nav"
import { Session } from "next-auth"

interface LayoutContentProps {
  children: React.ReactNode
  session: Session | null
}

export function LayoutContent({ children, session }: LayoutContentProps) {
  const pathname = usePathname()

  // Hide header and nav for immersive feed experience
  const isImmersiveRoute = pathname?.startsWith("/feed")

  return (
    <div className="relative flex min-h-screen flex-col">
      {!isImmersiveRoute && <Header session={session} />}
      <main className="flex-1">{children}</main>
      {session && !isImmersiveRoute && <BottomNav />}
    </div>
  )
}
