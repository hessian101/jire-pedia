"use client"

import { signOut } from "next-auth/react"
import { User } from "lucide-react"

interface UserNavProps {
  user: {
    name?: string | null
    email?: string | null
  }
}

export function UserNav({ user }: UserNavProps) {
  if (!user) {
    return null
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-full transition-colors group"
      >
        <User className="w-5 h-5 text-cyan-400" />
        <span className="text-sm text-gray-300 group-hover:text-cyan-400 transition-colors">
          {user.name || user.email}
        </span>
      </button>
    </div>
  )
}
