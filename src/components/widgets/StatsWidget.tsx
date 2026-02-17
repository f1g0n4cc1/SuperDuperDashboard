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
      <header className="mb-10">
        <h2 className="text-3xl font-black text-vault-amber mb-2 tracking-tighter uppercase vault-glow-text">S - SCHEDULES: Intelligence Overview</h2>
        <p className="text-vault-amber-secondary italic">"Data collection synchronized. Monitoring all vault sectors."</p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Mission Velocity', value: `${Math.round(stats.completionRate)}%`, icon: Target, subtitle: 'Project Progress' },
          { label: 'Active Missions', value: stats.totalTasks - stats.completedTasks, icon: Activity, subtitle: 'Open Tasks' },
          { label: 'Uplink Uptime', value: `${stats.journalStreak > 0 ? '99.9' : '0.0'}%`, icon: Zap, subtitle: 'Habit Streak' },
          { label: 'Tactical Score', value: 'ALPHA-9', icon: TrendingUp, subtitle: 'Focus Level' },
        ].map((item, i) => (
          <div key={i} className="glass-panel p-4 rounded-2xl border-vault-amber/5 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <item.icon className="w-3 h-3 text-vault-amber opacity-50" />
              <p className="text-[8px] uppercase tracking-[0.2em] text-vault-amber-secondary font-black">{item.label}</p>
            </div>
            <div>
              <p className="text-xl font-black text-vault-amber vault-glow-text leading-none">{item.value}</p>
              <p className="text-[7px] uppercase tracking-widest text-white/20 font-bold mt-1">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Breakdown */}
        <div className="lg:col-span-1 glass-panel p-6 rounded-3xl border-vault-amber/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black text-vault-amber uppercase tracking-[0.2em] opacity-50">Priority Distribution</h3>
          </div>
          <div className="space-y-5">
            {[
              { label: '[!] High Priority', count: stats.tasksByPriority.high, color: 'bg-red-500', total: stats.totalTasks, sub: 'Critical Objectives' },
              { label: '[-] Standard', count: stats.tasksByPriority.medium, color: 'bg-vault-amber', total: stats.totalTasks, sub: 'Routine Operations' },
              { label: '[.] Low/Admin', count: stats.tasksByPriority.low, color: 'bg-zinc-700', total: stats.totalTasks, sub: 'Maintenance & Ideas' },
            ].map((p, i) => (
              <div key={i}>
                <div className="flex justify-between text-[9px] mb-1 font-black uppercase tracking-widest">
                  <span className="text-vault-amber">{p.label}</span>
                  <span className="text-vault-amber">{p.count}</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mb-1">
                  <div 
                    className={`h-full ${p.color} transition-all duration-1000 shadow-[0_0_10px_currentColor]`} 
                    style={{ width: `${p.total > 0 ? (p.count / p.total) * 100 : 0}%` }}
                  />
                </div>
                <p className="text-[7px] uppercase text-white/10 font-bold tracking-tighter">{p.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border-vault-amber/5 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black text-vault-amber uppercase tracking-[0.2em] opacity-50">7-Day Deployment Log</h3>
            <div className="flex items-center gap-2 text-[7px] font-black text-white/20 uppercase tracking-tighter">
              <span>░ Idle</span>
              <span>▒ Active</span>
              <span>▓ Max</span>
              <span className="text-vault-amber">! Current</span>
            </div>
          </div>
          <div className="h-32 flex items-end justify-between gap-2 px-2 flex-1">
            {stats.recentActivity.map((day, i) => {
              const isToday = i === stats.recentActivity.length - 1;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div 
                    className={`w-full border-t rounded-t-sm transition-all relative ${
                      isToday ? 'bg-vault-amber/40 border-vault-amber shadow-[0_0_15px_rgba(255,182,66,0.3)]' : 'bg-vault-amber/10 border-vault-amber/20 group-hover:bg-vault-amber/30'
                    }`}
                    style={{ height: `${(day.count / (Math.max(...stats.recentActivity.map(d => d.count)) || 1)) * 100}%`, minHeight: '2px' }}
                  >
                     {day.count > 0 && (
                       <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-vault-amber opacity-0 group-hover:opacity-100 transition-opacity">
                         {day.count}
                       </div>
                     )}
                  </div>
                  <span className={`text-[7px] font-black uppercase tracking-tighter ${isToday ? 'text-vault-amber' : 'text-vault-amber-secondary'}`}>
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
