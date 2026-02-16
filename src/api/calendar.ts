import { supabase } from '../services/supabase';
import { type CalendarEvent, type CreateCalendarEventInput } from '../types/calendar';

export const calendarApi = {
  async list() {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data as CalendarEvent[];
  },

  async create(event: CreateCalendarEventInput) {
    const { data, error } = await supabase
      .from('calendar_events')
      .insert([event])
      .select()
      .single();

    if (error) throw error;
    return data as CalendarEvent;
  }
};
