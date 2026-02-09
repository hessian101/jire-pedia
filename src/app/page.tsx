import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { DailyChallenge } from "@/components/home/daily-challenge"
import { HomeTabs } from "@/components/home/home-tabs"
import { OnboardingTour } from "@/components/onboarding/onboarding-tour"
import { MobileContentSwitcher } from "@/components/home/mobile-content-switcher"
import { Sparkles } from "lucide-react"

export default async function HomePage() {
  const session = await auth()

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen pb-40 bg-gradient-to-b from-background to-background/50">
      <OnboardingTour />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-12">

        {/* Hero Section - Daily Challenge */}
        <section className="w-full">
          <DailyChallenge />
        </section>

        {/* content Grid with Mobile Switcher */}
        <MobileContentSwitcher
          mainContent={
            <main className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Latest Entries</h2>
              </div>

              {/* Placeholder Feed Items */}
              <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-6 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500" />
                      <div>
                        <div className="font-medium text-white">User {i}</div>
                        <div className="text-xs text-gray-400">2 hours ago</div>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">量子もつれ (Quantum Entanglement)</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      離れた場所にある2つの粒子が、まるで運命の赤い糸で結ばれているかのように、片方の状態が決まると瞬時にもう片方の状態も決まる現象...
                    </p>
                    <div className="mt-4 flex gap-2">
                      <span className="text-xs px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        Physics
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        Hard
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          }
          sidebarContent={
            <HomeTabs />
          }
        />
      </div>
    </div>
  )
}
