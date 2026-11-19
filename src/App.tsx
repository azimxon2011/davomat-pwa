import { useEffect, useMemo, useState } from 'react';
import { AppSettings, ClassReport, StudentAttendance, TabId, TeacherProfile } from './types';
import { DEFAULT_SETTINGS, SEED_CLASSES } from './data/seed';
import { useLocalStorage } from './hooks/useLocalStorage';
import { usePwaInstall } from './hooks/usePwaInstall';
import { getTodayISO } from './utils/uzbekDate';
import { AppHeader } from './components/AppHeader';
import { BottomNav } from './components/BottomNav';
import { Toast, ToastMessage } from './components/Toast';
import { AttendanceView } from './views/AttendanceView';
import { DashboardView } from './views/DashboardView';
import { RegisterView } from './views/RegisterView';
import { SettingsView } from './views/SettingsView';

export function App() {
  const [teacher, setTeacher] = useLocalStorage<TeacherProfile | null>('davomat_teacher_v2', null);
  const [reports, setReports] = useLocalStorage<ClassReport[]>('davomat_reports_v2', []);
  const [settings, setSettings] = useLocalStorage<AppSettings>('davomat_settings_v2', DEFAULT_SETTINGS);

  const [tab, setTab] = useState<TabId>('attendance');
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const { canInstall, isInstalled, isOnline, installApp } = usePwaInstall();

  const today = getTodayISO();

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = settings.theme === 'dark' || (settings.theme === 'system' && prefersDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, [settings.theme]);

  const notify = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToast({ id, text, type });
    setTimeout(() => setToast((cur) => (cur?.id === id ? null : cur)), 2800);
  };

  const teacherClass = useMemo(
    () => SEED_CLASSES.find((c) => c.id === teacher?.classId) ?? null,
    [teacher?.classId]
  );

  if (!teacher || !teacherClass) {
    return (
      <RegisterView
        classes={SEED_CLASSES}
        onRegister={(profile) => {
          setTeacher(profile);
          notify(`Xush kelibsiz, ${profile.fullName}!`);
        }}
      />
    );
  }

  const todayReport = reports.find(
    (r) => r.classId === teacherClass.id && r.date === today
  );

  const handleSaveReport = (
    records: Record<string, StudentAttendance>,
    sentToTelegram?: boolean
  ) => {
    const entry: ClassReport = {
      classId: teacherClass.id,
      date: today,
      submittedAt: new Date().toISOString(),
      records,
      sentToTelegram: Boolean(sentToTelegram),
    };
    setReports((prev) => [
      ...prev.filter((r) => !(r.classId === teacherClass.id && r.date === today)),
      entry,
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Toast toast={toast} />

      <AppHeader
        classNameLabel={teacherClass.name}
        teacherName={teacher.fullName}
        isOnline={isOnline}
        canInstall={canInstall}
        onInstall={installApp}
      />

      <main className="max-w-2xl mx-auto px-3 sm:px-4 pt-3 space-y-3">
        {tab === 'attendance' && (
          <AttendanceView
            cls={teacherClass}
            teacher={teacher}
            date={today}
            existingReport={todayReport}
            settings={settings}
            onSaveReport={handleSaveReport}
            onNotify={notify}
          />
        )}

        {tab === 'dashboard' && (
          <DashboardView
            cls={teacherClass}
            teacher={teacher}
            report={todayReport}
            date={today}
            settings={settings}
            onNotify={notify}
          />
        )}

        {tab === 'settings' && (
          <SettingsView
            teacher={teacher}
            classNameLabel={teacherClass.name}
            settings={settings}
            onChange={setSettings}
            canInstall={canInstall}
            isInstalled={isInstalled}
            onInstallApp={installApp}
            onNotify={notify}
          />
        )}
      </main>

      <BottomNav tab={tab} onChange={setTab} />
    </div>
  );
}

export default App;
