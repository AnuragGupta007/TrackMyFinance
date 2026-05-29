import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { User, Sun, Moon } from 'lucide-react';
import { toast } from 'react-toastify';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [form, setForm] = useState({ name: user?.name || '' });
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setLoading(true);
    try {
      await updateUser({ name: form.name });
      toast.success('Profile updated');
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white font-display tracking-tight">Settings</h1>

      {/* Profile */}
      <Card>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white font-display mb-4 tracking-tight">Profile</h3>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-medium text-neutral-900 dark:text-white">{user?.name}</p>
            <p className="text-sm text-neutral-500">{user?.email}</p>
          </div>
        </div>
        <form onSubmit={handleUpdate} className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} icon={User} />
          <Button type="submit" loading={loading}>Save Changes</Button>
        </form>
      </Card>

      {/* Appearance */}
      <Card>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white font-display mb-4 tracking-tight">Appearance</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-neutral-800 dark:text-neutral-200">Dark Mode</p>
            <p className="text-sm text-neutral-500">Toggle between light and dark theme</p>
          </div>
          <button onClick={toggleTheme}
            className={`w-14 h-7 rounded-full flex items-center p-1 transition-colors ${darkMode ? 'bg-primary-500' : 'bg-neutral-200'}`}>
            <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform flex items-center justify-center ${darkMode ? 'translate-x-7' : ''}`}>
              {darkMode ? <Moon className="w-3 h-3 text-primary-500" /> : <Sun className="w-3 h-3 text-neutral-400" />}
            </div>
          </button>
        </div>
      </Card>

      {/* App Info */}
      <Card>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white font-display mb-4 tracking-tight">About</h3>
        <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
          <p><span className="font-medium">App:</span> TrackMyFinance v1.0.0</p>
          <p><span className="font-medium">Currency:</span> ₹ (INR)</p>
          <p><span className="font-medium">Stack:</span> React · Node.js · MongoDB</p>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
