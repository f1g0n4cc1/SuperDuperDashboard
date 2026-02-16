import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { journalApi } from '../api/journal';
import { QUERY_KEYS } from '../lib/queryKeys';
import { journalSchema } from '../lib/validation';
import type { UpdateJournalInput } from '../types/journal';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export const useJournal = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 1. Fetch Today's Entry (handled server-side via RPC)
  const { data: todayEntry, isLoading } = useQuery({
    queryKey: QUERY_KEYS.journal,
    queryFn: () => journalApi.getTodayEntry(),
    enabled: !!user,
  });

  // 2. Update Mutation (The Auto-save Engine)
  const updateEntry = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateJournalInput }) => {
      const validated = journalSchema.partial().safeParse(updates);
      if (!validated.success) {
        throw new Error(validated.error.issues[0].message);
      }
      return journalApi.update(id, validated.data);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.journal, data);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to autosave journal entry');
    }
  });

  return {
    todayEntry,
    isLoading,
    updateEntry,
  };
};
