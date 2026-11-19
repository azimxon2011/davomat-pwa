import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { AttendanceStatus } from '../types';
import { STATUS_LIST } from '../utils/status';

const QUICK_NOTES = [
  'Harorati bor',
  'Shifokorda',
  'Ota-onasi xabar berdi',
  '10 daqiqa kechikdi',
  'Olimpiada / tadbirda',
  'Telefon koʻtarmayapti',
];

interface NoteModalProps {
  open: boolean;
  studentName: string;
  status: AttendanceStatus;
  initialNote: string;
  onSave: (status: AttendanceStatus, note: string) => void;
  onClose: () => void;
}

export function NoteModal({
  open,
  studentName,
  status,
  initialNote,
  onSave,
  onClose,
}: NoteModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<AttendanceStatus>(status);
  const [note, setNote] = useState(initialNote);

  useEffect(() => {
    setSelectedStatus(status);
    setNote(initialNote);
  }, [status, initialNote, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/55 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="min-w-0 pr-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
              {studentName}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Holat va sabab izohini kiriting
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {STATUS_LIST.map((st) => {
              const active = selectedStatus === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSelectedStatus(st.id)}
                  className={`h-10 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    active
                      ? st.pillActiveClass
                      : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <span>{st.emoji}</span>
                  <span>{st.label}</span>
                </button>
              );
            })}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              Izoh (ixtiyoriy)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Masalan: Harorati bor, onasi xabar berdi..."
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {QUICK_NOTES.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setNote(chip)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-950/60 dark:hover:text-teal-300 transition"
              >
                {chip}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              onSave(selectedStatus, note.trim());
              onClose();
            }}
            className="w-full h-12 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md shadow-teal-600/20 active:scale-[0.99] transition safe-bottom"
          >
            Saqlash
          </button>
        </div>
      </div>
    </div>
  );
}
