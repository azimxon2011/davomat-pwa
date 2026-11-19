import { ClassStats } from '../utils/status';

interface AttendanceFooterProps {
  stats: ClassStats;
  onSendTelegram: () => void;
}

export function AttendanceFooter({ stats, onSendTelegram }: AttendanceFooterProps) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm border-t border-zinc-200 dark:border-zinc-800 safe-bottom">
      <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs font-medium text-zinc-600 dark:text-zinc-400 tabular-nums">
          <span>Keldi: {stats.present}</span>
          <span className="text-red-600 dark:text-red-400">Kelmadi: {stats.absent}</span>
          <span className="text-amber-600 dark:text-amber-400">Kechikdi: {stats.late}</span>
        </div>

        <button
          type="button"
          onClick={onSendTelegram}
          className="h-10 px-4 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-semibold shrink-0"
        >
          Telegramga yuborish
        </button>
      </div>
    </div>
  );
}
