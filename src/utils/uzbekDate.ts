const UZ_MONTHS = [
  'yanvar',
  'fevral',
  'mart',
  'aprel',
  'may',
  'iyun',
  'iyul',
  'avgust',
  'sentabr',
  'oktabr',
  'noyabr',
  'dekabr',
];

const UZ_WEEKDAYS = [
  'Yakshanba',
  'Dushanba',
  'Seshanba',
  'Chorshanba',
  'Payshanba',
  'Juma',
  'Shanba',
];

export function getTodayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function shiftDateISO(isoDate: string, deltaDays: number): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + deltaDays);
  const ny = date.getFullYear();
  const nm = String(date.getMonth() + 1).padStart(2, '0');
  const nd = String(date.getDate()).padStart(2, '0');
  return `${ny}-${nm}-${nd}`;
}

export function formatUzbekDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const monthName = UZ_MONTHS[date.getMonth()] || '';
  return `${d}-${monthName}, ${y}`;
}

export function formatUzbekWeekday(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const today = getTodayISO();
  const yesterday = shiftDateISO(today, -1);

  if (isoDate === today) return `Bugun · ${UZ_WEEKDAYS[date.getDay()]}`;
  if (isoDate === yesterday) return `Kecha · ${UZ_WEEKDAYS[date.getDay()]}`;
  return UZ_WEEKDAYS[date.getDay()];
}

export function formatTimeShort(isoTimestamp: string): string {
  const d = new Date(isoTimestamp);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
