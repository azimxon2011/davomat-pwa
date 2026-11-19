import { useState } from 'react';
import { ArrowRight, Lock, User } from 'lucide-react';
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
      setError('Iltimos, ism va familiyangizni toʻliq kiriting');
      return;
    }
    if (!classId) {
      setError('Iltimos, sinfingizni tanlang');
      return;
    }
    onRegister({ fullName: cleaned, classId });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-900/5 space-y-6">
        <div className="text-center space-y-2">
          <img
            src="/icon.svg"
            alt="Davomat"
            className="w-14 h-14 rounded-2xl mx-auto shadow-md shadow-teal-600/20"
          />
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Davomat tizimi
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Sinf rahbari sifatida roʻyxatdan oʻting va oʻz sinfingizni tanlang
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Ism va familiyangiz
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setError('');
                }}
                placeholder="Masalan: Rahimova Gulnora"
                autoComplete="name"
                className="w-full h-12 pl-10 pr-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Sinfingizni tanlang
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
                    className={`h-12 rounded-2xl border text-sm font-extrabold transition active:scale-95 ${
                      active
                        ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/25'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-teal-400'
                    }`}
                  >
                    {cls.name}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 text-center">
              {error}
            </p>
          )}

          <div className="flex items-start gap-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 p-3 text-[11px] text-amber-800 dark:text-amber-200 leading-relaxed">
            <Lock className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Roʻyxatdan oʻtgandan soʻng faqat tanlangan sinf davomatini koʻrish va belgilash mumkin boʻladi.
            </span>
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-600/25 transition"
          >
            <span>Kirish</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
