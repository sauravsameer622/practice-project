import React, { useState } from 'react';
import { Student } from '../types';

interface SettingsViewProps {
  academicTerm: string;
  onUpdateTerm: (term: string) => void;
  passThreshold: number;
  onUpdatePassThreshold: (val: number) => void;
  students: Student[];
  onResetToDefaults: () => void;
  onRestoreData: (importedStudents: Student[]) => void;
  onShowToast: (msg: string, type?: 'success' | 'delete' | 'info') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  academicTerm,
  onUpdateTerm,
  passThreshold,
  onUpdatePassThreshold,
  students,
  onResetToDefaults,
  onRestoreData,
  onShowToast,
}) => {
  const [termInput, setTermInput] = useState(academicTerm);
  const [thresholdInput, setThresholdInput] = useState(passThreshold);

  const handleSaveAcademic = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTerm(termInput);
    onUpdatePassThreshold(thresholdInput);
    onShowToast('Academic configuration saved successfully');
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(students, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `edutrack-registry-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowToast('Registry backup downloaded as JSON');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            onRestoreData(parsed);
            onShowToast(`Successfully restored ${parsed.length} student records from JSON backup`);
          } else {
            onShowToast('Invalid JSON file format', 'delete');
          }
        } catch (err) {
          onShowToast('Failed to parse JSON file', 'delete');
        }
      };
    }
  };

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#e2dfff] dark:bg-[#322b82] text-[#3322cc] dark:text-[#c3c0ff] text-[10px] font-bold uppercase tracking-wider">
              System Configuration
            </span>
            <span className="text-[#464555] dark:text-[#b5b2c7] text-[12px]">
              • Institution Parameters & Data Persistence
            </span>
          </div>
          <h1 className="text-[28px] md:text-[32px] font-bold text-[#1b1b24] dark:text-[#f2effc] tracking-tight leading-tight mt-1">
            System Settings
          </h1>
          <p className="text-[14px] text-[#464555] dark:text-[#b5b2c7]">
            Configure institutional academic terms, grading thresholds, and data backup vaults.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Academic Parameters */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="bg-white dark:bg-[#191726] rounded-2xl p-5 shadow-sm border border-[#e3e1ed]/70 dark:border-[#27243d]">
            <h3 className="text-[16px] font-bold text-[#1b1b24] dark:text-[#f2effc] pb-3 border-b border-[#e3e1ed]/50 dark:border-[#27243d]">
              Academic Term & Pass Criteria
            </h3>

            <form onSubmit={handleSaveAcademic} className="flex flex-col gap-4 pt-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-[#1b1b24] dark:text-[#f2effc]">
                  Active Academic Term
                </label>
                <input
                  type="text"
                  value={termInput}
                  onChange={(e) => setTermInput(e.target.value)}
                  placeholder="e.g., Fall Term 2024–2025"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f5f2ff] dark:bg-[#201e30] text-[#1b1b24] dark:text-[#f2effc] text-[14px] border border-transparent focus:border-[#4d43e3] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[12px] font-semibold text-[#1b1b24] dark:text-[#f2effc]">
                    Passing Mark Threshold
                  </label>
                  <span className="text-[13px] font-bold text-[#4d43e3] dark:text-[#857df8] tabular-nums">
                    {thresholdInput} Marks
                  </span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={60}
                  value={thresholdInput}
                  onChange={(e) => setThresholdInput(Number(e.target.value))}
                  className="w-full accent-[#4d43e3] cursor-pointer"
                />
                <span className="text-[11px] text-[#464555] dark:text-[#b5b2c7]">
                  Scores below this threshold automatically assign Grade F and status FAIL.
                </span>
              </div>

              <button
                type="submit"
                className="mt-2 py-2.5 px-4 rounded-full bg-[#4d43e3] text-white font-semibold text-[13px] hover:bg-[#6760fd] transition-colors cursor-pointer self-start"
              >
                Save Academic Parameters
              </button>
            </form>
          </div>

          {/* Institutional Lead Profile */}
          <div className="bg-white dark:bg-[#191726] rounded-2xl p-5 shadow-sm border border-[#e3e1ed]/70 dark:border-[#27243d]">
            <h3 className="text-[16px] font-bold text-[#1b1b24] dark:text-[#f2effc] pb-3 border-b border-[#e3e1ed]/50 dark:border-[#27243d]">
              Dean Administration Credentials
            </h3>

            <div className="pt-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#4d43e3] dark:bg-[#857df8] text-white flex items-center justify-center text-[24px]">
                <span className="material-symbols-outlined text-[32px]">person</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[16px] font-bold text-[#1b1b24] dark:text-[#f2effc]">
                  Dr. Aris Thorne
                </span>
                <span className="text-[13px] text-[#464555] dark:text-[#b5b2c7]">
                  Academic Dean & Registry Superintendent
                </span>
                <span className="text-[11px] text-[#777587] mt-0.5">
                  Office of Academic Integrity • Terminal Session V3.4
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Data Persistence & Vault */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="bg-white dark:bg-[#191726] rounded-2xl p-5 shadow-sm border border-[#e3e1ed]/70 dark:border-[#27243d]">
            <h3 className="text-[16px] font-bold text-[#1b1b24] dark:text-[#f2effc] pb-3 border-b border-[#e3e1ed]/50 dark:border-[#27243d]">
              Registry Vault & Data Operations
            </h3>

            <div className="flex flex-col gap-4 pt-4">
              <div className="p-4 rounded-xl bg-[#f5f2ff] dark:bg-[#201e30] border border-[#e3e1ed]/50 dark:border-[#27243d] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[13px] text-[#1b1b24] dark:text-[#f2effc]">
                    Export Registry Backup (JSON)
                  </span>
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    className="px-3.5 py-1.5 rounded-full bg-[#4d43e3] text-white font-semibold text-[11px] hover:bg-[#6760fd] transition-colors cursor-pointer"
                  >
                    Export JSON
                  </button>
                </div>
                <p className="text-[12px] text-[#464555] dark:text-[#b5b2c7]">
                  Generates an immutable snapshot of all {students.length} current student records with scores and grades.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#f5f2ff] dark:bg-[#201e30] border border-[#e3e1ed]/50 dark:border-[#27243d] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[13px] text-[#1b1b24] dark:text-[#f2effc]">
                    Import / Restore JSON
                  </span>
                  <label className="px-3.5 py-1.5 rounded-full bg-[#e9e7f3] dark:bg-[#252238] text-[#1b1b24] dark:text-[#f2effc] font-semibold text-[11px] hover:bg-[#e3e1ed] transition-colors cursor-pointer border border-[#c7c4d8]/40 dark:border-[#353150]">
                    Select File
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJSON}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-[12px] text-[#464555] dark:text-[#b5b2c7]">
                  Restore student registry state from a previously exported JSON backup file.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#ffdad6]/20 dark:bg-[#5c1314]/30 border border-[#ffdad6] dark:border-[#5c1314] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[13px] text-[#ba1a1a] dark:text-[#ffdad6]">
                    Reset to Default Seed Data
                  </span>
                  <button
                    type="button"
                    onClick={onResetToDefaults}
                    className="px-3.5 py-1.5 rounded-full bg-[#ba1a1a] text-white font-semibold text-[11px] hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Reset Registry
                  </button>
                </div>
                <p className="text-[12px] text-[#464555] dark:text-[#b5b2c7]">
                  Re-populates the registry with the original 5 sample learners (Rahul, Priya, Amit, Sneha, Vikram).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
