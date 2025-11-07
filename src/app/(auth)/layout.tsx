import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "認証 - Jire-pedia",
  description: "ログイン・新規登録",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
