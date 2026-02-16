import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import { QUERY_KEYS } from '../lib/queryKeys';
import { type Task, type CreateTaskInput, type UpdateTaskInput } from '../types/tasks';
import { useAuth } from '../context/AuthContext';

export const useTasks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 1. Fetch Tasks
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.tasks,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Task[];
    },
    enabled: !!user,
  });

  // 2. Create Task Mutation
  const createTask = useMutation({
    mutationFn: async (newTask: CreateTaskInput) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...newTask, user_id: user?.id }])
        .select()
        .single();

      if (error) throw error;
      return data as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks });
    },
  });

  // 3. Update Task (Optimistic UI)
  const updateTask = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateTaskInput }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Task;
    },
    onMutate: async ({ id, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.tasks });

      // Snapshot previous value
      const previousTasks = queryClient.getQueryData<Task[]>(QUERY_KEYS.tasks);

      // Optimistically update to the new value
      queryClient.setQueryData<Task[]>(QUERY_KEYS.tasks, (old) =>
        old?.map((task) => (task.id === id ? { ...task, ...updates } : task))
      );

      return { previousTasks };
    },
    onError: (_err, _newTodo, context) => {
      // Rollback if mutation fails
      if (context?.previousTasks) {
        queryClient.setQueryData(QUERY_KEYS.tasks, context.previousTasks);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to synchronize
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks });
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
