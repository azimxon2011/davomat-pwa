import { useEffect, useMemo, useState } from 'react';
import { ClassGroup, ClassReport, StudentAttendance, TeacherProfile } from './types';
import { SEED_CLASSES } from './data/seed';
import { useLocalStorage } from './hooks/useLocalStorage';
import { usePwaInstall } from './hooks/usePwaInstall';
import { AppPrefs, DEFAULT_PREFS } from './utils/i18n';
import { formatUzbekDate, getTodayISO } from './utils/uzbekDate';
import { buildUpdatedExcelBytes, syncExcelToLocalDisk } from './utils/excelUpdater';
import { AppHeader } from './components/AppHeader';
import { SettingsModal } from './components/SettingsModal';
import { Toast, ToastMessage } from './components/Toast';
import { AttendanceView } from './views/AttendanceView';
import { RegisterView } from './views/RegisterView';

export function App() {
  const [classes, setClasses] = useLocalStorage<ClassGroup[]>('davomat_classes_v3', SEED_CLASSES);
  const [teacher, setTeacher] = useLocalStorage<TeacherProfile | null>('davomat_teacher_v3', null);
  const [reports, setReports] = useLocalStorage<ClassReport[]>('davomat_reports_v3', []);
  const [prefs, setPrefs] = useLocalStorage<AppPrefs>('davomat_prefs_v1', DEFAULT_PREFS);
  const [excelBytes, setExcelBytes] = useState<Uint8Array | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [submittedInfo, setSubmittedInfo] = useState({ count: 0, total: SEED_CLASSES.length, all: false });
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const { canInstall, isOnline, installApp } = usePwaInstall();
  const today = getTodayISO();

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = prefs.theme === 'dark' || (prefs.theme === 'system' && prefersDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, [prefs.theme]);

  const notify = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToast({ id, text, type });
    setTimeout(() => setToast((cur) => (cur?.id === id ? null : cur)), 2500);
  };

  const teacherClass = useMemo(
    () => classes.find((c) => c.id === teacher?.classId) ?? null,
    [classes, teacher?.classId]
  );

  if (!teacher || !teacherClass) {
    return (
      <RegisterView
        classes={classes}
        lang={prefs.lang}
        onRegister={(profile) => setTeacher(profile)}
      />
    );
  }

  const todayReport = reports.find((r) => r.classId === teacherClass.id && r.date === today);

  const handleSaveReport = async (records: Record<string, StudentAttendance>) => {
    const entry: ClassReport = { classId: teacherClass.id, date: today, submittedAt: new Date().toISOString(), records };
    let nextReports = [...reports.filter((r) => !(r.classId === teacherClass.id && r.date === today)), entry];
    setReports(nextReports);

    let allSubmitted = false;
    let submittedCount = nextReports.filter((r) => r.date === today).length;
    try {
      const apiRes = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: today, report: entry, totalClasses: classes.length }),
      });
      if (apiRes.ok) {
        const data = await apiRes.json();
        if (data?.ok && Array.isArray(data.reports)) {
          nextReports = data.reports;
          submittedCount = data.submittedCount;
          allSubmitted = Boolean(data.allSubmitted);
        }
      }
    } catch {
      allSubmitted = submittedCount >= classes.length;
    }

    setSubmittedInfo({ count: submittedCount, total: classes.length, all: allSubmitted });
    if (allSubmitted) {
      try {
        const updated = await buildUpdatedExcelBytes(classes, nextReports, today);
        setExcelBytes(updated);
        await syncExcelToLocalDisk(updated);
      } catch {
        setExcelBytes(null);
      }
    } else {
      setExcelBytes(null);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Toast toast={toast} />
      <AppHeader
        classNameLabel={teacherClass.name}
        teacherName={teacher.fullName}
        dateLabel={formatUzbekDate(today)}
        isOnline={isOnline}
        canInstall={canInstall}
        lang={prefs.lang}
        onInstall={installApp}
        onOpenSettings={() => setSettingsOpen(true)}
        onLogout={() => {
          setSettingsOpen(false);
          setTeacher(null);
        }}
      />
      <main className="max-w-xl mx-auto px-3 sm:px-4 pt-3">
        <AttendanceView
          cls={teacherClass}
          teacher={teacher}
          date={today}
          lang={prefs.lang}
          existingReport={todayReport}
          excelBytes={excelBytes}
          submittedInfo={submittedInfo}
          onSaveReport={handleSaveReport}
          onNotify={notify}
        />
      </main>
      <SettingsModal
        open={settingsOpen}
        cls={teacherClass}
        prefs={prefs}
        onChangePrefs={setPrefs}
        onAddStudent={(fullName) =>
          setClasses((prev) =>
            prev.map((c) =>
              c.id === teacherClass.id
                ? { ...c, students: [...c.students, { id: `${c.id}-s-${Date.now()}`, fullName }] }
                : c
            )
          )
        }
        onRemoveStudent={(sid) =>
          setClasses((prev) =>
            prev.map((c) =>
              c.id === teacherClass.id ? { ...c, students: c.students.filter((s) => s.id !== sid) } : c
            )
          )
        }
        onLogout={() => {
          setSettingsOpen(false);
          setTeacher(null);
        }}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
