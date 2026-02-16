import { supabase } from '../services/supabase';

export const statsApi = {
  async getRawData() {
    const [tasksRes, journalsRes] = await Promise.all([
      supabase.from('tasks').select('status, priority, created_at'),
      supabase.from('journal_entries').select('created_at').order('created_at', { ascending: false })
    ]);

    if (tasksRes.error) throw tasksRes.error;
    if (journalsRes.error) throw journalsRes.error;

    return {
      tasks: tasksRes.data,
      journals: journalsRes.data
    };
  }
};
