import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesApi } from '../api/notes';
import type { Note, CreateNoteInput, UpdateNoteInput } from '../types/notes';
import { useAuth } from '../context/AuthContext';

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
      return lastPage.length === 10 ? allPages.length : undefined;
    },
    enabled: !!user,
  });

  const notes = data?.pages.flat() ?? [];

  const createNote = useMutation({
    mutationFn: (newNote: CreateNoteInput) => notesApi.create(newNote),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const updateNote = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: UpdateNoteInput }) => 
      notesApi.update(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const deleteNote = useMutation({
    mutationFn: (id: string) => notesApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  return { notes, isLoading, createNote, updateNote, deleteNote };
};
