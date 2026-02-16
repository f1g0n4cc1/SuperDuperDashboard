import React from 'react';
import { useCalendarSync } from '../../hooks/useCalendarSync';
import { Calendar as CalendarIcon, Clock, Loader2, ExternalLink, Plus } from 'lucide-react';

export const CalendarWidget: React.FC = () => {
  const { events, isLoading } = useCalendarSync();

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto h-[75vh] flex flex-col">
      <header className="mb-10 flex justify-between items-end px-2">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Tactical Agenda</h2>
          <p className="text-batcave-text-secondary italic">"Time is your most valuable asset. Master the schedule."</p>
        </div>
        <button 
          className="p-3 bg-batcave-blue/10 text-batcave-blue rounded-2xl hover:bg-batcave-blue hover:text-white transition-all shadow-[0_0_15px_rgba(59,130,246,0.1)]"
        >
          <Plus className="w-5 h-5" />
        </button>
      </header>

      <div className="flex-1 glass-panel rounded-3xl p-8 flex flex-col overflow-hidden">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-batcave-blue" />
          </div>
        ) : events.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20">
            <CalendarIcon className="w-20 h-20 mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest">No strategic engagements scheduled</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
            {events.map((event) => (
              <div key={event.id} className="glass-panel p-6 rounded-3xl group flex items-start gap-6 hover:border-batcave-blue/30 transition-all">
                <div className="flex flex-col items-center min-w-[60px] pt-1">
                  <span className="text-[10px] font-bold text-batcave-blue uppercase tracking-widest mb-1">
                    {new Date(event.start_time).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="text-xl font-black text-white">
                    {new Date(event.start_time).getDate()}
                  </span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-batcave-blue transition-colors">
                      {event.title}
                    </h3>
                    {event.is_external && (
                      <span className="px-2 py-0.5 bg-batcave-blue/10 text-batcave-blue text-[8px] font-black uppercase rounded-md tracking-tighter">Google Sync</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-batcave-text-secondary">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(event.start_time)} - {formatTime(event.end_time)}
                    </div>
                  </div>
                  {event.description && (
                    <p className="mt-2 text-[11px] text-gray-600 line-clamp-2">{event.description}</p>
                  )}
                </div>

                {event.is_external && (
                  <ExternalLink className="w-4 h-4 text-gray-800 hover:text-white transition-colors cursor-pointer" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
