import { LogOut, Settings } from 'lucide-react';
import { I18N, Lang } from '../utils/i18n';

interface AppHeaderProps {
  classNameLabel: string;
  teacherName: string;
  dateLabel: string;
  isOnline: boolean;
  canInstall: boolean;
  lang: Lang;
  onInstall: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export function AppHeader({
  classNameLabel,
  teacherName,
  dateLabel,
  isOnline,
  canInstall,
  lang,
  onInstall,
  onOpenSettings,
  onLogout,
}: AppHeaderProps) {
  const t = I18N[lang];

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-indigo-100 dark:border-zinc-800 safe-top">
      <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="h-9 px-2.5 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white text-sm font-bold flex items-center justify-center shadow-sm shadow-indigo-600/25 shrink-0">
            {classNameLabel}
          </span>
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <h1 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white">
                {classNameLabel} {t.classSuffix}
              </h1>
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                {dateLabel}
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{teacherName}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {!isOnline && (
            <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-semibold">
              {t.offline}
            </span>
          )}
          {canInstall && (
            <button
              type="button"
              onClick={onInstall}
              className="h-8 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs shadow-indigo-600/20 transition"
            >
              {t.install}
            </button>
          )}
          <button
            type="button"
            onClick={onOpenSettings}
            title={t.settings}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onLogout}
            title={t.logout}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
