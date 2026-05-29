import Card from '../ui/Card';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const RecentTransactions = ({ transactions = [] }) => {
  if (transactions.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white font-display mb-4 tracking-tight">Recent Transactions</h3>
        <p className="text-sm text-neutral-500 py-8 text-center">No transactions yet. Add your first expense!</p>
      </Card>
    );
  }

  return (
    <Card padding={false}>
      <div className="p-6 pb-2">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white font-display tracking-tight">Recent Transactions</h3>
      </div>
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60 mt-2">
        {transactions.map((tx, index) => (
          <div
            key={tx._id || index}
            className="flex items-center gap-4 px-6 py-3.5 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
          >
            {/* Category icon */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ backgroundColor: `${tx.categoryId?.color || '#0D9488'}15` }}
            >
              {tx.categoryId?.icon || '📦'}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">{tx.title}</p>
              <p className="text-xs text-neutral-500">
                {tx.categoryId?.name || 'Uncategorized'} · {formatDate(tx.date, 'relative')}
              </p>
            </div>

            {/* Amount */}
            <span className="text-sm font-bold text-neutral-900 dark:text-white font-mono flex-shrink-0">
              -{formatCurrency(tx.amount)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentTransactions;
