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
          className="h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium shrink-0"
        >
          Hammasi keldi
        </button>
      </div>

      <div className="flex items-center gap-1.5 text-xs">
        {(
          [
            ['all', `Barchasi (${stats.total})`],
            ['absent', `Kelmaganlar (${stats.absent})`],
            ['late', `Kechikkanlar (${stats.late})`],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => onFilterChange(id)}
            className={`px-2.5 py-1 rounded-md font-medium transition ${
              filter === id
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
