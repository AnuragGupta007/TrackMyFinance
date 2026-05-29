import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Edit3, HandCoins } from 'lucide-react';
import { savingsApi } from '../services/api/savings.api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { PageLoader } from '../components/ui/Loader';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { GOAL_ICONS, GOAL_COLORS } from '../utils/constants';
import { toast } from 'react-toastify';
import { DEMO_SAVINGS_GOALS } from '../utils/demoData';

const Savings = () => {
  const { isDemo } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [contributeModal, setContributeModal] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', targetAmount: '', targetDate: '', color: '#0D9488', icon: '🎯' });
  const [contribForm, setContribForm] = useState({ amount: '', note: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchData = useCallback(async () => {
    if (isDemo) { setGoals(DEMO_SAVINGS_GOALS); setLoading(false); return; }
    try {
      const res = await savingsApi.getAll();
      setGoals(res.data || []);
    } catch { toast.error('Failed to load goals'); }
    finally { setLoading(false); }
  }, [isDemo]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const resetForm = () => { setForm({ name: '', targetAmount: '', targetDate: '', color: '#0D9488', icon: '🎯' }); setEditItem(null); };

  const openCreate = () => { resetForm(); setModalOpen(true); };
  const openEdit = (g) => {
    setEditItem(g);
    setForm({ name: g.name, targetAmount: g.targetAmount.toString(), targetDate: g.targetDate ? formatDate(g.targetDate, 'input') : '', color: g.color || '#0D9488', icon: g.icon || '🎯' });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.targetAmount) { toast.error('Name and target amount are required'); return; }
    if (isDemo) {
      if (editItem) {
        setGoals(prev => prev.map(g => g._id === editItem._id ? { ...g, name: form.name, targetAmount: parseFloat(form.targetAmount), icon: form.icon, color: form.color } : g));
        toast.success('Goal updated');
      } else {
        const newGoal = { _id: 'sav_' + Date.now(), name: form.name, targetAmount: parseFloat(form.targetAmount), currentAmount: 0, status: 'active', color: form.color, icon: form.icon, contributions: [] };
        setGoals(prev => [...prev, newGoal]);
        toast.success('Savings goal created 🎯');
      }
      setModalOpen(false); resetForm(); return;
    }
    try {
      const payload = { ...form, targetAmount: parseFloat(form.targetAmount) };
      if (editItem) { await savingsApi.update(editItem._id, payload); toast.success('Goal updated'); }
      else { await savingsApi.create(payload); toast.success('Savings goal created 🎯'); }
      setModalOpen(false); resetForm(); fetchData();
    } catch (err) { toast.error(err.message); }
  };

  const handleContribute = async (e) => {
    e.preventDefault();
    if (!contribForm.amount || parseFloat(contribForm.amount) <= 0) { toast.error('Enter a valid amount'); return; }
    if (isDemo) {
      const amt = parseFloat(contribForm.amount);
      setGoals(prev => prev.map(g => g._id === contributeModal._id ? { ...g, currentAmount: g.currentAmount + amt } : g));
      toast.success('Contribution added! 💰');
      setContributeModal(null); setContribForm({ amount: '', note: '' }); return;
    }
    try {
      await savingsApi.contribute(contributeModal._id, { amount: parseFloat(contribForm.amount), note: contribForm.note });
      toast.success('Contribution added! 💰');
      setContributeModal(null); setContribForm({ amount: '', note: '' }); fetchData();
    } catch (err) { toast.error(err.message); }
  };

  const handleDelete = async () => {
    const id = deleteTarget;
    setDeleteTarget(null);
    if (!id) return;
    if (isDemo) { setGoals(prev => prev.filter(g => g._id !== id)); toast.success('Goal deleted'); return; }
    try { await savingsApi.delete(id); toast.success('Goal deleted'); fetchData(); }
    catch (err) { toast.error(err.message); }
  };

  const totalSaved = goals.reduce((a, g) => a + g.currentAmount, 0);
  const totalTarget = goals.reduce((a, g) => a + g.targetAmount, 0);

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white font-display tracking-tight">Savings Goals</h1>
          <p className="text-neutral-500 mt-1">Track progress towards your financial dreams</p>
        </div>
        <Button onClick={openCreate} icon={Plus}>New Goal</Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary-500 to-primary-700 text-white border-none shadow-lg shadow-primary-500/20">
          <p className="text-white/80 text-sm font-medium">Total Saved</p>
          <p className="text-3xl font-bold font-mono mt-1 tracking-tight">{formatCurrency(totalSaved)}</p>
        </Card>
        <Card className="bg-gradient-to-br from-accent-500 to-accent-700 text-white border-none shadow-lg shadow-accent-500/20">
          <p className="text-white/80 text-sm font-medium">Total Target</p>
          <p className="text-3xl font-bold font-mono mt-1 tracking-tight">{formatCurrency(totalTarget)}</p>
        </Card>
        <Card className="bg-gradient-to-br from-[#111111] to-[#1C1C1E] text-white border-none shadow-lg shadow-black/20">
          <p className="text-white/80 text-sm font-medium">Active Goals</p>
          <p className="text-3xl font-bold font-mono mt-1 tracking-tight">{goals.filter(g => g.status === 'active').length}</p>
        </Card>
      </div>

      {/* Goals grid */}
      {goals.length === 0 ? (
        <EmptyState title="No savings goals yet" description="Set your first savings goal and start building your future" action={<Button onClick={openCreate} icon={Plus} size="sm">Create Goal</Button>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {goals.map((goal) => {
            const pct = goal.targetAmount > 0 ? Math.round((goal.currentAmount / goal.targetAmount) * 100) : 0;
            return (
              <Card key={goal._id} className="group flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-neutral-100 dark:bg-neutral-800">
                      {goal.icon || '🎯'}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-tight">{goal.name}</h4>
                      <Badge variant={goal.status === 'completed' ? 'success' : goal.status === 'paused' ? 'warning' : 'info'} className="mt-0.5">
                        {goal.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(goal)} className="p-1.5 text-neutral-400 hover:text-accent-500 hover:bg-accent-50 dark:hover:bg-accent-500/10 rounded-lg transition-colors"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteTarget(goal._id)} className="p-1.5 text-neutral-400 hover:text-expense-500 hover:bg-expense-50 dark:hover:bg-expense-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="mb-2 mt-auto">
                  <span className="text-3xl font-bold font-mono tracking-tight" style={{ color: goal.color || '#0D9488' }}>{pct}%</span>
                </div>
                <ProgressBar value={goal.currentAmount} max={goal.targetAmount} color={goal.color || '#0D9488'} size="md" />
                <div className="flex justify-between items-center mt-3 text-xs text-neutral-500">
                  <span className="font-mono font-bold text-neutral-900 dark:text-white">{formatCurrency(goal.currentAmount)}</span>
                  <span className="font-mono">of {formatCurrency(goal.targetAmount)}</span>
                </div>
                {goal.targetDate && (
                  <p className="text-xs text-neutral-500 mt-2 font-medium">Target: {formatDate(goal.targetDate)}</p>
                )}
                {goal.status === 'active' && (
                  <Button size="sm" variant="outline" className="w-full mt-4" icon={HandCoins}
                    onClick={() => { setContributeModal(goal); setContribForm({ amount: '', note: '' }); }}>
                    Add Money
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); resetForm(); }} title={editItem ? 'Edit Goal' : 'New Savings Goal'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Goal Name" placeholder="e.g., Emergency Fund" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Target Amount (₹)" type="number" min="1" placeholder="100000" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} />
          <Input label="Target Date (optional)" type="date" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Icon</label>
            <div className="flex flex-wrap gap-2">
              {GOAL_ICONS.map(ic => (
                <button key={ic} type="button" onClick={() => setForm({ ...form, icon: ic })}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border-2 transition-all ${form.icon === ic ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10' : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'}`}>
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Color</label>
            <div className="flex flex-wrap gap-2">
              {GOAL_COLORS.map(c => (
                <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                  className={`w-8 h-8 rounded-full transition-all ${form.color === c ? 'ring-2 ring-offset-2 ring-neutral-400 dark:ring-offset-neutral-900' : ''}`} style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => { setModalOpen(false); resetForm(); }}>Cancel</Button>
            <Button type="submit" className="flex-1">{editItem ? 'Update' : 'Create Goal'}</Button>
          </div>
        </form>
      </Modal>

      {/* Contribute Modal */}
      <Modal isOpen={!!contributeModal} onClose={() => setContributeModal(null)} title={`Add to "${contributeModal?.name}"`} size="sm">
        <form onSubmit={handleContribute} className="space-y-4">
          <Input label="Amount (₹)" type="number" min="1" placeholder="5000" value={contribForm.amount} onChange={(e) => setContribForm({ ...contribForm, amount: e.target.value })} />
          <Input label="Note (optional)" placeholder="Monthly savings" value={contribForm.note} onChange={(e) => setContribForm({ ...contribForm, note: e.target.value })} />
          <Button type="submit" className="w-full" icon={HandCoins}>Add Contribution</Button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        title="Delete Goal?"
        message="This savings goal will be permanently removed."
      />
    </div>
  );
};

export default Savings;
