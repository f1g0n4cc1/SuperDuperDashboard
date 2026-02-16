import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import { QUERY_KEYS } from '../lib/queryKeys';
import type { JournalEntry, UpdateJournalInput } from '../types/journal';
import { useAuth } from '../context/AuthContext';

export const useJournal = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 1. Fetch Today's Entry (or create one if it doesn't exist)
  const { data: todayEntry, isLoading } = useQuery({
    queryKey: QUERY_KEYS.journal,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        // Create initial entry for today if none exists
        const { data: newEntry, error: createError } = await supabase
          .from('journal_entries')
          .insert([{ user_id: user?.id, content: '', mood: 5 }])
          .select()
          .single();
          
        if (createError) throw createError;
        return newEntry as JournalEntry;
      }

      return data as JournalEntry;
    },
    enabled: !!user,
  });

  // 2. Update Mutation (The Auto-save Engine)
  const updateEntry = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateJournalInput }) => {
      const { data, error } = await supabase
        .from('journal_entries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as JournalEntry;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.journal, data);
    },
  });

  return {
    todayEntry,
    isLoading,
    updateEntry,
  };
};
