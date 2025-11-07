import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { TrendingWords } from "@/components/home/trending-words"
import { DailyChallenge } from "@/components/home/daily-challenge"
import { OngoingMissions } from "@/components/home/ongoing-missions"

export default async function HomePage() {
  const session = await auth()

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen pb-40">
      {/* Main Content - 3 Column Layout */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6">
          {/* Left Sidebar - Trending Words */}
          <aside>
            <TrendingWords />
          </aside>

          {/* Center - Daily Challenge */}
          <main>
            <DailyChallenge />
          </main>

          {/* Right Sidebar - Ongoing Missions */}
          <aside>
            <OngoingMissions />
          </aside>
        </div>
      </div>
    </div>
  )
}
