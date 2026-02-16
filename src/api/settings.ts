import { supabase } from '../services/supabase';
import { type UserSettings, type DashboardLayout } from '../types/settings';

export const settingsApi = {
  async get() {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as UserSettings | null;
  },

  async update(layout: DashboardLayout) {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert({ 
        dashboard_layout: layout,
        updated_at: new Date().toISOString() 
      })
      .select()
      .single();

    if (error) throw error;
    return data as UserSettings;
  }
};
