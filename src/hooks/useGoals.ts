import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalsApi } from '../api/goals';
import type { Goal, CreateGoalInput, UpdateGoalInput } from '../types/goals';
import { useAuth } from '../context/AuthContext';

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
    mutationFn: (newGoal: CreateGoalInput) => goalsApi.create(newGoal),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const updateGoal = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: UpdateGoalInput }) => 
      goalsApi.update(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  return { goals, isLoading, createGoal, updateGoal };
};
