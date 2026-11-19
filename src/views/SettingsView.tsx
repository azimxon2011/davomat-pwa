import { Monitor, Moon, RotateCcw, School, Smartphone, Sun } from 'lucide-react';
import { AppSettings } from '../types';
import { TelegramSettingsCard } from '../components/TelegramSettingsCard';

interface SettingsViewProps {
  settings: AppSettings;
  onChange: (next: AppSettings) => void;
  onResetDemo: () => void;
  canInstall: boolean;
  isInstalled: boolean;
  onInstallApp: () => void;
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function SettingsView({
  settings,
  onChange,
  onResetDemo,
  canInstall,
  isInstalled,
  onInstallApp,
  onNotify,
}: SettingsViewProps) {
  return (
    <div className="space-y-4 pb-24">
      <div>
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Sozlamalar</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Maktab maʼlumotlari, Telegram integratsiyasi va koʻrinish
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">PWA ilova holati</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isInstalled
                ? 'Ilova qurilmangizga oʻrnatilgan (oflayn ishlaydi)'
                : 'Bosh ekranga qoʻshib, alohida ilova kabi foydalaning'}
            </p>
          </div>
        </div>
        {canInstall && (
          <button
            type="button"
            onClick={onInstallApp}
            className="h-9 px-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shrink-0"
          >
            Oʻrnatish
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <School className="w-4 h-4 text-teal-600" />
          Maktab maʼlumotlari
        </h3>
        <div className="space-y-2.5">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Maktab nomi
            </label>
            <input
              type="text"
              value={settings.schoolName}
              onChange={(e) => onChange({ ...settings, schoolName: e.target.value })}
              className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Direktor oʻrinbosari F.I.Sh.
            </label>
            <input
              type="text"
              value={settings.vicePrincipalName}
              onChange={(e) => onChange({ ...settings, vicePrincipalName: e.target.value })}
              className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
            />
          </div>
        </div>
      </div>

      <TelegramSettingsCard settings={settings} onChange={onChange} onNotify={onNotify} />

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Mavzu (Koʻrinish)</h3>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              ['light', 'Yorugʻ', Sun],
              ['dark', 'Tungi', Moon],
              ['system', 'Tizim', Monitor],
            ] as const
          ).map(([id, label, Icon]) => {
            const active = settings.theme === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onChange({ ...settings, theme: id })}
                className={`h-11 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  active
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={onResetDemo}
        className="w-full h-11 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center justify-center gap-2 hover:bg-rose-100 transition"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Namuna maʼlumotlarini tiklash</span>
      </button>
    </div>
  );
}
