import { supabase } from '../services/supabase';
import { type JournalEntry, type UpdateJournalInput } from '../types/journal';

export const journalApi = {
  async getTodayEntry() {
    const { data, error } = await supabase
      .rpc('get_or_create_daily_journal')
      .single();

    if (error) throw error;
    return data as JournalEntry;
  },

  async update(id: string, updates: UpdateJournalInput) {
    const { data, error } = await supabase
      .from('journal_entries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as JournalEntry;
  }
};
