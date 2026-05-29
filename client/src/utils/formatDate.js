/**
 * Format date to readable string
 */
export const formatDate = (date, format = 'short') => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const options = {
    short: { day: 'numeric', month: 'short', year: 'numeric' },
    long: { day: 'numeric', month: 'long', year: 'numeric' },
    relative: null,
    input: null,
  };

  if (format === 'input') {
    return d.toISOString().split('T')[0];
  }

  if (format === 'relative') {
    const now = new Date();
    const diffMs = now - d;
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return d.toLocaleDateString('en-IN', options.short);
  }

  return d.toLocaleDateString('en-IN', options[format] || options.short);
};

/**
 * Get month name
 */
export const getMonthName = (monthNum, short = false) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return short ? shortMonths[monthNum - 1] : months[monthNum - 1];
};
