import React from 'react';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenMobileMenu: () => void;
  academicTerm: string;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleTheme,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenMobileMenu,
  academicTerm,
}) => {
  const brandLogoUrl = "https://lh3.googleusercontent.com/aida/AEtjO1UhZnCPxOfE9riVFx08su3DzQ1g8SmPB5CqjhDGGybvNRYOYvmQ_HdKidmIhBwyEWEa14g_ByXp9XiWaDVdez_J_vtFz-YTVXrW7K_9HmJfW_9xBj8Imxyiw50UXgtNeQtp8SkNk9v9I7x1wK_J1flTm6-TVWfvZ2V42OybjTu9RgGHX5bbYgdlTgIiLDUYMrIj7zzXo9drOr_9A0KvviTsA8KFNDsJplgxifq6QVAw6qc1pOaW4tdUSw";

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-[#fbf8ff]/95 dark:bg-[#12111b]/95 backdrop-blur-xl border-b border-[#e3e1ed]/70 dark:border-[#27243d] transition-colors">
      <div className="h-16 w-full px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Mobile hamburger menu */}
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-lg text-[#464555] dark:text-[#b5b2c7] hover:bg-[#efecf9] dark:hover:bg-[#252238] transition-colors"
            title="Open navigation menu"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>

          <div className="flex items-center gap-3">
            <img
              src={brandLogoUrl}
              alt="EduTrack Logo"
              className="h-8 w-auto object-contain shrink-0"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Graceful fallback if image is unreachable
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <span className="font-semibold text-[16px] leading-tight text-[#1b1b24] dark:text-[#f2effc] tracking-tight">
                EduTrack
              </span>
              <span className="text-[10px] font-bold tracking-wider text-[#464555] dark:text-[#b5b2c7] uppercase">
                Student Management
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center px-3 py-1 rounded-full bg-[#e9e7f3] dark:bg-[#252238] text-[#464555] dark:text-[#b5b2c7] text-[12px] font-medium gap-1.5 ml-2 border border-[#c7c4d8]/40 dark:border-[#353150]">
            <span className="material-symbols-outlined text-[16px] text-[#4d43e3] dark:text-[#857df8]">calendar_today</span>
            <span>{academicTerm}</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Theme Toggle Pill */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="flex items-center bg-[#e9e7f3] dark:bg-[#252238] rounded-full p-1 cursor-pointer focus:outline-none hover:opacity-90 transition-all border border-[#c7c4d8]/30 dark:border-[#353150]"
            title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} mode`}
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                !isDarkMode
                  ? 'bg-white text-[#4d43e3] shadow-sm'
                  : 'text-[#464555] dark:text-[#b5b2c7]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">light_mode</span>
            </span>
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                isDarkMode
                  ? 'bg-[#191726] text-[#857df8] shadow-sm'
                  : 'text-[#464555] dark:text-[#b5b2c7]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">dark_mode</span>
            </span>
          </button>

          {/* Notifications Button */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[#efecf9] dark:bg-[#252238] hover:bg-[#e9e7f3] dark:hover:bg-[#2d2943] transition-colors relative text-[#464555] dark:text-[#b5b2c7] hover:text-[#1b1b24] dark:hover:text-[#f2effc] border border-transparent hover:border-[#c7c4d8]/40"
            title="System notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#4d43e3] ring-2 ring-white dark:ring-[#12111b] animate-pulse"></span>
            )}
          </button>

          {/* Academic Dean Profile */}
          <div className="flex items-center gap-2 pl-1 border-l border-[#e3e1ed] dark:border-[#27243d]">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[13px] font-semibold text-[#1b1b24] dark:text-[#f2effc] leading-tight">
                Dr. Aris Thorne
              </span>
              <span className="text-[11px] text-[#464555] dark:text-[#b5b2c7]">
                Academic Dean
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#4d43e3] dark:bg-[#857df8] flex items-center justify-center text-white shadow-sm ring-2 ring-[#e2dfff] dark:ring-[#322b82]">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
