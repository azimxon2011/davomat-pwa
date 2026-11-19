import { LogOut, Monitor, Moon, Sun, X } from 'lucide-react';
import { ClassGroup } from '../types';
import { AppPrefs, I18N, Lang, ThemeMode } from '../utils/i18n';
import { StudentListEditor } from './StudentListEditor';

interface SettingsModalProps {
  open: boolean;
  cls: ClassGroup;
  prefs: AppPrefs;
  onChangePrefs: (next: AppPrefs) => void;
  onAddStudent: (fullName: string) => void;
  onRemoveStudent: (studentId: string) => void;
  onLogout: () => void;
  onClose: () => void;
}

export function SettingsModal({
  open,
  cls,
  prefs,
  onChangePrefs,
  onAddStudent,
  onRemoveStudent,
  onLogout,
  onClose,
}: SettingsModalProps) {
  if (!open) return null;
  const t = I18N[prefs.lang];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-white dark:bg-zinc-900 rounded-t-2xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{t.settings}</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-5">
          <div>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2">{t.themeLabel}</p>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  ['light', t.themeLight, Sun],
                  ['dark', t.themeDark, Moon],
                  ['system', t.themeSystem, Monitor],
                ] as const
              ).map(([id, label, Icon]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onChangePrefs({ ...prefs, theme: id as ThemeMode })}
                  className={`h-10 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    prefs.theme === id
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2">{t.langLabel}</p>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  ['uz', 'Oʻzbekcha'],
                  ['ru', 'Русский'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onChangePrefs({ ...prefs, lang: id as Lang })}
                  className={`h-10 rounded-xl border text-xs font-semibold transition ${
                    prefs.lang === id
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <StudentListEditor
            cls={cls}
            lang={prefs.lang}
            onAdd={onAddStudent}
            onRemove={onRemoveStudent}
          />
        </div>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 safe-bottom">
          <button
            type="button"
            onClick={onLogout}
            className="w-full h-10 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>{t.switchClass}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
