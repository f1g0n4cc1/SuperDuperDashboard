import { supabase } from '../services/supabase';
import { type Project, type CreateProjectInput } from '../types/projects';

export const projectsApi = {
  async list() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as Project[];
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
