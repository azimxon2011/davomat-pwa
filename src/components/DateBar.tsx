import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  formatUzbekDate,
  formatUzbekWeekday,
  getTodayISO,
  shiftDateISO,
} from '../utils/uzbekDate';

interface DateBarProps {
  date: string;
  onChange: (date: string) => void;
}

export function DateBar({ date, onChange }: DateBarProps) {
  const today = getTodayISO();
  const isToday = date === today;

  return (
    <div className="flex items-center justify-between gap-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-2 shadow-xs">
      <button
        type="button"
        onClick={() => onChange(shiftDateISO(date, -1))}
        aria-label="Oldingi kun"
        className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <label className="relative flex-1 flex flex-col items-center justify-center cursor-pointer py-0.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
        <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-white">
          <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>{formatUzbekDate(date)}</span>
        </div>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {formatUzbekWeekday(date)}
        </span>
        <input
          type="date"
          value={date}
          max={today}
          onChange={(e) => {
            if (e.target.value) onChange(e.target.value);
          }}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </label>

      <div className="flex items-center gap-1">
        {!isToday && (
          <button
            type="button"
            onClick={() => onChange(today)}
            className="px-2.5 h-10 rounded-xl text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 transition"
          >
            Bugun
          </button>
        )}
        <button
          type="button"
          disabled={isToday}
          onClick={() => onChange(shiftDateISO(date, 1))}
          aria-label="Keyingi kun"
          className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-35 disabled:pointer-events-none active:scale-95 transition"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
