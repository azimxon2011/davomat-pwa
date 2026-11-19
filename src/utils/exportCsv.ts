import { ClassGroup, ClassReport } from '../types';
import { STATUS_MAP } from './status';
import { formatTimeShort } from './uzbekDate';

export function downloadDailyCsv(
  classes: ClassGroup[],
  reportsForDate: ClassReport[],
  date: string
): void {
  const reportMap = new Map(reportsForDate.map((r) => [r.classId, r]));
  const rows: string[][] = [
    [
      'Sana',
      'Sinf',
      'Smena',
      'Sinf rahbari',
      'Oʻquvchi F.I.Sh.',
      'Holat',
      'Izoh',
      'Topshirilgan vaqt',
    ],
  ];

  for (const cls of classes) {
    const rep = reportMap.get(cls.id);
    if (!rep) {
      rows.push([
        date,
        cls.name,
        cls.shift,
        cls.curatorName,
        '—',
        'Topshirilmagan',
        '',
        '',
      ]);
      continue;
    }

    const time = formatTimeShort(rep.submittedAt);
    for (const s of cls.students) {
      const rec = rep.records[s.id];
      const status = rec?.status ?? 'present';
      rows.push([
        date,
        cls.name,
        cls.shift,
        cls.curatorName,
        s.fullName,
        STATUS_MAP[status].label,
        rec?.note ?? '',
        time,
      ]);
    }
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
  a.download = `davomat-${date}.csv`;
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
