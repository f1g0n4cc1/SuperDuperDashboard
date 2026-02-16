import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';

export const useCalendar = () => {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['calendar-events'],
    queryFn: async () => {
      // 1. Check if we have the provider token
      const providerToken = session?.provider_token;
      
      if (!providerToken) {
        return null; // Silent return, doesn't block UI
      }

      // 2. Fetch from Google Calendar API
      // Note: In production, you'd fetch from your own edge function 
      // or directly if scopes are granted.
      try {
        const response = await fetch(
          'https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=' + 
          new Date().toISOString() + '&maxResults=5&singleEvents=true&orderBy=startTime',
          {
            headers: { Authorization: `Bearer ${providerToken}` }
          }
        );
        
        if (response.status === 401 || response.status === 403) {
          console.warn('Calendar access denied or scope missing.');
          return null;
        }

        const data = await response.json();
        return data.items;
      } catch (err) {
        console.error('Calendar Fetch Error:', err);
        return null;
      }
    },
    enabled: !!session?.provider_token,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
