import { useEffect, useMemo, useState } from 'react';
import { AppSettings, ClassGroup, ClassReport, StudentAttendance, TabId } from './types';
import { createSeedReports, DEFAULT_SETTINGS, SEED_CLASSES } from './data/seed';
import { useLocalStorage } from './hooks/useLocalStorage';
import { usePwaInstall } from './hooks/usePwaInstall';
import { getTodayISO } from './utils/uzbekDate';
import { AppHeader } from './components/AppHeader';
import { BottomNav } from './components/BottomNav';
import { DateBar } from './components/DateBar';
import { Toast, ToastMessage } from './components/Toast';
import { AttendanceView } from './views/AttendanceView';
import { DashboardView } from './views/DashboardView';
import { ClassesView } from './views/ClassesView';
import { SettingsView } from './views/SettingsView';

export function App() {
  const [classes, setClasses] = useLocalStorage<ClassGroup[]>('davomat_classes_v1', SEED_CLASSES);
  const [reports, setReports] = useLocalStorage<ClassReport[]>('davomat_reports_v1', createSeedReports);
  const [settings, setSettings] = useLocalStorage<AppSettings>('davomat_settings_v1', DEFAULT_SETTINGS);

  const [tab, setTab] = useState<TabId>('attendance');
  const [date, setDate] = useState<string>(getTodayISO);
  const [selectedClassId, setSelectedClassId] = useState<string>(
    settings.defaultClassId || classes[0]?.id || ''
  );
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const { canInstall, isInstalled, isOnline, installApp } = usePwaInstall();

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

  const reportsForDate = useMemo(() => reports.filter((r) => r.date === date), [reports, date]);

  const handleSaveReport = (
    classId: string,
    records: Record<string, StudentAttendance>,
    sentToTelegram?: boolean
  ) => {
    const entry: ClassReport = {
      classId,
      date,
      submittedAt: new Date().toISOString(),
      records,
      sentToTelegram: Boolean(sentToTelegram),
    };
    setReports((prev) => [
      ...prev.filter((r) => !(r.classId === classId && r.date === date)),
      entry,
    ]);
  };

  const pendingCount = Math.max(0, classes.length - reportsForDate.length);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Toast toast={toast} />

      <AppHeader
        schoolName={settings.schoolName}
        isOnline={isOnline}
        canInstall={canInstall}
        onInstall={installApp}
      />

      <main className="max-w-2xl mx-auto px-3 sm:px-4 pt-3 space-y-3">
        {(tab === 'attendance' || tab === 'dashboard') && <DateBar date={date} onChange={setDate} />}

        {tab === 'attendance' && (
          <AttendanceView
            classes={classes}
            selectedClassId={selectedClassId}
            onSelectClass={setSelectedClassId}
            date={date}
            reportsForDate={reportsForDate}
            settings={settings}
            onSaveReport={handleSaveReport}
            onNotify={notify}
          />
        )}

        {tab === 'dashboard' && (
          <DashboardView
            classes={classes}
            reportsForDate={reportsForDate}
            date={date}
            settings={settings}
            onJumpToClass={(id) => {
              setSelectedClassId(id);
              setTab('attendance');
            }}
            onNotify={notify}
          />
        )}

        {tab === 'classes' && (
          <ClassesView classes={classes} onChangeClasses={setClasses} onNotify={notify} />
        )}

        {tab === 'settings' && (
          <SettingsView
            settings={settings}
            onChange={setSettings}
            onResetDemo={() => {
              setClasses(SEED_CLASSES);
              setReports(createSeedReports());
              setSettings(DEFAULT_SETTINGS);
              setSelectedClassId(SEED_CLASSES[0].id);
              notify('Namuna maʼlumotlari qayta tiklandi', 'info');
            }}
            canInstall={canInstall}
            isInstalled={isInstalled}
            onInstallApp={installApp}
            onNotify={notify}
          />
        )}
      </main>

      <BottomNav tab={tab} pendingCount={pendingCount} onChange={setTab} />
    </div>
  );
}

export default App;
