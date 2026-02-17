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
        <h2 className="text-3xl font-black text-vault-amber mb-2 tracking-tighter uppercase vault-glow-text">Intelligence Overview</h2>
        <p className="text-vault-amber-secondary italic">"Data collection synchronized. Monitoring all vault sectors."</p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Mission Velocity', value: `${Math.round(stats.completionRate)}%`, icon: Target },
          { label: 'Active Missions', value: stats.totalTasks - stats.completedTasks, icon: Activity },
          { label: 'Uplink Uptime', value: '99.9%', icon: Zap },
          { label: 'Tactical Score', value: 'ALPHA-9', icon: TrendingUp },
        ].map((item, i) => (
          <div key={i} className="glass-panel p-4 rounded-2xl border-vault-amber/5">
            <item.icon className="w-3 h-3 mb-2 text-vault-amber opacity-50" />
            <p className="text-[8px] uppercase tracking-[0.2em] text-vault-amber-secondary font-black mb-1">{item.label}</p>
            <p className="text-xl font-black text-vault-amber vault-glow-text">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Breakdown */}
        <div className="lg:col-span-1 glass-panel p-6 rounded-3xl border-vault-amber/5">
          <h3 className="text-[10px] font-black text-vault-amber uppercase tracking-[0.2em] mb-6 opacity-50">Priority Distribution</h3>
          <div className="space-y-5">
            {[
              { label: 'High Priority', count: stats.tasksByPriority.high, color: 'bg-red-500', total: stats.totalTasks },
              { label: 'Standard', count: stats.tasksByPriority.medium, color: 'bg-vault-amber', total: stats.totalTasks },
              { label: 'Low/Admin', count: stats.tasksByPriority.low, color: 'bg-zinc-700', total: stats.totalTasks },
            ].map((p, i) => (
              <div key={i}>
                <div className="flex justify-between text-[10px] mb-2 font-bold uppercase tracking-widest text-vault-amber-secondary">
                  <span>{p.label}</span>
                  <span className="text-vault-amber">{p.count}</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${p.color} transition-all duration-1000 shadow-[0_0_10px_currentColor]`} 
                    style={{ width: `${p.total > 0 ? (p.count / p.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border-vault-amber/5">
          <h3 className="text-[10px] font-black text-vault-amber uppercase tracking-[0.2em] mb-6 opacity-50">7-Day Deployment Log</h3>
          <div className="h-32 flex items-end justify-between gap-2 px-2">
            {stats.recentActivity.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div 
                  className="w-full bg-vault-amber/10 border-t border-vault-amber/20 rounded-t-sm group-hover:bg-vault-amber/30 transition-all relative"
                  style={{ height: `${(day.count / (Math.max(...stats.recentActivity.map(d => d.count)) || 1)) * 100}%`, minHeight: '2px' }}
                >
                   {day.count > 0 && (
                     <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-vault-amber opacity-0 group-hover:opacity-100 transition-opacity">
                       {day.count}
                     </div>
                   )}
                </div>
                <span className="text-[7px] text-vault-amber-secondary font-black uppercase tracking-tighter">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
