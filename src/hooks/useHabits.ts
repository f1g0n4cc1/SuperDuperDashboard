import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import type { Habit, HabitLog, HabitWithLogs, CreateHabitInput } from '../types/habits';
import { useAuth } from '../context/AuthContext';

export const useHabits = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const QUERY_KEY = ['habits'];

  // Fetch habits and their logs for the last 90 days (for the grid)
  const { data: habits = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      // 1. Fetch Habits
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .order('created_at', { ascending: true });

      if (habitsError) throw habitsError;

      // 2. Fetch Logs (simplified join logic for demo/starter)
      const { data: logsData, error: logsError } = await supabase
        .from('habit_logs')
        .select('*');

      if (logsError) throw logsError;

      // 3. Map logs to habits
      return (habitsData as Habit[]).map(habit => ({
        ...habit,
        logs: (logsData as HabitLog[]).filter(log => log.habit_id === habit.id)
      })) as HabitWithLogs[];
    },
    enabled: !!user,
  });

  const createHabit = useMutation({
    mutationFn: async (newHabit: CreateHabitInput) => {
      const { data, error } = await supabase
        .from('habits')
        .insert([newHabit])
        .select()
        .single();

      if (error) throw error;
      return data as Habit;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const toggleHabit = useMutation({
    mutationFn: async ({ habitId, completedAt, isCompleted }: { habitId: string, completedAt: string, isCompleted: boolean }) => {
      if (isCompleted) {
        // Remove log
        const { error } = await supabase
          .from('habit_logs')
          .delete()
          .eq('habit_id', habitId)
          .eq('completed_at', completedAt);
        if (error) throw error;
      } else {
        // Add log
        const { error } = await supabase
          .from('habit_logs')
          .insert([{ habit_id: habitId, completed_at: completedAt }]);
        if (error) throw error;
      }
    },
    onMutate: async ({ habitId, completedAt, isCompleted }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      const previousHabits = queryClient.getQueryData<HabitWithLogs[]>(QUERY_KEY);

      queryClient.setQueryData<HabitWithLogs[]>(QUERY_KEY, (old) => 
        old?.map(habit => {
          if (habit.id === habitId) {
            return {
              ...habit,
              logs: isCompleted 
                ? habit.logs.filter(l => l.completed_at !== completedAt)
                : [...habit.logs, { id: 'temp', habit_id: habitId, completed_at: completedAt, created_at: '' }]
            };
          }
          return habit;
        })
      );

      return { previousHabits };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData(QUERY_KEY, context.previousHabits);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  return { habits, isLoading, createHabit, toggleHabit };
};
