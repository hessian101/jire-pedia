import { DailyChallenge } from './DailyChallenge';
import { TrendingWords } from './TrendingWords';
import { OngoingMissions } from './OngoingMissions';
import { Bell, Search, User } from 'lucide-react';
import type { Term } from '../App';

interface HomeProps {
  onNavigateToGame: (term: Term) => void;
  onNavigateToTerm: (term: Term) => void;
}

export function Home({ onNavigateToGame, onNavigateToTerm }: HomeProps) {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-cyan-500/20 bg-[#0f1117]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl">Jire-pedia</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF3366] rounded-full"></span>
            </button>
            <button className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-full transition-colors">
              <User className="w-5 h-5" />
              <span className="text-sm">花子</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - 3 Column Layout */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6">
          {/* Left Sidebar - Trending Words */}
          <aside>
            <TrendingWords onNavigateToTerm={onNavigateToTerm} />
          </aside>

          {/* Center - Daily Challenge */}
          <main>
            <DailyChallenge onStartGame={onNavigateToGame} />
          </main>

          {/* Right Sidebar - Ongoing Missions */}
          <aside>
            <OngoingMissions />
          </aside>
        </div>
      </div>
    </div>
  );
}
