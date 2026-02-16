import React from 'react';

interface WidgetContainerProps {
  title: string;
  children: React.ReactNode;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({ title, children }) => {
  return (
    <div className="glass-panel rounded-3xl p-6 group hover:scale-[1.01] hover:shadow-[0_0_40px_rgba(255,255,255,0.03)] flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white/90">{title}</h3>
        <button className="text-gray-500 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};
