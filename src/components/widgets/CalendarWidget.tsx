import React, { useState } from 'react';
import { useCalendarSync } from '../../hooks/useCalendarSync';
import { Calendar as CalendarIcon, Clock, Loader2, ExternalLink, Plus, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const CalendarWidget: React.FC = () => {
  const { events, isLoading, createEvent, deleteEvent } = useCalendarSync();
  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: ''
  });

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.start_time || !newEvent.end_time) {
      toast.error('Please fill in all required fields');
      return;
    }

    createEvent.mutate({
      ...newEvent,
      is_external: false
    }, {
      onSuccess: () => {
        setIsAdding(false);
        setNewEvent({ title: '', description: '', start_time: '', end_time: '' });
        toast.success('Strategic engagement scheduled');
      },
      onError: () => {
        toast.error('Failed to schedule engagement');
      }
    });
  };

  const handleCancelEvent = (id: string) => {
    if (confirm('Abort this engagement? All tactical data for this slot will be purged.')) {
      deleteEvent.mutate(id);
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto h-full flex flex-col">
      <header className="mb-10 flex justify-between items-end px-2">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Tactical Agenda</h2>
          <p className="text-batcave-text-secondary italic">"Time is your most valuable asset. Master the schedule."</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`p-3 rounded-2xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.1)] ${
            isAdding ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-batcave-blue/10 text-batcave-blue hover:bg-batcave-blue hover:text-white'
          }`}
        >
          {isAdding ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </button>
      </header>

      <div className="flex-1 glass-panel rounded-3xl p-8 flex flex-col overflow-hidden relative">
        {isAdding ? (
          <form onSubmit={handleAddEvent} className="animate-in fade-in zoom-in-95 duration-300 space-y-6 max-w-lg mx-auto w-full py-10">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-black text-batcave-text-secondary">Operation Name</label>
              <input
                autoFocus
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Briefing Title..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-batcave-blue transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-batcave-text-secondary">Commencement</label>
                <input
                  type="datetime-local"
                  value={newEvent.start_time}
                  onChange={(e) => setNewEvent({ ...newEvent, start_time: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-batcave-blue transition-all [color-scheme:dark]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-batcave-text-secondary">Conclusion</label>
                <input
                  type="datetime-local"
                  value={newEvent.end_time}
                  onChange={(e) => setNewEvent({ ...newEvent, end_time: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-batcave-blue transition-all [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-black text-batcave-text-secondary">Tactical Intel</label>
              <textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Additional details..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-batcave-blue transition-all resize-none h-32"
              />
            </div>

            <button 
              type="submit"
              disabled={createEvent.isPending}
              className="w-full py-4 bg-batcave-blue text-white font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] disabled:opacity-50"
            >
              {createEvent.isPending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Authorize Engagement'}
            </button>
          </form>
        ) : (
          <>
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
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-white group-hover:text-batcave-blue transition-colors truncate">
                          {event.title}
                        </h3>
                        {event.is_external && (
                          <span className="px-2 py-0.5 bg-batcave-blue/10 text-batcave-blue text-[8px] font-black uppercase rounded-md tracking-tighter shrink-0">Google Sync</span>
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

                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!event.is_external && (
                        <button 
                          onClick={() => handleCancelEvent(event.id)}
                          className="p-2 text-gray-700 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      {event.is_external && (
                        <ExternalLink className="w-4 h-4 text-gray-800 hover:text-white transition-colors cursor-pointer" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
