import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Sun, Moon, TrendingUp } from 'lucide-react';
import Button from '../components/ui/Button';

const PublicLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-lg border-b border-neutral-200/60 dark:border-neutral-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center group-hover:opacity-90 transition-opacity">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold text-neutral-900 dark:text-white font-display tracking-tight">
                Track<span className="text-primary-500">My</span>Finance
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-2">
              <button onClick={toggleTheme} className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                {darkMode ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
              </button>
              {isAuthenticated ? (
                <Button onClick={() => navigate('/dashboard')} size="sm">Dashboard</Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate('/login')} size="sm">Log In</Button>
                  <Button onClick={() => navigate('/register')} size="sm">Get Started Free</Button>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <div className="md:hidden flex items-center gap-2">
              <button onClick={toggleTheme} className="p-2 rounded-lg text-neutral-500">
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-lg text-neutral-700 dark:text-neutral-300">
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 animate-fade-in-down">
            <div className="px-4 py-4 space-y-2">
              {isAuthenticated ? (
                <Button className="w-full" onClick={() => { navigate('/dashboard'); setMenuOpen(false); }}>Dashboard</Button>
              ) : (
                <>
                  <Button variant="outline" className="w-full" onClick={() => { navigate('/login'); setMenuOpen(false); }}>Log In</Button>
                  <Button className="w-full" onClick={() => { navigate('/register'); setMenuOpen(false); }}>Get Started Free</Button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Page content */}
      <main className="pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#111111] text-neutral-500 py-12 border-t border-neutral-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-white font-display text-sm tracking-tight">TrackMyFinance</span>
            </div>
            <p className="text-sm">&copy; {new Date().getFullYear()} TrackMyFinance. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
