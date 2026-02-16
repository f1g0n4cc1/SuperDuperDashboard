import React from 'react';
import { Home, CheckSquare, Book, Settings, BarChart3 } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: CheckSquare, label: 'Tasks' },
    { icon: Book, label: 'Journal' },
    { icon: BarChart3, label: 'Stats' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-20 lg:w-64 flex flex-col h-full py-6">
      <div className="px-6 mb-10">
        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent hidden lg:block">
          BATCAVE
        </h1>
        <div className="lg:hidden w-8 h-8 bg-white rounded-md flex items-center justify-center">
          <span className="text-black font-bold">B</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center p-3 rounded-xl transition-all group ${
              item.active 
                ? 'bg-white/10 text-white shadow-lg border border-white/10' 
                : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
            }`}
          >
            <item.icon className={`w-6 h-6 lg:mr-4 transition-transform group-hover:scale-110`} />
            <span className="hidden lg:block font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="px-4 mt-auto">
        <div className="p-4 glass-panel rounded-2xl hidden lg:block">
          <p className="text-xs text-gray-500 mb-1">Status</p>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 shadow-[0_0_8px_#22c55e]" />
            <span className="text-sm font-medium">Synchronized</span>
          </div>
        </div>
      </div>
    </div>
  );
};
