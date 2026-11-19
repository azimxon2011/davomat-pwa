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
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-white dark:bg-zinc-900 rounded-t-2xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-zinc-200 dark:border-zinc-800">
          <div className="min-w-0 pr-2">
            <h3 className="text-sm font-semibold truncate">{studentName}</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {isLate ? 'Kechikish izohi' : 'Kelmaganlik sababi'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3.5">
          {!isLate && (
            <div className="grid grid-cols-2 gap-2">
              {ABSENT_REASONS.map((item) => {
                const active = reason.trim() === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      onSave('absent', item);
                      onClose();
                    }}
                    className={`h-10 px-3 rounded-lg border text-xs font-medium text-left transition ${
                      active
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          )}

          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={isLate ? 'Izoh yozing...' : 'Boshqa sabab...'}
            className="w-full h-10 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-zinc-500"
          />

          <button
            type="button"
            onClick={() => {
              onSave(status, reason.trim());
              onClose();
            }}
            className="w-full h-10 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-medium text-sm safe-bottom"
          >
            Saqlash
          </button>
        </div>
      </div>
    </div>
  );
}
