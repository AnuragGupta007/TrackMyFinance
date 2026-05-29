import { useState, useRef } from 'react';
import { Sparkles, Brain, TrendingUp, Shield, Target, Lightbulb, BarChart3, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { aiApi } from '../services/api/ai.api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { toast } from 'react-toastify';

const SECTION_CONFIG = {
  spendingAnalysis: {
    title: 'Spending Analysis',
    icon: BarChart3,
    color: 'from-blue-500 to-cyan-500',
    bgLight: 'bg-blue-50',
    bgDark: 'dark:bg-blue-500/10',
    border: 'border-blue-200 dark:border-blue-500/20',
    iconColor: 'text-blue-500',
  },
  budgetHealth: {
    title: 'Budget Health',
    icon: Shield,
    color: 'from-primary-500 to-teal-500',
    bgLight: 'bg-primary-50',
    bgDark: 'dark:bg-primary-500/10',
    border: 'border-primary-200 dark:border-primary-500/20',
    iconColor: 'text-primary-500',
  },
  savingsForecast: {
    title: 'Savings Forecast',
    icon: Target,
    color: 'from-accent-500 to-amber-500',
    bgLight: 'bg-accent-50',
    bgDark: 'dark:bg-accent-500/10',
    border: 'border-accent-200 dark:border-accent-500/20',
    iconColor: 'text-accent-500',
  },
  cashFlowForecast: {
    title: 'Cash Flow Prediction',
    icon: TrendingUp,
    color: 'from-expense-500 to-red-500',
    bgLight: 'bg-expense-50',
    bgDark: 'dark:bg-expense-500/10',
    border: 'border-expense-200 dark:border-expense-500/20',
    iconColor: 'text-expense-500',
  },
};

const STATUS_COLORS = {
  healthy: 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400',
  warning: 'bg-accent-100 text-accent-700 dark:bg-accent-500/20 dark:text-accent-400',
  critical: 'bg-expense-100 text-expense-700 dark:bg-expense-500/20 dark:text-expense-400',
};

const IMPACT_COLORS = {
  high: 'bg-expense-100 text-expense-600 dark:bg-expense-500/15 dark:text-expense-400',
  medium: 'bg-accent-100 text-accent-600 dark:bg-accent-500/15 dark:text-accent-400',
  low: 'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
};

const AIInsights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isRequesting = useRef(false);

  const generateInsights = async () => {
    if (isRequesting.current) return;
    isRequesting.current = true;
    setLoading(true);
    setError('');
    try {
      const response = await aiApi.getInsights();
      setInsights(response.data);
      toast.success('AI insights generated! ✨');
    } catch (err) {
      setError(err.message || 'Failed to generate insights');
      toast.error(err.message || 'Failed to generate insights');
    } finally {
      setLoading(false);
      isRequesting.current = false;
    }
  };

  // Render spending analysis section
  const renderSpendingAnalysis = (data) => {
    if (!data) return null;
    return (
      <div className="space-y-3">
        {/* Top categories */}
        {data.topCategories?.length > 0 && (
          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Top Categories</p>
            <div className="space-y-2">
              {data.topCategories.map((cat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 truncate">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-bold text-neutral-900 dark:text-white font-mono">₹{cat.amount?.toLocaleString('en-IN')}</span>
                    <span className="text-xs font-bold text-neutral-500 w-10 text-right">{cat.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Month-over-month */}
        {data.monthOverMonthChange && (
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
            <p className="text-xs font-medium text-neutral-500 mb-1">Month-over-Month</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">{data.monthOverMonthChange}</p>
          </div>
        )}

        {/* Anomalies */}
        {data.anomalies?.length > 0 && (
          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">⚠️ Anomalies Detected</p>
            <ul className="space-y-1">
              {data.anomalies.map((a, i) => (
                <li key={i} className="text-sm text-neutral-600 dark:text-neutral-400 flex items-start gap-2">
                  <span className="text-accent-500 mt-0.5">•</span> {a}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Daily average */}
        {data.dailyAverage != null && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Daily Average: <span className="font-bold text-neutral-900 dark:text-white font-mono">₹{data.dailyAverage?.toLocaleString('en-IN')}</span>
          </p>
        )}
      </div>
    );
  };

  // Render budget health section
  const renderBudgetHealth = (data) => {
    if (!data) return null;
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {data.status && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[data.status] || STATUS_COLORS.healthy}`}>
              {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
            </span>
          )}
          {data.overallUtilization != null && (
            <span className="text-xs font-bold text-neutral-500">
              {data.overallUtilization}% utilized
            </span>
          )}
        </div>

        {data.summary && (
          <p className="text-sm text-neutral-700 dark:text-neutral-300">{data.summary}</p>
        )}

        {data.atRiskBudgets?.length > 0 && (
          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">At-Risk Budgets</p>
            <div className="space-y-2">
              {data.atRiskBudgets.map((b, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{b.category}</span>
                    <span className="text-xs font-bold text-accent-500">{b.utilization}%</span>
                  </div>
                  {b.suggestion && <p className="text-xs text-neutral-500">{b.suggestion}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render savings forecast section
  const renderSavingsForecast = (data) => {
    if (!data) return null;
    return (
      <div className="space-y-3">
        {data.summary && (
          <p className="text-sm text-neutral-700 dark:text-neutral-300">{data.summary}</p>
        )}

        {data.onTrackGoals?.length > 0 && (
          <div>
            <p className="text-xs font-medium text-primary-500 uppercase tracking-wider mb-2">✅ On Track</p>
            <div className="space-y-1.5">
              {data.onTrackGoals.map((g, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">{g.name}</span>
                  <span className="text-primary-600 dark:text-primary-400 text-xs font-bold">{g.projectedCompletion}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.behindGoals?.length > 0 && (
          <div>
            <p className="text-xs font-medium text-accent-500 uppercase tracking-wider mb-2">⚠️ Needs Attention</p>
            <div className="space-y-2">
              {data.behindGoals.map((g, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{g.name}</span>
                    <span className="text-xs font-bold text-expense-500 font-mono">Gap: ₹{g.gap?.toLocaleString('en-IN')}</span>
                  </div>
                  {g.suggestion && <p className="text-xs text-neutral-500">{g.suggestion}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render cash flow forecast section
  const renderCashFlowForecast = (data) => {
    if (!data) return null;
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          {data.projectedExpenses != null && (
            <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 flex-1">
              <p className="text-xs font-medium text-neutral-500 mb-0.5">Projected Next Month</p>
              <p className="text-lg font-bold text-neutral-900 dark:text-white font-mono">₹{data.projectedExpenses?.toLocaleString('en-IN')}</p>
            </div>
          )}
          {data.trend && (
            <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 flex-1">
              <p className="text-xs font-medium text-neutral-500 mb-0.5">Trend</p>
              <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300 capitalize">
                {data.trend === 'increasing' && '📈 '}
                {data.trend === 'decreasing' && '📉 '}
                {data.trend === 'stable' && '➡️ '}
                {data.trend}
              </p>
            </div>
          )}
        </div>
        {data.summary && (
          <p className="text-sm text-neutral-700 dark:text-neutral-300">{data.summary}</p>
        )}
      </div>
    );
  };

  const sectionRenderers = {
    spendingAnalysis: renderSpendingAnalysis,
    budgetHealth: renderBudgetHealth,
    savingsForecast: renderSavingsForecast,
    cashFlowForecast: renderCashFlowForecast,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white font-display tracking-tight">AI Financial Advisor</h1>
              <p className="text-neutral-500 text-sm">Powered by AI</p>
            </div>
          </div>
        </div>
        <Button
          onClick={generateInsights}
          disabled={loading}
          icon={loading ? Loader2 : insights ? RefreshCw : Brain}
        >
          {loading ? 'Analyzing...' : insights ? 'Regenerate' : 'Generate Insights'}
        </Button>
      </div>

      {/* Empty state */}
      {!insights && !loading && !error && (
        <Card className="text-center py-16">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <Brain className="w-10 h-10 text-neutral-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white font-display mb-1 tracking-tight">
                Your AI-Powered Financial Advisor
              </h3>
              <p className="text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
                Click "Generate Insights" to get personalized spending analysis, budget health checks,
                savings forecasts, and actionable recommendations based on your last 3 months of data.
              </p>
            </div>
            <Button onClick={generateInsights} disabled={loading} icon={Brain} size="lg" className="mt-2">
              Generate My Insights
            </Button>
          </div>
        </Card>
      )}

      {/* Loading state */}
      {loading && (
        <Card className="text-center py-16">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center animate-pulse">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent-400 animate-bounce flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white font-display mb-1 tracking-tight">
                Analyzing your finances...
              </h3>
              <p className="text-sm text-neutral-500">
                Our AI is crunching 3 months of your data. This may take a few seconds.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Error state */}
      {error && !loading && (
        <Card className="border border-expense-200 dark:border-expense-500/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-expense-100 dark:bg-expense-500/10 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-expense-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-expense-600 dark:text-expense-400 mb-1">Unable to generate insights</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Insights results */}
      {insights && !loading && (
        <div className="space-y-6 animate-fade-in">
          {/* Insight section cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(SECTION_CONFIG).map(([key, config]) => {
              const data = insights[key];
              const renderer = sectionRenderers[key];
              if (!data || !renderer) return null;
              const Icon = config.icon;

              return (
                <Card key={key} className={`border ${config.border}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-8 h-8 rounded-lg ${config.bgLight} ${config.bgDark} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${config.iconColor}`} />
                    </div>
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white font-display tracking-tight">
                      {config.title}
                    </h3>
                  </div>
                  {renderer(data)}
                </Card>
              );
            })}
          </div>

          {/* Recommendations */}
          {insights.recommendations?.length > 0 && (
            <Card className="border border-accent-200 dark:border-accent-500/20">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-accent-50 dark:bg-accent-500/10 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-accent-500" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white font-display tracking-tight">
                  Smart Recommendations
                </h3>
              </div>
              <div className="space-y-3">
                {insights.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <span className="text-xl shrink-0">{rec.icon || '💡'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">{rec.title}</p>
                        {rec.impact && (
                          <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full ${IMPACT_COLORS[rec.impact] || ''}`}>
                            {rec.impact}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{rec.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default AIInsights;
