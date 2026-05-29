const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
    success: 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400',
    danger: 'bg-expense-50 text-expense-700 dark:bg-expense-500/10 dark:text-expense-400',
    warning: 'bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-400',
    info: 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
