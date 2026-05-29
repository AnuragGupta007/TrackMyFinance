// Sample data for demo mode — no backend required
export const DEMO_USER = {
  _id: 'demo_user_001',
  name: 'Anurag Demo',
  email: 'demo@trackmyfinance.com',
  currency: '₹',
};

export const DEMO_CATEGORIES = [
  { _id: 'cat1', name: 'Food & Dining', icon: '🍔', color: '#F59E0B', type: 'expense' },
  { _id: 'cat2', name: 'Transport', icon: '🚗', color: '#3B82F6', type: 'expense' },
  { _id: 'cat3', name: 'Entertainment', icon: '🎬', color: '#8B5CF6', type: 'expense' },
  { _id: 'cat4', name: 'Shopping', icon: '🛍️', color: '#EC4899', type: 'expense' },
  { _id: 'cat5', name: 'Bills & Utilities', icon: '💡', color: '#EF4444', type: 'expense' },
  { _id: 'cat6', name: 'Health', icon: '🏥', color: '#10B981', type: 'expense' },
  { _id: 'cat7', name: 'Education', icon: '📚', color: '#06B6D4', type: 'expense' },
  { _id: 'cat8', name: 'Travel', icon: '✈️', color: '#F97316', type: 'expense' },
  { _id: 'cat9', name: 'Groceries', icon: '🛒', color: '#84CC16', type: 'expense' },
  { _id: 'cat10', name: 'Other', icon: '📦', color: '#64748B', type: 'expense' },
];

const today = new Date();
const daysAgo = (n) => new Date(today.getFullYear(), today.getMonth(), today.getDate() - n);

export const DEMO_EXPENSES = [
  { _id: 'exp1', title: 'Swiggy Order', amount: 450, categoryId: DEMO_CATEGORIES[0], notes: 'Dinner for 2', date: daysAgo(0) },
  { _id: 'exp2', title: 'Uber Ride', amount: 280, categoryId: DEMO_CATEGORIES[1], notes: 'Office commute', date: daysAgo(0) },
  { _id: 'exp3', title: 'Netflix Subscription', amount: 649, categoryId: DEMO_CATEGORIES[2], notes: 'Monthly plan', date: daysAgo(1) },
  { _id: 'exp4', title: 'Amazon Purchase', amount: 2499, categoryId: DEMO_CATEGORIES[3], notes: 'Wireless earbuds', date: daysAgo(2) },
  { _id: 'exp5', title: 'Electricity Bill', amount: 1850, categoryId: DEMO_CATEGORIES[4], notes: 'May bill', date: daysAgo(3) },
  { _id: 'exp6', title: 'Gym Membership', amount: 1500, categoryId: DEMO_CATEGORIES[5], notes: 'Monthly fee', date: daysAgo(3) },
  { _id: 'exp7', title: 'Udemy Course', amount: 499, categoryId: DEMO_CATEGORIES[6], notes: 'React advanced', date: daysAgo(4) },
  { _id: 'exp8', title: 'Groceries - BigBasket', amount: 3200, categoryId: DEMO_CATEGORIES[8], notes: 'Weekly groceries', date: daysAgo(5) },
  { _id: 'exp9', title: 'Zomato Lunch', amount: 350, categoryId: DEMO_CATEGORIES[0], notes: 'Lunch', date: daysAgo(5) },
  { _id: 'exp10', title: 'Petrol', amount: 2000, categoryId: DEMO_CATEGORIES[1], notes: 'Full tank', date: daysAgo(6) },
  { _id: 'exp11', title: 'Movie Tickets', amount: 600, categoryId: DEMO_CATEGORIES[2], notes: 'PVR IMAX', date: daysAgo(7) },
  { _id: 'exp12', title: 'WiFi Bill', amount: 999, categoryId: DEMO_CATEGORIES[4], notes: 'Airtel fiber', date: daysAgo(8) },
  { _id: 'exp13', title: 'Medicines', amount: 750, categoryId: DEMO_CATEGORIES[5], notes: 'Monthly vitamins', date: daysAgo(10) },
  { _id: 'exp14', title: 'Myntra Shopping', amount: 1899, categoryId: DEMO_CATEGORIES[3], notes: 'T-shirts', date: daysAgo(12) },
  { _id: 'exp15', title: 'Train Ticket', amount: 1200, categoryId: DEMO_CATEGORIES[7], notes: 'Weekend trip', date: daysAgo(14) },
];

export const DEMO_BUDGETS = [
  { _id: 'bud1', name: 'Food Budget', categoryId: DEMO_CATEGORIES[0], limit: 5000, spent: 800, period: 'monthly', month: today.getMonth() + 1, year: today.getFullYear() },
  { _id: 'bud2', name: 'Transport Budget', categoryId: DEMO_CATEGORIES[1], limit: 4000, spent: 2280, period: 'monthly', month: today.getMonth() + 1, year: today.getFullYear() },
  { _id: 'bud3', name: 'Entertainment', categoryId: DEMO_CATEGORIES[2], limit: 2000, spent: 1249, period: 'monthly', month: today.getMonth() + 1, year: today.getFullYear() },
  { _id: 'bud4', name: 'Shopping', categoryId: DEMO_CATEGORIES[3], limit: 5000, spent: 4398, period: 'monthly', month: today.getMonth() + 1, year: today.getFullYear() },
  { _id: 'bud5', name: 'Bills', categoryId: DEMO_CATEGORIES[4], limit: 5000, spent: 2849, period: 'monthly', month: today.getMonth() + 1, year: today.getFullYear() },
  { _id: 'bud6', name: 'Groceries', categoryId: DEMO_CATEGORIES[8], limit: 6000, spent: 3200, period: 'monthly', month: today.getMonth() + 1, year: today.getFullYear() },
];

export const DEMO_SAVINGS_GOALS = [
  {
    _id: 'sav1', name: 'Emergency Fund', targetAmount: 300000, currentAmount: 185000,
    targetDate: new Date(2025, 11, 31), status: 'active', color: '#10B981', icon: '🛡️',
    contributions: [
      { amount: 50000, date: daysAgo(120), note: 'Initial deposit' },
      { amount: 35000, date: daysAgo(90), note: 'March savings' },
      { amount: 50000, date: daysAgo(60), note: 'April savings' },
      { amount: 50000, date: daysAgo(30), note: 'May savings' },
    ],
  },
  {
    _id: 'sav2', name: 'New Laptop', targetAmount: 80000, currentAmount: 52000,
    targetDate: new Date(2025, 8, 30), status: 'active', color: '#38BDF8', icon: '💻',
    contributions: [
      { amount: 20000, date: daysAgo(90), note: 'Saved from freelancing' },
      { amount: 15000, date: daysAgo(60), note: 'Monthly savings' },
      { amount: 17000, date: daysAgo(30), note: 'Bonus money' },
    ],
  },
  {
    _id: 'sav3', name: 'Goa Trip', targetAmount: 25000, currentAmount: 25000,
    targetDate: new Date(2025, 5, 15), status: 'completed', color: '#F59E0B', icon: '✈️',
    contributions: [
      { amount: 10000, date: daysAgo(60), note: 'Trip fund start' },
      { amount: 15000, date: daysAgo(20), note: 'Final push' },
    ],
  },
  {
    _id: 'sav4', name: 'Bike Down Payment', targetAmount: 50000, currentAmount: 12000,
    targetDate: new Date(2026, 2, 1), status: 'active', color: '#EC4899', icon: '🏍️',
    contributions: [
      { amount: 12000, date: daysAgo(15), note: 'Started saving' },
    ],
  },
];

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const DEMO_TRENDS = {
  expenses: Array.from({ length: 6 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() - (5 - i), 1);
    return {
      month: d.getMonth() + 1,
      year: d.getFullYear(),
      label: monthNames[d.getMonth()],
      total: [12400, 18900, 15600, 22300, 17800, 18725][i],
      count: [18, 25, 20, 30, 22, 15][i],
    };
  }),
  savings: Array.from({ length: 6 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() - (5 - i), 1);
    return {
      month: d.getMonth() + 1,
      year: d.getFullYear(),
      label: monthNames[d.getMonth()],
      total: [15000, 20000, 35000, 50000, 67000, 50000][i],
    };
  }),
};

export const DEMO_OVERVIEW = {
  expenses: { total: 18725, count: 15 },
  savings: {
    totalSaved: 274000,
    totalTarget: 455000,
    activeGoals: 3,
    completedGoals: 1,
  },
  budgets: {
    totalLimit: 27000,
    totalSpent: 14776,
    items: DEMO_BUDGETS,
  },
  recentTransactions: DEMO_EXPENSES.slice(0, 5),
  month: today.getMonth() + 1,
  year: today.getFullYear(),
};

export const DEMO_EXPENSE_SUMMARY = {
  summary: [
    { categoryId: 'cat1', categoryName: 'Food & Dining', categoryIcon: '🍔', categoryColor: '#F59E0B', total: 800, count: 2 },
    { categoryId: 'cat4', categoryName: 'Shopping', categoryIcon: '🛍️', categoryColor: '#EC4899', total: 4398, count: 2 },
    { categoryId: 'cat9', categoryName: 'Groceries', categoryIcon: '🛒', categoryColor: '#84CC16', total: 3200, count: 1 },
    { categoryId: 'cat5', categoryName: 'Bills & Utilities', categoryIcon: '💡', categoryColor: '#EF4444', total: 2849, count: 2 },
    { categoryId: 'cat2', categoryName: 'Transport', categoryIcon: '🚗', categoryColor: '#3B82F6', total: 2280, count: 2 },
    { categoryId: 'cat3', categoryName: 'Entertainment', categoryIcon: '🎬', categoryColor: '#8B5CF6', total: 1249, count: 2 },
    { categoryId: 'cat6', categoryName: 'Health', categoryIcon: '🏥', categoryColor: '#10B981', total: 2250, count: 2 },
    { categoryId: 'cat7', categoryName: 'Education', categoryIcon: '📚', categoryColor: '#06B6D4', total: 499, count: 1 },
    { categoryId: 'cat8', categoryName: 'Travel', categoryIcon: '✈️', categoryColor: '#F97316', total: 1200, count: 1 },
  ],
  totalExpenses: 18725,
  month: today.getMonth() + 1,
  year: today.getFullYear(),
};
