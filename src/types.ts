export type AttendanceStatus =
  | 'present'
  | 'sick'
  | 'excused'
  | 'unexcused'
  | 'late';

export interface Student {
  id: string;
  fullName: string;
  phone?: string;
}

export interface ClassGroup {
  id: string;
  name: string;
  curatorName: string;
  curatorPhone?: string;
  shift: '1-smena' | '2-smena';
  students: Student[];
}

export interface StudentAttendance {
  status: AttendanceStatus;
  note?: string;
}

export interface ClassReport {
  classId: string;
  date: string; // YYYY-MM-DD
  submittedAt: string; // ISO string
  records: Record<string, StudentAttendance>; // studentId -> status
  sentToTelegram?: boolean;
}

export interface AppSettings {
  schoolName: string;
  vicePrincipalName: string;
  telegramBotToken: string;
  telegramChatId: string;
  defaultClassId: string;
  theme: 'light' | 'dark' | 'system';
  haptics: boolean;
}

export type TabId = 'attendance' | 'dashboard' | 'classes' | 'settings';
