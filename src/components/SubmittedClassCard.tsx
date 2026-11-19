import { ChevronDown, ChevronUp, Users } from 'lucide-react';
import { ClassGroup, ClassReport } from '../types';
import { computeClassStats, STATUS_MAP } from '../utils/status';
import { formatTimeShort } from '../utils/uzbekDate';

interface SubmittedClassCardProps {
  cls: ClassGroup;
  report: ClassReport;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
}

export function SubmittedClassCard({
  cls,
  report,
  expanded,
  onToggle,
  onEdit,
}: SubmittedClassCardProps) {
  const st = computeClassStats(cls, report.records);
  const flagged = cls.students.filter(
    (s) => (report.records[s.id]?.status ?? 'present') !== 'present'
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-3.5 flex items-center justify-between gap-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-slate-900 dark:text-white">
              {cls.name}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              {st.attendancePercent}%
            </span>
            <span className="text-[11px] text-slate-400">
              {formatTimeShort(report.submittedAt)}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
            {cls.curatorName}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 justify-end">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              {st.present + st.late}/{st.total}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {flagged.length === 0 ? 'Hammasi keldi' : `${flagged.length} ta qaydnoma`}
            </span>
          </div>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {flagged.length === 0 ? (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium py-1">
              🎉 Barcha oʻquvchilar darsda toʻliq qatnashmoqda.
            </p>
          ) : (
            flagged.map((s) => {
              const rec = report.records[s.id];
              const meta = STATUS_MAP[rec.status];
              return (
                <div
                  key={s.id}
                  className="flex items-start justify-between gap-2 text-xs py-1.5 border-b last:border-b-0 border-slate-100 dark:border-slate-800/70"
                >
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {s.fullName}
                    </p>
                    {rec.note && (
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                        Izoh: {rec.note}
                      </p>
                    )}
                  </div>
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded-lg border font-semibold ${meta.badgeClass}`}
                  >
                    {meta.emoji} {meta.label}
                  </span>
                </div>
              );
            })
          )}

          <button
            type="button"
            onClick={onEdit}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline pt-1"
          >
            Tahrirlashga oʻtish →
          </button>
        </div>
      )}
    </div>
  );
}
