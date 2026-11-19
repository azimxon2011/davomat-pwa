import { useState } from 'react';
import { Copy, Check, Send, Share2, X, Loader2 } from 'lucide-react';
import { AppSettings } from '../types';
import { openTelegramShare, sendToTelegramBot } from '../utils/telegram';

interface TelegramPreviewModalProps {
  open: boolean;
  title: string;
  text: string;
  settings: AppSettings;
  onClose: () => void;
  onSentSuccess?: () => void;
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function TelegramPreviewModal({
  open,
  title,
  text,
  settings,
  onClose,
  onSentSuccess,
  onNotify,
}: TelegramPreviewModalProps) {
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);

  if (!open) return null;

  const hasBotConfig = Boolean(
    settings.telegramBotToken.trim() && settings.telegramChatId.trim()
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onNotify('Hisobot matni nusxalandi');
      setTimeout(() => setCopied(false), 1800);
    } catch {
      onNotify('Nusxalab boʻlmadi', 'error');
    }
  };

  const handleBotSend = async () => {
    setSending(true);
    const res = await sendToTelegramBot(
      settings.telegramBotToken,
      settings.telegramChatId,
      text
    );
    setSending(false);
    if (res.ok) {
      onNotify('Hisobot Telegramga muvaffaqiyatli yuborildi!');
      onSentSuccess?.();
      onClose();
    } else {
      onNotify(res.error || 'Yuborishda xatolik', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/55 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full sm:max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Direktor oʻrinbosariga yuborish uchun tayyor matn
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed bg-slate-50 dark:bg-slate-950/70 border border-slate-200/70 dark:border-slate-800 rounded-2xl p-4 text-slate-800 dark:text-slate-200">
            {text}
          </pre>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 safe-bottom bg-white dark:bg-slate-900">
          {hasBotConfig ? (
            <button
              type="button"
              disabled={sending}
              onClick={handleBotSend}
              className="w-full h-12 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 disabled:opacity-60 transition"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>
                {sending
                  ? 'Telegramga yuborilmoqda...'
                  : 'Telegram bot orqali yuborish'}
              </span>
            </button>
          ) : (
            <p className="text-xs text-center text-slate-500 dark:text-slate-400 px-2">
              Avtomatik yuborish uchun «Sozlamalar» boʻlimida Telegram Bot tokeni va Chat ID ni kiriting.
            </p>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                openTelegramShare(text);
                onSentSuccess?.();
              }}
              className="h-11 rounded-2xl bg-sky-500 hover:bg-sky-600 active:scale-[0.99] text-white font-semibold text-sm flex items-center justify-center gap-2 transition"
            >
              <Share2 className="w-4 h-4" />
              <span>Telegramda ulashish</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-[0.99] text-slate-800 dark:text-slate-100 font-semibold text-sm flex items-center justify-center gap-2 transition"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span>{copied ? 'Nusxalandi' : 'Nusxalash'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
