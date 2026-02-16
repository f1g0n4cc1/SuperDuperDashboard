import { supabase } from '../services/supabase';
import { type Project, type CreateProjectInput } from '../types/projects';

export const projectsApi = {
  async list() {
    const { data, error } = await supabase
      .from('project_summaries')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as any[]; // Type refinement happens in hook or types
  },

  async create(project: CreateProjectInput) {
    const { data, error } = await supabase
      .from('projects')
      .insert([project] as any)
      .select()
      .single();

    if (error) throw error;
    return data as Project;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};
