import { strFromU8, strToU8, unzipSync, zipSync } from 'fflate';
import { ClassGroup, ClassReport } from '../types';
import { computeClassStats } from './status';

export function formatSlashDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-');
  return `${d}/${m}/${y}`;
}

export async function buildUpdatedExcelBytes(
  classes: ClassGroup[],
  reports: ClassReport[],
  isoDate: string
): Promise<Uint8Array> {
  const res = await fetch(`/DAVOMAT.xlsx?t=${Date.now()}`);
  const buf = await res.arrayBuffer();
  const archive = unzipSync(new Uint8Array(buf));

  const slashDate = formatSlashDate(isoDate);

  // 1. Update date in xl/sharedStrings.xml
  if (archive['xl/sharedStrings.xml']) {
    let ssXml = strFromU8(archive['xl/sharedStrings.xml']);
    ssXml = ssXml.replace(
      /\d{2}\/\d{2}\/\d{4}\s+Sinf böyicha davomat hisoboti 2-soat\s*/g,
      `${slashDate} Sinf böyicha davomat hisoboti 2-soat `
    );
    archive['xl/sharedStrings.xml'] = strToU8(ssXml);
  }

  // 2. Update attendance numbers & percentages in xl/worksheets/sheet1.xml
  if (archive['xl/worksheets/sheet1.xml']) {
    let sheetXml = strFromU8(archive['xl/worksheets/sheet1.xml']);
    const todayReports = new Map(
      reports.filter((r) => r.date === isoDate).map((r) => [r.classId, r])
    );

    let sumTotal = 0;
    let sumAttended = 0;

    for (const cls of classes) {
      const r = cls.excelRow;
      const total = cls.students.length;
      const rep = todayReports.get(cls.id);
      let attended = cls.defaultAttended;
      if (rep) {
        const st = computeClassStats(cls, rep.records);
        attended = st.present + st.late;
      }
      const ratio = total > 0 ? attended / total : 0;

      sumTotal += total;
      sumAttended += attended;

      sheetXml = sheetXml.replace(
        new RegExp(`(<c r="B${r}"[^>]*><v>)[^<]*(</v></c>)`),
        `$1${total}$2`
      );
      sheetXml = sheetXml.replace(
        new RegExp(`(<c r="C${r}"[^>]*><v>)[^<]*(</v></c>)`),
        `$1${attended}$2`
      );
      sheetXml = sheetXml.replace(
        new RegExp(`(<c r="D${r}"[^>]*>(?:<f[^/>]*/>|<f[^>]*>[^<]*</f>)<v>)[^<]*(</v></c>)`),
        `$1${ratio}$2`
      );
    }

    const totalRatio = sumTotal > 0 ? sumAttended / sumTotal : 0;
    sheetXml = sheetXml.replace(
      /(<c r="B24"[^>]*><f>[^<]*<\/f><v>)[^<]*(<\/v><\/c>)/,
      `$1${sumTotal}$2`
    );
    sheetXml = sheetXml.replace(
      /(<c r="C24"[^>]*><f>[^<]*<\/f><v>)[^<]*(<\/v><\/c>)/,
      `$1${sumAttended}$2`
    );
    sheetXml = sheetXml.replace(
      /(<c r="D24"[^>]*>(?:<f[^/>]*\/>|<f[^>]*>[^<]*<\/f>)<v>)[^<]*(<\/v><\/c>)/,
      `$1${totalRatio}$2`
    );

    archive['xl/worksheets/sheet1.xml'] = strToU8(sheetXml);
  }

  return zipSync(archive);
}

export async function syncExcelToLocalDisk(bytes: Uint8Array): Promise<boolean> {
  try {
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    const res = await fetch('/api/save-excel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64 }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function downloadExcelBytes(bytes: Uint8Array, filename = 'DAVOMAT.xlsx'): void {
  const blob = new Blob([bytes], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
