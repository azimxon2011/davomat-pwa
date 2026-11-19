import { AttendanceStatus, ClassGroup, StudentAttendance } from '../types';

export interface StatusMeta {
  id: AttendanceStatus;
  label: string;
  activeClass: string;
}

export const STATUS_LIST: StatusMeta[] = [
  {
    id: 'present',
    label: 'Keldi',
    activeClass:
      'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950',
  },
  {
    id: 'absent',
    label: 'Kelmadi',
    activeClass:
      'bg-red-600 text-white dark:bg-red-500 dark:text-white',
  },
  {
    id: 'late',
    label: 'Kechikdi',
    activeClass:
      'bg-amber-600 text-white dark:bg-amber-500 dark:text-zinc-950',
  },
];

export const ABSENT_REASONS = [
  'Kasal',
  'Sertifikat',
  'Olimpiada',
  'Oilaviy sabab',
  'Shifokorda',
  'Sababsiz',
];

export interface ClassStats {
  total: number;
  present: number;
  absent: number;
  late: number;
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

  return { total: cls.students.length, present, absent, late };
}
