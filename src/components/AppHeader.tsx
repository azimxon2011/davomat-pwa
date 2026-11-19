import { Download, WifiOff } from 'lucide-react';

interface AppHeaderProps {
  schoolName: string;
  isOnline: boolean;
  canInstall: boolean;
  onInstall: () => void;
}

export function AppHeader({ schoolName, isOnline, canInstall, onInstall }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 safe-top">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <img src="/icon.svg" alt="Davomat" className="w-8 h-8 rounded-xl shadow-xs shrink-0" />
          <div className="min-w-0">
            <h1 className="text-sm font-extrabold tracking-tight leading-none">Davomat</h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {schoolName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isOnline && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 text-[11px] font-bold">
              <WifiOff className="w-3 h-3" />
              Oflayn
            </span>
          )}
          {canInstall && (
            <button
              type="button"
              onClick={onInstall}
              className="h-8 px-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Oʻrnatish</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
