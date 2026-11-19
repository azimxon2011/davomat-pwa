import { BarChart3, ClipboardCheck, Settings, Users } from 'lucide-react';
import { TabId } from '../types';

interface BottomNavProps {
  tab: TabId;
  pendingCount: number;
  onChange: (tab: TabId) => void;
}

export function BottomNav({ tab, pendingCount, onChange }: BottomNavProps) {
  const items = [
    ['attendance', 'Davomat', ClipboardCheck, 0],
    ['dashboard', 'Hisobot', BarChart3, pendingCount],
    ['classes', 'Sinflar', Users, 0],
    ['settings', 'Sozlamalar', Settings, 0],
  ] as const;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 safe-bottom">
      <div className="max-w-2xl mx-auto grid grid-cols-4 h-16 px-2">
        {items.map(([id, label, Icon, badge]) => {
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
              <div className="relative">
                <Icon className={`w-5 h-5 ${active ? 'stroke-[2.4]' : ''}`} />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-amber-500 text-white text-[10px] font-extrabold flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-bold leading-none">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
