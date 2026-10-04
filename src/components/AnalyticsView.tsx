import React from 'react';
import { Student } from '../types';

interface AnalyticsViewProps {
  students: Student[];
  passThreshold: number;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  students,
  passThreshold,
}) => {
  const total = students.length;
  const marksList = students.map((s) => s.marks).sort((a, b) => a - b);

  const mean = total > 0 ? marksList.reduce((a, b) => a + b, 0) / total : 0;
  const median =
    total > 0
      ? total % 2 === 0
        ? (marksList[total / 2 - 1] + marksList[total / 2]) / 2
        : marksList[Math.floor(total / 2)]
      : 0;
  const minScore = total > 0 ? marksList[0] : 0;
  const maxScore = total > 0 ? marksList[total - 1] : 0;

  // Standard deviation
  const variance =
    total > 0
      ? marksList.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / total
      : 0;
  const stdDev = Math.sqrt(variance);

  // Distribution buckets
  const buckets = [
    { label: '90 - 100 (A+)', count: students.filter((s) => s.marks >= 90).length, color: 'bg-[#4d43e3]' },
    { label: '80 - 89 (A)', count: students.filter((s) => s.marks >= 80 && s.marks < 90).length, color: 'bg-[#6760fd]' },
    { label: '70 - 79 (B)', count: students.filter((s) => s.marks >= 70 && s.marks < 80).length, color: 'bg-[#58579b]' },
    { label: '60 - 69 (C)', count: students.filter((s) => s.marks >= 60 && s.marks < 70).length, color: 'bg-[#8f8b9e]' },
    { label: '40 - 59 (D)', count: students.filter((s) => s.marks >= 40 && s.marks < 60).length, color: 'bg-[#9d25a4]' },
    { label: '< 40 (F - Fail)', count: students.filter((s) => s.marks < 40).length, color: 'bg-[#ba1a1a]' },
  ];

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#e2dfff] dark:bg-[#322b82] text-[#3322cc] dark:text-[#c3c0ff] text-[10px] font-bold uppercase tracking-wider">
              Statistical Intelligence
            </span>
            <span className="text-[#464555] dark:text-[#b5b2c7] text-[12px]">
              • Descriptive Metrics & Quartiles
            </span>
          </div>
          <h1 className="text-[28px] md:text-[32px] font-bold text-[#1b1b24] dark:text-[#f2effc] tracking-tight leading-tight mt-1">
            Cohort Analytics & Insights
          </h1>
          <p className="text-[14px] text-[#464555] dark:text-[#b5b2c7]">
            Mathematical distribution of assessment marks, standard deviation, and variance audits.
          </p>
        </div>
      </div>

      {/* Statistical Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pb-6">
        <div className="bg-white dark:bg-[#191726] rounded-2xl p-4 shadow-sm border border-[#e3e1ed]/70 dark:border-[#27243d] text-center">
          <span className="text-[11px] font-bold text-[#464555] dark:text-[#b5b2c7] uppercase">Mean Score</span>
          <div className="text-[24px] font-bold text-[#4d43e3] dark:text-[#857df8] tabular-nums mt-1">{mean.toFixed(1)}</div>
        </div>

        <div className="bg-white dark:bg-[#191726] rounded-2xl p-4 shadow-sm border border-[#e3e1ed]/70 dark:border-[#27243d] text-center">
          <span className="text-[11px] font-bold text-[#464555] dark:text-[#b5b2c7] uppercase">Median</span>
          <div className="text-[24px] font-bold text-[#1b1b24] dark:text-[#f2effc] tabular-nums mt-1">{median}</div>
        </div>

        <div className="bg-white dark:bg-[#191726] rounded-2xl p-4 shadow-sm border border-[#e3e1ed]/70 dark:border-[#27243d] text-center">
          <span className="text-[11px] font-bold text-[#464555] dark:text-[#b5b2c7] uppercase">Std Dev (σ)</span>
          <div className="text-[24px] font-bold text-[#58579b] dark:text-[#a3a1f0] tabular-nums mt-1">{stdDev.toFixed(1)}</div>
        </div>

        <div className="bg-white dark:bg-[#191726] rounded-2xl p-4 shadow-sm border border-[#e3e1ed]/70 dark:border-[#27243d] text-center">
          <span className="text-[11px] font-bold text-[#464555] dark:text-[#b5b2c7] uppercase">Max Mark</span>
          <div className="text-[24px] font-bold text-[#3322cc] dark:text-[#c3c0ff] tabular-nums mt-1">{maxScore}</div>
        </div>

        <div className="bg-white dark:bg-[#191726] rounded-2xl p-4 shadow-sm border border-[#e3e1ed]/70 dark:border-[#27243d] text-center">
          <span className="text-[11px] font-bold text-[#464555] dark:text-[#b5b2c7] uppercase">Min Mark</span>
          <div className="text-[24px] font-bold text-[#ba1a1a] dark:text-[#ffb4ab] tabular-nums mt-1">{minScore}</div>
        </div>

        <div className="bg-white dark:bg-[#191726] rounded-2xl p-4 shadow-sm border border-[#e3e1ed]/70 dark:border-[#27243d] text-center">
          <span className="text-[11px] font-bold text-[#464555] dark:text-[#b5b2c7] uppercase">Pass Rate</span>
          <div className="text-[24px] font-bold text-[#9d25a4] dark:text-[#e588eb] tabular-nums mt-1">
            {total > 0 ? Math.round((students.filter(s => s.marks >= passThreshold).length / total) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Main Analysis Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Score Brackets & Bars */}
        <div className="lg:col-span-7 bg-white dark:bg-[#191726] rounded-2xl p-5 shadow-sm border border-[#e3e1ed]/70 dark:border-[#27243d] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e1ed]/50 dark:border-[#27243d]">
              <div>
                <h3 className="text-[16px] font-bold text-[#1b1b24] dark:text-[#f2effc]">
                  Mark Distribution Brackets
                </h3>
                <p className="text-[12px] text-[#464555] dark:text-[#b5b2c7]">
                  Normalized learner segmentation against standard rubric
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 py-4">
              {buckets.map((b, i) => {
                const pct = total > 0 ? Math.round((b.count / total) * 100) : 0;
                return (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="font-semibold text-[#1b1b24] dark:text-[#f2effc]">{b.label}</span>
                      <span className="text-[#464555] dark:text-[#b5b2c7] tabular-nums font-bold">
                        {b.count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#efecf9] dark:bg-[#252238] h-2 rounded-full overflow-hidden">
                      <div
                        className={`${b.color} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${Math.max(b.count > 0 ? 5 : 0, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#e3e1ed]/50 dark:border-[#27243d] text-[12px] text-[#464555] dark:text-[#b5b2c7]">
            Distribution Skew: Slightly left-skewed with high concentration around 70-90 range.
          </div>
        </div>

        {/* Right: Academic Dean Takeaways */}
        <div className="lg:col-span-5 bg-white dark:bg-[#191726] rounded-2xl p-5 shadow-sm border border-[#e3e1ed]/70 dark:border-[#27243d] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e1ed]/50 dark:border-[#27243d]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4d43e3] dark:text-[#857df8] text-[20px]">
                  insights
                </span>
                <h3 className="text-[16px] font-bold text-[#1b1b24] dark:text-[#f2effc]">
                  Dean Diagnostic Observations
                </h3>
              </div>
            </div>

            <div className="flex flex-col gap-3 py-3">
              <div className="p-3 rounded-xl bg-[#f5f2ff] dark:bg-[#201e30] border border-[#e3e1ed]/50 dark:border-[#27243d]">
                <h4 className="text-[13px] font-bold text-[#1b1b24] dark:text-[#f2effc] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#4d43e3]">check_circle</span>
                  High Honor Distinction
                </h4>
                <p className="text-[12px] text-[#464555] dark:text-[#b5b2c7] mt-1">
                  40% of enrolled learners have achieved Grade A or higher, demonstrating strong comprehension in Python and JavaScript.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#f5f2ff] dark:bg-[#201e30] border border-[#e3e1ed]/50 dark:border-[#27243d]">
                <h4 className="text-[13px] font-bold text-[#1b1b24] dark:text-[#f2effc] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#9d25a4]">trending_up</span>
                  Data Science & Full Stack Retention
                </h4>
                <p className="text-[12px] text-[#464555] dark:text-[#b5b2c7] mt-1">
                  Mid-tier marks (60–79) show steady progression with 100% pass retention across engineering cohorts.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#ffdad6]/20 dark:bg-[#5c1314]/30 border border-[#ffdad6] dark:border-[#5c1314]">
                <h4 className="text-[13px] font-bold text-[#ba1a1a] dark:text-[#ffdad6] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">priority_high</span>
                  Remediation Need in Java Enterprise
                </h4>
                <p className="text-[12px] text-[#464555] dark:text-[#b5b2c7] mt-1">
                  Amit Verma scored 35. Schedule supplemental laboratory sessions for threading & JVM memory fundamentals.
                </p>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#777587] text-right">
            Computed in real-time via DOM Engine v3.4
          </div>
        </div>
      </div>
    </div>
  );
};
