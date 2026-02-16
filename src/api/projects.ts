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
      .insert([project])
      .select()
      .single();

    if (error) throw error;
    return data as Project;
  }
};
