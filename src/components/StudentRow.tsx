import { MessageSquarePlus } from 'lucide-react';
import { AttendanceStatus, Student, StudentAttendance } from '../types';
import { STATUS_LIST, STATUS_MAP } from '../utils/status';

interface StudentRowProps {
  student: Student;
  index: number;
  record?: StudentAttendance;
  onStatusChange: (status: AttendanceStatus) => void;
  onOpenNote: () => void;
}

export function StudentRow({
  student,
  index,
  record,
  onStatusChange,
  onOpenNote,
}: StudentRowProps) {
  const status: AttendanceStatus = record?.status ?? 'present';
  const meta = STATUS_MAP[status];
  const isFlagged = status !== 'present';

  return (
    <div
      className={`rounded-2xl border p-3 transition ${
        isFlagged
          ? 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 shadow-xs'
          : 'bg-white/90 dark:bg-slate-900/80 border-slate-200/70 dark:border-slate-800/80'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5 min-w-0">
          <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
            {index + 1}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
              {student.fullName}
            </p>
            {record?.note && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                Izoh: {record.note}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenNote}
          title="Izoh qoʻshish"
          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition ${
            record?.note
              ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/70 dark:text-teal-300'
              : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <MessageSquarePlus className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-2.5 grid grid-cols-5 gap-1.5">
        {STATUS_LIST.map((st) => {
          const active = status === st.id;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => onStatusChange(st.id)}
              className={`h-9 rounded-xl border text-[11px] font-semibold flex items-center justify-center gap-1 transition active:scale-95 ${
                active
                  ? st.pillActiveClass
                  : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="text-xs">{st.emoji}</span>
              <span className="hidden sm:inline truncate">{st.label}</span>
            </button>
          );
        })}
      </div>

      {isFlagged && (
        <div className="mt-2 flex items-center justify-between text-[11px]">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border font-semibold ${meta.badgeClass}`}
          >
            {meta.emoji} {meta.label}
          </span>
          <button
            type="button"
            onClick={onOpenNote}
            className="text-teal-600 dark:text-teal-400 font-semibold hover:underline"
          >
            {record?.note ? 'Izohni tahrirlash' : '+ Sabab yozish'}
          </button>
        </div>
      )}
    </div>
  );
}
