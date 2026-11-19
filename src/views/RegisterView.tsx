import { useState } from 'react';
import { ClassGroup, TeacherProfile } from '../types';

interface RegisterViewProps {
  classes: ClassGroup[];
  onRegister: (profile: TeacherProfile) => void;
}

export function RegisterView({ classes, onRegister }: RegisterViewProps) {
  const [fullName, setFullName] = useState('');
  const [classId, setClassId] = useState(classes[0]?.id ?? '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = fullName.trim();
    if (cleaned.length < 3) {
      setError('Ism va familiyangizni kiriting');
      return;
    }
    if (!classId) {
      setError('Sinfingizni tanlang');
      return;
    }
    onRegister({ fullName: cleaned, classId });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-5">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Davomat</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Ism-familiyangizni kiriting va sinfingizni tanlang
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
              Ism va familiya
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setError('');
              }}
              placeholder="Rahimova Gulnora"
              autoComplete="name"
              className="w-full h-11 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
              Sinf
            </label>
            <div className="grid grid-cols-3 gap-2">
              {classes.map((cls) => {
                const active = cls.id === classId;
                return (
                  <button
                    key={cls.id}
                    type="button"
                    onClick={() => {
                      setClassId(cls.id);
                      setError('');
                    }}
                    className={`h-11 rounded-lg border text-sm font-medium transition ${
                      active
                        ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-950 dark:border-zinc-100'
                        : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400'
                    }`}
                  >
                    {cls.name}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <p className="text-xs font-medium text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full h-11 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-medium text-sm"
          >
            Kirish
          </button>
        </form>
      </div>
    </div>
  );
}
