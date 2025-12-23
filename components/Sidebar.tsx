
import React from 'react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  hasParticipants: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, hasParticipants }) => {
  const navItems = [
    { id: 'INPUT', label: '名單輸入', icon: '📝' },
    { id: 'LOTTERY', label: '獎品抽籤', icon: '🎁', disabled: !hasParticipants },
    { id: 'GROUPING', label: '自動分組', icon: '👥', disabled: !hasParticipants },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm">
      <div className="p-8 border-b border-slate-100">
        <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          HR Talent Hub
        </h1>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Smart HR Assistant</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => !item.disabled && setView(item.id as ViewState)}
            disabled={item.disabled}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              currentView === item.id
                ? 'bg-indigo-50 text-indigo-700 font-medium border border-indigo-100 shadow-sm'
                : item.disabled
                ? 'text-slate-300 cursor-not-allowed opacity-50'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-6 text-xs text-slate-400 border-t border-slate-100">
        &copy; 2024 HR Talent Hub v1.0
      </div>
    </aside>
  );
};

export default Sidebar;
