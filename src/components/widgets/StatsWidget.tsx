import React from 'react';
import { useStats } from '../../hooks/useStats';
import { Loader2, TrendingUp, Target, Zap, Activity } from 'lucide-react';

export const StatsWidget: React.FC = () => {
  const { data: stats, isLoading } = useStats();

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-batcave-blue" />
    </div>
  );

  if (!stats) return null;

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Intelligence Reports</h2>
        <p className="text-batcave-text-secondary">Strategic overview of your productivity and mission progress.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Completion Rate', value: `${Math.round(stats.completionRate)}%`, icon: Target, color: 'text-batcave-blue' },
          { label: 'Active Missions', value: stats.totalTasks - stats.completedTasks, icon: Activity, color: 'text-batcave-yellow' },
          { label: 'Journal Streak', value: `${stats.journalStreak} Days`, icon: Zap, color: 'text-green-500' },
          { label: 'Tactical Score', value: 'Alpha', icon: TrendingUp, color: 'text-purple-500' },
        ].map((item, i) => (
          <div key={i} className="glass-panel p-6 rounded-3xl group">
            <item.icon className={`w-5 h-5 mb-4 ${item.color} drop-shadow-[0_0_8px_currentColor]`} />
            <p className="text-[10px] uppercase tracking-widest text-batcave-text-secondary font-bold mb-1">{item.label}</p>
            <p className="text-2xl font-bold text-white">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Breakdown */}
        <div className="lg:col-span-1 glass-panel p-8 rounded-3xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Priority Distribution</h3>
          <div className="space-y-6">
            {[
              { label: 'High Priority', count: stats.tasksByPriority.high, color: 'bg-batcave-red', total: stats.totalTasks },
              { label: 'Standard', count: stats.tasksByPriority.medium, color: 'bg-batcave-blue', total: stats.totalTasks },
              { label: 'Low/Admin', count: stats.tasksByPriority.low, color: 'bg-gray-600', total: stats.totalTasks },
            ].map((p, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-batcave-text-secondary font-medium">{p.label}</span>
                  <span className="text-white font-bold">{p.count}</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${p.color} transition-all duration-1000 shadow-[0_0_10px_currentColor]`} 
                    style={{ width: `${p.total > 0 ? (p.count / p.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Chart Placeholder */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Mission Deployment (Last 7 Days)</h3>
          <div className="h-48 flex items-end justify-between gap-2">
            {stats.recentActivity.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div 
                  className="w-full bg-batcave-blue/20 rounded-t-lg group-hover:bg-batcave-blue/40 transition-all relative"
                  style={{ height: `${(day.count / (Math.max(...stats.recentActivity.map(d => d.count)) || 1)) * 100}%`, minHeight: '4px' }}
                >
                   {day.count > 0 && (
                     <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-batcave-blue opacity-0 group-hover:opacity-100 transition-opacity">
                       {day.count}
                     </div>
                   )}
                </div>
                <span className="text-[8px] text-gray-600 font-bold uppercase tracking-tighter">
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
