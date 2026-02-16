import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { habitsApi } from '../api/habits';
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
      // 1. Fetch Habits and Logs in parallel
      const [habitsData, logsData] = await Promise.all([
        habitsApi.list(),
        habitsApi.listLogs()
      ]);

      // 2. Fetch stats for each habit (to get streaks)
      const habitsWithStats = await Promise.all(
        (habitsData as Habit[]).map(async (habit) => {
          const stats = await habitsApi.getStats(habit.id);
          return {
            ...habit,
            ...stats,
            logs: (logsData as HabitLog[]).filter(log => log.habit_id === habit.id)
          };
        })
      );

      return habitsWithStats as HabitWithLogs[];
    },
    enabled: !!user,
  });

  const createHabit = useMutation({
    mutationFn: (newHabit: CreateHabitInput) => habitsApi.create(newHabit),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const toggleHabit = useMutation({
    mutationFn: async ({ habitId, completedAt, isCompleted }: { habitId: string, completedAt: string, isCompleted: boolean }) => {
      if (isCompleted) {
        await habitsApi.removeLog(habitId, completedAt);
      } else {
        await habitsApi.addLog(habitId, completedAt);
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
