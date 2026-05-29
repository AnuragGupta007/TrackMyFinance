const Loader = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-[3px]',
    lg: 'h-12 w-12 border-[3px]',
    xl: 'h-16 w-16 border-4',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizes[size]} rounded-full border-primary-500/20 border-t-primary-500 animate-spin`}
      />
    </div>
  );
};

export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <Loader size="xl" />
      <p className="mt-4 text-neutral-500 dark:text-neutral-400 text-sm">Loading...</p>
    </div>
  </div>
);

export default Loader;
