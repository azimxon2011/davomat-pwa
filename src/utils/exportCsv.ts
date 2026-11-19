import { ClassGroup, StudentAttendance, TeacherProfile } from '../types';
import { STATUS_MAP } from './status';

export function downloadClassCsv(
  cls: ClassGroup,
  teacher: TeacherProfile,
  records: Record<string, StudentAttendance>,
  date: string
): void {
  const rows: string[][] = [
    ['Sana', 'Sinf', 'Sinf rahbari', 'Oʻquvchi F.I.Sh.', 'Holat', 'Sabab / Izoh'],
  ];

  for (const s of cls.students) {
    const rec = records[s.id];
    const status = rec?.status ?? 'present';
    rows.push([
      date,
      cls.name,
      teacher.fullName,
      s.fullName,
      STATUS_MAP[status].label,
      rec?.reason ?? '',
    ]);
  }

  const csvContent =
    '\uFEFF' +
    rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      )
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `davomat-${cls.name}-${date}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function triggerHaptic(enabled: boolean, pattern: number | number[] = 12): void {
  if (!enabled) return;
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // ignore unsupported environments
    }
  }
}
