import { TELEGRAM_CONFIG } from '../config';
import { ClassGroup, StudentAttendance, TeacherProfile } from '../types';
import { formatSlashDate } from './excelUpdater';
import { computeClassStats } from './status';

export function buildClassTelegramReport(
  cls: ClassGroup,
  teacher: TeacherProfile,
  date: string,
  records: Record<string, StudentAttendance>
): string {
  const stats = computeClassStats(cls, records);
  const attended = stats.present + stats.late;
  const pct = stats.total > 0 ? Math.round((attended / stats.total) * 100) : 100;

  const absentList = cls.students.filter((s) => records[s.id]?.status === 'absent');
  const lateList = cls.students.filter((s) => records[s.id]?.status === 'late');

  const lines: string[] = [
    `Davomat — ${cls.name} sinf (${formatSlashDate(date)})`,
    `Sınf rahbari: ${teacher.fullName}`,
    `Jami: ${stats.total} | Qatnashgan: ${attended} (${pct}%)`,
    `Kelmadi: ${stats.absent} | Kechikdi: ${stats.late}`,
  ];

  if (absentList.length === 0 && lateList.length === 0) {
    lines.push(``, `Barcha oʻquvchilar darsda (100%).`);
    return lines.join('\n');
  }

  if (absentList.length > 0) {
    lines.push(``, `Kelmaganlar (${absentList.length}):`);
    absentList.forEach((s, i) => {
      const reason = records[s.id]?.reason?.trim();
      lines.push(`${i + 1}. ${s.fullName}${reason ? ` — ${reason}` : ''}`);
    });
  }

  if (lateList.length > 0) {
    lines.push(``, `Kechikkanlar (${lateList.length}):`);
    lateList.forEach((s, i) => {
      const reason = records[s.id]?.reason?.trim();
      lines.push(`${i + 1}. ${s.fullName}${reason ? ` — ${reason}` : ''}`);
    });
  }

  return lines.join('\n');
}

export function hasTelegramBotConfig(): boolean {
  return Boolean(TELEGRAM_CONFIG.botToken.trim());
}

async function resolveTargetChatIds(token: string): Promise<string[]> {
  const botId = token.split(':')[0];
  const configured = TELEGRAM_CONFIG.chatId.trim();
  const chatSet = new Set<string>();

  if (configured && configured !== botId) {
    chatSet.add(configured);
  }

  try {
    const cached = JSON.parse(localStorage.getItem('davomat_tg_chats') || '[]') as string[];
    cached.forEach((id) => {
      if (id && id !== botId) chatSet.add(String(id));
    });
  } catch {
    // ignore
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
    const data = await res.json();
    if (data?.ok && Array.isArray(data.result)) {
      for (const upd of data.result) {
        const chatId =
          upd?.message?.chat?.id ??
          upd?.my_chat_member?.chat?.id ??
          upd?.channel_post?.chat?.id;
        if (chatId && String(chatId) !== botId) {
          chatSet.add(String(chatId));
        }
      }
      localStorage.setItem('davomat_tg_chats', JSON.stringify(Array.from(chatSet)));
    }
  } catch {
    // ignore network error during discovery
  }

  return Array.from(chatSet);
}

export async function sendToTelegramBot(
  text: string,
  excelBytes?: Uint8Array,
  isoDate?: string
): Promise<{ ok: boolean; error?: string }> {
  const token = TELEGRAM_CONFIG.botToken.trim();
  if (!token) {
    return { ok: false, error: 'Bot tokeni kiritilmagan.' };
  }

  const chatIds = await resolveTargetChatIds(token);
  if (chatIds.length === 0) {
    return {
      ok: false,
      error: `Avval Telegramda @${TELEGRAM_CONFIG.botUsername} botiga kirib /start tugmasini bosing!`,
    };
  }

  try {
    let lastError = '';
    let anySuccess = false;

    for (const chatId of chatIds) {
      const msgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text }),
      });
      const msgData = await msgRes.json();
      if (msgRes.ok && msgData.ok) {
        anySuccess = true;
      } else {
        lastError = msgData.description || 'Xatolik';
      }

      if (excelBytes) {
        const form = new FormData();
        form.append('chat_id', chatId);
        const blob = new Blob([excelBytes], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        form.append('document', blob, 'DAVOMAT.xlsx');
        if (isoDate) {
          form.append(
            'caption',
            `${formatSlashDate(isoDate)} Sinf böyicha davomat hisoboti 2-soat`
          );
        }
        await fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
          method: 'POST',
          body: form,
        });
      }
    }

    if (!anySuccess) {
      return { ok: false, error: lastError || 'Telegram xatoligi yuz berdi.' };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: 'Internet aloqasi yoʻq.' };
  }
}

export function openTelegramShare(text: string): void {
  const url = `https://t.me/share/url?url=${encodeURIComponent(' ')}&text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
