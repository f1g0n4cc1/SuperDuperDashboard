import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalsApi } from '../api/goals';
import type { CreateGoalInput, UpdateGoalInput } from '../types/goals';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export const useGoals = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const QUERY_KEY = ['goals'];

  const { data: goals = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => goalsApi.list(),
    enabled: !!user,
  });

  const createGoal = useMutation({
    mutationFn: (newGoal: CreateGoalInput) => {
      // Basic validation for goals (title)
      if (!newGoal.title || newGoal.title.length > 255) {
        throw new Error("Invalid title length");
      }
      return goalsApi.create(newGoal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Objective established');
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to establish objective')
  });

  const updateGoal = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: UpdateGoalInput }) => 
      goalsApi.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: () => toast.error('Failed to update objective')
  });

  return { goals, isLoading, createGoal, updateGoal };
};
