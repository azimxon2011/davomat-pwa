import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { AttendanceStatus } from '../types';
import { ABSENT_REASONS } from '../utils/status';

interface NoteModalProps {
  open: boolean;
  studentName: string;
  status: AttendanceStatus;
  initialReason: string;
  onSave: (status: AttendanceStatus, reason: string) => void;
  onClose: () => void;
}

export function NoteModal({
  open,
  studentName,
  status,
  initialReason,
  onSave,
  onClose,
}: NoteModalProps) {
  const [reason, setReason] = useState(initialReason);

  useEffect(() => {
    setReason(initialReason);
  }, [initialReason, open]);

  if (!open) return null;

  const isLate = status === 'late';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/55 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="min-w-0 pr-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
              {studentName}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isLate
                ? 'Kechikish izohi (ixtiyoriy)'
                : 'Kelmaganlik sababini tanlang yoki yozing'}
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
          {!isLate && (
            <div className="grid grid-cols-2 gap-2">
              {ABSENT_REASONS.map((item) => {
                const active = reason.trim() === item.label;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      onSave('absent', item.label);
                      onClose();
                    }}
                    className={`h-11 px-3 rounded-2xl border text-xs font-bold flex items-center gap-2 transition active:scale-95 ${
                      active
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-rose-400'
                    }`}
                  >
                    <span className="text-base">{item.emoji}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              {isLate ? 'Izoh' : 'Yoki oʻz sababingizni yozing'}
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                isLate
                  ? 'Masalan: 10 daqiqa kechikdi...'
                  : 'Masalan: Musobaqaga ketgan...'
              }
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              onSave(status, reason.trim());
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
