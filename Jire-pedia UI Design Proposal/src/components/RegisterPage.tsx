import { useState, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Sparkles } from 'lucide-react';

interface RegisterPageProps {
  onRegister: () => void;
  onSwitchToLogin: () => void;
}

export function RegisterPage({ onRegister, onSwitchToLogin }: RegisterPageProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      opacity: number;
    }> = [];

    // Create star particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedY: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.y += particle.speedY;

        if (particle.y > canvas.height) {
          particle.y = 0;
          particle.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();

        if (Math.random() > 0.98) {
          ctx.beginPath();
          ctx.moveTo(particle.x - particle.size * 2, particle.y);
          ctx.lineTo(particle.x + particle.size * 2, particle.y);
          ctx.moveTo(particle.x, particle.y - particle.size * 2);
          ctx.lineTo(particle.x, particle.y + particle.size * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${particle.opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && email && password && confirmPassword && agreedToTerms) {
      if (password === confirmPassword) {
        onRegister();
      } else {
        alert('Passwords do not match');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      <div className="relative z-10 w-full">
        {/* Desktop Layout - 2 columns */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 lg:max-w-6xl lg:mx-auto lg:px-8">
          {/* Left Column - Welcome Message */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-4xl">Jire-pedia</h1>
              </div>
              <h2 className="text-5xl leading-tight">
                じれったい説明で<br />学ぶ辞書
              </h2>
              <p className="text-xl text-gray-400 leading-relaxed">
                AIを使って、NGワードを避けながら用語を説明するゲーム。<br />
                あなたの説明力を試して、王座を目指そう！
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-center">
                <div className="text-3xl text-cyan-400">1000+</div>
                <div className="text-sm text-gray-400 mt-1">用語</div>
              </div>
              <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-4 text-center">
                <div className="text-3xl text-purple-400">10K+</div>
                <div className="text-sm text-gray-400 mt-1">プレイヤー</div>
              </div>
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-center">
                <div className="text-3xl text-blue-400">50K+</div>
                <div className="text-sm text-gray-400 mt-1">挑戦</div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="relative rounded-[3rem] p-[2px] bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 shadow-[0_0_60px_rgba(0,255,255,0.3)]">
                <div className="rounded-[3rem] bg-[#0f1117] p-10">
                  <h2 className="text-3xl text-center mb-8">Create Your Account</h2>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full h-12 bg-transparent border-2 border-white/20 focus:border-cyan-500 rounded-xl px-5 text-base placeholder:text-gray-500 transition-all"
                    />

                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 bg-transparent border-2 border-white/20 focus:border-cyan-500 rounded-xl px-5 text-base placeholder:text-gray-500 transition-all"
                    />

                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-12 bg-transparent border-2 border-white/20 focus:border-purple-500 rounded-xl px-5 text-base placeholder:text-gray-500 transition-all"
                    />

                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-12 bg-transparent border-2 border-white/20 focus:border-purple-500 rounded-xl px-5 text-base placeholder:text-gray-500 transition-all"
                    />

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="terms"
                        checked={agreedToTerms}
                        onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                        className="border-2 border-white/20 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-300 cursor-pointer">
                        I agree to the Terms & Privacy
                      </label>
                    </div>

                    <Button
                      type="submit"
                      disabled={!agreedToTerms}
                      className="w-full h-12 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-full transition-all hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-cyan-500/50"
                    >
                      REGISTER
                    </Button>
                  </form>

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <button
                      type="button"
                      onClick={onRegister}
                      className="h-10 px-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      <span>Google</span>
                    </button>

                    <button
                      type="button"
                      onClick={onRegister}
                      className="h-10 px-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                      </svg>
                      <span>Apple</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Single column */}
        <div className="lg:hidden max-w-md mx-4 sm:mx-auto">
          <div className="relative rounded-[3rem] p-[2px] bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 shadow-[0_0_60px_rgba(0,255,255,0.3)]">
            <div className="rounded-[3rem] bg-[#0f1117] p-10">
              {/* Logo */}
              <div className="text-center mb-6">
                <h1 className="text-2xl">Jire-pedia</h1>
              </div>

              <h2 className="text-3xl text-center mb-8">Create Your Account</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-12 bg-transparent border-2 border-white/20 focus:border-cyan-500 rounded-xl px-5 text-base placeholder:text-gray-500 transition-all"
                />

                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 bg-transparent border-2 border-white/20 focus:border-cyan-500 rounded-xl px-5 text-base placeholder:text-gray-500 transition-all"
                />

                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 bg-transparent border-2 border-white/20 focus:border-purple-500 rounded-xl px-5 text-base placeholder:text-gray-500 transition-all"
                />

                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-12 bg-transparent border-2 border-white/20 focus:border-purple-500 rounded-xl px-5 text-base placeholder:text-gray-500 transition-all"
                />

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="terms-mobile"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    className="border-2 border-white/20 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  />
                  <label htmlFor="terms-mobile" className="text-sm text-gray-300 cursor-pointer">
                    I agree to the Terms & Privacy
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={!agreedToTerms}
                  className="w-full h-12 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-full transition-all hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-cyan-500/50"
                >
                  REGISTER
                </Button>
              </form>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  type="button"
                  onClick={onRegister}
                  className="h-10 px-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={onRegister}
                  className="h-10 px-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <span>Apple</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center mt-8">
          <span className="text-sm text-gray-400">Already have an account? </span>
          <button
            onClick={onSwitchToLogin}
            className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors underline"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
