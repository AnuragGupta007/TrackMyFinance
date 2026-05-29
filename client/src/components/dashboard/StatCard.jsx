import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';
import { formatCurrency } from '../../utils/formatCurrency';

const StatCard = ({ title, value, icon: Icon, color = '#0D9488', trend, trendValue, prefix = '₹' }) => {
  const animatedValue = useAnimatedCounter(value, 1200);

  return (
    <div className="stat-card group" style={{ '--stat-color': color }}>
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>
        </div>
        
        <div className="mt-auto">
          <p className="text-3xl font-bold text-neutral-900 dark:text-white font-mono tracking-tight">
            {prefix === '₹' ? formatCurrency(animatedValue) : animatedValue}
          </p>
          
          {trend && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold ${trend === 'up' ? 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400' : 'bg-expense-50 text-expense-600 dark:bg-expense-500/10 dark:text-expense-400'}`}>
                {trend === 'up' ? '↑' : '↓'}
              </span>
              <span className="text-xs text-neutral-500">{trendValue}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
