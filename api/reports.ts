import fs from 'node:fs';
import path from 'node:path';

const memoryStore = new Map<string, any[]>();

function readDay(date: string): any[] {
  const file = path.join('/tmp', `davomat-${date}.json`);
  try {
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    }
  } catch {
    // ignore fs errors
  }
  return memoryStore.get(date) || [];
}

function writeDay(date: string, reports: any[]): void {
  memoryStore.set(date, reports);
  const file = path.join('/tmp', `davomat-${date}.json`);
  try {
    fs.writeFileSync(file, JSON.stringify(reports), 'utf8');
  } catch {
    // ignore fs errors
  }
}

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET') {
    const date = String(req.query?.date || '').slice(0, 10);
    if (!date) {
      return res.status(400).json({ ok: false, error: 'Missing date' });
    }
    const reports = readDay(date);
    return res.status(200).json({ ok: true, reports, submittedCount: reports.length });
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { date, report, totalClasses = 20 } = body || {};
      if (!date || !report?.classId) {
        return res.status(400).json({ ok: false, error: 'Invalid payload' });
      }
      const existing = readDay(date);
      const next = [
        ...existing.filter((r: any) => r.classId !== report.classId),
        report,
      ];
      writeDay(date, next);

      const submittedCount = next.length;
      const allSubmitted = submittedCount >= totalClasses;
      return res.status(200).json({
        ok: true,
        reports: next,
        submittedCount,
        totalClasses,
        allSubmitted,
      });
    } catch (err: any) {
      return res.status(500).json({ ok: false, error: err?.message || 'Server error' });
    }
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}
