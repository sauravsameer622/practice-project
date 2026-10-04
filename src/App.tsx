/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Student,
  CourseInfo,
  AcademicTask,
  SystemNotification,
  ActiveTab,
} from './types';
import {
  INITIAL_STUDENTS,
  COURSES_CATALOG,
  INITIAL_TASKS,
  INITIAL_NOTIFICATIONS,
} from './data/initialData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { StudentsView } from './components/StudentsView';
import { OverviewView } from './components/OverviewView';
import { CoursesView } from './components/CoursesView';
import { GradesView } from './components/GradesView';
import { AttendanceView } from './components/AttendanceView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { Toast } from './components/Toast';
import { ConfirmModal } from './components/ConfirmModal';
import { NotificationsModal } from './components/NotificationsModal';

export default function App() {
  // App States
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('edutrack_students');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_STUDENTS;
      }
    }
    return INITIAL_STUDENTS;
  });

  const [courses] = useState<CourseInfo[]>(COURSES_CATALOG);
  const [tasks] = useState<AcademicTask[]>(INITIAL_TASKS);
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);

  // Active navigation tab — default is 'students' matching the screenshot
  const [activeTab, setActiveTab] = useState<ActiveTab>('students');
  const [academicTerm, setAcademicTerm] = useState('Fall Term 2024–2025');
  const [passThreshold, setPassThreshold] = useState<number>(40);

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // UI Modals & Drawers
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'delete' | 'info';
  } | null>(null);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText?: string;
    isDanger?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  // Next ID tracker
  const [nextId, setNextId] = useState<number>(() => {
    const maxId = students.reduce((max, s) => Math.max(max, s.id), 5);
    return maxId + 1;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('edutrack_students', JSON.stringify(students));
  }, [students]);

  // Sync dark mode class to <html> tag
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Toast trigger
  const showToast = (message: string, type: 'success' | 'delete' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3200);
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      showToast(next ? 'Switched to Dark Mode appearance' : 'Switched to Light Mode appearance');
      return next;
    });
  };

  // Student CRUD operations
  const handleAddStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...studentData,
      id: nextId,
    };
    setNextId((prev) => prev + 1);
    setStudents((prev) => [...prev, newStudent]);
    showToast(`Student "${newStudent.name}" added to registry.`);
  };

  const handleUpdateStudent = (id: number, studentData: Omit<Student, 'id'>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...studentData, id } : s))
    );
    showToast(`Student #${id} updated successfully.`);
  };

  const handleDeleteStudent = (id: number) => {
    const target = students.find((s) => s.id === id);
    const studentName = target ? target.name : `ID #${id}`;

    setConfirmModal({
      isOpen: true,
      title: 'Delete Student Record?',
      description: `Are you sure you want to remove "${studentName}" from the registry? This action cannot be reversed.`,
      confirmText: 'Delete Record',
      isDanger: true,
      onConfirm: () => {
        setStudents((prev) => prev.filter((s) => s.id !== id));
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast(`Record for ${studentName} deleted.`, 'delete');
      },
    });
  };

  const handleClearRegistry = () => {
    if (students.length === 0) {
      showToast('Registry is already empty.', 'info');
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Clear All Students?',
      description: 'This will remove all student records from the academic registry. This action cannot be reversed.',
      confirmText: 'Clear Registry',
      isDanger: true,
      onConfirm: () => {
        setStudents([]);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast('All student records have been cleared.', 'delete');
      },
    });
  };

  const handleResetToDefaults = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset to Seed Data?',
      description: 'This will restore the original 5 sample student records and overwrite current entries.',
      confirmText: 'Reset to Sample Data',
      isDanger: false,
      onConfirm: () => {
        setStudents(INITIAL_STUDENTS);
        setNextId(6);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast('Registry restored to original seed cohort.');
      },
    });
  };

  const handleSignOut = () => {
    showToast('Session ended. Signed out as Dr. Aris Thorne.', 'info');
  };

  // Grade adjustment from Grades view
  const handleUpdateMarks = (studentId: number, newMarks: number) => {
    const computeGrade = (m: number): Student['grade'] => {
      if (m >= 90) return 'A+';
      if (m >= 80) return 'A';
      if (m >= 70) return 'B';
      if (m >= 60) return 'C';
      if (m >= passThreshold) return 'D';
      return 'F';
    };

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            marks: newMarks,
            grade: computeGrade(newMarks),
            result: newMarks >= passThreshold ? 'PASS' : 'FAIL',
          };
        }
        return s;
      })
    );
    showToast(`Updated marks for student #${studentId}`);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Mobile', 'Course', 'Marks', 'Grade', 'Result'];
    const rows = students.map((s) => [
      s.id,
      `"${s.name}"`,
      s.email,
      s.mobile,
      `"${s.course}"`,
      s.marks,
      s.grade,
      s.result,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `edutrack-gradebook-${academicTerm.toLowerCase().replace(/\s+/g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('Gradebook downloaded as CSV');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#fbf8ff] dark:bg-[#12111b] text-[#1b1b24] dark:text-[#f2effc] transition-colors">
      {/* Toast Notification */}
      <Toast
        message={toast?.message || null}
        type={toast?.type}
        onClose={() => setToast(null)}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        description={confirmModal.description}
        confirmText={confirmModal.confirmText}
        isDanger={confirmModal.isDanger}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Notifications Drawer */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
          showToast('Marked all notifications as read');
        }}
        onClearAll={() => {
          setNotifications([]);
          showToast('Cleared notifications', 'delete');
        }}
      />

      {/* Fixed Top Header */}
      <Header
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        unreadNotificationsCount={unreadCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        academicTerm={academicTerm}
      />

      {/* Fixed Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <div className="md:pl-64 transition-all">
        <main className="w-full pt-20 px-4 md:px-8 min-h-screen max-w-7xl mx-auto">
          {activeTab === 'students' && (
            <StudentsView
              students={students}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              onClearRegistry={handleClearRegistry}
              isDarkMode={isDarkMode}
              onToggleTheme={toggleTheme}
              passThreshold={passThreshold}
            />
          )}

          {activeTab === 'overview' && (
            <OverviewView
              students={students}
              courses={courses}
              passThreshold={passThreshold}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'courses' && (
            <CoursesView
              courses={courses}
              students={students}
              onSelectCourseFilter={(_c) => {}}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'grades-and-assignments' && (
            <GradesView
              students={students}
              tasks={tasks}
              passThreshold={passThreshold}
              onUpdateMarks={handleUpdateMarks}
              onExportCSV={handleExportCSV}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView
              students={students}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              students={students}
              passThreshold={passThreshold}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              academicTerm={academicTerm}
              onUpdateTerm={setAcademicTerm}
              passThreshold={passThreshold}
              onUpdatePassThreshold={setPassThreshold}
              students={students}
              onResetToDefaults={handleResetToDefaults}
              onRestoreData={(imported) => {
                setStudents(imported);
                const maxId = imported.reduce((max, s) => Math.max(max, s.id), 5);
                setNextId(maxId + 1);
              }}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>
    </div>
  );
}
