import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  description,
  confirmText = 'Confirm Action',
  isDanger = true,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#191726] rounded-2xl p-6 shadow-2xl max-w-md w-full mx-auto flex flex-col gap-4 border border-[#e3e1ed] dark:border-[#27243d] scale-100 animate-in zoom-in-95 duration-150">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#ffdad6] dark:bg-[#5c1314] text-[#ba1a1a] dark:text-[#ffdad6] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">warning</span>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-[18px] font-bold text-[#1b1b24] dark:text-[#f2effc]">
              {title}
            </h3>
            <p className="text-[13px] text-[#464555] dark:text-[#b5b2c7] leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 mt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-full bg-[#e9e7f3] dark:bg-[#252238] text-[#1b1b24] dark:text-[#f2effc] hover:bg-[#e3e1ed] dark:hover:bg-[#2d2943] transition-colors text-[13px] font-semibold cursor-pointer border border-[#c7c4d8]/40 dark:border-[#353150]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-full text-white text-[13px] font-semibold transition-all shadow-sm cursor-pointer ${
              isDanger
                ? 'bg-[#ba1a1a] hover:opacity-90'
                : 'bg-[#4d43e3] hover:bg-[#6760fd]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
