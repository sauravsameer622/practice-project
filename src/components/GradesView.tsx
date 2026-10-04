import React, { useState } from 'react';
import { Student, AcademicTask } from '../types';

interface GradesViewProps {
  students: Student[];
  tasks: AcademicTask[];
  passThreshold: number;
  onUpdateMarks: (studentId: number, newMarks: number) => void;
  onExportCSV: () => void;
}

export const GradesView: React.FC<GradesViewProps> = ({
  students,
  tasks,
  passThreshold,
  onUpdateMarks,
  onExportCSV,
}) => {
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [tempMarks, setTempMarks] = useState<number>(0);

  const startEdit = (st: Student) => {
    setEditingStudentId(st.id);
    setTempMarks(st.marks);
  };

  const saveEdit = (stId: number) => {
    onUpdateMarks(stId, Math.min(100, Math.max(0, tempMarks)));
    setEditingStudentId(null);
  };

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#e2dfff] dark:bg-[#322b82] text-[#3322cc] dark:text-[#c3c0ff] text-[10px] font-bold uppercase tracking-wider">
              Evaluation & Rubrics
            </span>
            <span className="text-[#464555] dark:text-[#b5b2c7] text-[12px]">
              • Academic Gradebook & Task Submissions
            </span>
          </div>
          <h1 className="text-[28px] md:text-[32px] font-bold text-[#1b1b24] dark:text-[#f2effc] tracking-tight leading-tight mt-1">
            Grades & Tasks Console
          </h1>
          <p className="text-[14px] text-[#464555] dark:text-[#b5b2c7]">
            Direct gradebook calibration, rubric tracking, and institutional transcript export.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExportCSV}
            className="px-4 py-2.5 rounded-full bg-[#e9e7f3] dark:bg-[#252238] hover:bg-[#e3e1ed] dark:hover:bg-[#2d2943] text-[#1b1b24] dark:text-[#f2effc] font-semibold text-[13px] transition-colors flex items-center gap-1.5 cursor-pointer border border-[#c7c4d8]/40 dark:border-[#353150]"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export CSV Gradebook</span>
          </button>
        </div>
      </div>

      {/* Two Column Section: Gradebook Table + Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Gradebook Table */}
        <div className="lg:col-span-8 bg-white dark:bg-[#191726] rounded-2xl shadow-sm border border-[#e3e1ed]/70 dark:border-[#27243d] overflow-hidden">
          <div className="px-5 py-3.5 bg-[#f5f2ff] dark:bg-[#201e30] border-b border-[#e3e1ed]/60 dark:border-[#27243d] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4d43e3] dark:text-[#857df8] text-[18px]">
                table_chart
              </span>
              <span className="text-[15px] font-bold text-[#1b1b24] dark:text-[#f2effc]">
                Continuous Assessment Ledger
              </span>
            </div>
            <span className="text-[11px] font-semibold text-[#464555] dark:text-[#b5b2c7]">
              Pass Threshold: {passThreshold} marks
            </span>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#efecf9]/80 dark:bg-[#252238] text-[#464555] dark:text-[#b5b2c7] text-[11px] font-bold uppercase tracking-wider border-b border-[#e3e1ed]/50 dark:border-[#27243d]">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4 text-center">Score (0-100)</th>
                  <th className="py-3 px-4 text-center">Grade</th>
                  <th className="py-3 px-4 text-center">Outcome</th>
                  <th className="py-3 px-4 text-right">Quick Calibrate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e1ed]/40 dark:divide-[#27243d] text-[#1b1b24] dark:text-[#f2effc] text-[13px]">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-[#efecf9]/40 dark:hover:bg-[#252238]/50 transition-colors">
                    <td className="py-3 px-4 font-bold">
                      {st.name}
                    </td>
                    <td className="py-3 px-4 text-[#464555] dark:text-[#b5b2c7]">
                      {st.course}
                    </td>
                    <td className="py-3 px-4 text-center tabular-nums font-bold">
                      {editingStudentId === st.id ? (
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={tempMarks}
                          onChange={(e) => setTempMarks(Number(e.target.value))}
                          className="w-16 px-2 py-1 text-center font-bold rounded-lg border border-[#4d43e3] bg-white dark:bg-[#191726] text-[#1b1b24] dark:text-[#f2effc]"
                          autoFocus
                        />
                      ) : (
                        <span className="text-[16px]">{st.marks}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#e2dfff] dark:bg-[#322b82] text-[#3322cc] dark:text-[#c3c0ff]">
                        {st.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          st.result === 'PASS'
                            ? 'bg-[#e2dfff] dark:bg-[#322b82] text-[#3322cc] dark:text-[#c3c0ff]'
                            : 'bg-[#ffdad6] dark:bg-[#5c1314] text-[#ba1a1a] dark:text-[#ffdad6]'
                        }`}
                      >
                        {st.result}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {editingStudentId === st.id ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => saveEdit(st.id)}
                            className="px-2.5 py-1 rounded-full bg-[#4d43e3] text-white text-[11px] font-bold hover:bg-[#6760fd] transition-colors cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingStudentId(null)}
                            className="px-2.5 py-1 rounded-full bg-[#e9e7f3] dark:bg-[#252238] text-[#464555] dark:text-[#b5b2c7] text-[11px] font-bold hover:bg-[#e3e1ed] transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startEdit(st)}
                          className="px-2.5 py-1 rounded-full bg-[#efecf9] dark:bg-[#252238] hover:bg-[#4d43e3] hover:text-white text-[#4d43e3] dark:text-[#c3c0ff] text-[11px] font-bold transition-all cursor-pointer"
                        >
                          Adjust
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Academic Tasks & Deliverables */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white dark:bg-[#191726] rounded-2xl p-5 shadow-sm border border-[#e3e1ed]/70 dark:border-[#27243d]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e1ed]/50 dark:border-[#27243d]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4d43e3] dark:text-[#857df8] text-[20px]">
                  assignment
                </span>
                <h3 className="text-[16px] font-bold text-[#1b1b24] dark:text-[#f2effc]">
                  Active Curricular Tasks
                </h3>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#e2dfff] dark:bg-[#322b82] text-[#3322cc] dark:text-[#c3c0ff]">
                {tasks.length} Modules
              </span>
            </div>

            <div className="flex flex-col gap-3 pt-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-xl bg-[#f5f2ff] dark:bg-[#201e30] border border-[#e3e1ed]/50 dark:border-[#27243d] flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#4d43e3] dark:text-[#857df8]">
                      {task.course}
                    </span>
                    <span className="text-[11px] text-[#464555] dark:text-[#b5b2c7]">
                      Due: {task.dueDate}
                    </span>
                  </div>
                  <h4 className="text-[13px] font-bold text-[#1b1b24] dark:text-[#f2effc] leading-snug">
                    {task.title}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-[#464555] dark:text-[#b5b2c7] pt-1">
                    <span>Weight: {task.weight}%</span>
                    <span>Submissions: {task.completedCount} of {students.length}</span>
                  </div>
                  <div className="w-full bg-[#e9e7f3] dark:bg-[#252238] h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-[#4d43e3] dark:bg-[#857df8] h-full rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (task.completedCount / Math.max(1, students.length)) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
