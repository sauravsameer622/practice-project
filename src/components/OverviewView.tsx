import React from 'react';
import { Student, CourseInfo, ActiveTab } from '../types';

interface OverviewViewProps {
  students: Student[];
  courses: CourseInfo[];
  passThreshold: number;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  students,
  courses,
  passThreshold,
  onNavigateTab,
}) => {
  const totalStudents = students.length;
  const passCount = students.filter((s) => s.marks >= passThreshold).length;
  const failCount = totalStudents - passCount;
  const overallAvg = totalStudents > 0
    ? (students.reduce((acc, s) => acc + s.marks, 0) / totalStudents).toFixed(1)
    : '0.0';

  // Grade distributions
  const gradeCounts = {
    'A+': students.filter((s) => s.grade === 'A+').length,
    'A': students.filter((s) => s.grade === 'A').length,
    'B': students.filter((s) => s.grade === 'B').length,
    'C': students.filter((s) => s.grade === 'C').length,
    'D': students.filter((s) => s.grade === 'D').length,
    'F': students.filter((s) => s.grade === 'F').length,
  };

  const topStudents = [...students].sort((a, b) => b.marks - a.marks).slice(0, 3);
  const studentsNeedingHelp = students.filter((s) => s.marks < passThreshold);

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#e2dfff] dark:bg-[#322b82] text-[#3322cc] dark:text-[#c3c0ff] text-[10px] font-bold uppercase tracking-wider">
              Academic Intelligence
            </span>
            <span className="text-[#464555] dark:text-[#b5b2c7] text-[12px]">
              • Cohort Health & Realtime Diagnostics
            </span>
          </div>
          <h1 className="text-[28px] md:text-[32px] font-bold text-[#1b1b24] dark:text-[#f2effc] tracking-tight leading-tight mt-1">
            Executive Academic Overview
          </h1>
          <p className="text-[14px] text-[#464555] dark:text-[#b5b2c7]">
            Comprehensive departmental performance, grade distributions, and retention metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigateTab('students')}
            className="px-4 py-2.5 rounded-full bg-[#4d43e3] hover:bg-[#6760fd] text-white font-semibold text-[13px] transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">group</span>
            <span>Manage Registry</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-6">
        <div className="bg-white dark:bg-[#191726] rounded-2xl p-4 shadow-sm border border-[#e3e1ed]/70 dark:border-[#27243d]">
          <span className="text-[12px] font-semibold text-[#464555] dark:text-[#b5b2c7] uppercase tracking-wider">
            Total Cohort
          </span>
          <div className="mt-2 text-[32px] font-bold text-[#1b1b24] dark:text-[#f2effc] tabular-nums">
            {totalStudents}
          </div>
          <div className="text-[12px] text-[#464555] dark:text-[#b5b2c7] mt-1">
            Across {courses.length} departmental courses
          </div>
        </div>

        <div className="bg-white dark:bg-[#191726] rounded-2xl p-4 shadow-sm border border-[#e3e1ed]/70 dark:border-[#27243d]">
          <span className="text-[12px] font-semibold text-[#464555] dark:text-[#b5b2c7] uppercase tracking-wider">
            Mean Performance
          </span>
          <div className="mt-2 text-[32px] font-bold text-[#1b1b24] dark:text-[#f2effc] tabular-nums">
            {overallAvg} <span className="text-[16px] text-[#464555] font-normal">/ 100</span>
          </div>
          <div className="text-[12px] text-[#464555] dark:text-[#b5b2c7] mt-1">
            Standard cohort score benchmark
          </div>
        </div>

        <div className="bg-white dark:bg-[#191726] rounded-2xl p-4 shadow-sm border border-[#e3e1ed]/70 dark:border-[#27243d]">
          <span className="text-[12px] font-semibold text-[#464555] dark:text-[#b5b2c7] uppercase tracking-wider">
            Retention Rate
          </span>
          <div className="mt-2 text-[32px] font-bold text-[#1b1b24] dark:text-[#f2effc] tabular-nums">
            {totalStudents > 0 ? Math.round((passCount / totalStudents) * 100) : 0}%
          </div>
          <div className="text-[12px] text-[#464555] dark:text-[#b5b2c7] mt-1">
            {passCount} passed • {failCount} critical interventions
          </div>
        </div>

        <div className="bg-white dark:bg-[#191726] rounded-2xl p-4 shadow-sm border border-[#e3e1ed]/70 dark:border-[#27243d]">
          <span className="text-[12px] font-semibold text-[#464555] dark:text-[#b5b2c7] uppercase tracking-wider">
            Curriculum Modules
          </span>
          <div className="mt-2 text-[32px] font-bold text-[#1b1b24] dark:text-[#f2effc] tabular-nums">
            6
          </div>
          <div className="text-[12px] text-[#464555] dark:text-[#b5b2c7] mt-1">
            DOM, Python, Java, Full Stack, BI & AI
          </div>
        </div>
      </div>

      {/* Main Grid: Grade Breakdown & Department Enrollment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6">
        {/* Left: Grade Distribution Histogram */}
        <div className="lg:col-span-7 bg-white dark:bg-[#191726] rounded-2xl p-5 shadow-sm border border-[#e3e1ed]/70 dark:border-[#27243d] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e1ed]/50 dark:border-[#27243d]">
              <div>
                <h3 className="text-[16px] font-bold text-[#1b1b24] dark:text-[#f2effc]">
                  Cohort Grade Distribution
                </h3>
                <p className="text-[12px] text-[#464555] dark:text-[#b5b2c7]">
                  Evaluated against institutional criteria (Pass ≥ {passThreshold})
                </p>
              </div>
              <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full bg-[#efecf9] dark:bg-[#252238] text-[#464555] dark:text-[#b5b2c7]">
                Total: {totalStudents}
              </span>
            </div>

            <div className="grid grid-cols-6 gap-3 py-6 items-end h-52">
              {(['A+', 'A', 'B', 'C', 'D', 'F'] as const).map((grade) => {
                const count = gradeCounts[grade];
                const heightPercent = totalStudents > 0 ? (count / totalStudents) * 100 : 0;
                const isFail = grade === 'F';

                return (
                  <div key={grade} className="flex flex-col items-center h-full justify-end gap-2 group">
                    <span className="text-[11px] font-bold text-[#464555] dark:text-[#b5b2c7] tabular-nums">
                      {count}
                    </span>
                    <div className="w-full bg-[#efecf9] dark:bg-[#252238] rounded-t-lg h-36 flex items-end overflow-hidden p-0.5">
                      <div
                        className={`w-full rounded-t-md transition-all duration-500 ${
                          isFail
                            ? 'bg-[#ba1a1a] dark:bg-[#ffb4ab]'
                            : grade === 'A+' || grade === 'A'
                            ? 'bg-[#4d43e3] dark:bg-[#857df8]'
                            : 'bg-[#58579b] dark:bg-[#a3a1f0]'
                        }`}
                        style={{ height: `${Math.max(8, heightPercent)}%` }}
                      />
                    </div>
                    <span className="text-[12px] font-bold text-[#1b1b24] dark:text-[#f2effc]">
                      {grade}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#e3e1ed]/50 dark:border-[#27243d] flex items-center justify-between text-[12px] text-[#464555] dark:text-[#b5b2c7]">
            <span>Honor Roll (A/A+): {gradeCounts['A+'] + gradeCounts['A']} Students</span>
            <span>Needs Support (F): {gradeCounts['F']} Student</span>
          </div>
        </div>

        {/* Right: Academic Alerts & Interventions */}
        <div className="lg:col-span-5 bg-white dark:bg-[#191726] rounded-2xl p-5 shadow-sm border border-[#e3e1ed]/70 dark:border-[#27243d] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e1ed]/50 dark:border-[#27243d]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ba1a1a] dark:text-[#ffb4ab] text-[20px]">
                  warning
                </span>
                <h3 className="text-[16px] font-bold text-[#1b1b24] dark:text-[#f2effc]">
                  Academic Interventions
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] dark:bg-[#5c1314] text-[#ba1a1a] dark:text-[#ffdad6] text-[10px] font-bold">
                {studentsNeedingHelp.length} Pending
              </span>
            </div>

            <div className="py-3 flex flex-col gap-3">
              {studentsNeedingHelp.length > 0 ? (
                studentsNeedingHelp.map((st) => (
                  <div
                    key={st.id}
                    className="p-3 rounded-xl bg-[#ffdad6]/20 dark:bg-[#5c1314]/30 border border-[#ffdad6] dark:border-[#5c1314] flex items-center justify-between gap-3"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-[13px] text-[#1b1b24] dark:text-[#f2effc]">
                        {st.name}
                      </span>
                      <span className="text-[11px] text-[#464555] dark:text-[#b5b2c7]">
                        {st.course} • Score: {st.marks}/100 (Below {passThreshold})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigateTab('students')}
                      className="px-3 py-1 rounded-full bg-[#ba1a1a] hover:opacity-90 text-white text-[11px] font-semibold cursor-pointer shrink-0"
                    >
                      Remediate
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-[#464555] dark:text-[#b5b2c7] text-[13px]">
                  No academic probation alerts. All active students meet the criteria!
                </div>
              )}

              {/* Honor Roll Highlight */}
              <div className="mt-2 pt-2 border-t border-[#e3e1ed]/50 dark:border-[#27243d]">
                <div className="text-[11px] font-bold text-[#464555] dark:text-[#b5b2c7] uppercase tracking-wider mb-2">
                  Top Valedictorian Honors
                </div>
                {topStudents.map((st, idx) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between py-1.5 text-[13px]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#ffd6f8] dark:bg-[#5c1160] text-[#9d25a4] dark:text-[#ffd6f8] text-[10px] font-bold flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <span className="font-semibold text-[#1b1b24] dark:text-[#f2effc]">
                        {st.name}
                      </span>
                      <span className="text-[11px] text-[#464555] dark:text-[#b5b2c7]">
                        ({st.course})
                      </span>
                    </div>
                    <span className="font-bold text-[#4d43e3] dark:text-[#857df8] tabular-nums">
                      {st.marks} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('grades-and-assignments')}
            className="w-full py-2 rounded-xl bg-[#efecf9] dark:bg-[#252238] hover:bg-[#e3e1ed] dark:hover:bg-[#2d2943] text-[#1b1b24] dark:text-[#f2effc] font-semibold text-[12px] transition-colors cursor-pointer text-center"
          >
            Open Full Gradebook & Assessment Log →
          </button>
        </div>
      </div>
    </div>
  );
};
