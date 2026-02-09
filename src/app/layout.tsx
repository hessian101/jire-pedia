import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { LayoutContent } from "@/components/layout/layout-content"
import { auth } from "@/lib/auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Jire-pedia - AIを攻略する説明力ゲーム",
  description: "専門用語を自分の言葉で説明し、AIに推測させる学習プラットフォーム",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="ja" className="dark">
      <body className={inter.className}>
        <Providers>
          <LayoutContent session={session}>{children}</LayoutContent>
        </Providers>
      </body>
    </html>
  )
}
