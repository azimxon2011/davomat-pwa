import { Search, X } from 'lucide-react';
import { ClassStats } from '../utils/status';

export type FilterMode = 'all' | 'absent' | 'late';

interface AttendanceHeaderProps {
  stats: ClassStats;
  search: string;
  onSearchChange: (v: string) => void;
  filter: FilterMode;
  onFilterChange: (f: FilterMode) => void;
  onAllPresent: () => void;
}

export function AttendanceHeader({
  stats,
  search,
  onSearchChange,
  filter,
  onFilterChange,
  onAllPresent,
}: AttendanceHeaderProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Qidirish..."
            className="w-full h-9 pl-9 pr-8 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-zinc-400"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onAllPresent}
          className="h-9 px-3 rounded-lg border border-emerald-200 dark:border-emerald-800/70 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold shrink-0 transition"
        >
          Hammasi keldi
        </button>
      </div>

      <div className="flex items-center gap-1.5 text-xs">
        {(
          [
            ['all', `Barchasi (${stats.total})`, 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/20'],
            ['absent', `Kelmaganlar (${stats.absent})`, 'bg-rose-600 text-white shadow-xs shadow-rose-600/20'],
            ['late', `Kechikkanlar (${stats.late})`, 'bg-amber-500 text-white shadow-xs shadow-amber-500/20'],
          ] as const
        ).map(([id, label, activeCls]) => (
          <button
            key={id}
            type="button"
            onClick={() => onFilterChange(id)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              filter === id
                ? activeCls
                : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-indigo-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
