export interface Student {
  id: number;
  name: string;
  email: string;
  mobile: string;
  course: string;
  marks: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  result: 'PASS' | 'FAIL';
  enrolledDate?: string;
  attendanceRate?: number;
}

export interface CourseInfo {
  id: string;
  name: string;
  code: string;
  instructor: string;
  credits: number;
  schedule: string;
  description: string;
  topics: string[];
}

export interface AttendanceEntry {
  studentId: number;
  date: string;
  status: 'PRESENT' | 'LATE' | 'ABSENT' | 'EXCUSED';
}

export interface AcademicTask {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  weight: number;
  totalMarks: number;
  completedCount: number;
}

export interface SystemNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success';
}

export type ActiveTab = 'overview' | 'students' | 'courses' | 'grades-and-assignments' | 'attendance' | 'analytics' | 'settings';
