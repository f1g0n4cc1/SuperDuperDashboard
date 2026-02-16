import { useInfiniteQuery, useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { notesApi } from '../api/notes';
import { noteSchema } from '../lib/validation';
import type { Note, CreateNoteInput, UpdateNoteInput } from '../types/notes';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { logger } from '../lib/logger';

export const useNotes = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const QUERY_KEY = ['notes'];

  const { 
    data, 
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage 
  } = useInfiniteQuery<Note[], Error, InfiniteData<Note[], string | undefined>, string[], string | undefined>({
    queryKey: QUERY_KEY,
    queryFn: ({ pageParam }) => notesApi.list(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.length < 10 ? undefined : lastPage[lastPage.length - 1].created_at;
    },
    enabled: !!user,
  });

  const notes = data?.pages.flat() ?? [];

  const createNote = useMutation({
    mutationFn: (newNote: CreateNoteInput) => {
      const validated = noteSchema.safeParse(newNote);
      if (!validated.success) {
        throw new Error(validated.error.issues[0].message);
      }
      return notesApi.create(validated.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Note archived');
    },
    onError: (err: Error) => {
      logger.error('createNote failed', { error: err, user_id: user?.id });
      toast.error(err.message || 'Failed to save note');
    }
  });

  const updateNote = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: UpdateNoteInput }) => 
      notesApi.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (err: Error) => {
      logger.error('updateNote failed', { error: err, user_id: user?.id });
      toast.error('Failed to update note');
    }
  });

  const deleteNote = useMutation({
    mutationFn: (id: string) => notesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Note deleted');
    },
    onError: (err: Error) => {
      logger.error('deleteNote failed', { error: err, user_id: user?.id });
      toast.error('Failed to delete note');
    }
  });

  return { notes, isLoading, createNote, updateNote, deleteNote };
};
