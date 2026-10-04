import React from 'react';
import { SystemNotification } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SystemNotification[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 md:p-6 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#191726] rounded-2xl p-5 shadow-2xl w-full max-w-sm flex flex-col gap-3 border border-[#e3e1ed] dark:border-[#27243d] mt-12 animate-in slide-in-from-top-4 duration-200">
        <div className="flex items-center justify-between pb-2 border-b border-[#e3e1ed]/60 dark:border-[#27243d]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4d43e3] dark:text-[#857df8] text-[20px]">
              notifications
            </span>
            <h3 className="text-[15px] font-bold text-[#1b1b24] dark:text-[#f2effc]">
              System Notifications
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#777587] hover:text-[#1b1b24] dark:hover:text-white cursor-pointer"
            title="Close"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-2.5 max-h-80 overflow-y-auto pr-1">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 rounded-xl border flex flex-col gap-1 transition-all ${
                  !notif.read
                    ? 'bg-[#f5f2ff] dark:bg-[#201e30] border-[#c2c1ff]/60 dark:border-[#353150]'
                    : 'bg-white dark:bg-[#191726] border-[#e3e1ed]/50 dark:border-[#27243d]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[#1b1b24] dark:text-[#f2effc]">
                    {notif.title}
                  </span>
                  <span className="text-[10px] text-[#777587]">{notif.time}</span>
                </div>
                <p className="text-[11px] text-[#464555] dark:text-[#b5b2c7] leading-relaxed">
                  {notif.description}
                </p>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-[#777587] text-[12px]">
              No notifications at this time.
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-[#e3e1ed]/50 dark:border-[#27243d]">
            <button
              type="button"
              onClick={onMarkAllRead}
              className="text-[11px] font-bold text-[#4d43e3] dark:text-[#857df8] hover:underline cursor-pointer"
            >
              Mark all as read
            </button>
            <button
              type="button"
              onClick={onClearAll}
              className="text-[11px] font-bold text-[#ba1a1a] hover:underline cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
