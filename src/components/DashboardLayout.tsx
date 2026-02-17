import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, sidebar }) => {
  return (
    <div className="h-screen w-full grid grid-cols-[auto_1fr] bg-vault-bg text-vault-amber overflow-hidden crt-overlay font-mono">
      <aside className="h-full glass-panel border-r border-vault-amber/10 z-20">
        {sidebar}
      </aside>
      <main className="h-full overflow-y-auto relative custom-scrollbar">
        <div className="max-w-7xl mx-auto p-6 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
};
