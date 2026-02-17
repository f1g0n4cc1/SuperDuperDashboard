import { useInfiniteQuery, useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks';
import { QUERY_KEYS } from '../lib/queryKeys';
import { taskSchema } from '../lib/validation';
import { type Task, type CreateTaskInput, type UpdateTaskInput } from '../types/tasks';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { logger } from '../lib/logger';

export const useTasks = (projectId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = projectId ? (['tasks', { projectId }] as const) : (['tasks'] as const);

  // 1. Fetch Tasks (Infinite Scroll Support)
  const { 
    data, 
    isLoading, 
    error
  } = useInfiniteQuery<Task[], Error, InfiniteData<Task[], string | undefined>, any, string | undefined>({
    queryKey,
    queryFn: ({ pageParam }) => tasksApi.list(projectId, pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.length < 20 ? undefined : lastPage[lastPage.length - 1].created_at;
    },
    enabled: !!user,
  });

  const tasks = data?.pages.flat() ?? [];

  // 2. Create Task Mutation
  const createTask = useMutation({
    mutationFn: (newTask: CreateTaskInput) => {
      const validated = taskSchema.safeParse(newTask);
      if (!validated.success) {
        throw new Error(validated.error.issues[0].message);
      }
      return tasksApi.create({
        ...validated.data,
        project_id: validated.data.project_id ?? undefined
      } as CreateTaskInput);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks });
      toast.success('Objective deployed');
    },
    onError: (err: Error) => {
      logger.error('createTask failed', { error: err, user_id: user?.id });
      toast.error(err.message || 'Failed to deploy objective');
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
      const previousData = queryClient.getQueryData<InfiniteData<Task[], string | undefined>>(queryKey);

      // Optimistically update to the new value
      queryClient.setQueryData<InfiniteData<Task[], string | undefined>>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map(page => 
            page.map(task => task.id === id ? { ...task, ...updates } : task)
          )
        };
      });

      return { previousData };
    },
    onError: (err, _vars, context) => {
      // Rollback if mutation fails
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      logger.error('updateTask failed', { error: err, context: 'Optimistic Rollback', user_id: user?.id });
      toast.error('Synchronization failure. Changes reverted.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteTask = useMutation({
    mutationFn: (id: string) => tasksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Objective terminated');
    },
    onError: () => toast.error('Failed to terminate objective')
  });

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask
  };
};
