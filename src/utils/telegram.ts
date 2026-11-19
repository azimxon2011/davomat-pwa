import { ClassGroup, StudentAttendance, TeacherProfile } from '../types';
import { computeClassStats } from './status';
import { formatUzbekDate } from './uzbekDate';

export function buildClassTelegramReport(
  cls: ClassGroup,
  teacher: TeacherProfile,
  date: string,
  records: Record<string, StudentAttendance>
): string {
  const stats = computeClassStats(cls, records);

  const presentList = cls.students.filter(
    (s) => (records[s.id]?.status ?? 'present') === 'present'
  );
  const absentList = cls.students.filter(
    (s) => records[s.id]?.status === 'absent'
  );
  const lateList = cls.students.filter(
    (s) => records[s.id]?.status === 'late'
  );

  const lines: string[] = [
    `📋 DAVOMAT HISOBOTI — ${cls.name} sinf`,
    `📅 Sana: ${formatUzbekDate(date)}`,
    `👩‍🏫 Sinf rahbari: ${teacher.fullName}`,
    ``,
    `📊 Jami: ${stats.total} | ✅ Keldi: ${stats.present} | ❌ Kelmadi: ${stats.absent} | ⏰ Kechikdi: ${stats.late} (${stats.attendancePercent}%)`,
  ];

  lines.push(``, `✅ Kelganlar (${presentList.length}):`);
  if (presentList.length === 0) {
    lines.push(`— Yoʻq`);
  } else {
    presentList.forEach((s, i) => lines.push(`${i + 1}. ${s.fullName}`));
  }

  lines.push(``, `❌ Kelmaganlar (${absentList.length}):`);
  if (absentList.length === 0) {
    lines.push(`— Yoʻq`);
  } else {
    absentList.forEach((s, i) => {
      const reason = records[s.id]?.reason?.trim();
      lines.push(`${i + 1}. ${s.fullName}${reason ? ` — ${reason}` : ''}`);
    });
  }

  lines.push(``, `⏰ Kechikkanlar (${lateList.length}):`);
  if (lateList.length === 0) {
    lines.push(`— Yoʻq`);
  } else {
    lateList.forEach((s, i) => {
      const reason = records[s.id]?.reason?.trim();
      lines.push(`${i + 1}. ${s.fullName}${reason ? ` — ${reason}` : ''}`);
    });
  }

  return lines.join('\n');
}

export async function sendToTelegramBot(
  botToken: string,
  chatId: string,
  text: string
): Promise<{ ok: boolean; error?: string }> {
  const token = botToken.trim();
  const chat = chatId.trim();
  if (!token || !chat) {
    return {
      ok: false,
      error: 'Telegram Bot tokeni yoki Chat ID sozlamalarda kiritilmagan.',
    };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      return {
        ok: false,
        error: data.description || 'Telegram API xatoligi yuz berdi.',
      };
    }
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: 'Internet aloqasi yoʻq yoki Telegram serveriga ulanib boʻlmadi.',
    };
  }
}

export function openTelegramShare(text: string): void {
  const url = `https://t.me/share/url?url=${encodeURIComponent(' ')}&text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
