import { supabase } from '../services/supabase';
import { type Note, type CreateNoteInput, type UpdateNoteInput } from '../types/notes';

export const notesApi = {
  async list(cursor?: string, pageSize = 10) {
    let query = supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(pageSize);

    if (cursor) {
      query = query.lt('created_at', cursor);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Note[];
  },

  async create(note: CreateNoteInput) {
    const { data, error } = await supabase
      .from('notes')
      .insert([note] as any)
      .select()
      .single();

    if (error) throw error;
    return data as Note;
  },

  async update(id: string, updates: UpdateNoteInput) {
    const { data, error } = await supabase
      .from('notes')
      .update({ ...updates, updated_at: new Date().toISOString() } as any)
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
