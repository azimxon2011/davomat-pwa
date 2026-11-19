interface AppHeaderProps {
  classNameLabel: string;
  teacherName: string;
  dateLabel: string;
  isOnline: boolean;
  canInstall: boolean;
  onInstall: () => void;
}

export function AppHeader({
  classNameLabel,
  teacherName,
  dateLabel,
  isOnline,
  canInstall,
  onInstall,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800 safe-top">
      <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <h1 className="text-base font-semibold tracking-tight">{classNameLabel} sinf</h1>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{dateLabel}</span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{teacherName}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isOnline && (
            <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
              Oflayn
            </span>
          )}
          {canInstall && (
            <button
              type="button"
              onClick={onInstall}
              className="h-8 px-3 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-medium"
            >
              Oʻrnatish
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
