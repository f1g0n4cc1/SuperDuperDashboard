import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks';
import { QUERY_KEYS } from '../lib/queryKeys';
import { type Task, type CreateTaskInput, type UpdateTaskInput } from '../types/tasks';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export const useTasks = (projectId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = projectId ? [...QUERY_KEYS.tasks, { projectId }] : QUERY_KEYS.tasks;

  // 1. Fetch Tasks (Infinite Scroll Support)
  const { 
    data, 
    isLoading, 
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage 
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 0 }) => tasksApi.list(projectId, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length < 20 ? undefined : allPages.length;
    },
    enabled: !!user,
  });

  const tasks = data?.pages.flat() ?? [];

  // 2. Create Task Mutation
  const createTask = useMutation({
    mutationFn: (newTask: CreateTaskInput) => tasksApi.create(newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks });
      toast.success('Objective deployed');
    },
    onError: () => {
      toast.error('Failed to deploy objective. System offline?');
    }
  });

  // 3. Update Task (Optimistic UI)
  const updateTask = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateTaskInput }) => 
      tasksApi.update(id, updates),
    onMutate: async ({ id, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);

      // Optimistically update to the new value
      queryClient.setQueryData<Task[]>(queryKey, (old) =>
        old?.map((task) => (task.id === id ? { ...task, ...updates } : task))
      );

      return { previousTasks };
    },
    onError: (_err, _newTodo, context) => {
      // Rollback if mutation fails
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKey, context.previousTasks);
      }
      toast.error('Synchronization failure. Changes reverted.');
    },
    onSettled: () => {
      // Always refetch after error or success to synchronize
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
  };
};
