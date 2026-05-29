import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';
import { formatCurrency } from '../../utils/formatCurrency';

const SavingsOverview = ({ goals = [] }) => {
  if (goals.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white font-display mb-4 tracking-tight">Savings Goals</h3>
        <p className="text-sm text-neutral-500 py-8 text-center">No savings goals yet. Start saving!</p>
      </Card>
    );
  }

  return (
    <Card padding={false}>
      <div className="p-6 pb-2">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white font-display tracking-tight">Savings Goals</h3>
      </div>
      <div className="p-6 pt-3 space-y-5">
        {goals.slice(0, 3).map((goal, index) => {
          const percentage = goal.targetAmount > 0 ? Math.round((goal.currentAmount / goal.targetAmount) * 100) : 0;
          return (
            <div key={goal._id || index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{goal.icon || '🎯'}</span>
                  <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{goal.name}</span>
                </div>
                <span className="text-xs font-bold" style={{ color: goal.color || '#0D9488' }}>
                  {percentage}%
                </span>
              </div>
              <ProgressBar
                value={goal.currentAmount}
                max={goal.targetAmount}
                color={goal.color || '#0D9488'}
                size="sm"
              />
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-sm font-bold text-neutral-900 dark:text-white font-mono">
                  {formatCurrency(goal.currentAmount)}
                </span>
                <span className="text-xs text-neutral-500 font-mono">
                  of {formatCurrency(goal.targetAmount)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default SavingsOverview;
