import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesApi } from '../api/notes';
import { noteSchema } from '../lib/validation';
import type { Note, CreateNoteInput, UpdateNoteInput } from '../types/notes';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

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
  } = useInfiniteQuery({
    queryKey: QUERY_KEY,
    queryFn: ({ pageParam = 0 }) => notesApi.list(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length < 10 ? undefined : allPages.length;
    },
    enabled: !!user,
  });

  const notes = data?.pages.flat() ?? [];

  const createNote = useMutation({
    mutationFn: (newNote: CreateNoteInput) => {
      const validated = noteSchema.safeParse(newNote);
      if (!validated.success) {
        throw new Error(validated.error.errors[0].message);
      }
      return notesApi.create(validated.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Note archived');
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to save note')
  });

  const updateNote = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: UpdateNoteInput }) => 
      notesApi.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: () => toast.error('Failed to update note')
  });

  const deleteNote = useMutation({
    mutationFn: (id: string) => notesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Note deleted');
    },
    onError: () => toast.error('Failed to delete note')
  });

  return { notes, isLoading, createNote, updateNote, deleteNote };
};
