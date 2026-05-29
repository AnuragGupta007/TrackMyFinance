import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Play } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const Hero = () => {
  const navigate = useNavigate();
  const { loginAsDemo } = useAuth();

  const handleDemo = () => {
    loginAsDemo();
    navigate('/dashboard');
  };

  return (
    <section className="relative overflow-hidden gradient-hero min-h-[90vh] flex items-center">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/5 w-[400px] h-[400px] bg-primary-500/[0.06] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/5 w-[500px] h-[500px] bg-accent-500/[0.04] rounded-full blur-[120px]" />
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/15 mb-8 animate-fade-in-down">
          <Sparkles className="w-3.5 h-3.5 text-primary-400" />
          <span className="text-sm text-primary-300 font-medium">Smart Finance Management</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white font-display leading-[1.1] mb-6 animate-fade-in-up tracking-tight">
          Master Your Money,
          <br />
          <span className="gradient-text">Shape Your Future</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-neutral-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up animate-delay-200">
          Track every rupee, crush your budgets, and watch your savings grow with
          beautiful charts and intelligent insights — all in one place.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up animate-delay-300">
          <Button size="lg" onClick={() => navigate('/register')} className="text-base px-8 py-4">
            Start Tracking Free <ArrowRight className="w-5 h-5 ml-1" />
          </Button>
          <Button variant="outline" size="lg" onClick={handleDemo} className="text-base px-8 py-4 border-neutral-700 text-neutral-300 hover:border-primary-500 hover:text-primary-300 hover:bg-primary-500/10">
            <Play className="w-4 h-4 mr-1 fill-current" /> Try Live Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in-up animate-delay-400">
          {[
            { value: '100%', label: 'Free' },
            { value: '₹0', label: 'No Hidden Fees' },
            { value: '24/7', label: 'Access' },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-2xl sm:text-3xl font-bold text-white font-display">{value}</div>
              <div className="text-xs sm:text-sm text-neutral-600 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Dashboard preview mockup */}
        <div className="mt-20 relative animate-fade-in-up animate-delay-400">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-xl bg-neutral-800/30 border border-neutral-700/30 p-1.5 shadow-2xl shadow-black/30">
              <div className="rounded-lg bg-[#1C1C1E] overflow-hidden">
                {/* Mock browser bar */}
                <div className="flex items-center gap-2 px-4 py-2.5 bg-[#111111] border-b border-neutral-800/50">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-expense-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-accent-400/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-primary-500/50" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="h-5 rounded bg-neutral-800/60 max-w-xs mx-auto" />
                  </div>
                </div>
                {/* Mock dashboard content */}
                <div className="p-5 space-y-3">
                  {/* Stat cards */}
                  <div className="grid grid-cols-4 gap-2.5">
                    {[
                      { label: 'Balance', value: '₹2,45,000', color: '#0D9488' },
                      { label: 'Expenses', value: '₹42,300', color: '#E55B5B' },
                      { label: 'Savings', value: '₹1,20,000', color: '#D97706' },
                      { label: 'Budget Left', value: '₹18,700', color: '#2DD4BF' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="rounded-lg bg-neutral-800/40 p-3 border border-neutral-700/20">
                        <div className="text-[10px] text-neutral-600 mb-1">{label}</div>
                        <div className="text-sm font-bold font-mono" style={{ color }}>{value}</div>
                      </div>
                    ))}
                  </div>
                  {/* Mock chart */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="col-span-2 rounded-lg bg-neutral-800/40 p-4 border border-neutral-700/20 h-36">
                      <div className="text-[10px] text-neutral-600 mb-3">Monthly Spending</div>
                      <div className="flex items-end gap-1.5 h-20">
                        {[40, 65, 45, 80, 55, 70, 50, 85, 60, 75, 45, 90].map((h, i) => (
                          <div key={i} className="flex-1 rounded-sm transition-all" style={{ height: `${h}%`, backgroundColor: i === 11 ? '#0D9488' : '#27272A' }} />
                        ))}
                      </div>
                    </div>
                    <div className="rounded-lg bg-neutral-800/40 p-4 border border-neutral-700/20 h-36">
                      <div className="text-[10px] text-neutral-600 mb-3">Categories</div>
                      <div className="flex items-center justify-center h-20">
                        <div className="w-16 h-16 rounded-full" style={{
                          background: 'conic-gradient(#0D9488 0deg 120deg, #D97706 120deg 200deg, #2DD4BF 200deg 280deg, #E55B5B 280deg 360deg)'
                        }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Subtle glow */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-1/2 h-16 bg-primary-500/10 blur-[60px]" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
