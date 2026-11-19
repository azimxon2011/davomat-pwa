import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ClassGroup } from '../types';
import { ClassManageCard } from '../components/ClassManageCard';
import { NewClassForm } from '../components/NewClassForm';

interface ClassesViewProps {
  classes: ClassGroup[];
  onChangeClasses: (next: ClassGroup[]) => void;
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function ClassesView({ classes, onChangeClasses, onNotify }: ClassesViewProps) {
  const [showNew, setShowNew] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(classes[0]?.id ?? null);

  return (
    <div className="space-y-4 pb-24">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Sinflar va oʻquvchilar
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Jami {classes.length} ta sinf · {classes.reduce((a, c) => a + c.students.length, 0)} nafar oʻquvchi
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNew((v) => !v)}
          className="h-10 px-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-teal-600/20 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi sinf</span>
        </button>
      </div>

      {showNew && (
        <NewClassForm
          onCreate={(cls) => {
            onChangeClasses([...classes, cls]);
            setShowNew(false);
            setExpandedId(cls.id);
            onNotify(`${cls.name} sinfi qoʻshildi (${cls.students.length} oʻquvchi)`);
          }}
          onCancel={() => setShowNew(false)}
          onError={(msg) => onNotify(msg, 'error')}
        />
      )}

      <div className="space-y-2.5">
        {classes.map((cls) => (
          <ClassManageCard
            key={cls.id}
            cls={cls}
            open={expandedId === cls.id}
            onToggle={() => setExpandedId(expandedId === cls.id ? null : cls.id)}
            onAddStudents={(names) => {
              onChangeClasses(
                classes.map((c) =>
                  c.id === cls.id
                    ? {
                        ...c,
                        students: [
                          ...c.students,
                          ...names.map((fullName, idx) => ({
                            id: `${cls.id}-s-${Date.now()}-${idx}`,
                            fullName,
                          })),
                        ],
                      }
                    : c
                )
              );
              onNotify(`${names.length} nafar oʻquvchi qoʻshildi`);
            }}
            onRemoveStudent={(sid) =>
              onChangeClasses(
                classes.map((c) =>
                  c.id === cls.id
                    ? { ...c, students: c.students.filter((s) => s.id !== sid) }
                    : c
                )
              )
            }
            onRemoveClass={() => {
              onChangeClasses(classes.filter((c) => c.id !== cls.id));
              onNotify(`${cls.name} sinfi oʻchirildi`, 'info');
            }}
          />
        ))}
      </div>
    </div>
  );
}
