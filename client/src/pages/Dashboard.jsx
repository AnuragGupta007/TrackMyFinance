import { useState, useEffect } from 'react';
import { Wallet, TrendingDown, PiggyBank, Target } from 'lucide-react';
import { dashboardApi } from '../services/api/dashboard.api';
import { savingsApi } from '../services/api/savings.api';
import StatCard from '../components/dashboard/StatCard';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import BudgetOverview from '../components/dashboard/BudgetOverview';
import SavingsOverview from '../components/dashboard/SavingsOverview';
import Card from '../components/ui/Card';
import { PageLoader } from '../components/ui/Loader';
import { useAuth } from '../context/AuthContext';
import { getMonthName } from '../utils/formatDate';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { CHART_COLORS } from '../utils/constants';
import { formatCurrency } from '../utils/formatCurrency';
import { DEMO_OVERVIEW, DEMO_TRENDS, DEMO_SAVINGS_GOALS } from '../utils/demoData';

const Dashboard = () => {
  const { user, isDemo } = useAuth();
  const [overview, setOverview] = useState(null);
  const [trends, setTrends] = useState(null);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemo) {
      setOverview(DEMO_OVERVIEW);
      setTrends(DEMO_TRENDS);
      setSavingsGoals(DEMO_SAVINGS_GOALS);
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        const [overviewRes, trendsRes, savingsRes] = await Promise.all([
          dashboardApi.getOverview(),
          dashboardApi.getTrends(),
          savingsApi.getAll(),
        ]);
        setOverview(overviewRes.data);
        setTrends(trendsRes.data);
        setSavingsGoals(savingsRes.data || []);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isDemo]);

  if (loading) return <PageLoader />;

  const expenseChartData = trends?.expenses || [];
  const savingsChartData = trends?.savings || [];

  // Prepare pie data from budget categories
  const pieData = overview?.budgets?.items?.map((b) => ({
    name: b.categoryId?.name || b.name,
    value: b.spent,
    color: b.categoryId?.color || '#6B7280',
  })).filter(d => d.value > 0) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white font-display tracking-tight">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-neutral-500 mt-1">
          Here&apos;s your financial overview for {getMonthName(overview?.month || new Date().getMonth() + 1)} {overview?.year || new Date().getFullYear()}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Expenses"
          value={overview?.expenses?.total || 0}
          icon={TrendingDown}
          color="#E55B5B"
        />
        <StatCard
          title="Total Savings"
          value={overview?.savings?.totalSaved || 0}
          icon={PiggyBank}
          color="#0D9488"
        />
        <StatCard
          title="Budget Used"
          value={overview?.budgets?.totalSpent || 0}
          icon={Target}
          color="#D97706"
        />
        <StatCard
          title="Budget Remaining"
          value={Math.max((overview?.budgets?.totalLimit || 0) - (overview?.budgets?.totalSpent || 0), 0)}
          icon={Wallet}
          color="#2DD4BF"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area chart - expense trends */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white font-display mb-4 tracking-tight">Monthly Expense Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={expenseChartData}>
                <defs>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E55B5B" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#E55B5B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-10" />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6B7280' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(v) => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}K` : v}`} />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), 'Expenses']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E8E8E3', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                />
                <Area type="monotone" dataKey="total" stroke="#E55B5B" fill="url(#expenseGrad)" strokeWidth={2} animationDuration={1000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pie chart - categories */}
        <Card>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white font-display mb-4 tracking-tight">Budget by Category</h3>
          <div className="h-72 flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    animationDuration={1000}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: '12px', border: '1px solid #E8E8E3' }} />
                  <Legend iconType="circle" iconSize={8} formatter={(value) => <span className="text-xs text-neutral-600 dark:text-neutral-400">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-neutral-500">No budget data yet</p>
            )}
          </div>
        </Card>
      </div>

      {/* Savings chart + overview row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar chart - savings growth */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white font-display mb-4 tracking-tight">Savings Growth</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={savingsChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-10" />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6B7280' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(v) => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}K` : v}`} />
                <Tooltip formatter={(value) => [formatCurrency(value), 'Saved']} contentStyle={{ borderRadius: '12px', border: '1px solid #E8E8E3' }} />
                <Bar dataKey="total" fill="#0D9488" radius={[4, 4, 0, 0]} animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <SavingsOverview goals={savingsGoals} />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactions transactions={overview?.recentTransactions || []} />
        <BudgetOverview budgets={overview?.budgets?.items || []} />
      </div>
    </div>
  );
};

export default Dashboard;
