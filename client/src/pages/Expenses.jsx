import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Trash2, Edit3, Camera } from 'lucide-react';
import { expenseApi } from '../services/api/expense.api';
import { categoryApi } from '../services/api/category.api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ReceiptScanner from '../components/ui/ReceiptScanner';
import { PageLoader } from '../components/ui/Loader';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { toast } from 'react-toastify';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CHART_COLORS } from '../utils/constants';
import { DEMO_EXPENSES, DEMO_CATEGORIES, DEMO_EXPENSE_SUMMARY } from '../utils/demoData';

const Expenses = () => {
  const { isDemo } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [form, setForm] = useState({ title: '', amount: '', categoryId: '', notes: '', date: formatDate(new Date(), 'input') });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [scanModalOpen, setScanModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (isDemo) {
      setExpenses(DEMO_EXPENSES);
      setCategories(DEMO_CATEGORIES);
      setSummary(DEMO_EXPENSE_SUMMARY);
      setLoading(false);
      return;
    }
    try {
      const [expRes, catRes, sumRes] = await Promise.all([
        expenseApi.getAll({ category: filterCat, limit: 50 }),
        categoryApi.getAll(),
        expenseApi.getSummary({}),
      ]);
      setExpenses(expRes.data?.expenses || []);
      setCategories(catRes.data || []);
      setSummary(sumRes.data);
    } catch (err) {
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, [filterCat, isDemo]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const resetForm = () => {
    setForm({ title: '', amount: '', categoryId: '', notes: '', date: formatDate(new Date(), 'input') });
    setEditItem(null);
  };

  const openCreate = () => { resetForm(); setModalOpen(true); };
  const openEdit = (exp) => {
    setEditItem(exp);
    setForm({
      title: exp.title,
      amount: exp.amount.toString(),
      categoryId: exp.categoryId?._id || exp.categoryId,
      notes: exp.notes || '',
      date: formatDate(exp.date, 'input'),
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount || !form.categoryId) {
      toast.error('Please fill required fields');
      return;
    }
    if (isDemo) {
      const cat = categories.find(c => c._id === form.categoryId);
      const newExp = { _id: 'exp_' + Date.now(), title: form.title, amount: parseFloat(form.amount), categoryId: cat, notes: form.notes, date: new Date(form.date) };
      if (editItem) {
        setExpenses(prev => prev.map(e => e._id === editItem._id ? { ...e, ...newExp, _id: editItem._id } : e));
        toast.success('Expense updated');
      } else {
        setExpenses(prev => [newExp, ...prev]);
        toast.success('Expense added 💸');
      }
      setModalOpen(false);
      resetForm();
      return;
    }
    try {
      const payload = { ...form, amount: parseFloat(form.amount) };
      if (editItem) {
        await expenseApi.update(editItem._id, payload);
        toast.success('Expense updated');
      } else {
        await expenseApi.create(payload);
        toast.success('Expense added 💸');
      }
      setModalOpen(false);
      resetForm();
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    const id = deleteTarget;
    setDeleteTarget(null);
    if (!id) return;
    if (isDemo) {
      setExpenses(prev => prev.filter(e => e._id !== id));
      toast.success('Expense deleted');
      return;
    }
    try {
      await expenseApi.delete(id);
      toast.success('Expense deleted');
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filtered = expenses.filter(exp =>
    exp.title.toLowerCase().includes(search.toLowerCase())
  );

  const pieData = summary?.summary?.map(s => ({
    name: s.categoryName,
    value: s.total,
    color: s.categoryColor,
  })) || [];

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white font-display tracking-tight">Expenses</h1>
          <p className="text-neutral-500 mt-1">Track and manage all your expenses</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setScanModalOpen(true)} variant="outline" icon={Camera}>Scan Receipt</Button>
          <Button onClick={openCreate} icon={Plus}>Add Expense</Button>
        </div>
      </div>

      {/* Summary + Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white font-display tracking-tight">Category Breakdown</h3>
            <span className="text-sm text-neutral-500 font-mono">
              Total: {formatCurrency(summary?.totalExpenses || 0)}
            </span>
          </div>
          <div className="h-64">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={2} dataKey="value" animationDuration={1000}>
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color || CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ borderRadius: '12px', border: '1px solid #E8E8E3' }} />
                  <Legend iconType="circle" iconSize={8} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-neutral-500 text-sm">No expense data yet</div>
            )}
          </div>
        </Card>

        {/* Category summary list */}
        <Card>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white font-display mb-4 tracking-tight">Top Categories</h3>
          <div className="space-y-4">
            {(summary?.summary || []).slice(0, 6).map((cat, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span>{cat.categoryIcon}</span>
                  <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{cat.categoryName}</span>
                </div>
                <span className="text-sm font-bold text-neutral-900 dark:text-white font-mono">{formatCurrency(cat.total)}</span>
              </div>
            ))}
            {(!summary?.summary || summary.summary.length === 0) && (
              <p className="text-sm text-neutral-500 text-center py-4">No data</p>
            )}
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input placeholder="Search expenses..." value={search} onChange={(e) => setSearch(e.target.value)} icon={Search} />
          </div>
          <select
            className="input-field sm:w-48"
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.icon} {c.name}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Expense list */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No expenses found"
          description="Start tracking by adding your first expense"
          action={<Button onClick={openCreate} icon={Plus} size="sm">Add Expense</Button>}
        />
      ) : (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-900/50">
                  <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-4">Expense</th>
                  <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-4">Category</th>
                  <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-4">Date</th>
                  <th className="text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-4">Amount</th>
                  <th className="text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {filtered.map((exp, index) => (
                  <tr key={exp._id} className={`transition-colors ${index % 2 === 0 ? 'bg-white dark:bg-neutral-900' : 'bg-neutral-50/30 dark:bg-neutral-800/20'} hover:bg-neutral-50 dark:hover:bg-neutral-800/40`}>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{exp.title}</p>
                      {exp.notes && <p className="text-xs text-neutral-500 mt-0.5 truncate max-w-xs">{exp.notes}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{exp.categoryId?.icon || '📦'}</span>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">{exp.categoryId?.name || 'Uncategorized'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500">{formatDate(exp.date)}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-neutral-900 dark:text-white font-mono">{formatCurrency(exp.amount)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(exp)} className="p-1.5 rounded-lg text-neutral-400 hover:text-accent-500 hover:bg-accent-50 dark:hover:bg-accent-500/10 transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(exp._id)} className="p-1.5 rounded-lg text-neutral-400 hover:text-expense-500 hover:bg-expense-50 dark:hover:bg-expense-500/10 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); resetForm(); }} title={editItem ? 'Edit Expense' : 'Add Expense'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" name="title" placeholder="e.g., Lunch at Café" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input label="Amount (₹)" name="amount" type="number" min="0" step="0.01" placeholder="0.00" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Category</label>
            <select className="input-field" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              <option value="">Select category</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>
          <Input label="Date" name="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <Input label="Notes (optional)" name="notes" placeholder="Additional details..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => { setModalOpen(false); resetForm(); }}>Cancel</Button>
            <Button type="submit" className="flex-1">{editItem ? 'Update' : 'Add Expense'}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        title="Delete Expense?"
        message="This expense will be permanently removed."
      />

      {/* Receipt Scanner Modal */}
      <Modal
        isOpen={scanModalOpen}
        onClose={() => setScanModalOpen(false)}
        title="Scan Receipt"
      >
        <ReceiptScanner
          onResult={(data) => {
            setScanModalOpen(false);
            // Pre-fill the expense form with scanned data
            const matchedCat = data.categoryId || categories.find(
              c => c.name.toLowerCase() === (data.category || '').toLowerCase()
            )?._id || '';
            setForm({
              title: data.title || '',
              amount: data.amount != null ? data.amount.toString() : '',
              categoryId: matchedCat,
              notes: data.notes || '',
              date: data.date || formatDate(new Date(), 'input'),
            });
            setEditItem(null);
            setModalOpen(true);
          }}
          onClose={() => setScanModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Expenses;
