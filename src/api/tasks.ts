import { supabase } from '../services/supabase';
import { type Task, type CreateTaskInput, type UpdateTaskInput } from '../types/tasks';

export const tasksApi = {
  async list(projectId?: string, cursor?: string, pageSize = 20) {
    let query = supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(pageSize);

    if (cursor) {
      query = query.lt('created_at', cursor);
    }

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
      .insert(task as any)
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  async update(id: string, updates: UpdateTaskInput) {
    const { data, error } = await (supabase
      .from('tasks') as any)
      .update(updates as any)
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
