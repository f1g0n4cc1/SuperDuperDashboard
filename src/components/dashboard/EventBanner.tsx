import React from 'react';
import { Bell, Clock, ExternalLink, Loader2, Calendar } from 'lucide-react';
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
      <div className="glass-panel bg-batcave-panel/40 p-6 rounded-3xl mb-8 flex items-center justify-center h-24">
        <Loader2 className="w-6 h-6 animate-spin text-batcave-blue" />
      </div>
    );
  }

  if (upcomingEvents.length === 0) {
    return (
      <div className="glass-panel bg-batcave-panel/40 p-6 rounded-3xl mb-8 flex items-center gap-6 group">
        <div className="p-4 bg-white/5 rounded-2xl">
          <Bell className="w-6 h-6 text-gray-600" />
        </div>
        <div>
          <h4 className="text-[10px] uppercase tracking-[0.2em] text-batcave-text-secondary font-bold mb-1">
            Active Quest
          </h4>
          <h3 className="text-xl font-bold text-gray-500 tracking-tight">Start a quest to see details.</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel bg-batcave-panel/40 p-6 rounded-3xl mb-8 flex flex-col gap-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-batcave-yellow/10 rounded-lg">
            <Calendar className="w-4 h-4 text-batcave-yellow" />
          </div>
          <h4 className="text-[10px] uppercase tracking-[0.2em] text-batcave-text-secondary font-black">
            Strategic Engagements: Next 72 Hours
          </h4>
        </div>
        <button 
          onClick={() => setActiveView('Calendar')}
          className="text-[10px] font-black uppercase text-batcave-blue hover:text-white transition-all tracking-widest"
        >
          View Full Agenda
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {upcomingEvents.map((event, index) => (
          <div 
            key={event.id}
            className={`flex items-center gap-4 p-4 rounded-2xl transition-all border group ${
              index === 0 
                ? 'bg-white/5 border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.02)]' 
                : 'bg-white/[0.02] border-transparent hover:bg-white/[0.04]'
            }`}
          >
            <div className={`w-1 h-8 rounded-full ${
              index === 0 ? 'bg-batcave-yellow shadow-[0_0_10px_#eab308]' : 'bg-gray-800'
            }`} />
            
            <div className="flex-1 min-w-0">
              <h3 className={`text-sm font-bold truncate transition-colors ${
                index === 0 ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
              }`}>
                {event.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-3 h-3 text-batcave-blue" />
                <span className="text-[10px] text-batcave-text-secondary font-medium">
                  {formatEventTime(event.start_time)}
                </span>
              </div>
            </div>

            {event.is_external && (
              <div className="p-1.5 bg-batcave-blue/10 rounded-lg">
                <ExternalLink className="w-3 h-3 text-batcave-blue" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
