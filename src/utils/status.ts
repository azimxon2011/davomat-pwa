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
      'bg-emerald-600 text-white shadow-xs shadow-emerald-600/25',
  },
  {
    id: 'absent',
    label: 'Kelmadi',
    activeClass:
      'bg-rose-600 text-white shadow-xs shadow-rose-600/25',
  },
  {
    id: 'late',
    label: 'Kechikdi',
    activeClass:
      'bg-amber-500 text-white shadow-xs shadow-amber-500/25',
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
