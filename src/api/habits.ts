import { supabase } from '../services/supabase';
import { type Habit, type HabitLog, type CreateHabitInput } from '../types/habits';

export const habitsApi = {
  async list() {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as Habit[];
  },

  async listLogs(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('habit_logs')
      .select('*')
      .gte('completed_at', startDate.toISOString().split('T')[0]);

    if (error) throw error;
    return data as HabitLog[];
  },

  async create(habit: CreateHabitInput) {
    const { data, error } = await supabase
      .from('habits')
      .insert([habit] as any)
      .select()
      .single();

    if (error) throw error;
    return data as Habit;
  },

  async addLog(habitId: string, completedAt: string) {
    const { error } = await (supabase
      .from('habit_logs') as any)
      .insert([{ habit_id: habitId, completed_at: completedAt } as any]);
    if (error) throw error;
  },

  async removeLog(habitId: string, completedAt: string) {
    const { error } = await supabase
      .from('habit_logs')
      .delete()
      .eq('habit_id', habitId)
      .eq('completed_at', completedAt);
    if (error) throw error;
  },

  async getStats(habitId: string) {
    const { data, error } = await supabase
      .rpc('get_habit_stats', { target_habit_id: habitId } as any)
      .single();

    if (error) throw error;
    return data;
  }
};
