import React from 'react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'delete' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  let icon = 'check_circle';
  let iconClass = 'text-[#4d43e3] dark:text-[#857df8]';
  if (type === 'delete') {
    icon = 'delete';
    iconClass = 'text-[#ba1a1a] dark:text-[#ffb4ab]';
  } else if (type === 'info') {
    icon = 'info';
    iconClass = 'text-[#58579b] dark:text-[#a3a1f0]';
  }

  return (
    <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl bg-white dark:bg-[#191726] text-[#1b1b24] dark:text-[#f2effc] border border-[#e3e1ed] dark:border-[#27243d] animate-in fade-in slide-in-from-top-4 duration-200">
      <span className={`material-symbols-outlined text-[20px] ${iconClass}`}>
        {icon}
      </span>
      <span className="text-[13px] font-medium">{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="ml-2 text-[#777587] hover:text-[#1b1b24] dark:hover:text-white cursor-pointer"
        title="Dismiss"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  );
};
