import { useMemo, useState } from 'react';
import { ClassReport, StudentAttendance, TeacherProfile } from './types';
import { SEED_CLASSES } from './data/seed';
import { useLocalStorage } from './hooks/useLocalStorage';
import { usePwaInstall } from './hooks/usePwaInstall';
import { formatUzbekDate, getTodayISO } from './utils/uzbekDate';
import { AppHeader } from './components/AppHeader';
import { Toast, ToastMessage } from './components/Toast';
import { AttendanceView } from './views/AttendanceView';
import { RegisterView } from './views/RegisterView';

export function App() {
  const [teacher, setTeacher] = useLocalStorage<TeacherProfile | null>('davomat_teacher_v2', null);
  const [reports, setReports] = useLocalStorage<ClassReport[]>('davomat_reports_v2', []);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const { canInstall, isOnline, installApp } = usePwaInstall();

  const today = getTodayISO();

  const notify = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToast({ id, text, type });
    setTimeout(() => setToast((cur) => (cur?.id === id ? null : cur)), 2500);
  };

  const teacherClass = useMemo(
    () => SEED_CLASSES.find((c) => c.id === teacher?.classId) ?? null,
    [teacher?.classId]
  );

  if (!teacher || !teacherClass) {
    return (
      <RegisterView
        classes={SEED_CLASSES}
        onRegister={(profile) => setTeacher(profile)}
      />
    );
  }

  const todayReport = reports.find(
    (r) => r.classId === teacherClass.id && r.date === today
  );

  const handleSaveReport = (records: Record<string, StudentAttendance>) => {
    const entry: ClassReport = {
      classId: teacherClass.id,
      date: today,
      submittedAt: new Date().toISOString(),
      records,
    };
    setReports((prev) => [
      ...prev.filter((r) => !(r.classId === teacherClass.id && r.date === today)),
      entry,
    ]);
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
        onInstall={installApp}
      />

      <main className="max-w-xl mx-auto px-3 sm:px-4 pt-3">
        <AttendanceView
          cls={teacherClass}
          teacher={teacher}
          date={today}
          existingReport={todayReport}
          onSaveReport={handleSaveReport}
          onNotify={notify}
        />
      </main>
    </div>
  );
}

export default App;
