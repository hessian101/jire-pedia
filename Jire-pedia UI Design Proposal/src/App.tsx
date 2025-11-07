import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { Home } from './components/Home';
import { GamePlay } from './components/GamePlay';
import { TermPage } from './components/TermPage';
import { SearchPage } from './components/SearchPage';
import { ProfilePage } from './components/ProfilePage';
import { BottomNav } from './components/BottomNav';
import { Toaster } from './components/ui/sonner';

export type Screen = 'home' | 'game' | 'term' | 'search' | 'profile';
export type AuthScreen = 'login' | 'register';

export interface Term {
  id: string;
  name: string;
  category: string;
  officialDefinition: string;
  throneHolder?: string;
  throneDescription?: string;
  throneScore?: number;
  attempts: number;
  successRate: number;
  trending?: boolean;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);

  const navigateToGame = (term: Term) => {
    setSelectedTerm(term);
    setCurrentScreen('game');
  };

  const navigateToTerm = (term: Term) => {
    setSelectedTerm(term);
    setCurrentScreen('term');
  };

  if (!isLoggedIn) {
    if (authScreen === 'login') {
      return (
        <LoginPage
          onLogin={() => setIsLoggedIn(true)}
          onSwitchToRegister={() => setAuthScreen('register')}
        />
      );
    } else {
      return (
        <RegisterPage
          onRegister={() => setIsLoggedIn(true)}
          onSwitchToLogin={() => setAuthScreen('login')}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1117] text-white pb-24">
      {currentScreen === 'home' && (
        <Home onNavigateToGame={navigateToGame} onNavigateToTerm={navigateToTerm} />
      )}
      {currentScreen === 'game' && selectedTerm && (
        <GamePlay term={selectedTerm} onBack={() => setCurrentScreen('home')} onComplete={(term) => navigateToTerm(term)} />
      )}
      {currentScreen === 'term' && selectedTerm && (
        <TermPage term={selectedTerm} onBack={() => setCurrentScreen('home')} onStartGame={navigateToGame} />
      )}
      {currentScreen === 'search' && (
        <SearchPage onNavigateToTerm={navigateToTerm} />
      )}
      {currentScreen === 'profile' && (
        <ProfilePage />
      )}
      <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      <Toaster />
    </div>
  );
}

export default App;
