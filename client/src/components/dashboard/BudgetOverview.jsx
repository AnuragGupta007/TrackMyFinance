import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';
import { formatCurrency } from '../../utils/formatCurrency';

const BudgetOverview = ({ budgets = [] }) => {
  if (budgets.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white font-display mb-4 tracking-tight">Budget Overview</h3>
        <p className="text-sm text-neutral-500 py-8 text-center">No budgets set. Create one to track spending!</p>
      </Card>
    );
  }

  return (
    <Card padding={false}>
      <div className="p-6 pb-2">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white font-display tracking-tight">Budget Overview</h3>
      </div>
      <div className="p-6 pt-3 space-y-5">
        {budgets.slice(0, 4).map((budget, index) => {
          return (
            <div key={budget._id || index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{budget.categoryId?.icon || '📁'}</span>
                  <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    {budget.name || budget.categoryId?.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-neutral-900 dark:text-white font-mono">
                    {formatCurrency(budget.spent)}
                  </span>
                  <span className="text-xs text-neutral-500 ml-1 font-mono">
                    / {formatCurrency(budget.limit)}
                  </span>
                </div>
              </div>
              <ProgressBar
                value={budget.spent}
                max={budget.limit}
                color={budget.categoryId?.color || '#0D9488'}
                size="sm"
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default BudgetOverview;
