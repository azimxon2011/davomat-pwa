import { CheckCircle2 } from 'lucide-react';
import { ClassGroup } from '../types';

interface ClassPillsProps {
  classes: ClassGroup[];
  selectedId: string;
  doneIds: Set<string>;
  onSelect: (id: string) => void;
}

export function ClassPills({ classes, selectedId, doneIds, onSelect }: ClassPillsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
      {classes.map((c) => {
        const active = c.id === selectedId;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(c.id)}
            className={`shrink-0 h-10 px-3.5 rounded-2xl text-sm font-bold flex items-center gap-1.5 border transition active:scale-95 ${
              active
                ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800'
            }`}
          >
            <span>{c.name}</span>
            {doneIds.has(c.id) && (
              <CheckCircle2 className={`w-4 h-4 ${active ? 'text-teal-100' : 'text-emerald-500'}`} />
            )}
          </button>
        );
      })}
    </div>
  );
}
