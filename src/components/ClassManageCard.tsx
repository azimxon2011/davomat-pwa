import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, UserPlus, Users } from 'lucide-react';
import { ClassGroup } from '../types';

interface Props {
  cls: ClassGroup;
  open: boolean;
  onToggle: () => void;
  onAddStudents: (names: string[]) => void;
  onRemoveStudent: (studentId: string) => void;
  onRemoveClass: () => void;
}

export function ClassManageCard({
  cls,
  open,
  onToggle,
  onAddStudents,
  onRemoveStudent,
  onRemoveClass,
}: Props) {
  const [addText, setAddText] = useState('');

  const handleAdd = () => {
    const names = addText.split('\n').map((l) => l.trim()).filter(Boolean);
    if (names.length === 0) return;
    onAddStudents(names);
    setAddText('');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden">
      <div className="p-3.5 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onToggle}
          className="flex-1 text-left flex items-center justify-between gap-2 min-w-0"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">{cls.name}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                {cls.shift}
              </span>
              <span className="text-xs text-teal-600 dark:text-teal-400 font-semibold flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {cls.students.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{cls.curatorName}</p>
          </div>
          {open ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
        </button>

        <button
          type="button"
          onClick={onRemoveClass}
          title="Sinfni oʻchirish"
          className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {open && (
        <div className="px-3.5 pb-3.5 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex gap-2">
            <textarea
              rows={1}
              value={addText}
              onChange={(e) => setAddText(e.target.value)}
              placeholder="Yangi oʻquvchi qoʻshish (bir nechta qator ham mumkin)..."
              className="flex-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs resize-none"
            />
            <button
              type="button"
              onClick={handleAdd}
              className="px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1 shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Qoʻshish</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/70 max-h-64 overflow-y-auto">
            {cls.students.map((s, idx) => (
              <div key={s.id} className="py-2 flex items-center justify-between gap-2 text-xs">
                <span className="text-slate-700 dark:text-slate-300">
                  <span className="text-slate-400 mr-2">{idx + 1}.</span>
                  {s.fullName}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveStudent(s.id)}
                  className="text-slate-400 hover:text-rose-500 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
