import { supabase } from '../services/supabase';
import { type Note, type CreateNoteInput, type UpdateNoteInput } from '../types/notes';

export const notesApi = {
  async list(page = 0, pageSize = 10) {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return data as Note[];
  },

  async create(note: CreateNoteInput) {
    const { data, error } = await supabase
      .from('notes')
      .insert([note])
      .select()
      .single();

    if (error) throw error;
    return data as Note;
  },

  async update(id: string, updates: UpdateNoteInput) {
    const { data, error } = await supabase
      .from('notes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Note;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};
