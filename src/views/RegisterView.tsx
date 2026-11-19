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
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/70 via-white to-blue-50/50 dark:from-zinc-950 dark:via-zinc-950 dark:to-indigo-950/30 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-indigo-100 dark:border-zinc-800 rounded-2xl p-6 shadow-xl shadow-indigo-600/5 space-y-5">
        <div className="flex items-center gap-3">
          <img src="/icon.svg" alt="Davomat" className="w-10 h-10 rounded-xl shadow-sm" />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Davomat</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Ism-familiyangizni kiriting va sinfni tanlang
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
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
              className="w-full h-11 px-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
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
                    className={`h-11 rounded-xl border text-sm font-semibold transition ${
                      active
                        ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/25'
                        : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-indigo-400'
                    }`}
                  >
                    {cls.name}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/25 active:scale-[0.99] transition"
          >
            Kirish
          </button>
        </form>
      </div>
    </div>
  );
}
