import { supabase } from '../services/supabase';
import { type Task, type CreateTaskInput, type UpdateTaskInput } from '../types/tasks';

export const tasksApi = {
  async list(projectId?: string, page = 0, pageSize = 20) {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Task[];
  },

  async create(task: CreateTaskInput) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  async update(id: string, updates: UpdateTaskInput) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};
