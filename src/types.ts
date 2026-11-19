export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface Student {
  id: string;
  fullName: string;
}

export interface ClassGroup {
  id: string;
  name: string;
  excelRow: number;
  curatorName: string;
  defaultAttended: number;
  students: Student[];
}

export interface StudentAttendance {
  status: AttendanceStatus;
  reason?: string;
}

export interface ClassReport {
  classId: string;
  date: string;
  submittedAt: string;
  records: Record<string, StudentAttendance>;
}

export interface TeacherProfile {
  fullName: string;
  classId: string;
}
