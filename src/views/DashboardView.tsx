import { useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { AppSettings, ClassGroup, ClassReport } from '../types';
import { computeClassStats } from '../utils/status';
import { buildSchoolTelegramReport } from '../utils/telegram';
import { downloadDailyCsv } from '../utils/exportCsv';
import { DashboardHero } from '../components/DashboardHero';
import { PendingClassesCard } from '../components/PendingClassesCard';
import { SubmittedClassCard } from '../components/SubmittedClassCard';
import { TelegramPreviewModal } from '../components/TelegramPreviewModal';

interface DashboardViewProps {
  classes: ClassGroup[];
  reportsForDate: ClassReport[];
  date: string;
  settings: AppSettings;
  onJumpToClass: (classId: string) => void;
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function DashboardView({
  classes,
  reportsForDate,
  date,
  settings,
  onJumpToClass,
  onNotify,
}: DashboardViewProps) {
  const [expandedClassId, setExpandedClassId] = useState<string | null>(null);
  const [telegramOpen, setTelegramOpen] = useState(false);

  const reportMap = useMemo(
    () => new Map(reportsForDate.map((r) => [r.classId, r])),
    [reportsForDate]
  );

  const summary = useMemo(() => {
    let totalStudents = 0, present = 0, sick = 0, excused = 0, unexcused = 0, late = 0;
    const submitted: { cls: ClassGroup; report: ClassReport }[] = [];
    const pending: ClassGroup[] = [];

    for (const cls of classes) {
      const rep = reportMap.get(cls.id);
      if (rep) {
        submitted.push({ cls, report: rep });
        const st = computeClassStats(cls, rep.records);
        totalStudents += st.total;
        present += st.present;
        sick += st.sick;
        excused += st.excused;
        unexcused += st.unexcused;
        late += st.late;
      } else {
        pending.push(cls);
      }
    }

    const absent = sick + excused + unexcused;
    const percent =
      totalStudents === 0
        ? 0
        : Math.round(((present + late) / totalStudents) * 1000) / 10;

    return { totalStudents, present, sick, excused, unexcused, late, absent, percent, submitted, pending };
  }, [classes, reportMap]);

  const schoolReportText = buildSchoolTelegramReport(classes, reportsForDate, date, settings);

  return (
    <div className="space-y-4 pb-24">
      <DashboardHero
        schoolName={settings.schoolName}
        percent={summary.percent}
        submittedCount={summary.submitted.length}
        totalClasses={classes.length}
        totalStudents={summary.totalStudents}
        present={summary.present}
        absent={summary.absent}
        sick={summary.sick}
        excused={summary.excused}
        unexcused={summary.unexcused}
        late={summary.late}
        onOpenTelegram={() => setTelegramOpen(true)}
        onDownloadCsv={() => {
          downloadDailyCsv(classes, reportsForDate, date);
          onNotify('Excel (CSV) hisobot yuklab olindi');
        }}
      />

      <PendingClassesCard
        pending={summary.pending}
        date={date}
        onJumpToClass={onJumpToClass}
      />

      <div className="space-y-2.5">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 px-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Topshirgan sinflar ({summary.submitted.length})
        </h3>

        {summary.submitted.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 text-center text-sm text-slate-500 border border-slate-200/80 dark:border-slate-800">
            Ushbu sana uchun hali hech qaysi sinf hisobot topshirmagan.
          </div>
        ) : (
          summary.submitted.map(({ cls, report }) => (
            <SubmittedClassCard
              key={cls.id}
              cls={cls}
              report={report}
              expanded={expandedClassId === cls.id}
              onToggle={() => setExpandedClassId(expandedClassId === cls.id ? null : cls.id)}
              onEdit={() => onJumpToClass(cls.id)}
            />
          ))
        )}
      </div>

      <TelegramPreviewModal
        open={telegramOpen}
        title="Maktab boʻyicha umumiy hisobot"
        text={schoolReportText}
        settings={settings}
        onClose={() => setTelegramOpen(false)}
        onNotify={onNotify}
      />
    </div>
  );
}
