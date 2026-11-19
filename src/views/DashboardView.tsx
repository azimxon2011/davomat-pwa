import { useState } from 'react';
import { Download, Send } from 'lucide-react';
import { AppSettings, ClassGroup, ClassReport, TeacherProfile } from '../types';
import { computeClassStats } from '../utils/status';
import { buildClassTelegramReport } from '../utils/telegram';
import { downloadClassCsv } from '../utils/exportCsv';
import { formatUzbekDate } from '../utils/uzbekDate';
import { TelegramPreviewModal } from '../components/TelegramPreviewModal';

interface DashboardViewProps {
  cls: ClassGroup;
  teacher: TeacherProfile;
  report?: ClassReport;
  date: string;
  settings: AppSettings;
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function DashboardView({
  cls,
  teacher,
  report,
  date,
  settings,
  onNotify,
}: DashboardViewProps) {
  const [telegramOpen, setTelegramOpen] = useState(false);
  const records = report?.records ?? {};
  const stats = computeClassStats(cls, records);

  const presentList = cls.students.filter((s) => (records[s.id]?.status ?? 'present') === 'present');
  const absentList = cls.students.filter((s) => records[s.id]?.status === 'absent');
  const lateList = cls.students.filter((s) => records[s.id]?.status === 'late');

  const tgText = buildClassTelegramReport(cls, teacher, date, records);

  return (
    <div className="space-y-4 pb-24">
      <div className="bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600 rounded-3xl p-5 text-white shadow-lg shadow-teal-700/20 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-teal-100 uppercase tracking-wider">
              {formatUzbekDate(date)}
            </p>
            <h2 className="text-xl font-extrabold mt-0.5">{cls.name} sinf hisoboti</h2>
            <p className="text-xs text-teal-100/90 mt-0.5">{teacher.fullName}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-extrabold leading-none">{stats.attendancePercent}%</div>
            <p className="text-[11px] text-teal-100 mt-1">Jami: {stats.total} nafar</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-white/15 py-2.5 px-2">
            <div className="text-lg font-extrabold">{stats.present}</div>
            <div className="text-[11px] text-teal-50">✅ Keldi</div>
          </div>
          <div className="rounded-2xl bg-white/15 py-2.5 px-2">
            <div className="text-lg font-extrabold">{stats.absent}</div>
            <div className="text-[11px] text-teal-50">❌ Kelmadi</div>
          </div>
          <div className="rounded-2xl bg-white/15 py-2.5 px-2">
            <div className="text-lg font-extrabold">{stats.late}</div>
            <div className="text-[11px] text-teal-50">⏰ Kechikdi</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setTelegramOpen(true)}
            className="h-11 rounded-2xl bg-white text-teal-800 hover:bg-teal-50 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition"
          >
            <Send className="w-4 h-4" />
            <span>Telegramga yuborish</span>
          </button>

          <button
            type="button"
            onClick={() => {
              downloadClassCsv(cls, teacher, records, date);
              onNotify('Excel (CSV) hisobot yuklab olindi');
            }}
            className="h-11 rounded-2xl bg-teal-900/35 hover:bg-teal-900/50 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition"
          >
            <Download className="w-4 h-4" />
            <span>Excel (CSV)</span>
          </button>
        </div>
      </div>

      {/* Separate lists: Absent, Late, Present */}
      {[
        { title: `❌ Kelmaganlar (${absentList.length})`, items: absentList, accent: 'text-rose-600 dark:text-rose-400' },
        { title: `⏰ Kechikkanlar (${lateList.length})`, items: lateList, accent: 'text-violet-600 dark:text-violet-400' },
        { title: `✅ Kelganlar (${presentList.length})`, items: presentList, accent: 'text-emerald-600 dark:text-emerald-400' },
      ].map((group) => (
        <div
          key={group.title}
          className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 space-y-2.5"
        >
          <h3 className={`text-sm font-extrabold ${group.accent}`}>{group.title}</h3>
          {group.items.length === 0 ? (
            <p className="text-xs text-slate-400">Roʻyxat boʻsh</p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/70">
              {group.items.map((s, idx) => {
                const reason = records[s.id]?.reason;
                return (
                  <div key={s.id} className="py-2 flex items-center justify-between gap-2 text-xs">
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      <span className="text-slate-400 mr-2">{idx + 1}.</span>
                      {s.fullName}
                    </span>
                    {reason && (
                      <span className="text-slate-500 dark:text-slate-400 shrink-0">
                        {reason}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}

      <TelegramPreviewModal
        open={telegramOpen}
        title={`${cls.name} sinf davomat hisoboti`}
        text={tgText}
        settings={settings}
        onClose={() => setTelegramOpen(false)}
        onNotify={onNotify}
      />
    </div>
  );
}
