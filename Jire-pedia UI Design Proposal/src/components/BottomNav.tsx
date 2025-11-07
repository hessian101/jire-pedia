import { Home, Gamepad2, BookOpen, Swords, User } from 'lucide-react';
import type { Screen } from '../App';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'game' as Screen, icon: Gamepad2, label: 'ミッション' },
    { id: 'home' as Screen, icon: Home, label: 'ホーム' },
    { id: 'search' as Screen, icon: BookOpen, label: 'Jire-pedia', isCenter: true },
    { id: 'term' as Screen, icon: Swords, label: 'バトル' },
    { id: 'profile' as Screen, icon: User, label: 'マイページ' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 pb-6">
        <div className="bg-[#1a1d2e]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl shadow-[0_0_30px_rgba(0,255,255,0.1)]">
          <div className="flex items-center justify-around px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;

              if (item.isCenter) {
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
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
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
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
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
