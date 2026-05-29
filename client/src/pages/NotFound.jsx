import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Home } from 'lucide-react';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4">
    <div className="text-center animate-fade-in-up">
      <h1 className="text-8xl font-bold gradient-text font-display mb-4 tracking-tight">404</h1>
      <p className="text-xl font-medium text-neutral-800 dark:text-neutral-200 mb-2">Page Not Found</p>
      <p className="text-neutral-500 mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link to="/"><Button icon={Home}>Go Home</Button></Link>
    </div>
  </div>
);

export default NotFound;
