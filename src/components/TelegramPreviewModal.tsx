import { useState } from 'react';
import { X } from 'lucide-react';
import { TELEGRAM_CONFIG } from '../config';
import { sendToTelegramBot } from '../utils/telegram';

interface TelegramPreviewModalProps {
  open: boolean;
  title: string;
  text: string;
  date: string;
  excelBytes: Uint8Array | null;
  onClose: () => void;
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function TelegramPreviewModal({
  open,
  title,
  text,
  date,
  excelBytes,
  onClose,
  onNotify,
}: TelegramPreviewModalProps) {
  const [sending, setSending] = useState(false);
  const [needStart, setNeedStart] = useState(false);

  if (!open) return null;

  const handleBotSend = async () => {
    setSending(true);
    setNeedStart(false);
    const res = await sendToTelegramBot(text, excelBytes ?? undefined, date);
    setSending(false);
    if (res.ok) {
      onNotify('Yuborildi');
      onClose();
    } else {
      if (res.error?.includes('/start')) {
        setNeedStart(true);
      }
      onNotify(res.error || 'Yuborishda xatolik', 'error');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg bg-white dark:bg-zinc-900 rounded-t-2xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="text-sm font-semibold">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 text-zinc-800 dark:text-zinc-200">
            {text}
          </pre>
        </div>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2 safe-bottom">
          {needStart && (
            <a
              href={`https://t.me/${TELEGRAM_CONFIG.botUsername}?start=1`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-10 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs flex items-center justify-center transition"
            >
              1. @{TELEGRAM_CONFIG.botUsername} botiga /start bosing, keyin «Yuborish»
            </a>
          )}

          <button
            type="button"
            disabled={sending}
            onClick={handleBotSend}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold text-sm shadow-sm shadow-indigo-600/20 disabled:opacity-50 transition"
          >
            {sending ? 'Yuborilmoqda...' : 'Yuborish'}
          </button>
        </div>
      </div>
    </div>
  );
}
