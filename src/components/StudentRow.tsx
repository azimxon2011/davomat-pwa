import { AttendanceStatus, Student, StudentAttendance } from '../types';
import { STATUS_LIST } from '../utils/status';

interface StudentRowProps {
  student: Student;
  index: number;
  record?: StudentAttendance;
  onSelectStatus: (status: AttendanceStatus) => void;
  onEditReason: () => void;
}

export function StudentRow({
  student,
  index,
  record,
  onSelectStatus,
  onEditReason,
}: StudentRowProps) {
  const status: AttendanceStatus = record?.status ?? 'present';
  const isFlagged = status !== 'present';

  return (
    <div
      className={`rounded-2xl border p-3 transition ${
        isFlagged
          ? 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 shadow-xs'
          : 'bg-white/90 dark:bg-slate-900/80 border-slate-200/70 dark:border-slate-800/80'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold flex items-center justify-center shrink-0">
            {index + 1}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white leading-snug truncate">
              {student.fullName}
            </p>
            {isFlagged && record?.reason && (
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-0.5 truncate">
                Sabab: {record.reason}
              </p>
            )}
          </div>
        </div>

        {isFlagged && (
          <button
            type="button"
            onClick={onEditReason}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline shrink-0"
          >
            {record?.reason ? 'Tahrirlash' : '+ Sabab'}
          </button>
        )}
      </div>

      <div className="mt-2.5 grid grid-cols-3 gap-2">
        {STATUS_LIST.map((st) => {
          const active = status === st.id;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => onSelectStatus(st.id)}
              className={`h-10 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 ${
                active
                  ? st.pillActiveClass
                  : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{st.emoji}</span>
              <span>{st.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
