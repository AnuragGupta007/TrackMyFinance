import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Edit3 } from 'lucide-react';
import { budgetApi } from '../services/api/budget.api';
import { categoryApi } from '../services/api/category.api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import ProgressBar from '../components/ui/ProgressBar';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { PageLoader } from '../components/ui/Loader';
import { formatCurrency } from '../utils/formatCurrency';
import { getMonthName } from '../utils/formatDate';
import { toast } from 'react-toastify';
import { DEMO_BUDGETS, DEMO_CATEGORIES } from '../utils/demoData';

const Budgets = () => {
  const { isDemo } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [form, setForm] = useState({ name: '', categoryId: '', limit: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchData = useCallback(async () => {
    if (isDemo) {
      setBudgets(DEMO_BUDGETS);
      setCategories(DEMO_CATEGORIES);
      setLoading(false);
      return;
    }
    try {
      const [budRes, catRes] = await Promise.all([
        budgetApi.getAll({ month, year }),
        categoryApi.getAll(),
      ]);
      setBudgets(budRes.data?.budgets || []);
      setCategories(catRes.data || []);
    } catch {
      toast.error('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  }, [month, year, isDemo]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const resetForm = () => {
    setForm({ name: '', categoryId: '', limit: '' });
    setEditItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.categoryId || !form.limit) {
      toast.error('Please fill all fields'); return;
    }
    if (isDemo) {
      const cat = categories.find(c => c._id === form.categoryId);
      if (editItem) {
        setBudgets(prev => prev.map(b => b._id === editItem._id ? { ...b, name: form.name, limit: parseFloat(form.limit) } : b));
        toast.success('Budget updated');
      } else {
        const newBud = { _id: 'bud_' + Date.now(), name: form.name, categoryId: cat, limit: parseFloat(form.limit), spent: 0, month, year };
        setBudgets(prev => [...prev, newBud]);
        toast.success('Budget created 🎯');
      }
      setModalOpen(false); resetForm(); return;
    }
    try {
      const payload = { ...form, limit: parseFloat(form.limit), month, year };
      if (editItem) {
        await budgetApi.update(editItem._id, payload);
        toast.success('Budget updated');
      } else {
        await budgetApi.create(payload);
        toast.success('Budget created 🎯');
      }
      setModalOpen(false);
      resetForm();
      fetchData();
    } catch (err) { toast.error(err.message); }
  };

  const handleDelete = async () => {
    const id = deleteTarget;
    setDeleteTarget(null);
    if (!id) return;
    if (isDemo) { setBudgets(prev => prev.filter(b => b._id !== id)); toast.success('Budget deleted'); return; }
    try {
      await budgetApi.delete(id);
      toast.success('Budget deleted');
      fetchData();
    } catch (err) { toast.error(err.message); }
  };

  const totalLimit = budgets.reduce((a, b) => a + b.limit, 0);
  const totalSpent = budgets.reduce((a, b) => a + b.spent, 0);

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white font-display tracking-tight">Budgets</h1>
          <p className="text-neutral-500 mt-1">{getMonthName(month)} {year}</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="input-field w-auto font-medium" value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{getMonthName(i + 1)}</option>
            ))}
          </select>
          <Button onClick={() => { resetForm(); setModalOpen(true); }} icon={Plus}>New Budget</Button>
        </div>
      </div>

      {/* Summary card */}
      <Card className="gradient-primary text-white border-none shadow-lg shadow-primary-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-white/80 text-sm font-medium">Total Budget</p>
            <p className="text-4xl font-bold font-mono mt-1 tracking-tight">{formatCurrency(totalLimit)}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-white/80 text-sm font-medium">Spent</p>
            <p className="text-2xl font-bold font-mono tracking-tight">{formatCurrency(totalSpent)}</p>
            <p className="text-white/70 text-sm mt-1 font-mono">{formatCurrency(Math.max(totalLimit - totalSpent, 0))} remaining</p>
          </div>
        </div>
        <div className="mt-5 w-full h-3 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
          <div className="h-full bg-white rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0, 100)}%` }} />
        </div>
      </Card>

      {/* Budget cards grid */}
      {budgets.length === 0 ? (
        <EmptyState title="No budgets for this month" description="Create category budgets to track spending"
          action={<Button onClick={() => { resetForm(); setModalOpen(true); }} icon={Plus} size="sm">Create Budget</Button>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {budgets.map((budget) => {
            const pct = budget.limit > 0 ? Math.round((budget.spent / budget.limit) * 100) : 0;
            const isOver = pct > 100;
            return (
              <Card key={budget._id} className="group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: `${budget.categoryId?.color || '#0D9488'}15` }}>
                      {budget.categoryId?.icon || '📁'}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-tight">{budget.name}</h4>
                      <p className="text-xs text-neutral-500">{budget.categoryId?.name}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => {
                      setEditItem(budget);
                      setForm({ name: budget.name, categoryId: budget.categoryId?._id || '', limit: budget.limit.toString() });
                      setModalOpen(true);
                    }} className="p-1.5 text-neutral-400 hover:text-accent-500 hover:bg-accent-50 dark:hover:bg-accent-500/10 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteTarget(budget._id)} className="p-1.5 text-neutral-400 hover:text-expense-500 hover:bg-expense-50 dark:hover:bg-expense-500/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-end justify-between mb-2">
                  <span className="text-2xl font-bold text-neutral-900 dark:text-white font-mono tracking-tight">{formatCurrency(budget.spent)}</span>
                  <span className="text-xs text-neutral-500 font-mono mb-1">of {formatCurrency(budget.limit)}</span>
                </div>

                <ProgressBar value={budget.spent} max={budget.limit} color={budget.categoryId?.color || '#0D9488'} size="md" />

                <div className="mt-3 flex items-center justify-between">
                  <span className={`text-xs font-bold ${isOver ? 'text-expense-500' : 'text-primary-500'}`}>
                    {isOver ? 'Over budget!' : `${pct}% used`}
                  </span>
                  <span className="text-xs font-medium text-neutral-500 font-mono">{formatCurrency(Math.max(budget.limit - budget.spent, 0))} left</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); resetForm(); }} title={editItem ? 'Edit Budget' : 'Create Budget'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Budget Name" placeholder="e.g., Food Budget" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Category</label>
            <select className="input-field" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} disabled={!!editItem}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <Input label="Monthly Limit (₹)" type="number" min="0" step="1" placeholder="10000" value={form.limit} onChange={(e) => setForm({ ...form, limit: e.target.value })} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => { setModalOpen(false); resetForm(); }}>Cancel</Button>
            <Button type="submit" className="flex-1">{editItem ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        title="Delete Budget?"
        message="This budget limits will be permanently removed."
      />
    </div>
  );
};

export default Budgets;
