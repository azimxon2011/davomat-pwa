import { useEffect, useMemo, useState } from 'react';
import { AppSettings, AttendanceStatus, ClassGroup, ClassReport, StudentAttendance } from '../types';
import { computeClassStats } from '../utils/status';
import { buildClassTelegramReport } from '../utils/telegram';
import { triggerHaptic } from '../utils/exportCsv';
import { AttendanceFooter } from '../components/AttendanceFooter';
import { AttendanceHeader, FilterMode } from '../components/AttendanceHeader';
import { ClassPills } from '../components/ClassPills';
import { NoteModal } from '../components/NoteModal';
import { StudentRow } from '../components/StudentRow';
import { TelegramPreviewModal } from '../components/TelegramPreviewModal';

interface Props {
  classes: ClassGroup[];
  selectedClassId: string;
  onSelectClass: (id: string) => void;
  date: string;
  reportsForDate: ClassReport[];
  settings: AppSettings;
  onSaveReport: (classId: string, records: Record<string, StudentAttendance>, sent?: boolean) => void;
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function AttendanceView({
  classes,
  selectedClassId,
  onSelectClass,
  date,
  reportsForDate,
  settings,
  onSaveReport,
  onNotify,
}: Props) {
  const cls = classes.find((c) => c.id === selectedClassId) ?? classes[0];
  const existing = useMemo(() => reportsForDate.find((r) => r.classId === cls?.id), [reportsForDate, cls?.id]);

  const [draft, setDraft] = useState<Record<string, StudentAttendance>>({});
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterMode>('all');
  const [noteTarget, setNoteTarget] = useState<{ id: string; name: string } | null>(null);
  const [tgOpen, setTgOpen] = useState(false);

  useEffect(() => {
    setDraft(existing?.records ? { ...existing.records } : {});
    setSearch('');
    setFilter('all');
  }, [cls?.id, date, existing?.submittedAt]);

  if (!cls) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-800 text-sm text-slate-500">
        Hozircha sinflar mavjud emas. «Sinflar» boʻlimidan yangi sinf qoʻshing.
      </div>
    );
  }

  const doneIds = new Set(reportsForDate.map((r) => r.classId));
  const stats = computeClassStats(cls, draft);

  const setStatus = (sid: string, status: AttendanceStatus, note?: string) => {
    triggerHaptic(settings.haptics, 10);
    setDraft((prev) => {
      const next = { ...prev };
      if (status === 'present' && !note) delete next[sid];
      else next[sid] = { status, note: note !== undefined ? note : prev[sid]?.note };
      return next;
    });
  };

  const students = cls.students.filter((s) => {
    const st = draft[s.id]?.status ?? 'present';
    if (filter === 'absent' && !['sick', 'excused', 'unexcused'].includes(st)) return false;
    if (filter === 'late' && st !== 'late') return false;
    if (search.trim() && !s.fullName.toLowerCase().includes(search.trim().toLowerCase())) return false;
    return true;
  });

  const tgText = buildClassTelegramReport(cls, date, draft, settings);

  return (
    <div className="space-y-4 pb-36">
      <ClassPills classes={classes} selectedId={cls.id} doneIds={doneIds} onSelect={onSelectClass} />

      <AttendanceHeader
        currentClass={cls}
        existingReport={existing}
        stats={stats}
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        onAllPresent={() => {
          triggerHaptic(settings.haptics, [15, 30, 15]);
          setDraft({});
          onSaveReport(cls.id, {}, false);
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
              onStatusChange={(st) => setStatus(s.id, st)}
              onOpenNote={() => setNoteTarget({ id: s.id, name: s.fullName })}
            />
          ))
        )}
      </div>

      <AttendanceFooter
        stats={stats}
        onSave={() => {
          triggerHaptic(settings.haptics, 18);
          onSaveReport(cls.id, draft, existing?.sentToTelegram);
          onNotify(`${cls.name} sinf davomati saqlandi`);
        }}
        onSendTelegram={() => {
          onSaveReport(cls.id, draft, existing?.sentToTelegram);
          setTgOpen(true);
        }}
      />

      <NoteModal
        open={Boolean(noteTarget)}
        studentName={noteTarget?.name ?? ''}
        status={noteTarget ? (draft[noteTarget.id]?.status ?? 'present') : 'present'}
        initialNote={noteTarget ? (draft[noteTarget.id]?.note ?? '') : ''}
        onSave={(st, note) => noteTarget && setStatus(noteTarget.id, st, note)}
        onClose={() => setNoteTarget(null)}
      />

      <TelegramPreviewModal
        open={tgOpen}
        title={`${cls.name} sinf davomat hisoboti`}
        text={tgText}
        settings={settings}
        onClose={() => setTgOpen(false)}
        onSentSuccess={() => onSaveReport(cls.id, draft, true)}
        onNotify={onNotify}
      />
    </div>
  );
}
