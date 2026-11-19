import { Lock, Monitor, Moon, Smartphone, Sun, User } from 'lucide-react';
import { AppSettings, TeacherProfile } from '../types';
import { TelegramSettingsCard } from '../components/TelegramSettingsCard';

interface SettingsViewProps {
  teacher: TeacherProfile;
  classNameLabel: string;
  settings: AppSettings;
  onChange: (next: AppSettings) => void;
  canInstall: boolean;
  isInstalled: boolean;
  onInstallApp: () => void;
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function SettingsView({
  teacher,
  classNameLabel,
  settings,
  onChange,
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
          Profil maʼlumotlari, Telegram integratsiyasi va koʻrinish
        </p>
      </div>

      {/* Locked teacher profile */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-teal-600" />
            Sinf rahbari profili
          </h3>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <Lock className="w-3 h-3" />
            Biriktirilgan
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 p-3">
            <p className="text-slate-500 dark:text-slate-400">Ism va familiya</p>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5 truncate">
              {teacher.fullName}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 p-3">
            <p className="text-slate-500 dark:text-slate-400">Biriktirilgan sinf</p>
            <p className="font-extrabold text-teal-600 dark:text-teal-400 mt-0.5">
              {classNameLabel} sinf
            </p>
          </div>
        </div>
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
    </div>
  );
}
