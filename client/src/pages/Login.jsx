import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, TrendingUp, Play } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { toast } from 'react-toastify';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Mobile logo */}
      <div className="lg:hidden flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold text-neutral-900 dark:text-white font-display tracking-tight">TrackMyFinance</span>
      </div>

      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white font-display mb-2 tracking-tight">Welcome back</h1>
      <p className="text-neutral-500 mb-8">Enter your credentials to access your dashboard</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          icon={Mail}
          autoComplete="email"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          icon={Lock}
          autoComplete="current-password"
        />
        <Button type="submit" className="w-full" loading={loading}>
          Sign In
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 mt-6">
        <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
        <span className="text-xs text-neutral-400 font-medium">OR</span>
        <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
      </div>

      {/* Demo button */}
      <Button
        variant="outline"
        className="w-full mt-4"
        icon={Play}
        onClick={() => { loginAsDemo(); navigate('/dashboard'); }}
      >
        Try Demo — No Sign In Needed
      </Button>

      <p className="text-center text-sm text-neutral-500 mt-6">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-primary-500 font-medium hover:text-primary-600 transition-colors">
          Create one free
        </Link>
      </p>
    </div>
  );
};

export default Login;
