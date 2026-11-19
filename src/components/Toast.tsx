import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export interface ToastMessage {
  id: number;
  text: string;
  type?: 'success' | 'error' | 'info';
}

export function Toast({ toast }: { toast: ToastMessage | null }) {
  if (!toast) return null;

  const styles =
    toast.type === 'error'
      ? 'bg-rose-600 text-white shadow-rose-600/30'
      : toast.type === 'info'
        ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 shadow-slate-900/20'
        : 'bg-teal-600 text-white shadow-teal-600/30';

  const Icon =
    toast.type === 'error'
      ? AlertCircle
      : toast.type === 'info'
        ? Info
        : CheckCircle2;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md pointer-events-none">
      <div
        className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lg text-sm font-medium transition-all ${styles}`}
      >
        <Icon className="w-4 h-4 shrink-0" />
        <span className="leading-snug">{toast.text}</span>
      </div>
    </div>
  );
}
