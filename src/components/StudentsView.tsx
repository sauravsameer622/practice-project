import React, { useState, useMemo } from 'react';
import { Student } from '../types';

interface StudentsViewProps {
  students: Student[];
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onUpdateStudent: (id: number, student: Omit<Student, 'id'>) => void;
  onDeleteStudent: (id: number) => void;
  onClearRegistry: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  passThreshold: number;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onClearRegistry,
  isDarkMode,
  onToggleTheme,
  passThreshold = 40,
}) => {
  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [course, setCourse] = useState('');
  const [marks, setMarks] = useState<string>('');

  // Form Validation Errors
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [mobileError, setMobileError] = useState(false);
  const [courseError, setCourseError] = useState(false);
  const [marksError, setMarksError] = useState(false);

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'ID_ASC' | 'MARKS_DESC' | 'MARKS_ASC' | 'NAME_ASC' | 'NAME_DESC' | 'COURSE_ASC'>('ID_ASC');

  // Accordion State
  const [showVivaMatrix, setShowVivaMatrix] = useState(false);

  // Helper functions for grades
  const computeGrade = (score: number): 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= passThreshold) return 'D';
    return 'F';
  };

  const computeResult = (score: number): 'PASS' | 'FAIL' => {
    return score >= passThreshold ? 'PASS' : 'FAIL';
  };

  // Live preview calculation based on input
  const liveScoreNum = marks.trim() !== '' && !isNaN(Number(marks)) ? Number(marks) : null;
  const liveGrade = liveScoreNum !== null && liveScoreNum >= 0 && liveScoreNum <= 100 ? computeGrade(liveScoreNum) : null;
  const liveResult = liveScoreNum !== null && liveScoreNum >= 0 && liveScoreNum <= 100 ? computeResult(liveScoreNum) : null;

  // Grade badge styling helper
  const getGradeBadgeClass = (g: string) => {
    switch (g) {
      case 'A+':
        return 'bg-[#e2dfff] dark:bg-[#322b82] text-[#3322cc] dark:text-[#c3c0ff] font-bold border border-[#c3c0ff]/50';
      case 'A':
        return 'bg-[#e2dfff]/70 dark:bg-[#322b82]/70 text-[#4d43e3] dark:text-[#a3a1f0] font-bold';
      case 'B':
        return 'bg-[#c2c1ff]/40 dark:bg-[#353467] text-[#58579b] dark:text-[#d4d3ff] font-bold';
      case 'C':
        return 'bg-[#e9e7f3] dark:bg-[#2d2943] text-[#464555] dark:text-[#e3e1ed] font-semibold';
      case 'D':
        return 'bg-[#ffd6f8] dark:bg-[#5c1160] text-[#7f0087] dark:text-[#ffd6f8] font-semibold';
      case 'F':
      default:
        return 'bg-[#ffdad6] dark:bg-[#5c1314] text-[#ba1a1a] dark:text-[#ffdad6] font-bold';
    }
  };

  // Cohort Stats
  const stats = useMemo(() => {
    const total = students.length;
    if (total === 0) {
      return {
        total: 0,
        average: '0.0',
        avgPercent: 0,
        passRate: 0,
        passCount: 0,
        topName: 'N/A',
        topScore: 'No marks recorded',
      };
    }

    const totalMarks = students.reduce((sum, s) => sum + s.marks, 0);
    const avg = totalMarks / total;
    const passCount = students.filter((s) => s.marks >= passThreshold).length;
    const passRate = Math.round((passCount / total) * 100);

    const sorted = [...students].sort((a, b) => b.marks - a.marks);
    const top = sorted[0];

    return {
      total,
      average: avg.toFixed(1),
      avgPercent: Math.min(100, Math.max(0, avg)),
      passRate,
      passCount,
      topName: top.name,
      topScore: `${top.marks}/100 • ${top.course}`,
    };
  }, [students, passThreshold]);

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;

    // Name check
    if (name.trim().length < 3) {
      setNameError(true);
      valid = false;
    } else {
      setNameError(false);
    }

    // Email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setEmailError(true);
      valid = false;
    } else {
      setEmailError(false);
    }

    // Mobile check (exactly 10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile.trim())) {
      setMobileError(true);
      valid = false;
    } else {
      setMobileError(false);
    }

    // Course check
    if (!course) {
      setCourseError(true);
      valid = false;
    } else {
      setCourseError(false);
    }

    // Marks check
    const marksNum = Number(marks.trim());
    if (marks.trim() === '' || isNaN(marksNum) || marksNum < 0 || marksNum > 100) {
      setMarksError(true);
      valid = false;
    } else {
      setMarksError(false);
    }

    if (!valid) return;

    const studentData: Omit<Student, 'id'> = {
      name: name.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      course,
      marks: marksNum,
      grade: computeGrade(marksNum),
      result: computeResult(marksNum),
      attendanceRate: 90,
      enrolledDate: new Date().toISOString().split('T')[0],
    };

    if (editingId !== null) {
      onUpdateStudent(editingId, studentData);
    } else {
      onAddStudent(studentData);
    }

    handleReset();
  };

  const handleEdit = (s: Student) => {
    setEditingId(s.id);
    setName(s.name);
    setEmail(s.email);
    setMobile(s.mobile);
    setCourse(s.course);
    setMarks(s.marks.toString());

    setNameError(false);
    setEmailError(false);
    setMobileError(false);
    setCourseError(false);
    setMarksError(false);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setEditingId(null);
    setName('');
    setEmail('');
    setMobile('');
    setCourse('');
    setMarks('');

    setNameError(false);
    setEmailError(false);
    setMobileError(false);
    setCourseError(false);
    setMarksError(false);
  };

  // Filter and Sort Students
  const displayedStudents = useMemo(() => {
    let list = [...students];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.course.toLowerCase().includes(q) ||
          s.mobile.includes(q)
      );
    }

    // Course dropdown filter
    if (courseFilter !== 'ALL') {
      list = list.filter((s) => s.course === courseFilter);
    }

    // Sorting
    switch (sortBy) {
      case 'MARKS_DESC':
        list.sort((a, b) => b.marks - a.marks);
        break;
      case 'MARKS_ASC':
        list.sort((a, b) => a.marks - b.marks);
        break;
      case 'NAME_ASC':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'NAME_DESC':
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'COURSE_ASC':
        list.sort((a, b) => a.course.localeCompare(b.course));
        break;
      case 'ID_ASC':
      default:
        list.sort((a, b) => a.id - b.id);
        break;
    }

    return list;
  }, [students, searchQuery, courseFilter, sortBy]);

  return (
    <div className="flex flex-col w-full">
      {/* Top Page Header Bar & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#e2dfff] dark:bg-[#322b82] text-[#3322cc] dark:text-[#c3c0ff] text-[10px] font-bold uppercase tracking-wider">
              DOM Engine v3.4
            </span>
            <span className="text-[#464555] dark:text-[#b5b2c7] text-[12px]">
              • Live Academic Session
            </span>
          </div>
          <h1 className="text-[28px] md:text-[32px] font-bold text-[#1b1b24] dark:text-[#f2effc] tracking-tight leading-tight mt-1">
            Student Management System
          </h1>
          <p className="text-[14px] text-[#464555] dark:text-[#b5b2c7]">
            JavaScript DOM Manipulation Engine & Academic Registry Console
          </p>
        </div>

        {/* Quick Utilities: Dark Theme Toggle & Reset Registry */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <button
            type="button"
            onClick={onToggleTheme}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#e9e7f3] dark:bg-[#252238] hover:bg-[#e3e1ed] dark:hover:bg-[#2d2943] text-[#1b1b24] dark:text-[#f2effc] transition-colors text-[13px] font-semibold shadow-sm cursor-pointer border border-[#c7c4d8]/40 dark:border-[#353150]"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <button
            type="button"
            onClick={onClearRegistry}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#ffdad6] dark:bg-[#5c1314] text-[#ba1a1a] dark:text-[#ffdad6] hover:opacity-90 transition-opacity text-[13px] font-semibold shadow-sm cursor-pointer border border-[#ba1a1a]/20"
          >
            <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
            <span>Clear Registry</span>
          </button>
        </div>
      </div>

      {/* Key Metrics 4-Card Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-6">
        {/* Stat 1: Total Students */}
        <div className="bg-white dark:bg-[#191726] rounded-2xl p-4 shadow-sm border border-[#e3e1ed]/70 dark:border-[#27243d] flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[#464555] dark:text-[#b5b2c7] uppercase tracking-wider">
              Total Enrolled
            </span>
            <div className="w-9 h-9 rounded-full bg-[#e2dfff] dark:bg-[#322b82] text-[#4d43e3] dark:text-[#c3c0ff] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">groups</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-[32px] font-bold text-[#1b1b24] dark:text-[#f2effc] tabular-nums tracking-tight">
              {stats.total}
            </span>
            <span className="text-[12px] text-[#464555] dark:text-[#b5b2c7]">
              Active Learners
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[#464555] dark:text-[#b5b2c7] text-[11px] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#4d43e3] dark:bg-[#857df8]"></span>
            <span>Synchronized to Memory</span>
          </div>
        </div>

        {/* Stat 2: Cohort Average */}
        <div className="bg-white dark:bg-[#191726] rounded-2xl p-4 shadow-sm border border-[#e3e1ed]/70 dark:border-[#27243d] flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[#464555] dark:text-[#b5b2c7] uppercase tracking-wider">
              Cohort Average
            </span>
            <div className="w-9 h-9 rounded-full bg-[#e2dfff] dark:bg-[#353467] text-[#58579b] dark:text-[#d4d3ff] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">equalizer</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-[32px] font-bold text-[#1b1b24] dark:text-[#f2effc] tabular-nums tracking-tight">
              {stats.average}
            </span>
            <span className="text-[12px] text-[#464555] dark:text-[#b5b2c7]">
              / 100
            </span>
          </div>
          {/* Mini Progress Rail */}
          <div className="w-full bg-[#e9e7f3] dark:bg-[#252238] h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#58579b] dark:bg-[#857df8] h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.avgPercent}%` }}
            />
          </div>
        </div>

        {/* Stat 3: Pass Rate */}
        <div className="bg-white dark:bg-[#191726] rounded-2xl p-4 shadow-sm border border-[#e3e1ed]/70 dark:border-[#27243d] flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[#464555] dark:text-[#b5b2c7] uppercase tracking-wider">
              Pass Rate
            </span>
            <div className="w-9 h-9 rounded-full bg-[#ffd6f8] dark:bg-[#5c1160] text-[#9d25a4] dark:text-[#ffd6f8] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">verified</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-[32px] font-bold text-[#1b1b24] dark:text-[#f2effc] tabular-nums tracking-tight">
              {stats.passRate}%
            </span>
            <span className="text-[12px] text-[#464555] dark:text-[#b5b2c7]">
              ({stats.passCount} of {stats.total} Passed)
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[#464555] dark:text-[#b5b2c7] text-[11px] font-medium">
            <span className="material-symbols-outlined text-[14px] text-[#4d43e3] dark:text-[#857df8]">
              speed
            </span>
            <span>Pass Threshold: ≥ {passThreshold} Marks</span>
          </div>
        </div>

        {/* Stat 4: Top Valedictorian */}
        <div className="bg-white dark:bg-[#191726] rounded-2xl p-4 shadow-sm border border-[#e3e1ed]/70 dark:border-[#27243d] flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[#464555] dark:text-[#b5b2c7] uppercase tracking-wider">
              Top Valedictorian
            </span>
            <div className="w-9 h-9 rounded-full bg-[#ffd6f8] dark:bg-[#5c1160] text-[#9d25a4] dark:text-[#ffd6f8] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">military_tech</span>
            </div>
          </div>
          <div className="mt-3 flex flex-col">
            <span className="text-[16px] font-bold text-[#1b1b24] dark:text-[#f2effc] truncate">
              {stats.topName}
            </span>
            <span className="text-[12px] text-[#464555] dark:text-[#b5b2c7] tabular-nums">
              {stats.topScore}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[#464555] dark:text-[#b5b2c7] text-[11px] font-medium">
            <span className="material-symbols-outlined text-[14px] text-[#9d25a4] dark:text-[#e588eb]">
              star
            </span>
            <span>Highest Achiever</span>
          </div>
        </div>
      </div>

      {/* Two-Column Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-8">
        {/* LEFT COLUMN: Registration & Edit Form (4 cols on lg) */}
        <div className="lg:col-span-4 flex flex-col gap-4 sticky top-20">
          <div className="bg-white dark:bg-[#191726] rounded-2xl p-5 shadow-sm border border-[#e3e1ed]/70 dark:border-[#27243d] flex flex-col gap-4">
            {/* Form Header with State Badge */}
            <div className="flex items-center justify-between pb-1 border-b border-[#e3e1ed]/50 dark:border-[#27243d]">
              <div className="flex flex-col">
                <h2 className="text-[18px] font-bold text-[#1b1b24] dark:text-[#f2effc]">
                  {editingId !== null ? `Edit Record #${editingId}` : 'Student Form'}
                </h2>
                <p className="text-[12px] text-[#464555] dark:text-[#b5b2c7]">
                  {editingId !== null ? 'Modify credentials below' : 'Enter academic credentials below'}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  editingId !== null
                    ? 'bg-[#ffd6f8] dark:bg-[#5c1160] text-[#7f0087] dark:text-[#ffd6f8]'
                    : 'bg-[#e2dfff] dark:bg-[#322b82] text-[#3322cc] dark:text-[#c3c0ff]'
                }`}
              >
                {editingId !== null ? `Editing #${editingId}` : 'New Student'}
              </span>
            </div>

            {/* Student Form Element */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
              {/* Input: Student Name */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="studentNameInput"
                  className="text-[12px] font-semibold text-[#1b1b24] dark:text-[#f2effc]"
                >
                  Student Full Name <span className="text-[#ba1a1a] dark:text-[#ffb4ab]">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[18px] text-[#777587]">
                    badge
                  </span>
                  <input
                    id="studentNameInput"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (nameError) setNameError(false);
                    }}
                    placeholder="e.g., Rahul Kumar"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f5f2ff] dark:bg-[#201e30] text-[#1b1b24] dark:text-[#f2effc] placeholder:text-[#777587] text-[14px] focus:outline-none focus:bg-white dark:focus:bg-[#191726] border transition-all ${
                      nameError
                        ? 'border-[#ba1a1a] bg-[#ffdad6]/20'
                        : 'border-transparent focus:border-[#4d43e3] dark:focus:border-[#857df8]'
                    }`}
                  />
                </div>
                {nameError && (
                  <span className="text-[11px] text-[#ba1a1a] dark:text-[#ffb4ab] font-medium">
                    Name must be at least 3 characters.
                  </span>
                )}
              </div>

              {/* Input: Email Address */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="studentEmailInput"
                  className="text-[12px] font-semibold text-[#1b1b24] dark:text-[#f2effc]"
                >
                  Email Address <span className="text-[#ba1a1a] dark:text-[#ffb4ab]">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[18px] text-[#777587]">
                    mail
                  </span>
                  <input
                    id="studentEmailInput"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError(false);
                    }}
                    placeholder="e.g., rahul@gmail.com"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f5f2ff] dark:bg-[#201e30] text-[#1b1b24] dark:text-[#f2effc] placeholder:text-[#777587] text-[14px] focus:outline-none focus:bg-white dark:focus:bg-[#191726] border transition-all ${
                      emailError
                        ? 'border-[#ba1a1a] bg-[#ffdad6]/20'
                        : 'border-transparent focus:border-[#4d43e3] dark:focus:border-[#857df8]'
                    }`}
                  />
                </div>
                {emailError && (
                  <span className="text-[11px] text-[#ba1a1a] dark:text-[#ffb4ab] font-medium">
                    Please enter a valid academic email address.
                  </span>
                )}
              </div>

              {/* Input: Mobile Number */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="studentMobileInput"
                  className="text-[12px] font-semibold text-[#1b1b24] dark:text-[#f2effc]"
                >
                  10-Digit Mobile Number <span className="text-[#ba1a1a] dark:text-[#ffb4ab]">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[18px] text-[#777587]">
                    call
                  </span>
                  <input
                    id="studentMobileInput"
                    type="tel"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => {
                      setMobile(e.target.value.replace(/\D/g, ''));
                      if (mobileError) setMobileError(false);
                    }}
                    placeholder="10-digit mobile number"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f5f2ff] dark:bg-[#201e30] text-[#1b1b24] dark:text-[#f2effc] placeholder:text-[#777587] text-[14px] focus:outline-none focus:bg-white dark:focus:bg-[#191726] border transition-all ${
                      mobileError
                        ? 'border-[#ba1a1a] bg-[#ffdad6]/20'
                        : 'border-transparent focus:border-[#4d43e3] dark:focus:border-[#857df8]'
                    }`}
                  />
                </div>
                {mobileError && (
                  <span className="text-[11px] text-[#ba1a1a] dark:text-[#ffb4ab] font-medium">
                    Mobile must be exactly 10 numeric digits.
                  </span>
                )}
              </div>

              {/* Select: Departmental Course */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="studentCourseSelect"
                  className="text-[12px] font-semibold text-[#1b1b24] dark:text-[#f2effc]"
                >
                  Departmental Course <span className="text-[#ba1a1a] dark:text-[#ffb4ab]">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[18px] text-[#777587]">
                    school
                  </span>
                  <select
                    id="studentCourseSelect"
                    value={course}
                    onChange={(e) => {
                      setCourse(e.target.value);
                      if (courseError) setCourseError(false);
                    }}
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#f5f2ff] dark:bg-[#201e30] text-[#1b1b24] dark:text-[#f2effc] text-[14px] focus:outline-none focus:bg-white dark:focus:bg-[#191726] border transition-all appearance-none cursor-pointer ${
                      courseError
                        ? 'border-[#ba1a1a] bg-[#ffdad6]/20'
                        : 'border-transparent focus:border-[#4d43e3] dark:focus:border-[#857df8]'
                    }`}
                  >
                    <option value="">Select Course</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                    <option value="Full Stack Development">Full Stack Development</option>
                    <option value="Data Analysis">Data Analysis</option>
                    <option value="Data Science">Data Science</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 pointer-events-none text-[#777587] text-[18px]">
                    expand_more
                  </span>
                </div>
                {courseError && (
                  <span className="text-[11px] text-[#ba1a1a] dark:text-[#ffb4ab] font-medium">
                    Please select a valid course.
                  </span>
                )}
              </div>

              {/* Input: Assessment Marks (0 - 100) */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="studentMarksInput"
                  className="text-[12px] font-semibold text-[#1b1b24] dark:text-[#f2effc]"
                >
                  Assessment Marks (0 - 100) <span className="text-[#ba1a1a] dark:text-[#ffb4ab]">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[18px] text-[#777587]">
                    score
                  </span>
                  <input
                    id="studentMarksInput"
                    type="number"
                    min={0}
                    max={100}
                    value={marks}
                    onChange={(e) => {
                      setMarks(e.target.value);
                      if (marksError) setMarksError(false);
                    }}
                    placeholder="0 - 100"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f5f2ff] dark:bg-[#201e30] text-[#1b1b24] dark:text-[#f2effc] placeholder:text-[#777587] text-[14px] focus:outline-none focus:bg-white dark:focus:bg-[#191726] border transition-all ${
                      marksError
                        ? 'border-[#ba1a1a] bg-[#ffdad6]/20'
                        : 'border-transparent focus:border-[#4d43e3] dark:focus:border-[#857df8]'
                    }`}
                  />
                </div>
                {marksError && (
                  <span className="text-[11px] text-[#ba1a1a] dark:text-[#ffb4ab] font-medium">
                    Marks must be a number between 0 and 100.
                  </span>
                )}
              </div>

              {/* Realtime Grade / Result Live Computation Preview Box */}
              <div className="bg-[#f5f2ff] dark:bg-[#201e30] rounded-xl p-3 flex items-center justify-between border border-[#e3e1ed]/50 dark:border-[#27243d]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#4d43e3] dark:text-[#857df8]">
                    analytics
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#464555] dark:text-[#b5b2c7]">
                    Live Computation
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {liveGrade ? (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${getGradeBadgeClass(
                        liveGrade
                      )}`}
                    >
                      Grade {liveGrade}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-[#e9e7f3] dark:bg-[#2d2943] text-[#464555] dark:text-[#b5b2c7] text-[11px] font-semibold">
                      Grade: --
                    </span>
                  )}

                  {liveResult ? (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                        liveResult === 'PASS'
                          ? 'bg-[#e2dfff] dark:bg-[#322b82] text-[#3322cc] dark:text-[#c3c0ff]'
                          : 'bg-[#ffdad6] dark:bg-[#5c1314] text-[#ba1a1a] dark:text-[#ffdad6]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[13px]">
                        {liveResult === 'PASS' ? 'check' : 'close'}
                      </span>
                      {liveResult}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-[#e9e7f3] dark:bg-[#2d2943] text-[#464555] dark:text-[#b5b2c7] text-[11px] font-semibold">
                      Result: --
                    </span>
                  )}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-full bg-[#4d43e3] hover:bg-[#6760fd] text-white font-semibold text-[14px] transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {editingId !== null ? 'sync' : 'person_add'}
                  </span>
                  <span>{editingId !== null ? 'Update Student' : 'Add Student'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="py-3 px-4 rounded-full bg-[#e9e7f3] dark:bg-[#252238] hover:bg-[#e3e1ed] dark:hover:bg-[#2d2943] text-[#1b1b24] dark:text-[#f2effc] font-semibold text-[14px] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  title="Reset form fields"
                >
                  <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                  <span>Reset</span>
                </button>
              </div>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full py-2 rounded-full bg-[#efecf9] dark:bg-[#201e30] text-[#464555] dark:text-[#b5b2c7] hover:text-[#1b1b24] dark:hover:text-white text-[12px] font-semibold transition-colors text-center cursor-pointer border border-[#c7c4d8]/40 dark:border-[#353150]"
                >
                  Cancel Edit Session
                </button>
              )}
            </form>
          </div>

          {/* Quick Info Callout */}
          <div className="bg-[#f5f2ff] dark:bg-[#191726] rounded-2xl p-4 flex items-start gap-3 border border-[#e3e1ed]/70 dark:border-[#27243d]">
            <span className="material-symbols-outlined text-[#4d43e3] dark:text-[#857df8] text-[20px] shrink-0 mt-0.5">
              info
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] font-bold text-[#1b1b24] dark:text-[#f2effc]">
                Grading Criteria:
              </span>
              <span className="text-[12px] text-[#464555] dark:text-[#b5b2c7] leading-relaxed">
                A+ (90-100), A (80-89), B (70-79), C (60-69), D (40-59), F (&lt;40). Pass threshold is {passThreshold} marks.
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Students Registry & Filter Console (8 cols on lg) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Toolbar: Search, Filter, Sort */}
          <div className="bg-white dark:bg-[#191726] rounded-2xl p-3.5 shadow-sm border border-[#e3e1ed]/70 dark:border-[#27243d] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-[#777587] text-[20px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Name, Email, or Course..."
                className="w-full pl-11 pr-9 py-2.5 rounded-full bg-[#f5f2ff] dark:bg-[#201e30] text-[#1b1b24] dark:text-[#f2effc] placeholder:text-[#777587] text-[14px] focus:outline-none focus:bg-white dark:focus:bg-[#191726] border border-transparent focus:border-[#4d43e3] dark:focus:border-[#857df8] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-[#777587] hover:text-[#1b1b24] dark:hover:text-[#f2effc] cursor-pointer"
                  title="Clear search"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            {/* Filter & Sort Group */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Course Filter Dropdown */}
              <div className="relative flex items-center">
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="py-2.5 pl-4 pr-8 rounded-full bg-[#e9e7f3] dark:bg-[#252238] text-[#1b1b24] dark:text-[#f2effc] text-[12px] font-semibold appearance-none cursor-pointer focus:outline-none border border-[#c7c4d8]/40 dark:border-[#353150]"
                >
                  <option value="ALL">All Courses</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="Python">Python</option>
                  <option value="Java">Java</option>
                  <option value="Full Stack Development">Full Stack Dev</option>
                  <option value="Data Analysis">Data Analysis</option>
                  <option value="Data Science">Data Science</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 pointer-events-none text-[#777587] text-[16px]">
                  filter_list
                </span>
              </div>

              {/* Sort Order Dropdown */}
              <div className="relative flex items-center">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="py-2.5 pl-4 pr-8 rounded-full bg-[#e9e7f3] dark:bg-[#252238] text-[#1b1b24] dark:text-[#f2effc] text-[12px] font-semibold appearance-none cursor-pointer focus:outline-none border border-[#c7c4d8]/40 dark:border-[#353150]"
                >
                  <option value="ID_ASC">Sort: Default (#)</option>
                  <option value="MARKS_DESC">Marks: High to Low</option>
                  <option value="MARKS_ASC">Marks: Low to High</option>
                  <option value="NAME_ASC">Name: A to Z</option>
                  <option value="NAME_DESC">Name: Z to A</option>
                  <option value="COURSE_ASC">Course: A to Z</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 pointer-events-none text-[#777587] text-[16px]">
                  swap_vert
                </span>
              </div>
            </div>
          </div>

          {/* Students Table Card */}
          <div className="bg-white dark:bg-[#191726] rounded-2xl shadow-sm border border-[#e3e1ed]/70 dark:border-[#27243d] overflow-hidden flex flex-col">
            {/* Registry Header Counter */}
            <div className="px-5 py-3.5 bg-[#f5f2ff] dark:bg-[#201e30] border-b border-[#e3e1ed]/60 dark:border-[#27243d] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4d43e3] dark:text-[#857df8] text-[18px]">
                  dataset
                </span>
                <span className="text-[15px] font-bold text-[#1b1b24] dark:text-[#f2effc]">
                  Registered Students
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#e3e1ed] dark:bg-[#2d2943] text-[#464555] dark:text-[#b5b2c7] text-[11px] font-bold">
                {displayedStudents.length} displayed
              </span>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#efecf9]/80 dark:bg-[#252238] text-[#464555] dark:text-[#b5b2c7] text-[11px] font-bold uppercase tracking-wider border-b border-[#e3e1ed]/50 dark:border-[#27243d]">
                    <th className="py-3 px-4 text-center w-12">#</th>
                    <th className="py-3 px-4">Student / Contact</th>
                    <th className="py-3 px-4">Department Course</th>
                    <th className="py-3 px-4 text-center">Marks</th>
                    <th className="py-3 px-4 text-center">Grade</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3e1ed]/40 dark:divide-[#27243d] text-[#1b1b24] dark:text-[#f2effc] text-[13px]">
                  {displayedStudents.map((st) => {
                    const isRowEditing = editingId === st.id;
                    const initialLetter = st.name.trim().charAt(0).toUpperCase() || '?';

                    return (
                      <tr
                        key={st.id}
                        className={`hover:bg-[#efecf9]/50 dark:hover:bg-[#252238]/60 transition-colors group ${
                          isRowEditing
                            ? 'bg-[#e2dfff]/30 dark:bg-[#322b82]/30 ring-1 ring-inset ring-[#4d43e3]/40'
                            : ''
                        }`}
                      >
                        {/* Cell 1: ID */}
                        <td className="py-3.5 px-4 text-center font-bold text-[12px] text-[#464555] dark:text-[#b5b2c7] tabular-nums">
                          #{st.id}
                        </td>

                        {/* Cell 2: Student / Contact */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#e3e1ed] dark:bg-[#2d2943] text-[#1b1b24] dark:text-[#f2effc] font-bold text-[14px] flex items-center justify-center shrink-0 border border-[#c7c4d8]/40 dark:border-[#353150]">
                              {initialLetter}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-[14px] text-[#1b1b24] dark:text-[#f2effc]">
                                {st.name}
                              </span>
                              <span className="text-[12px] text-[#464555] dark:text-[#b5b2c7]">
                                {st.email} • {st.mobile}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Cell 3: Course */}
                        <td className="py-3.5 px-4 font-medium text-[#1b1b24] dark:text-[#f2effc]">
                          {st.course}
                        </td>

                        {/* Cell 4: Marks */}
                        <td className="py-3.5 px-4 text-center font-bold text-[18px] text-[#1b1b24] dark:text-[#f2effc] tabular-nums">
                          {st.marks}
                        </td>

                        {/* Cell 5: Grade */}
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] ${getGradeBadgeClass(
                              st.grade
                            )}`}
                          >
                            {st.grade}
                          </span>
                        </td>

                        {/* Cell 6: Status */}
                        <td className="py-3.5 px-4 text-center">
                          {st.result === 'PASS' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#e2dfff] dark:bg-[#322b82] text-[#3322cc] dark:text-[#c3c0ff] text-[11px] font-bold">
                              <span className="material-symbols-outlined text-[13px]">check</span>
                              PASS
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ffdad6] dark:bg-[#5c1314] text-[#ba1a1a] dark:text-[#ffdad6] text-[11px] font-bold">
                              <span className="material-symbols-outlined text-[13px]">close</span>
                              FAIL
                            </span>
                          )}
                        </td>

                        {/* Cell 7: Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => handleEdit(st)}
                              title="Edit student record"
                              className="w-8 h-8 rounded-full bg-[#efecf9] dark:bg-[#252238] hover:bg-[#e3e1ed] dark:hover:bg-[#2d2943] text-[#1b1b24] dark:text-[#f2effc] flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => onDeleteStudent(st.id)}
                              title="Remove student record"
                              className="w-8 h-8 rounded-full bg-[#efecf9] dark:bg-[#252238] hover:bg-[#ffdad6] dark:hover:bg-[#5c1314] text-[#464555] dark:text-[#b5b2c7] hover:text-[#ba1a1a] dark:hover:text-[#ffdad6] flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Empty State Container */}
            {displayedStudents.length === 0 && (
              <div className="py-14 px-4 flex flex-col items-center justify-center text-center gap-2">
                <div className="w-14 h-14 rounded-full bg-[#e9e7f3] dark:bg-[#252238] flex items-center justify-center text-[#777587]">
                  <span className="material-symbols-outlined text-[30px]">person_off</span>
                </div>
                <div className="flex flex-col gap-1 max-w-sm">
                  <h4 className="text-[17px] font-bold text-[#1b1b24] dark:text-[#f2effc]">
                    No Student Records Found
                  </h4>
                  <p className="text-[13px] text-[#464555] dark:text-[#b5b2c7]">
                    There are no records matching your current filter criteria or the registry is empty.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setCourseFilter('ALL');
                    setSortBy('ID_ASC');
                  }}
                  className="mt-2 px-4 py-2 rounded-full bg-[#4d43e3] text-white text-[12px] font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Viva Cheat Sheet & DOM Assignment Inspection Panel */}
      <div className="bg-white dark:bg-[#191726] rounded-2xl p-5 md:p-6 shadow-sm border border-[#e3e1ed]/70 dark:border-[#27243d] mb-10 flex flex-col gap-4">
        <div
          onClick={() => setShowVivaMatrix(!showVivaMatrix)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#e2dfff] dark:bg-[#322b82] text-[#4d43e3] dark:text-[#c3c0ff] flex items-center justify-center">
              <span className="material-symbols-outlined text-[19px]">
                integration_instructions
              </span>
            </div>
            <div className="flex flex-col">
              <h3 className="text-[16px] font-bold text-[#1b1b24] dark:text-[#f2effc]">
                JavaScript DOM Implementation Matrix
              </h3>
              <span className="text-[12px] text-[#464555] dark:text-[#b5b2c7]">
                Viva Cheat Sheet & Technical Execution Audit
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[#464555] dark:text-[#b5b2c7]">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {showVivaMatrix ? 'Hide Breakdown' : 'Show Breakdown'}
            </span>
            <span
              className={`material-symbols-outlined transition-transform duration-200 ${
                showVivaMatrix ? 'rotate-180' : ''
              }`}
            >
              expand_more
            </span>
          </div>
        </div>

        {/* Collapsible Viva Content */}
        {showVivaMatrix && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-3 border-t border-[#e3e1ed]/60 dark:border-[#27243d]">
            {/* Item 1: Selection */}
            <div className="p-4 rounded-xl bg-[#f5f2ff] dark:bg-[#201e30] border border-[#e3e1ed]/50 dark:border-[#27243d] flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-[#4d43e3] dark:text-[#857df8]">
                <span className="material-symbols-outlined text-[18px]">find_in_page</span>
                <span className="text-[13px] font-bold">1. DOM Selection</span>
              </div>
              <code className="text-[12px] bg-[#e9e7f3] dark:bg-[#252238] px-2 py-1 rounded text-[#4d43e3] dark:text-[#a3a1f0] font-mono">
                document.getElementById()
              </code>
              <code className="text-[12px] bg-[#e9e7f3] dark:bg-[#252238] px-2 py-1 rounded text-[#4d43e3] dark:text-[#a3a1f0] font-mono">
                document.querySelector()
              </code>
              <p className="text-[12px] text-[#464555] dark:text-[#b5b2c7] mt-1 leading-relaxed">
                Direct single-node queries for inputs, stat counters, and table containers with scoped event hooks.
              </p>
            </div>

            {/* Item 2: Content Manipulation */}
            <div className="p-4 rounded-xl bg-[#f5f2ff] dark:bg-[#201e30] border border-[#e3e1ed]/50 dark:border-[#27243d] flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-[#58579b] dark:text-[#a3a1f0]">
                <span className="material-symbols-outlined text-[18px]">edit_note</span>
                <span className="text-[13px] font-bold">2. Content & Values</span>
              </div>
              <code className="text-[12px] bg-[#e9e7f3] dark:bg-[#252238] px-2 py-1 rounded text-[#58579b] dark:text-[#d4d3ff] font-mono">
                element.textContent
              </code>
              <code className="text-[12px] bg-[#e9e7f3] dark:bg-[#252238] px-2 py-1 rounded text-[#58579b] dark:text-[#d4d3ff] font-mono">
                element.value / innerHTML
              </code>
              <p className="text-[12px] text-[#464555] dark:text-[#b5b2c7] mt-1 leading-relaxed">
                Sanitized property injections for average marks, pass rates, badge pills, and field validations.
              </p>
            </div>

            {/* Item 3: Node Creation */}
            <div className="p-4 rounded-xl bg-[#f5f2ff] dark:bg-[#201e30] border border-[#e3e1ed]/50 dark:border-[#27243d] flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-[#9d25a4] dark:text-[#e588eb]">
                <span className="material-symbols-outlined text-[18px]">add_box</span>
                <span className="text-[13px] font-bold">3. Element Creation</span>
              </div>
              <code className="text-[12px] bg-[#e9e7f3] dark:bg-[#252238] px-2 py-1 rounded text-[#9d25a4] dark:text-[#ffd6f8] font-mono">
                document.createElement('tr')
              </code>
              <code className="text-[12px] bg-[#e9e7f3] dark:bg-[#252238] px-2 py-1 rounded text-[#9d25a4] dark:text-[#ffd6f8] font-mono">
                tableBody.appendChild(tr)
              </code>
              <p className="text-[12px] text-[#464555] dark:text-[#b5b2c7] mt-1 leading-relaxed">
                High-performance table row construction with nested semantic cells, edit/delete actions, and status tags.
              </p>
            </div>

            {/* Item 4: Removal */}
            <div className="p-4 rounded-xl bg-[#f5f2ff] dark:bg-[#201e30] border border-[#e3e1ed]/50 dark:border-[#27243d] flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-[#ba1a1a] dark:text-[#ffb4ab]">
                <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                <span className="text-[13px] font-bold">4. DOM Removal</span>
              </div>
              <code className="text-[12px] bg-[#e9e7f3] dark:bg-[#252238] px-2 py-1 rounded text-[#ba1a1a] dark:text-[#ffdad6] font-mono">
                element.remove()
              </code>
              <code className="text-[12px] bg-[#e9e7f3] dark:bg-[#252238] px-2 py-1 rounded text-[#ba1a1a] dark:text-[#ffdad6] font-mono">
                tableBody.removeChild(node)
              </code>
              <p className="text-[12px] text-[#464555] dark:text-[#b5b2c7] mt-1 leading-relaxed">
                Instant row unmounting paired with memory index recalculations and animated feedback toast triggers.
              </p>
            </div>

            {/* Item 5: Event Listeners */}
            <div className="p-4 rounded-xl bg-[#f5f2ff] dark:bg-[#201e30] border border-[#e3e1ed]/50 dark:border-[#27243d] flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-[#4d43e3] dark:text-[#857df8]">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span className="text-[13px] font-bold">5. Event Handlers</span>
              </div>
              <code className="text-[12px] bg-[#e9e7f3] dark:bg-[#252238] px-2 py-1 rounded text-[#4d43e3] dark:text-[#a3a1f0] font-mono">
                form.addEventListener('submit')
              </code>
              <code className="text-[12px] bg-[#e9e7f3] dark:bg-[#252238] px-2 py-1 rounded text-[#4d43e3] dark:text-[#a3a1f0] font-mono">
                input.addEventListener('input')
              </code>
              <p className="text-[12px] text-[#464555] dark:text-[#b5b2c7] mt-1 leading-relaxed">
                Instant keystroke search filtering, real-time live grade calculation, and select-change sorting logic.
              </p>
            </div>

            {/* Item 6: Class & Attribute Manipulation */}
            <div className="p-4 rounded-xl bg-[#f5f2ff] dark:bg-[#201e30] border border-[#e3e1ed]/50 dark:border-[#27243d] flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-[#58579b] dark:text-[#a3a1f0]">
                <span className="material-symbols-outlined text-[18px]">style</span>
                <span className="text-[13px] font-bold">6. Class & Attribute Flow</span>
              </div>
              <code className="text-[12px] bg-[#e9e7f3] dark:bg-[#252238] px-2 py-1 rounded text-[#58579b] dark:text-[#d4d3ff] font-mono">
                classList.add / remove / toggle
              </code>
              <code className="text-[12px] bg-[#e9e7f3] dark:bg-[#252238] px-2 py-1 rounded text-[#58579b] dark:text-[#d4d3ff] font-mono">
                element.setAttribute()
              </code>
              <p className="text-[12px] text-[#464555] dark:text-[#b5b2c7] mt-1 leading-relaxed">
                Dynamic error state toggles, dark class root propagation, and row highlighting during edit mode.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
