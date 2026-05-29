const ProgressBar = ({ value = 0, max = 100, color = '#0D9488', size = 'md', showLabel = false, className = '' }) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  const isOverBudget = percentage > 100;

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-neutral-500 font-medium">{percentage}%</span>
          {isOverBudget && <span className="text-expense-500 font-medium">Over budget!</span>}
        </div>
      )}
      <div className={`w-full ${sizes[size]} bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden`}>
        <div
          className={`${sizes[size]} rounded-full transition-all duration-1000 ease-out`}
          style={{
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: isOverBudget ? '#E55B5B' : color,
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
