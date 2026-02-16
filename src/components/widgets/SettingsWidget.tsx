import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUserSettings } from '../../hooks/useUserSettings';
import { User, Moon, Layout, RefreshCw, Shield } from 'lucide-react';

export const SettingsWidget: React.FC = () => {
  const { user, signOut } = useAuth();
  const { layout, updateLayout } = useUserSettings();

  const resetLayout = () => {
    if (confirm('Are you sure you want to reset your dashboard layout to default?')) {
      updateLayout.mutate({
        widgets: [
          { id: 'tasks-1', type: 'tasks', title: 'Mission Objectives' },
          { id: 'intel-1', type: 'intel', title: 'Intelligence Overview' },
          { id: 'notes-1', type: 'notes', title: 'Quick Notes' },
        ],
      });
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-20">
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">System Configuration</h2>
        <p className="text-batcave-text-secondary">Manage your tactical environment and security protocols.</p>
      </header>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="glass-panel p-8 rounded-3xl">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-batcave-blue/10 flex items-center justify-center border border-batcave-blue/20">
              <User className="w-10 h-10 text-batcave-blue" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{user?.email?.split('@')[0] || 'Agent'}</h3>
              <p className="text-sm text-batcave-text-secondary">{user?.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase rounded-md border border-green-500/20">Verified Identity</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => signOut()}
            className="px-6 py-2 bg-white/5 hover:bg-red-500/10 hover:text-red-500 border border-white/5 hover:border-red-500/20 rounded-xl text-sm font-bold transition-all"
          >
            Deactivate Session
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Appearance Section */}
          <div className="glass-panel p-8 rounded-3xl">
            <div className="flex items-center gap-3 mb-6">
              <Moon className="w-5 h-5 text-batcave-blue" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Appearance</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-batcave-blue/20">
                <div>
                  <p className="text-sm font-bold text-white">Batcave Theme</p>
                  <p className="text-[10px] text-batcave-text-secondary uppercase">Active Terminal Skin</p>
                </div>
                <div className="w-10 h-5 bg-batcave-blue rounded-full relative">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/2 rounded-2xl border border-transparent opacity-50 cursor-not-allowed">
                <div>
                  <p className="text-sm font-bold text-white">Clean Dark</p>
                  <p className="text-[10px] text-batcave-text-secondary uppercase">High Contrast Alpha</p>
                </div>
                <div className="w-10 h-5 bg-gray-800 rounded-full relative">
                  <div className="absolute left-1 top-1 w-3 h-3 bg-gray-600 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Workspace Section */}
          <div className="glass-panel p-8 rounded-3xl">
            <div className="flex items-center gap-3 mb-6">
              <Layout className="w-5 h-5 text-batcave-blue" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Workspace</h3>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={resetLayout}
                className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group"
              >
                <div className="text-left">
                  <p className="text-sm font-bold text-white">Reset Dashboard</p>
                  <p className="text-[10px] text-batcave-text-secondary uppercase">Restore default widget set</p>
                </div>
                <RefreshCw className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:rotate-180 transition-all duration-500" />
              </button>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-sm font-bold text-white">Active Widgets</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {layout.widgets.map(w => (
                    <span key={w.id} className="px-2 py-1 bg-batcave-blue/5 border border-batcave-blue/10 rounded text-[9px] text-batcave-blue font-bold uppercase tracking-wider">
                      {w.type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="glass-panel p-8 rounded-3xl border-l-4 border-l-batcave-blue">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-batcave-blue" />
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Security Protocol</h3>
          </div>
          <p className="text-sm text-batcave-text-secondary leading-relaxed mb-6">
            All data transmitted within the Batcave environment is encrypted using Supabase-tier security. 
            Row Level Security (RLS) is active across all tactical tables.
          </p>
          <div className="flex gap-4">
             <div className="px-4 py-2 bg-white/5 rounded-xl text-[10px] text-gray-500 font-mono">
               AES-256-GCM
             </div>
             <div className="px-4 py-2 bg-white/5 rounded-xl text-[10px] text-gray-500 font-mono">
               RLS_ACTIVE_V1
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
