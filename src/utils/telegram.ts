import { AppSettings, ClassGroup, ClassReport, StudentAttendance } from '../types';
import { computeClassStats, STATUS_MAP } from './status';
import { formatUzbekDate } from './uzbekDate';

export function buildClassTelegramReport(
  cls: ClassGroup,
  date: string,
  records: Record<string, StudentAttendance>,
  settings: AppSettings
): string {
  const stats = computeClassStats(cls, records);
  const lines: string[] = [
    `📋 DAVOMAT HISOBOTI — ${cls.name} sinf`,
    `🏫 ${settings.schoolName}`,
    `📅 Sana: ${formatUzbekDate(date)} (${cls.shift})`,
    `👩‍🏫 Sinf rahbari: ${cls.curatorName}`,
    ``,
    `📊 Jami: ${stats.total} nafar`,
    `✅ Keldi: ${stats.present} | ⏰ Kechikdi: ${stats.late} | Davomat: ${stats.attendancePercent}%`,
  ];

  const flagged = cls.students.filter(
    (s) => (records[s.id]?.status ?? 'present') !== 'present'
  );

  if (flagged.length === 0) {
    lines.push(``, `🎉 Barcha oʻquvchilar darsda toʻliq ishtirok etmoqda!`);
  } else {
    lines.push(
      `❌ Kelmaganlar: ${stats.absentTotal} (🤒 ${stats.sick} · 📄 ${stats.excused} · ❌ ${stats.unexcused})`,
      ``,
      `📌 Roʻyxat:`
    );
    flagged.forEach((student, idx) => {
      const rec = records[student.id];
      const meta = STATUS_MAP[rec.status];
      const noteText = rec.note?.trim() ? ` — ${rec.note.trim()}` : '';
      lines.push(`${idx + 1}. ${meta.emoji} ${student.fullName} (${meta.label}${noteText})`);
    });
  }

  return lines.join('\n');
}

export function buildSchoolTelegramReport(
  classes: ClassGroup[],
  reportsForDate: ClassReport[],
  date: string,
  settings: AppSettings
): string {
  const reportMap = new Map(reportsForDate.map((r) => [r.classId, r]));
  let totalStudents = 0;
  let totalPresent = 0;
  let totalLate = 0;
  let totalSick = 0;
  let totalExcused = 0;
  let totalUnexcused = 0;

  const submittedClasses: ClassGroup[] = [];
  const pendingClasses: ClassGroup[] = [];

  for (const cls of classes) {
    const rep = reportMap.get(cls.id);
    if (rep) {
      submittedClasses.push(cls);
      const st = computeClassStats(cls, rep.records);
      totalStudents += st.total;
      totalPresent += st.present;
      totalLate += st.late;
      totalSick += st.sick;
      totalExcused += st.excused;
      totalUnexcused += st.unexcused;
    } else {
      pendingClasses.push(cls);
    }
  }

  const totalAbsent = totalSick + totalExcused + totalUnexcused;
  const pct =
    totalStudents === 0
      ? 0
      : Math.round(((totalPresent + totalLate) / totalStudents) * 1000) / 10;

  const lines: string[] = [
    `🏫 KUNLIK UMUMIY DAVOMAT HISOBOTI`,
    `📍 ${settings.schoolName}`,
    `📅 Sana: ${formatUzbekDate(date)}`,
    `👤 Direktor oʻrinbosari: ${settings.vicePrincipalName}`,
    ``,
    `📝 Topshirdi: ${submittedClasses.length} / ${classes.length} sinf`,
    `👥 Hisobga olingan: ${totalStudents} oʻquvchi`,
    `✅ Keldi: ${totalPresent} | ⏰ Kechikdi: ${totalLate} (${pct}%)`,
    `❌ Kelmaganlar: ${totalAbsent} (🤒 Kasal: ${totalSick} · 📄 Sababli: ${totalExcused} · ❌ Sababsiz: ${totalUnexcused})`,
  ];

  const classDetails: string[] = [];
  for (const cls of submittedClasses) {
    const rep = reportMap.get(cls.id)!;
    const flagged = cls.students.filter(
      (s) => (rep.records[s.id]?.status ?? 'present') !== 'present'
    );
    if (flagged.length > 0) {
      classDetails.push(`\n🔹 ${cls.name} (${cls.curatorName}):`);
      flagged.forEach((s) => {
        const rec = rep.records[s.id];
        const meta = STATUS_MAP[rec.status];
        const note = rec.note?.trim() ? ` — ${rec.note.trim()}` : '';
        classDetails.push(`  • ${meta.emoji} ${s.fullName} (${meta.label}${note})`);
      });
    }
  }

  if (classDetails.length > 0) {
    lines.push(``, `📌 Kelmagan va kechikkanlar:`, ...classDetails);
  } else if (submittedClasses.length > 0) {
    lines.push(``, `🎉 Topshirgan barcha sinflarda davomat 100%!`);
  }

  if (pendingClasses.length > 0) {
    lines.push(
      ``,
      `⏳ Hali topshirmagan sinflar (${pendingClasses.length}):`,
      ...pendingClasses.map((c) => `  • ${c.name} — ${c.curatorName}`)
    );
  }

  return lines.join('\n');
}

export function buildReminderMessage(cls: ClassGroup, date: string): string {
  return `Assalomu alaykum, ${cls.curatorName}! ${formatUzbekDate(date)} sanasi uchun ${cls.name} sinf davomat hisobotini topshirishingizni soʻraymiz. Rahmat!`;
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
