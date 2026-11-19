import { useState } from 'react';
import { ClassGroup } from '../types';

interface NewClassFormProps {
  onCreate: (cls: ClassGroup) => void;
  onCancel: () => void;
  onError: (msg: string) => void;
}

export function NewClassForm({ onCreate, onCancel, onError }: NewClassFormProps) {
  const [name, setName] = useState('');
  const [curatorName, setCuratorName] = useState('');
  const [shift, setShift] = useState<'1-smena' | '2-smena'>('1-smena');
  const [bulkNames, setBulkNames] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !curatorName.trim()) {
      onError('Sinf nomi va sinf rahbari ismini kiriting');
      return;
    }
    const id = `cls-${Date.now()}`;
    const students = bulkNames
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((fullName, idx) => ({ id: `${id}-s-${idx + 1}`, fullName }));

    onCreate({
      id,
      name: name.trim(),
      curatorName: curatorName.trim(),
      shift,
      students,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-900/60 rounded-3xl p-4 space-y-3 shadow-sm">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
        Yangi sinf qoʻshish
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Sinf nomi (masalan: 10-A)"
          className="h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
        />
        <select
          value={shift}
          onChange={(e) => setShift(e.target.value as '1-smena' | '2-smena')}
          className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
        >
          <option value="1-smena">1-smena</option>
          <option value="2-smena">2-smena</option>
        </select>
      </div>
      <input
        type="text"
        value={curatorName}
        onChange={(e) => setCuratorName(e.target.value)}
        placeholder="Sinf rahbari F.I.Sh."
        className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
      />
      <textarea
        rows={4}
        value={bulkNames}
        onChange={(e) => setBulkNames(e.target.value)}
        placeholder="Oʻquvchilar roʻyxati (har bir qatorga bitta F.I.Sh.)"
        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm resize-none"
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="h-10 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
        >
          Bekor qilish
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="h-10 px-5 rounded-xl bg-teal-600 text-white text-xs font-bold"
        >
          Qoʻshish
        </button>
      </div>
    </div>
  );
}
