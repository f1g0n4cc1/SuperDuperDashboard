import React from 'react';
import { Home, CheckSquare, Book, Settings, BarChart3 } from 'lucide-react';
import { useViewStore, ViewType } from '../context/viewStore';

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView } = useViewStore();

  const navItems: { icon: any, label: ViewType }[] = [
    { icon: Home, label: 'Dashboard' },
    { icon: CheckSquare, label: 'Tasks' },
    { icon: Book, label: 'Journal' },
    { icon: BarChart3, label: 'Stats' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 flex flex-col h-full py-6 relative">
      <div className="px-6 mb-10">
        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
          BATCAVE
        </h1>
      </div>
      
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = activeView === item.label;
          return (
            <button
              key={item.label}
              onClick={() => setActiveView(item.label)}
              className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 group relative ${
                isActive 
                  ? 'bg-batcave-blue/10 text-batcave-blue shadow-[0_0_20px_rgba(59,130,246,0.15)]' 
                  : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
              }`}
            >
              {/* Active Indicator Border */}
              {isActive && (
                <div className="absolute left-0 w-1 h-6 bg-batcave-blue rounded-r-full shadow-[0_0_10px_#3b82f6]" />
              )}
              
              <item.icon className={`w-5 h-5 mr-4 transition-transform group-hover:scale-110 ${
                isActive ? 'text-batcave-blue' : ''
              }`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="px-4 mt-auto">
        <div className="p-4 glass-panel rounded-2xl">
          <p className="text-xs text-gray-500 mb-1 font-semibold tracking-widest uppercase">System</p>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 shadow-[0_0_8px_#22c55e]" />
            <span className="text-sm font-medium">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};
