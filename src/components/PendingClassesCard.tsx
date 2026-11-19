import { BellRing, Clock } from 'lucide-react';
import { ClassGroup } from '../types';
import { buildReminderMessage, openTelegramShare } from '../utils/telegram';

interface PendingClassesCardProps {
  pending: ClassGroup[];
  date: string;
  onJumpToClass: (classId: string) => void;
}

export function PendingClassesCard({
  pending,
  date,
  onJumpToClass,
}: PendingClassesCardProps) {
  if (pending.length === 0) return null;

  return (
    <div className="bg-amber-50/70 dark:bg-amber-950/25 border border-amber-200/90 dark:border-amber-900/60 rounded-3xl p-4 space-y-3">
      <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Hali topshirmagan sinflar ({pending.length})
      </h3>

      <div className="space-y-2">
        {pending.map((cls) => (
          <div
            key={cls.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-amber-200/60 dark:border-slate-800 flex items-center justify-between gap-2"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {cls.name}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                  {cls.shift}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {cls.curatorName}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => openTelegramShare(buildReminderMessage(cls, date))}
                className="h-9 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 text-xs font-semibold flex items-center gap-1 transition"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>Eslatma</span>
              </button>
              <button
                type="button"
                onClick={() => onJumpToClass(cls.id)}
                className="h-9 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition"
              >
                Belgilash
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
