import { AttendanceStatus, ClassGroup, StudentAttendance } from '../types';

export interface StatusMeta {
  id: AttendanceStatus;
  label: string;
  emoji: string;
  badgeClass: string;
  pillActiveClass: string;
  dotClass: string;
}

export const STATUS_LIST: StatusMeta[] = [
  {
    id: 'present',
    label: 'Keldi',
    emoji: '✅',
    badgeClass:
      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60',
    pillActiveClass:
      'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/20',
    dotClass: 'bg-emerald-500',
  },
  {
    id: 'sick',
    label: 'Kasal',
    emoji: '🤒',
    badgeClass:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/60',
    pillActiveClass:
      'bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-500/20',
    dotClass: 'bg-amber-500',
  },
  {
    id: 'excused',
    label: 'Sababli',
    emoji: '📄',
    badgeClass:
      'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800/60',
    pillActiveClass:
      'bg-sky-600 text-white border-sky-600 shadow-sm shadow-sky-600/20',
    dotClass: 'bg-sky-500',
  },
  {
    id: 'unexcused',
    label: 'Sababsiz',
    emoji: '❌',
    badgeClass:
      'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/60',
    pillActiveClass:
      'bg-rose-600 text-white border-rose-600 shadow-sm shadow-rose-600/20',
    dotClass: 'bg-rose-500',
  },
  {
    id: 'late',
    label: 'Kechikdi',
    emoji: '⏰',
    badgeClass:
      'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800/60',
    pillActiveClass:
      'bg-violet-600 text-white border-violet-600 shadow-sm shadow-violet-600/20',
    dotClass: 'bg-violet-500',
  },
];

export const STATUS_MAP: Record<AttendanceStatus, StatusMeta> = STATUS_LIST.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<AttendanceStatus, StatusMeta>
);

export const NEXT_STATUS: Record<AttendanceStatus, AttendanceStatus> = {
  present: 'unexcused',
  unexcused: 'sick',
  sick: 'excused',
  excused: 'late',
  late: 'present',
};

export interface ClassStats {
  total: number;
  present: number;
  sick: number;
  excused: number;
  unexcused: number;
  late: number;
  absentTotal: number;
  attendancePercent: number;
}

export function computeClassStats(
  cls: ClassGroup,
  records: Record<string, StudentAttendance>
): ClassStats {
  let present = 0;
  let sick = 0;
  let excused = 0;
  let unexcused = 0;
  let late = 0;

  for (const s of cls.students) {
    const st = records[s.id]?.status ?? 'present';
    if (st === 'present') present++;
    else if (st === 'sick') sick++;
    else if (st === 'excused') excused++;
    else if (st === 'unexcused') unexcused++;
    else if (st === 'late') late++;
  }

  const total = cls.students.length;
  const absentTotal = sick + excused + unexcused;
  const attendancePercent =
    total === 0 ? 100 : Math.round(((present + late) / total) * 1000) / 10;

  return {
    total,
    present,
    sick,
    excused,
    unexcused,
    late,
    absentTotal,
    attendancePercent,
  };
}
