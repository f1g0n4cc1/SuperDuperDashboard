import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { journalApi } from '../api/journal';
import { QUERY_KEYS } from '../lib/queryKeys';
import type { JournalEntry, UpdateJournalInput } from '../types/journal';
import { useAuth } from '../context/AuthContext';

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
    mutationFn: ({ id, updates }: { id: string; updates: UpdateJournalInput }) => 
      journalApi.update(id, updates),
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
