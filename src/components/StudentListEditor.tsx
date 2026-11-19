import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ClassGroup } from '../types';
import { I18N, Lang } from '../utils/i18n';

interface Props {
  cls: ClassGroup;
  lang: Lang;
  onAdd: (fullName: string) => void;
  onRemove: (studentId: string) => void;
}

export function StudentListEditor({ cls, lang, onAdd, onRemove }: Props) {
  const [newName, setNewName] = useState('');
  const t = I18N[lang];

  return (
    <div className="space-y-2.5">
      <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        {cls.name} — {t.studentsLabel} ({cls.students.length})
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!newName.trim()) return;
          onAdd(newName.trim());
          setNewName('');
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={t.addStudentPlaceholder}
          className="flex-1 h-9 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          className="h-9 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.add}</span>
        </button>
      </form>

      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl divide-y divide-zinc-200/80 dark:divide-zinc-800 max-h-52 overflow-y-auto">
        {cls.students.map((s, i) => (
          <div key={s.id} className="px-3 py-2 flex items-center justify-between gap-2 text-xs">
            <span className="text-zinc-800 dark:text-zinc-200 truncate">
              <span className="text-zinc-400 mr-1.5">{i + 1}.</span>
              {s.fullName}
            </span>
            <button
              type="button"
              onClick={() => onRemove(s.id)}
              className="text-zinc-400 hover:text-rose-600 p-1 shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
