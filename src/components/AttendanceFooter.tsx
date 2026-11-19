import { I18N, Lang } from '../utils/i18n';
import { ClassStats } from '../utils/status';

interface AttendanceFooterProps {
  stats: ClassStats;
  lang: Lang;
  onSendTelegram: () => void;
}

export function AttendanceFooter({ stats, lang, onSendTelegram }: AttendanceFooterProps) {
  const t = I18N[lang];

  return (
    <div className="fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-indigo-100 dark:border-zinc-800 safe-bottom">
      <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold tabular-nums">
          <span className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
            {t.present}: {stats.present}
          </span>
          <span className="px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
            {t.absentShort}: {stats.absent}
          </span>
          <span className="px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
            {t.lateShort}: {stats.late}
          </span>
        </div>

        <button
          type="button"
          onClick={onSendTelegram}
          className="h-10 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 active:scale-[0.98] transition shrink-0"
        >
          {t.send}
        </button>
      </div>
    </div>
  );
}
