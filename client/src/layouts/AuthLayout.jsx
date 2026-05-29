import { Outlet, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { TrendingUp, Sun, Moon } from 'lucide-react';

const AuthLayout = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex">
      {/* Left: Branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #111111 0%, #1A1A1A 50%, #111111 100%)' }}>
        <div className="absolute inset-0">
          {/* Subtle warm decorative shapes */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/8 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/3 right-1/6 w-80 h-80 bg-accent-500/6 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16">
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white font-display tracking-tight">TrackMyFinance</span>
          </Link>
          <h1 className="text-4xl font-bold text-white font-display leading-tight mb-4">
            Take control of your{' '}
            <span className="gradient-text">financial future</span>
          </h1>
          <p className="text-neutral-500 text-lg leading-relaxed max-w-md">
            Track expenses, manage budgets, and grow your savings — all in one beautiful dashboard.
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap gap-2.5 mt-8">
            {['Expense Tracking', 'Budget Planning', 'Savings Goals', 'Visual Analytics'].map((f) => (
              <span key={f} className="px-3 py-1.5 rounded-lg bg-white/[0.06] text-neutral-400 text-xs font-medium border border-white/[0.06]">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Auth form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-950 relative">
        <button
          onClick={toggleTheme}
          className="absolute top-6 right-6 p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <div className="w-full max-w-md animate-fade-in-up">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
