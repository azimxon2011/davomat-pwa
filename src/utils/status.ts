import { AttendanceStatus, ClassGroup, StudentAttendance } from '../types';

export interface StatusMeta {
  id: AttendanceStatus;
  label: string;
  emoji: string;
  badgeClass: string;
  pillActiveClass: string;
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
  },
  {
    id: 'absent',
    label: 'Kelmadi',
    emoji: '❌',
    badgeClass:
      'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/60',
    pillActiveClass:
      'bg-rose-600 text-white border-rose-600 shadow-sm shadow-rose-600/20',
  },
  {
    id: 'late',
    label: 'Kechikdi',
    emoji: '⏰',
    badgeClass:
      'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800/60',
    pillActiveClass:
      'bg-violet-600 text-white border-violet-600 shadow-sm shadow-violet-600/20',
  },
];

export const STATUS_MAP: Record<AttendanceStatus, StatusMeta> = STATUS_LIST.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<AttendanceStatus, StatusMeta>
);

export const ABSENT_REASONS = [
  { label: 'Kasal boʻldi', emoji: '🤒' },
  { label: 'Sertifikat / Imtihon', emoji: '📜' },
  { label: 'Olimpiada', emoji: '🏆' },
  { label: 'Oilaviy sabab', emoji: '🏠' },
  { label: 'Shifokorda', emoji: '🏥' },
  { label: 'Sababsiz', emoji: '❓' },
];

export interface ClassStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  attendancePercent: number;
}

export function computeClassStats(
  cls: ClassGroup,
  records: Record<string, StudentAttendance>
): ClassStats {
  let present = 0;
  let absent = 0;
  let late = 0;

  for (const s of cls.students) {
    const st = records[s.id]?.status ?? 'present';
    if (st === 'present') present++;
    else if (st === 'absent') absent++;
    else if (st === 'late') late++;
  }

  const total = cls.students.length;
  const attendancePercent =
    total === 0 ? 100 : Math.round(((present + late) / total) * 1000) / 10;

  return { total, present, absent, late, attendancePercent };
}
