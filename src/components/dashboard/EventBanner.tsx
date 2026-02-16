import React from 'react';
import { Bell, Clock, MapPin, ExternalLink } from 'lucide-react';

interface Event {
  title: string;
  time: string;
  location?: string;
  note?: string;
  color?: string;
}

export const EventBanner: React.FC = () => {
  // Mock data for initial polish - will be hooked to useCalendar later
  const upcomingEvent: Event = {
    title: 'Badminton',
    time: '6:00 PM - Tomorrow',
    location: 'NBC',
    note: 'Leave by 5:30 PM',
    color: '#eab308'
  };

  return (
    <div className="glass-panel bg-batcave-panel/40 p-6 rounded-3xl mb-8 flex flex-col md:flex-row md:items-center gap-6 group">
      {/* Icon Section */}
      <div className="flex items-center gap-4">
        <div className="p-4 bg-batcave-yellow/10 rounded-2xl">
          <Bell className="w-6 h-6 text-batcave-yellow drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
        </div>
        <div>
          <h4 className="text-[10px] uppercase tracking-[0.2em] text-batcave-text-secondary font-bold mb-1">
            Upcoming Events
          </h4>
          <h3 className="text-xl font-bold text-white tracking-tight">{upcomingEvent.title}</h3>
        </div>
      </div>

      {/* Details Section */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 md:pl-8 md:border-l border-white/5">
        <div className="flex items-center text-batcave-text-secondary text-sm">
          <Clock className="w-4 h-4 mr-2 text-batcave-blue" />
          <span>{upcomingEvent.time}</span>
        </div>
        
        {upcomingEvent.location && (
          <div className="flex items-center text-batcave-text-secondary text-sm">
            <MapPin className="w-4 h-4 mr-2 text-batcave-blue" />
            <span>{upcomingEvent.location}</span>
          </div>
        )}

        {upcomingEvent.note && (
          <div className="flex items-center text-batcave-yellow/80 text-xs font-medium bg-batcave-yellow/5 px-3 py-1 rounded-full w-fit">
            <span className="mr-2">⚡</span>
            {upcomingEvent.note}
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
