import { useEffect, useState } from 'react';
import {
  AttendanceStatus,
  ClassGroup,
  ClassReport,
  StudentAttendance,
  TeacherProfile,
} from '../types';
import { computeClassStats } from '../utils/status';
import { buildClassTelegramReport } from '../utils/telegram';
import { AttendanceFooter } from '../components/AttendanceFooter';
import { AttendanceHeader, FilterMode } from '../components/AttendanceHeader';
import { NoteModal } from '../components/NoteModal';
import { StudentRow } from '../components/StudentRow';
import { TelegramPreviewModal } from '../components/TelegramPreviewModal';

interface Props {
  cls: ClassGroup;
  teacher: TeacherProfile;
  date: string;
  existingReport?: ClassReport;
  excelBytes: Uint8Array | null;
  submittedInfo: { count: number; total: number; all: boolean };
  onSaveReport: (records: Record<string, StudentAttendance>) => Promise<void>;
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function AttendanceView({
  cls,
  teacher,
  date,
  existingReport,
  excelBytes,
  submittedInfo,
  onSaveReport,
  onNotify,
}: Props) {
  const [draft, setDraft] = useState<Record<string, StudentAttendance>>({});
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterMode>('all');
  const [reasonTarget, setReasonTarget] = useState<{
    id: string;
    name: string;
    status: AttendanceStatus;
  } | null>(null);
  const [tgOpen, setTgOpen] = useState(false);

  useEffect(() => {
    setDraft(existingReport?.records ? { ...existingReport.records } : {});
  }, [cls.id, date, existingReport?.submittedAt]);

  const stats = computeClassStats(cls, draft);

  const setStatus = (sid: string, status: AttendanceStatus, reason?: string) => {
    setDraft((prev) => {
      const next = { ...prev };
      if (status === 'present') {
        delete next[sid];
      } else {
        next[sid] = {
          status,
          reason: reason !== undefined ? reason : prev[sid]?.reason,
        };
      }
      return next;
    });
  };

  const handleSelectStatus = (studentId: string, studentName: string, status: AttendanceStatus) => {
    setStatus(studentId, status);
    if (status === 'absent') {
      setReasonTarget({ id: studentId, name: studentName, status: 'absent' });
    }
  };

  const students = cls.students.filter((s) => {
    const st = draft[s.id]?.status ?? 'present';
    if (filter === 'absent' && st !== 'absent') return false;
    if (filter === 'late' && st !== 'late') return false;
    if (search.trim() && !s.fullName.toLowerCase().includes(search.trim().toLowerCase())) return false;
    return true;
  });

  const tgText = buildClassTelegramReport(cls, teacher, date, draft);

  return (
    <div className="space-y-3 pb-24">
      <AttendanceHeader
        stats={stats}
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        onAllPresent={() => {
          setDraft({});
          onSaveReport({});
          onNotify('Barcha oʻquvchilar keldi');
        }}
      />

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl divide-y divide-zinc-200/80 dark:divide-zinc-800 overflow-hidden">
        {students.length === 0 ? (
          <div className="p-6 text-center text-sm text-zinc-500">
            Oʻquvchi topilmadi
          </div>
        ) : (
          students.map((s, i) => (
            <StudentRow
              key={s.id}
              student={s}
              index={i}
              record={draft[s.id]}
              onSelectStatus={(st) => handleSelectStatus(s.id, s.fullName, st)}
              onEditReason={() =>
                setReasonTarget({
                  id: s.id,
                  name: s.fullName,
                  status: draft[s.id]?.status ?? 'absent',
                })
              }
            />
          ))
        )}
      </div>

      <AttendanceFooter
        stats={stats}
        onSendTelegram={async () => {
          await onSaveReport(draft);
          setTgOpen(true);
        }}
      />

      <NoteModal
        open={Boolean(reasonTarget)}
        studentName={reasonTarget?.name ?? ''}
        status={reasonTarget?.status ?? 'absent'}
        initialReason={reasonTarget ? (draft[reasonTarget.id]?.reason ?? '') : ''}
        onSave={(st, reason) => reasonTarget && setStatus(reasonTarget.id, st, reason)}
        onClose={() => setReasonTarget(null)}
      />

      <TelegramPreviewModal
        open={tgOpen}
        title={`${cls.name} sinf hisoboti`}
        text={tgText}
        date={date}
        excelBytes={excelBytes}
        submittedInfo={submittedInfo}
        onClose={() => setTgOpen(false)}
        onNotify={onNotify}
      />
    </div>
  );
}
