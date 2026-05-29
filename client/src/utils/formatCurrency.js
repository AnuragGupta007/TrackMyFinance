/**
 * Format a number as Indian Rupees currency
 */
export const formatCurrency = (amount, showSymbol = true) => {
  const num = Number(amount) || 0;
  const formatted = num.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return showSymbol ? `₹${formatted}` : formatted;
};

/**
 * Format a compact currency (e.g., ₹1.2L, ₹50K)
 */
export const formatCompactCurrency = (amount) => {
  const num = Number(amount) || 0;
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
};
