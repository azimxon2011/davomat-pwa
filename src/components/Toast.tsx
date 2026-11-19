export interface ToastMessage {
  id: number;
  text: string;
  type?: 'success' | 'error' | 'info';
}

export function Toast({ toast }: { toast: ToastMessage | null }) {
  if (!toast) return null;

  const styles =
    toast.type === 'error'
      ? 'bg-red-600 text-white'
      : 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950';

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm pointer-events-none">
      <div className={`px-4 py-2.5 rounded-xl text-sm font-medium text-center shadow-md ${styles}`}>
        {toast.text}
      </div>
    </div>
  );
}
