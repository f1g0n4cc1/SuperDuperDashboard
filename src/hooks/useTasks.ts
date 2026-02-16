import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks';
import { QUERY_KEYS } from '../lib/queryKeys';
import { type Task, type CreateTaskInput, type UpdateTaskInput } from '../types/tasks';
import { useAuth } from '../context/AuthContext';

export const useTasks = (projectId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = projectId ? [...QUERY_KEYS.tasks, { projectId }] : QUERY_KEYS.tasks;

  // 1. Fetch Tasks
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey,
    queryFn: () => tasksApi.list(projectId),
    enabled: !!user,
  });

  // 2. Create Task Mutation
  const createTask = useMutation({
    mutationFn: (newTask: CreateTaskInput) => tasksApi.create(newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks });
    },
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
