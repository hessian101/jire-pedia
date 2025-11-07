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

  // Hide header and nav for immersive routes and auth pages
  const isImmersiveRoute = pathname?.startsWith("/feed")
  const isAuthRoute = pathname?.startsWith("/login") || pathname?.startsWith("/register")

  // Auth pages have their own full-page layouts
  if (isAuthRoute) {
    return <>{children}</>
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      {!isImmersiveRoute && <Header session={session} />}
      <main className="flex-1">{children}</main>
      {session && !isImmersiveRoute && <BottomNav />}
    </div>
  )
}
