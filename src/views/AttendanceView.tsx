import { useEffect, useState } from 'react';
import {
  AppSettings,
  AttendanceStatus,
  ClassGroup,
  ClassReport,
  StudentAttendance,
  TeacherProfile,
} from '../types';
import { computeClassStats } from '../utils/status';
import { buildClassTelegramReport } from '../utils/telegram';
import { triggerHaptic } from '../utils/exportCsv';
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
  settings: AppSettings;
  onSaveReport: (records: Record<string, StudentAttendance>, sent?: boolean) => void;
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function AttendanceView({
  cls,
  teacher,
  date,
  existingReport,
  settings,
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
    triggerHaptic(settings.haptics, 10);
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
    <div className="space-y-4 pb-36">
      <AttendanceHeader
        currentClass={cls}
        teacher={teacher}
        date={date}
        existingReport={existingReport}
        stats={stats}
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        onAllPresent={() => {
          triggerHaptic(settings.haptics, [15, 30, 15]);
          setDraft({});
          onSaveReport({}, false);
          onNotify(`${cls.name} sinf: barcha oʻquvchilar «Keldi» deb saqlandi!`);
        }}
      />

      <div className="space-y-2">
        {students.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 text-center text-sm text-slate-500 border border-slate-200/70 dark:border-slate-800">
            Mos oʻquvchi topilmadi
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
        onSave={() => {
          triggerHaptic(settings.haptics, 18);
          onSaveReport(draft, existingReport?.sentToTelegram);
          onNotify(`${cls.name} sinf davomati saqlandi`);
        }}
        onSendTelegram={() => {
          onSaveReport(draft, existingReport?.sentToTelegram);
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
        title={`${cls.name} sinf davomat hisoboti`}
        text={tgText}
        settings={settings}
        onClose={() => setTgOpen(false)}
        onSentSuccess={() => onSaveReport(draft, true)}
        onNotify={onNotify}
      />
    </div>
  );
}
