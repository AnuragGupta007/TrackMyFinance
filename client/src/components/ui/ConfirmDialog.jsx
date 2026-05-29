import { AlertTriangle } from 'lucide-react';
import Button from './Button';

const ConfirmDialog = ({ isOpen, onConfirm, onCancel, title = 'Are you sure?', message = 'This action cannot be undone.' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-[2px] animate-fade-in" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-xl shadow-card-lg border border-neutral-200 dark:border-neutral-800 animate-scale-in z-10 p-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-expense-50 dark:bg-expense-500/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7 text-expense-500" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white font-display mb-1 tracking-tight">{title}</h3>
          <p className="text-sm text-neutral-500 mb-6">{message}</p>
          <div className="flex gap-3 w-full">
            <Button variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
            <Button variant="danger" className="flex-1" onClick={onConfirm}>Delete</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
