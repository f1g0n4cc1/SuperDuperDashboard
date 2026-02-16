import React from 'react';
import { Bell, Clock, MapPin, ExternalLink, Loader2 } from 'lucide-react';
import { useCalendarSync } from '../../hooks/useCalendarSync';

export const EventBanner: React.FC = () => {
  const { events, isLoading } = useCalendarSync();

  // Find the next event that hasn't ended yet
  const now = new Date();
  const upcomingEvent = events.find(event => new Date(event.end_time) > now);

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

  if (!upcomingEvent) {
    return (
      <div className="glass-panel bg-batcave-panel/40 p-6 rounded-3xl mb-8 flex items-center gap-6 group">
        <div className="p-4 bg-white/5 rounded-2xl">
          <Bell className="w-6 h-6 text-gray-600" />
        </div>
        <div>
          <h4 className="text-[10px] uppercase tracking-[0.2em] text-batcave-text-secondary font-bold mb-1">
            Tactical Status
          </h4>
          <h3 className="text-xl font-bold text-gray-500 tracking-tight">No upcoming engagements scheduled.</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel bg-batcave-panel/40 p-6 rounded-3xl mb-8 flex flex-col md:flex-row md:items-center gap-6 group">
      {/* Icon Section */}
      <div className="flex items-center gap-4">
        <div className="p-4 bg-batcave-yellow/10 rounded-2xl">
          <Bell className="w-6 h-6 text-batcave-yellow drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
        </div>
        <div>
          <h4 className="text-[10px] uppercase tracking-[0.2em] text-batcave-text-secondary font-bold mb-1">
            Upcoming Engagement
          </h4>
          <h3 className="text-xl font-bold text-white tracking-tight">{upcomingEvent.title}</h3>
        </div>
      </div>

      {/* Details Section */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 md:pl-8 md:border-l border-white/5">
        <div className="flex items-center text-batcave-text-secondary text-sm">
          <Clock className="w-4 h-4 mr-2 text-batcave-blue" />
          <span>{formatEventTime(upcomingEvent.start_time)}</span>
        </div>
        
        {upcomingEvent.is_external && (
          <div className="flex items-center text-batcave-blue/80 text-[10px] font-bold uppercase bg-batcave-blue/5 px-3 py-1 rounded-full w-fit">
            <span className="mr-2">🔄</span>
            Satellite Sync
          </div>
        )}

        {upcomingEvent.description && (
          <div className="flex items-center text-batcave-text-secondary text-xs truncate max-w-xs">
            <span className="mr-2">📝</span>
            {upcomingEvent.description}
          </div>
        )}
      </div>

      {/* Action Section */}
      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-500 hover:text-white">
          <ExternalLink className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
