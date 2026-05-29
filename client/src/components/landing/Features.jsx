import { Receipt, Target, PiggyBank, BarChart3, Shield, Zap } from 'lucide-react';

const features = [
  {
    icon: Receipt,
    title: 'Expense Tracking',
    description: 'Track every rupee spent with categories, notes, and powerful filters. Know exactly where your money goes.',
    color: '#E55B5B',
    bg: 'bg-expense-50 dark:bg-expense-500/10',
  },
  {
    icon: Target,
    title: 'Smart Budgets',
    description: 'Set monthly budgets per category and get visual alerts before you overspend. Stay disciplined effortlessly.',
    color: '#D97706',
    bg: 'bg-accent-50 dark:bg-accent-500/10',
  },
  {
    icon: PiggyBank,
    title: 'Savings Goals',
    description: 'Create savings targets, add contributions, and watch your progress with beautiful animated trackers.',
    color: '#0D9488',
    bg: 'bg-primary-50 dark:bg-primary-500/10',
  },
  {
    icon: BarChart3,
    title: 'Visual Analytics',
    description: 'Interactive charts and graphs give you a bird\'s eye view of your finances — trends, patterns, and insights.',
    color: '#2DD4BF',
    bg: 'bg-teal-50 dark:bg-teal-500/10',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and secure. JWT authentication ensures only you can access your financial data.',
    color: '#6B7280',
    bg: 'bg-neutral-100 dark:bg-neutral-700/20',
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    description: 'Instant visual feedback when you add expenses, update budgets, or contribute to savings. The UI feels alive.',
    color: '#B45309',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-white dark:bg-neutral-900 relative overflow-hidden" id="features">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary-500 uppercase tracking-wider">Features</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white font-display mt-3 mb-4 tracking-tight">
            Everything you need to manage your finances
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-lg">
            Powerful tools designed to give you complete visibility and control over your money.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, description, color, bg }, index) => (
            <div
              key={title}
              className="group card p-6 hover:-translate-y-0.5 transition-all duration-200"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200`}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white font-display mb-2">{title}</h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
