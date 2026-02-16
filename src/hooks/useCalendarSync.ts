import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { calendarApi } from '../api/calendar';
import type { CreateCalendarEventInput } from '../types/calendar';
import { useAuth } from '../context/AuthContext';
import { useCalendar } from './useCalendar';
import { toast } from 'sonner';

export const useCalendarSync = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: googleEvents, isLoading: googleLoading } = useCalendar();
  const QUERY_KEY = ['calendar-sync'];

  const { data: localEvents = [], isLoading: localLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => calendarApi.list(),
    enabled: !!user,
  });

  const createEvent = useMutation({
    mutationFn: (newEvent: CreateCalendarEventInput) => calendarApi.create(newEvent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Event scheduled');
    },
    onError: () => toast.error('Failed to schedule event')
  });

  const deleteEvent = useMutation({
    mutationFn: (id: string) => calendarApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Event cancelled');
    },
    onError: () => toast.error('Failed to cancel event')
  });

  // Merge local and google events
  const allEvents = [
    ...localEvents,
    ...(googleEvents?.map((ge: any) => ({
      id: ge.id,
      user_id: user?.id || '',
      title: ge.summary,
      description: ge.description || '',
      start_time: ge.start.dateTime || ge.start.date,
      end_time: ge.end.dateTime || ge.end.date,
      is_external: true,
      external_id: ge.id,
      created_at: ge.created
    })) || [])
  ].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  return { 
    events: allEvents, 
    isLoading: localLoading || googleLoading, 
    createEvent,
    deleteEvent
  };
};
