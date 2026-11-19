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
    <div className="px-3.5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
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
              className="mt-0.5 ml-5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 underline decoration-dotted underline-offset-2"
            >
              {record?.reason ? record.reason : 'Sabab qoʻshish'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 sm:w-64 shrink-0 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 p-0.5 gap-0.5">
        {STATUS_LIST.map((st) => {
          const active = status === st.id;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => onSelectStatus(st.id)}
              className={`h-8 rounded-md text-xs font-medium transition ${
                active
                  ? st.activeClass
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {st.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
