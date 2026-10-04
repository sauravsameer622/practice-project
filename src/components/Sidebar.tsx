import React from 'react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onSignOut: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isMobileOpen,
  onCloseMobile,
  onSignOut,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: 'space_dashboard' },
    { id: 'students', label: 'Students', icon: 'group' },
    { id: 'courses', label: 'Courses', icon: 'menu_book' },
    { id: 'grades-and-assignments', label: 'Grades & Tasks', icon: 'grading' },
    { id: 'attendance', label: 'Attendance', icon: 'event_available' },
    { id: 'analytics', label: 'Analytics', icon: 'analytics' },
  ];

  const handleTabClick = (tab: ActiveTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-[#191726] z-40 flex flex-col justify-between py-4 px-3 border-r border-[#e3e1ed]/70 dark:border-[#27243d] shadow-[0_1px_8px_rgba(0,0,0,0.02)] transition-transform duration-300 md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Main Navigation */}
        <nav className="flex flex-col gap-1">
          <div className="px-3 py-2 text-[10px] font-bold text-[#464555] dark:text-[#b5b2c7] uppercase tracking-wider">
            Main Navigation
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-[14px] text-left cursor-pointer w-full ${
                  isActive
                    ? 'bg-[#4d43e3] dark:bg-[#4d43e3] text-white shadow-sm font-semibold'
                    : 'text-[#464555] dark:text-[#b5b2c7] hover:bg-[#efecf9] dark:hover:bg-[#252238] hover:text-[#1b1b24] dark:hover:text-[#f2effc]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* System Navigation */}
        <div className="flex flex-col gap-1 pt-4 border-t border-[#e3e1ed] dark:border-[#27243d]">
          <div className="px-3 py-2 text-[10px] font-bold text-[#464555] dark:text-[#b5b2c7] uppercase tracking-wider">
            System
          </div>

          <button
            type="button"
            onClick={() => handleTabClick('settings')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-[14px] text-left cursor-pointer w-full ${
              activeTab === 'settings'
                ? 'bg-[#4d43e3] text-white shadow-sm font-semibold'
                : 'text-[#464555] dark:text-[#b5b2c7] hover:bg-[#efecf9] dark:hover:bg-[#252238] hover:text-[#1b1b24] dark:hover:text-[#f2effc]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span>Settings</span>
          </button>

          <button
            type="button"
            onClick={onSignOut}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#464555] dark:text-[#b5b2c7] hover:bg-[#ffdad6] dark:hover:bg-[#5c1314] hover:text-[#93000a] dark:hover:text-[#ffdad6] transition-colors font-medium text-[14px] text-left cursor-pointer w-full"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
