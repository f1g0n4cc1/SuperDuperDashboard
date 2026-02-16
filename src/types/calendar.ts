export interface CalendarEvent {
  id: string;
  user_id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  is_external: boolean;
  external_id?: string;
  created_at: string;
}

export type CreateCalendarEventInput = Pick<CalendarEvent, 'title' | 'description' | 'start_time' | 'end_time' | 'is_external' | 'external_id'>;
