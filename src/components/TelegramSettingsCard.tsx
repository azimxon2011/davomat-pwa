import { useState } from 'react';
import { Bot, Loader2, Send } from 'lucide-react';
import { AppSettings } from '../types';
import { sendToTelegramBot } from '../utils/telegram';

interface Props {
  settings: AppSettings;
  onChange: (next: AppSettings) => void;
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function TelegramSettingsCard({ settings, onChange, onNotify }: Props) {
  const [testing, setTesting] = useState(false);

  const handleTest = async () => {
    setTesting(true);
    const res = await sendToTelegramBot(
      settings.telegramBotToken,
      settings.telegramChatId,
      `✅ «Davomat» PWA ilovasi muvaffaqiyatli ulandi!`
    );
    setTesting(false);
    if (res.ok) onNotify('Sinov xabari Telegramga yuborildi!');
    else onNotify(res.error || 'Ulanishda xatolik', 'error');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 space-y-3">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <Bot className="w-4 h-4 text-sky-500" />
        Telegram bot integratsiyasi (ixtiyoriy)
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        Bot tokeni va direktor oʻrinbosarining Chat ID sini kiritsangiz, hisobotlar 1 bosishda toʻgʻridan-toʻgʻri Telegramga yuboriladi. Kiritmasangiz ham «Telegramda ulashish» ishlayveradi.
      </p>

      <div className="space-y-2.5">
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Bot Token (@BotFather dan olingan)
          </label>
          <input
            type="password"
            value={settings.telegramBotToken}
            onChange={(e) => onChange({ ...settings, telegramBotToken: e.target.value })}
            placeholder="123456789:ABCdefGHI..."
            className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Direktor oʻrinbosari Chat ID (yoki guruh ID)
          </label>
          <input
            type="text"
            value={settings.telegramChatId}
            onChange={(e) => onChange({ ...settings, telegramChatId: e.target.value })}
            placeholder="Masalan: 198456721 yoki -100..."
            className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
          />
        </div>

        <button
          type="button"
          disabled={testing}
          onClick={handleTest}
          className="w-full h-10 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-60 transition"
        >
          {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span>Sinov xabarini yuborish</span>
        </button>
      </div>
    </div>
  );
}
