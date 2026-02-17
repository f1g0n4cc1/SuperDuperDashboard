import React from 'react';
import { useStats } from '../../hooks/useStats';
import { Loader2, TrendingUp, Target, Zap, Activity } from 'lucide-react';

export const StatsWidget: React.FC = () => {
  const { data: stats, isLoading } = useStats();

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-vault-amber" />
    </div>
  );

  if (!stats) return null;

    return (
      <div className="animate-fade-in max-w-4xl mx-auto h-full flex flex-col">
        <div className="grid grid-cols-2 gap-px bg-vault-amber/10 rounded-2xl overflow-hidden mb-12 border border-vault-amber/10 shadow-vault-inner-glow">
          {[
            { label: 'Mission Velocity', value: `${Math.round(stats.completionRate)}%`, icon: Target, subtitle: 'Daily Progress' },
            { label: 'Active Missions', value: stats.totalTasks - stats.completedTasks, icon: Activity, subtitle: 'Open Capacity' },
            { label: 'Uplink Uptime', value: `${stats.journalStreak > 0 ? '99.9' : '0.0'}%`, icon: Zap, subtitle: 'System Pulse' },
            { label: 'Tactical Score', value: 'ALPHA-9', icon: TrendingUp, subtitle: 'Focus Rank' },
          ].map((item, i) => (
            <div key={i} className="bg-vault-surface/60 p-6 flex flex-col justify-between relative overflow-hidden group">
              {/* Subtle Scanline separator */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(rgba(255,182,66,0)_50%,rgba(255,182,66,1)_50%)] bg-[length:100%_4px]" />
              
              <div className="flex items-center gap-2 mb-4 relative z-10">
                <item.icon className="w-2.5 h-2.5 text-vault-amber-secondary opacity-30" />
                <p className="text-[7px] uppercase tracking-terminal-wide text-vault-amber-secondary font-black opacity-40">{item.label}</p>
              </div>
              <div className="relative z-10">
                <p className="text-3xl font-black text-vault-amber vault-glow-text leading-none tracking-tighter">{item.value}</p>
                <p className="text-[6px] uppercase tracking-[0.4em] text-white/5 font-black mt-3">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
  
        <div className="flex-1 space-y-10">
          {/* Priority Breakdown */}
          <div className="space-y-6 px-1">
            <h3 className="text-[8px] font-black text-vault-amber-secondary uppercase tracking-terminal-wide opacity-20">Operational Distribution</h3>
            <div className="grid grid-cols-1 gap-8">
              {[
                { label: '[!] High Priority', count: stats.tasksByPriority.high, color: 'bg-red-500', total: stats.totalTasks },
                { label: '[-] Standard', count: stats.tasksByPriority.medium, color: 'bg-vault-amber', total: stats.totalTasks },
                { label: '[.] Low/Admin', count: stats.tasksByPriority.low, color: 'bg-zinc-800', total: stats.totalTasks },
              ].map((p, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between text-[10px] mb-3 font-black uppercase tracking-terminal text-vault-amber">
                    <span className="vault-glow-text opacity-80">{p.label}</span>
                    <span className="opacity-30">{p.count}</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mb-2">
                    <div 
                      className={`h-full ${p.color} transition-all duration-1000 shadow-vault-glow`} 
                      style={{ width: `${p.total > 0 ? (p.count / p.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          {/* Activity Chart */}
          <div className="space-y-8 px-1">
            <div className="flex items-center justify-between">
              <h3 className="text-[8px] font-black text-vault-amber-secondary uppercase tracking-terminal-wide opacity-20">7-Day Deployment Log</h3>
              <div className="flex items-center gap-4 text-[6px] font-black text-white/5 uppercase tracking-tighter">
                <span>░ Idle</span>
                <span>▒ Active</span>
                <span className="text-vault-amber/20">! Current</span>
              </div>
            </div>
            <div className="h-28 flex items-end justify-between gap-4 px-2">
              {stats.recentActivity.map((day, i) => {
                const isToday = i === stats.recentActivity.length - 1;
                const maxCount = Math.max(...stats.recentActivity.map(d => d.count)) || 1;
                const height = (day.count / maxCount) * 100;
                
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                    <div 
                      className={`w-full border-t rounded-t-sm transition-all relative ${
                        isToday ? 'bg-vault-amber/30 border-vault-amber shadow-vault-glow' : 'bg-vault-amber/5 border-vault-amber/10 group-hover:bg-vault-amber/20'
                      }`}
                      style={{ height: `${height}%`, minHeight: '2px' }}
                    >
                       {day.count > 0 && (
                         <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-black text-vault-amber opacity-0 group-hover:opacity-100 transition-opacity tracking-tighter vault-glow-text">
                           {day.count}
                         </div>
                       )}
                    </div>
                    <span className={`text-[7px] font-black uppercase tracking-terminal ${isToday ? 'text-vault-amber vault-glow-text' : 'text-vault-amber-secondary opacity-20'}`}>
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      {isToday && '!'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
};
