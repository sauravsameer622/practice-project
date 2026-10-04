import React, { useState } from 'react';
import { Student } from '../types';

interface AttendanceViewProps {
  students: Student[];
  onShowToast: (message: string, type?: 'success' | 'delete' | 'info') => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  students,
  onShowToast,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Map of studentId -> status
  const [attendanceRecords, setAttendanceRecords] = useState<
    Record<number, 'PRESENT' | 'LATE' | 'ABSENT' | 'EXCUSED'>
  >({
    1: 'PRESENT',
    2: 'PRESENT',
    3: 'ABSENT',
    4: 'PRESENT',
    5: 'LATE',
  });

  const handleStatusChange = (
    studentId: number,
    status: 'PRESENT' | 'LATE' | 'ABSENT' | 'EXCUSED'
  ) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const markAllPresent = () => {
    const updated: Record<number, 'PRESENT' | 'LATE' | 'ABSENT' | 'EXCUSED'> = {};
    students.forEach((s) => {
      updated[s.id] = 'PRESENT';
    });
    setAttendanceRecords(updated);
    onShowToast(`All ${students.length} students marked PRESENT for ${selectedDate}`);
  };

  const presentCount = students.filter(
    (s) => attendanceRecords[s.id] === 'PRESENT'
  ).length;
  const lateCount = students.filter(
    (s) => attendanceRecords[s.id] === 'LATE'
  ).length;
  const absentCount = students.filter(
    (s) => attendanceRecords[s.id] === 'ABSENT'
  ).length;
  const attendanceRate =
    students.length > 0
      ? Math.round(((presentCount + lateCount * 0.5) / students.length) * 100)
      : 0;

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#e2dfff] dark:bg-[#322b82] text-[#3322cc] dark:text-[#c3c0ff] text-[10px] font-bold uppercase tracking-wider">
              Roll-Call Engine
            </span>
            <span className="text-[#464555] dark:text-[#b5b2c7] text-[12px]">
              • Daily Session Attendance Register
            </span>
          </div>
          <h1 className="text-[28px] md:text-[32px] font-bold text-[#1b1b24] dark:text-[#f2effc] tracking-tight leading-tight mt-1">
            Attendance Register
          </h1>
          <p className="text-[14px] text-[#464555] dark:text-[#b5b2c7]">
            Monitor lecture presence, verify roll-calls, and audit student engagement consistency.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3.5 py-2 rounded-full bg-white dark:bg-[#191726] text-[#1b1b24] dark:text-[#f2effc] text-[13px] font-semibold border border-[#c7c4d8]/40 dark:border-[#353150] shadow-sm cursor-pointer"
          />
          <button
            type="button"
            onClick={markAllPresent}
            className="px-4 py-2.5 rounded-full bg-[#4d43e3] hover:bg-[#6760fd] text-white font-semibold text-[13px] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">done_all</span>
            <span>Mark All Present</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pb-6">
        <div className="bg-white dark:bg-[#191726] rounded-2xl p-4 shadow-sm border border-[#e3e1ed]/70 dark:border-[#27243d]">
          <span className="text-[12px] font-semibold text-[#464555] dark:text-[#b5b2c7] uppercase tracking-wider">
            Daily Attendance
          </span>
          <div className="mt-2 text-[32px] font-bold text-[#1b1b24] dark:text-[#f2effc] tabular-nums">
            {attendanceRate}%
          </div>
          <div className="text-[12px] text-[#464555] dark:text-[#b5b2c7]">
            Weighted attendance index
          </div>
        </div>

        <div className="bg-white dark:bg-[#191726] rounded-2xl p-4 shadow-sm border border-[#e3e1ed]/70 dark:border-[#27243d]">
          <span className="text-[12px] font-semibold text-[#464555] dark:text-[#b5b2c7] uppercase tracking-wider">
            Present
          </span>
          <div className="mt-2 text-[32px] font-bold text-[#3322cc] dark:text-[#857df8] tabular-nums">
            {presentCount}
          </div>
          <div className="text-[12px] text-[#464555] dark:text-[#b5b2c7]">
            Active in lecture halls
          </div>
        </div>

        <div className="bg-white dark:bg-[#191726] rounded-2xl p-4 shadow-sm border border-[#e3e1ed]/70 dark:border-[#27243d]">
          <span className="text-[12px] font-semibold text-[#464555] dark:text-[#b5b2c7] uppercase tracking-wider">
            Late Tardy
          </span>
          <div className="mt-2 text-[32px] font-bold text-[#9d25a4] dark:text-[#e588eb] tabular-nums">
            {lateCount}
          </div>
          <div className="text-[12px] text-[#464555] dark:text-[#b5b2c7]">
            Arrived past start threshold
          </div>
        </div>

        <div className="bg-white dark:bg-[#191726] rounded-2xl p-4 shadow-sm border border-[#e3e1ed]/70 dark:border-[#27243d]">
          <span className="text-[12px] font-semibold text-[#464555] dark:text-[#b5b2c7] uppercase tracking-wider">
            Absent
          </span>
          <div className="mt-2 text-[32px] font-bold text-[#ba1a1a] dark:text-[#ffb4ab] tabular-nums">
            {absentCount}
          </div>
          <div className="text-[12px] text-[#464555] dark:text-[#b5b2c7]">
            Unexcused absences today
          </div>
        </div>
      </div>

      {/* Attendance Roll Call Table */}
      <div className="bg-white dark:bg-[#191726] rounded-2xl shadow-sm border border-[#e3e1ed]/70 dark:border-[#27243d] overflow-hidden">
        <div className="px-5 py-3.5 bg-[#f5f2ff] dark:bg-[#201e30] border-b border-[#e3e1ed]/60 dark:border-[#27243d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4d43e3] dark:text-[#857df8] text-[18px]">
              checklist
            </span>
            <span className="text-[15px] font-bold text-[#1b1b24] dark:text-[#f2effc]">
              Roll-Call Roster for {selectedDate}
            </span>
          </div>
          <span className="text-[12px] font-semibold text-[#464555] dark:text-[#b5b2c7]">
            {students.length} Learners Registered
          </span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#efecf9]/80 dark:bg-[#252238] text-[#464555] dark:text-[#b5b2c7] text-[11px] font-bold uppercase tracking-wider border-b border-[#e3e1ed]/50 dark:border-[#27243d]">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4 text-center">Cumulative Attendance</th>
                <th className="py-3 px-4 text-center">Status Selection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e1ed]/40 dark:divide-[#27243d] text-[#1b1b24] dark:text-[#f2effc] text-[13px]">
              {students.map((st) => {
                const currentStatus = attendanceRecords[st.id] || 'PRESENT';

                return (
                  <tr key={st.id} className="hover:bg-[#efecf9]/30 dark:hover:bg-[#252238]/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#e3e1ed] dark:bg-[#2d2943] text-[#1b1b24] dark:text-[#f2effc] font-bold text-[12px] flex items-center justify-center">
                          {st.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span>{st.name}</span>
                          <span className="text-[11px] font-normal text-[#464555] dark:text-[#b5b2c7]">
                            {st.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#464555] dark:text-[#b5b2c7]">
                      {st.course}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-16 bg-[#e9e7f3] dark:bg-[#252238] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#4d43e3] dark:bg-[#857df8] h-full rounded-full"
                            style={{ width: `${st.attendanceRate || 85}%` }}
                          />
                        </div>
                        <span className="font-bold text-[12px] tabular-nums">
                          {st.attendanceRate || 85}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-[#efecf9] dark:bg-[#252238] p-1 rounded-full border border-[#c7c4d8]/30 dark:border-[#353150]">
                        {(['PRESENT', 'LATE', 'ABSENT', 'EXCUSED'] as const).map(
                          (status) => {
                            const isSelected = currentStatus === status;
                            let activeClass = 'bg-[#4d43e3] text-white';
                            if (status === 'ABSENT') activeClass = 'bg-[#ba1a1a] text-white';
                            if (status === 'LATE') activeClass = 'bg-[#9d25a4] text-white';
                            if (status === 'EXCUSED') activeClass = 'bg-[#58579b] text-white';

                            return (
                              <button
                                key={status}
                                type="button"
                                onClick={() => handleStatusChange(st.id, status)}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                                  isSelected
                                    ? activeClass + ' shadow-sm'
                                    : 'text-[#464555] dark:text-[#b5b2c7] hover:text-[#1b1b24] dark:hover:text-white'
                                }`}
                              >
                                {status}
                              </button>
                            );
                          }
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
