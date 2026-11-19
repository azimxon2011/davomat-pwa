import { AttendanceStatus, Student, StudentAttendance } from '../types';
import { I18N, Lang } from '../utils/i18n';
import { STATUS_LIST } from '../utils/status';

interface StudentRowProps {
  student: Student;
  index: number;
  record?: StudentAttendance;
  lang: Lang;
  onSelectStatus: (status: AttendanceStatus) => void;
  onEditReason: () => void;
}

export function StudentRow({
  student,
  index,
  record,
  lang,
  onSelectStatus,
  onEditReason,
}: StudentRowProps) {
  const t = I18N[lang];
  const status: AttendanceStatus = record?.status ?? 'present';
  const isFlagged = status !== 'present';

  const statusLabels: Record<AttendanceStatus, string> = {
    present: t.present,
    absent: t.absent,
    late: t.late,
  };

  const rowBg =
    status === 'absent'
      ? 'bg-rose-50/70 dark:bg-rose-950/20'
      : status === 'late'
        ? 'bg-amber-50/70 dark:bg-amber-950/20'
        : '';

  return (
    <div
      className={`px-3.5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-colors ${rowBg}`}
    >
      <div className="flex items-start justify-between gap-2 min-w-0">
        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
            <span className="text-zinc-400 mr-2 tabular-nums">{index + 1}.</span>
            {student.fullName}
          </p>
          {isFlagged && (
            <button
              type="button"
              onClick={onEditReason}
              className={`mt-1 ml-5 inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium transition ${
                status === 'absent'
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
              }`}
            >
              {record?.reason ? record.reason : t.addReason}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 sm:w-64 shrink-0 rounded-xl bg-zinc-100/90 dark:bg-zinc-800/80 p-1 gap-1">
        {STATUS_LIST.map((st) => {
          const active = status === st.id;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => onSelectStatus(st.id)}
              className={`h-8 rounded-lg text-xs font-semibold transition ${
                active
                  ? st.activeClass
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {statusLabels[st.id]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
