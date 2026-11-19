import { Download, Send } from 'lucide-react';

interface DashboardHeroProps {
  schoolName: string;
  percent: number;
  submittedCount: number;
  totalClasses: number;
  totalStudents: number;
  present: number;
  absent: number;
  sick: number;
  excused: number;
  unexcused: number;
  late: number;
  onOpenTelegram: () => void;
  onDownloadCsv: () => void;
}

export function DashboardHero({
  schoolName,
  percent,
  submittedCount,
  totalClasses,
  totalStudents,
  present,
  absent,
  sick,
  excused,
  unexcused,
  late,
  onOpenTelegram,
  onDownloadCsv,
}: DashboardHeroProps) {
  return (
    <>
      <div className="bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600 rounded-3xl p-5 text-white shadow-lg shadow-teal-700/20 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-teal-100 uppercase tracking-wider">
              Direktor oʻrinbosari paneli
            </p>
            <h2 className="text-xl font-extrabold mt-0.5">Kunlik umumiy davomat</h2>
            <p className="text-xs text-teal-100/90 mt-0.5">{schoolName}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-extrabold leading-none">{percent}%</div>
            <p className="text-[11px] text-teal-100 mt-1">
              {submittedCount} / {totalClasses} sinf
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="h-2.5 w-full rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${Math.min(100, percent)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-teal-50/90 font-medium">
            <span>Hisobga olingan: {totalStudents} oʻquvchi</span>
            <span>Keldi: {present} · Kelmadi: {absent}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={onOpenTelegram}
            className="h-11 rounded-2xl bg-white text-teal-800 hover:bg-teal-50 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition"
          >
            <Send className="w-4 h-4" />
            <span>Telegramga yuborish</span>
          </button>

          <button
            type="button"
            onClick={onDownloadCsv}
            className="h-11 rounded-2xl bg-teal-900/35 hover:bg-teal-900/50 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition"
          >
            <Download className="w-4 h-4" />
            <span>Excel (CSV) yuklash</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { label: 'Kasal', emoji: '🤒', value: sick, cls: 'text-amber-600 dark:text-amber-400' },
          { label: 'Sababli', emoji: '📄', value: excused, cls: 'text-sky-600 dark:text-sky-400' },
          { label: 'Sababsiz', emoji: '❌', value: unexcused, cls: 'text-rose-600 dark:text-rose-400' },
          { label: 'Kechikdi', emoji: '⏰', value: late, cls: 'text-violet-600 dark:text-violet-400' },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
              <p className={`text-2xl font-extrabold mt-0.5 ${item.cls}`}>{item.value}</p>
            </div>
            <span className="text-2xl">{item.emoji}</span>
          </div>
        ))}
      </div>
    </>
  );
}
