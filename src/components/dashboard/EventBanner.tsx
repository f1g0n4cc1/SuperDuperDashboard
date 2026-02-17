import React from 'react';
import { Bell, Clock, Loader2, Calendar } from 'lucide-react';
import { useCalendarSync } from '../../hooks/useCalendarSync';
import { useViewStore } from '../../context/viewStore';

export const EventBanner: React.FC = () => {
  const { events, isLoading } = useCalendarSync();
  const { setActiveView } = useViewStore();

  // Find the next 3 events that haven't ended yet
  const now = new Date();
  const upcomingEvents = events
    .filter(event => new Date(event.end_time) > now)
    .slice(0, 3);

  const formatEventTime = (startTime: string) => {
    const date = new Date(startTime);
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = new Date(now.getTime() + 86400000).toDateString() === date.toDateString();
    
    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });

    if (isToday) return `Today at ${timeStr}`;
    if (isTomorrow) return `Tomorrow at ${timeStr}`;
    
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${timeStr}`;
  };

  if (isLoading) {
    return (
      <div className="glass-panel bg-vault-surface/40 p-6 rounded-3xl mb-10 flex items-center justify-center h-24">
        <Loader2 className="w-6 h-6 animate-spin text-vault-amber" />
      </div>
    );
  }

  if (upcomingEvents.length === 0) {
    return (
      <div className="glass-panel bg-vault-surface/40 p-6 rounded-3xl mb-10 flex items-center gap-6 group border-vault-amber/5">
        <div className="p-4 bg-white/5 rounded-2xl">
          <Bell className="w-6 h-6 text-vault-amber/20" />
        </div>
        <div>
          <h4 className="text-[8px] uppercase tracking-terminal-wide text-vault-amber-secondary font-black opacity-40 mb-1">
            Active Quest
          </h4>
          <h3 className="text-xl font-black text-vault-amber/20 tracking-tighter uppercase">Start a quest to see details.</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel bg-vault-surface/40 p-4 rounded-3xl mb-10 flex flex-col gap-4 border-vault-amber/5">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <Calendar className="w-3 h-3 text-vault-amber-secondary" />
          <h4 className="text-[8px] uppercase tracking-terminal-wide text-vault-amber-secondary font-black">
            Active Quest: Next 72 Hours
          </h4>
        </div>
        <button 
          onClick={() => setActiveView('Entries')}
          className="text-[8px] font-black uppercase text-vault-amber/40 hover:text-vault-amber transition-all tracking-widest"
        >
          Expand Agenda
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {upcomingEvents.map((event, index) => (
          <div 
            key={event.id}
            className={`flex items-center gap-3 p-3 rounded-2xl transition-all border group ${
              index === 0 
                ? 'bg-vault-amber/5 border-vault-amber/20 shadow-vault-glow' 
                : 'bg-white/[0.01] border-transparent hover:bg-white/[0.02]'
            }`}
          >
            <div className={`w-0.5 h-6 rounded-full ${
              index === 0 ? 'bg-vault-amber shadow-vault-glow' : 'bg-vault-surface'
            }`} />
            
            <div className="flex-1 min-w-0">
              <h3 className={`text-[11px] font-black tracking-terminal truncate transition-colors ${
                index === 0 ? 'text-vault-amber vault-glow-text' : 'text-vault-amber-secondary group-hover:text-vault-amber'
              }`}>
                {event.title}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <Clock className="w-2.5 h-2.5 text-vault-amber/30" />
                <span className="text-[9px] text-vault-amber/40 font-bold uppercase tracking-tighter">
                  {formatEventTime(event.start_time)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
