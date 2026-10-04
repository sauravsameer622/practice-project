import React, { useState } from 'react';
import { CourseInfo, Student, ActiveTab } from '../types';

interface CoursesViewProps {
  courses: CourseInfo[];
  students: Student[];
  onSelectCourseFilter: (courseName: string) => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  courses,
  students,
  onSelectCourseFilter,
  onNavigateTab,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<CourseInfo | null>(courses[0] || null);

  const getCourseStats = (courseName: string) => {
    const enrolled = students.filter((s) => s.course === courseName);
    const count = enrolled.length;
    const avg = count > 0
      ? (enrolled.reduce((acc, s) => acc + s.marks, 0) / count).toFixed(1)
      : '0.0';
    const passCount = enrolled.filter((s) => s.marks >= 40).length;
    const passRate = count > 0 ? Math.round((passCount / count) * 100) : 0;
    return { count, avg, passRate, enrolled };
  };

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#e2dfff] dark:bg-[#322b82] text-[#3322cc] dark:text-[#c3c0ff] text-[10px] font-bold uppercase tracking-wider">
              Department Curriculum
            </span>
            <span className="text-[#464555] dark:text-[#b5b2c7] text-[12px]">
              • Academic Faculty & Syllabus Registry
            </span>
          </div>
          <h1 className="text-[28px] md:text-[32px] font-bold text-[#1b1b24] dark:text-[#f2effc] tracking-tight leading-tight mt-1">
            Departmental Courses
          </h1>
          <p className="text-[14px] text-[#464555] dark:text-[#b5b2c7]">
            Active syllabus tracks, assigned faculty leads, and enrolled cohort distributions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab('students')}
          className="px-4 py-2.5 rounded-full bg-[#4d43e3] hover:bg-[#6760fd] text-white font-semibold text-[13px] transition-all flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>Register New Learner</span>
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-8">
        {courses.map((course) => {
          const stats = getCourseStats(course.name);
          const isSelected = selectedCourse?.id === course.id;

          return (
            <div
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className={`bg-white dark:bg-[#191726] rounded-2xl p-5 shadow-sm border transition-all cursor-pointer flex flex-col justify-between hover:shadow-md ${
                isSelected
                  ? 'border-[#4d43e3] dark:border-[#857df8] ring-2 ring-[#4d43e3]/20'
                  : 'border-[#e3e1ed]/70 dark:border-[#27243d]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#e2dfff] dark:bg-[#322b82] text-[#3322cc] dark:text-[#c3c0ff] text-[11px] font-bold">
                    {course.code}
                  </span>
                  <span className="text-[11px] font-semibold text-[#464555] dark:text-[#b5b2c7]">
                    {course.credits} Credits
                  </span>
                </div>

                <h3 className="text-[17px] font-bold text-[#1b1b24] dark:text-[#f2effc] mt-1">
                  {course.name}
                </h3>
                <p className="text-[12px] text-[#464555] dark:text-[#b5b2c7] line-clamp-2 mt-1 leading-relaxed">
                  {course.description}
                </p>

                <div className="mt-3 flex items-center gap-2 text-[12px] text-[#464555] dark:text-[#b5b2c7]">
                  <span className="material-symbols-outlined text-[16px] text-[#4d43e3] dark:text-[#857df8]">
                    person
                  </span>
                  <span className="font-medium">{course.instructor}</span>
                </div>

                <div className="mt-1 flex items-center gap-2 text-[12px] text-[#464555] dark:text-[#b5b2c7]">
                  <span className="material-symbols-outlined text-[16px] text-[#58579b] dark:text-[#a3a1f0]">
                    schedule
                  </span>
                  <span>{course.schedule}</span>
                </div>

                {/* Topics tags */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {course.topics.slice(0, 3).map((topic, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-[#f5f2ff] dark:bg-[#201e30] text-[#464555] dark:text-[#b5b2c7] text-[10px] font-semibold border border-[#e3e1ed]/50 dark:border-[#27243d]"
                    >
                      {topic}
                    </span>
                  ))}
                  {course.topics.length > 3 && (
                    <span className="text-[10px] text-[#777587] self-center">
                      +{course.topics.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Stats Footer */}
              <div className="mt-4 pt-3 border-t border-[#e3e1ed]/50 dark:border-[#27243d] flex items-center justify-between">
                <div className="flex items-center gap-3 text-[12px]">
                  <div>
                    <span className="font-bold text-[#1b1b24] dark:text-[#f2effc] tabular-nums">
                      {stats.count}
                    </span>{' '}
                    <span className="text-[#464555] dark:text-[#b5b2c7]">Enrolled</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#4d43e3] dark:text-[#857df8] tabular-nums">
                      {stats.avg}
                    </span>{' '}
                    <span className="text-[#464555] dark:text-[#b5b2c7]">Avg</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCourseFilter(course.name);
                    onNavigateTab('students');
                  }}
                  className="px-2.5 py-1 rounded-full bg-[#efecf9] dark:bg-[#252238] hover:bg-[#4d43e3] hover:text-white text-[#4d43e3] dark:text-[#c3c0ff] text-[11px] font-bold transition-all cursor-pointer"
                >
                  View Roster
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Course Detail Drawer / Modal Preview */}
      {selectedCourse && (
        <div className="bg-white dark:bg-[#191726] rounded-2xl p-6 shadow-sm border border-[#e3e1ed]/70 dark:border-[#27243d]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e3e1ed]/50 dark:border-[#27243d]">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#e2dfff] dark:bg-[#322b82] text-[#3322cc] dark:text-[#c3c0ff] text-[11px] font-bold">
                  {selectedCourse.code}
                </span>
                <span className="text-[12px] text-[#464555] dark:text-[#b5b2c7]">
                  Lead Instructor: {selectedCourse.instructor}
                </span>
              </div>
              <h2 className="text-[22px] font-bold text-[#1b1b24] dark:text-[#f2effc] mt-1">
                {selectedCourse.name} — Enrolled Cohort Roster
              </h2>
            </div>

            <button
              type="button"
              onClick={() => {
                onSelectCourseFilter(selectedCourse.name);
                onNavigateTab('students');
              }}
              className="px-4 py-2 rounded-full bg-[#4d43e3] text-white font-semibold text-[12px] hover:bg-[#6760fd] transition-colors cursor-pointer"
            >
              Filter in Student Registry Console →
            </button>
          </div>

          <div className="pt-4">
            <h4 className="text-[13px] font-bold text-[#1b1b24] dark:text-[#f2effc] mb-3 uppercase tracking-wider">
              Enrolled Students ({getCourseStats(selectedCourse.name).count})
            </h4>

            {getCourseStats(selectedCourse.name).enrolled.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {getCourseStats(selectedCourse.name).enrolled.map((st) => (
                  <div
                    key={st.id}
                    className="p-3 rounded-xl bg-[#f5f2ff] dark:bg-[#201e30] border border-[#e3e1ed]/50 dark:border-[#27243d] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#e3e1ed] dark:bg-[#2d2943] text-[#1b1b24] dark:text-[#f2effc] font-bold text-[12px] flex items-center justify-center">
                        {st.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-[#1b1b24] dark:text-[#f2effc]">
                          {st.name}
                        </span>
                        <span className="text-[11px] text-[#464555] dark:text-[#b5b2c7]">
                          Score: {st.marks} • Grade {st.grade}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        st.result === 'PASS'
                          ? 'bg-[#e2dfff] dark:bg-[#322b82] text-[#3322cc] dark:text-[#c3c0ff]'
                          : 'bg-[#ffdad6] dark:bg-[#5c1314] text-[#ba1a1a] dark:text-[#ffdad6]'
                      }`}
                    >
                      {st.result}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-[#464555] dark:text-[#b5b2c7] italic py-2">
                No students currently enrolled in this course yet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
