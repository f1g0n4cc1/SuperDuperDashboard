import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { habitsApi } from '../api/habits';
import { habitSchema } from '../lib/validation';
import type { Habit, HabitLog, HabitWithLogs, CreateHabitInput } from '../types/habits';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export const useHabits = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const QUERY_KEY = ['habits'];

  // Fetch habits and their logs for the last 90 days (for the grid)
  const { data: habits = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      // 1. Fetch Habits and recent Logs in parallel
      const [habitsData, logsData] = await Promise.all([
        habitsApi.list(),
        habitsApi.listLogs(30)
      ]);

      // 2. Fetch stats for each habit (to get streaks)
      const habitsWithStats = await Promise.all(
        (habitsData as Habit[]).map(async (habit) => {
          const stats = await habitsApi.getStats(habit.id) as any;
          return {
            ...habit,
            current_streak: stats?.current_streak ?? 0,
            total_completions: stats?.total_completions ?? 0,
            last_completed_at: stats?.last_completed_at ?? null,
            logs: (logsData as HabitLog[]).filter(log => log.habit_id === habit.id)
          };
        })
      );

      return habitsWithStats as HabitWithLogs[];
    },
    enabled: !!user,
  });

  const createHabit = useMutation({
    mutationFn: (newHabit: CreateHabitInput) => {
      const validated = habitSchema.safeParse(newHabit);
      if (!validated.success) {
        throw new Error(validated.error.issues[0].message);
      }
      return habitsApi.create({
        ...validated.data,
        color: validated.data.color ?? undefined
      } as CreateHabitInput);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Habit initialized');
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to create habit')
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
      toast.error('Sync failure. Habit log reverted.');
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  return { habits, isLoading, createHabit, toggleHabit };
};
