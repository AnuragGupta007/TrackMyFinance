import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '../ui/Button';

const benefits = [
  'Track unlimited expenses for free',
  'Beautiful charts and analytics',
  'Set and monitor savings goals',
  'Category-wise budget management',
  'Dark mode for night owls',
  'Secure JWT authentication',
];

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #111111 0%, #1A1A1A 50%, #111111 100%)' }}>
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary-500/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-accent-400/6 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-display mb-6 tracking-tight">
          Ready to take control of your <span className="gradient-text">finances?</span>
        </h2>
        <p className="text-lg text-neutral-500 max-w-xl mx-auto mb-10">
          Join thousands of smart savers who are already tracking their way to financial freedom.
        </p>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-lg mx-auto mb-10 text-left">
          {benefits.map((b) => (
            <div key={b} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary-400 flex-shrink-0" />
              <span className="text-sm text-neutral-400">{b}</span>
            </div>
          ))}
        </div>

        <Button size="lg" onClick={() => navigate('/register')} className="text-base px-10 py-4">
          Get Started — It&apos;s Free <ArrowRight className="w-5 h-5 ml-1" />
        </Button>
      </div>
    </section>
  );
};

export default CTA;
