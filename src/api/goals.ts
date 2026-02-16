import { supabase } from '../services/supabase';
import { type Goal, type CreateGoalInput, type UpdateGoalInput } from '../types/goals';

export const goalsApi = {
  async list() {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Goal[];
  },

  async create(goal: CreateGoalInput) {
    const { data, error } = await supabase
      .from('goals')
      .insert([goal] as any)
      .select()
      .single();

    if (error) throw error;
    return data as Goal;
  },

  async update(id: string, updates: UpdateGoalInput) {
    const { data, error } = await supabase
      .from('goals')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Goal;
  }
};
