import { CheckCheck, CheckCircle2, Search, X } from 'lucide-react';
import { ClassGroup, ClassReport } from '../types';
import { ClassStats } from '../utils/status';
import { formatTimeShort } from '../utils/uzbekDate';

export type FilterMode = 'all' | 'absent' | 'late';

interface AttendanceHeaderProps {
  currentClass: ClassGroup;
  existingReport?: ClassReport;
  stats: ClassStats;
  search: string;
  onSearchChange: (v: string) => void;
  filter: FilterMode;
  onFilterChange: (f: FilterMode) => void;
  onAllPresent: () => void;
}

export function AttendanceHeader({
  currentClass,
  existingReport,
  stats,
  search,
  onSearchChange,
  filter,
  onFilterChange,
  onAllPresent,
}: AttendanceHeaderProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 shadow-xs space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              {currentClass.name} sinf
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {currentClass.shift}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Sinf rahbari: {currentClass.curatorName}
          </p>
        </div>

        {existingReport ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {formatTimeShort(existingReport.submittedAt)}
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 shrink-0">
            Topshirilmagan
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={onAllPresent}
          className="h-10 px-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-[0.98] transition shrink-0"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Hammasi keldi (1 bosish)</span>
        </button>

        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Oʻquvchi ismini qidirish..."
            className="w-full h-10 pl-9 pr-8 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs">
        {(
          [
            ['all', `Barchasi (${stats.total})`],
            ['absent', `Kelmaganlar (${stats.absentTotal})`],
            ['late', `Kechikkanlar (${stats.late})`],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => onFilterChange(id)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              filter === id
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
