import { BarChart3, ClipboardCheck, Settings } from 'lucide-react';
import { TabId } from '../types';

interface BottomNavProps {
  tab: TabId;
  onChange: (tab: TabId) => void;
}

export function BottomNav({ tab, onChange }: BottomNavProps) {
  const items = [
    ['attendance', 'Davomat', ClipboardCheck],
    ['dashboard', 'Hisobot', BarChart3],
    ['settings', 'Sozlamalar', Settings],
  ] as const;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 safe-bottom">
      <div className="max-w-2xl mx-auto grid grid-cols-3 h-16 px-2">
        {items.map(([id, label, Icon]) => {
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`relative flex flex-col items-center justify-center gap-1 rounded-2xl my-1 transition ${
                active
                  ? 'text-teal-600 dark:text-teal-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'stroke-[2.4]' : ''}`} />
              <span className="text-[11px] font-bold leading-none">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
