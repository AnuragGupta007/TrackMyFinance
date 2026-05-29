import { Inbox } from 'lucide-react';

const EmptyState = ({ icon: Icon = Inbox, title = 'No data yet', description = '', action, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-neutral-400" />
      </div>
      <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-200 mb-1">{title}</h3>
      {description && <p className="text-sm text-neutral-500 max-w-sm mb-4 leading-relaxed">{description}</p>}
      {action && action}
    </div>
  );
};

export default EmptyState;
