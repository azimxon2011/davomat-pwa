export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface Student {
  id: string;
  fullName: string;
}

export interface ClassGroup {
  id: string;
  name: string;
  students: Student[];
}

export interface StudentAttendance {
  status: AttendanceStatus;
  reason?: string;
}

export interface ClassReport {
  classId: string;
  date: string; // YYYY-MM-DD
  submittedAt: string; // ISO string
  records: Record<string, StudentAttendance>;
  sentToTelegram?: boolean;
}

export interface TeacherProfile {
  fullName: string;
  classId: string;
}

export interface AppSettings {
  telegramBotToken: string;
  telegramChatId: string;
  theme: 'light' | 'dark' | 'system';
  haptics: boolean;
}

export type TabId = 'attendance' | 'dashboard' | 'settings';
