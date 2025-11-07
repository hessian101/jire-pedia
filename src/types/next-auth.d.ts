import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      level: number
      xp: number
      rank: string
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    image?: string | null
    level?: number
    xp?: number
    rank?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email?: string | null
    name?: string | null
    image?: string | null
    level?: number
    xp?: number
    rank?: string
  }
}
