import { Save, Send } from 'lucide-react';
import { ClassStats } from '../utils/status';

interface AttendanceFooterProps {
  stats: ClassStats;
  onSave: () => void;
  onSendTelegram: () => void;
}

export function AttendanceFooter({
  stats,
  onSave,
  onSendTelegram,
}: AttendanceFooterProps) {
  return (
    <div className="fixed bottom-[76px] left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-2xl z-30">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xl shadow-slate-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center justify-between sm:justify-start gap-3 text-xs font-semibold">
          <span className="text-emerald-600 dark:text-emerald-400">✅ {stats.present}</span>
          <span className="text-rose-600 dark:text-rose-400">❌ {stats.absentTotal}</span>
          <span className="text-violet-600 dark:text-violet-400">⏰ {stats.late}</span>
          <span className="px-2 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold">
            {stats.attendancePercent}%
          </span>
        </div>
        <div className="grid grid-cols-2 sm:flex items-center gap-2">
          <button
            type="button"
            onClick={onSave}
            className="h-10 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition"
          >
            <Save className="w-4 h-4" />
            <span>Saqlash</span>
          </button>
          <button
            type="button"
            onClick={onSendTelegram}
            className="h-10 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-teal-600/25 active:scale-95 transition"
          >
            <Send className="w-4 h-4" />
            <span>Telegramga yuborish</span>
          </button>
        </div>
      </div>
    </div>
  );
}
