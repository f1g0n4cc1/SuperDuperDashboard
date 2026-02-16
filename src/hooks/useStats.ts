import { useQuery } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import { QUERY_KEYS } from '../lib/queryKeys';
import type { ProductivityStats } from '../types/stats';
import { useAuth } from '../context/AuthContext';

export const useStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: QUERY_KEYS.stats,
    queryFn: async () => {
      // 1. Fetch Tasks for aggregation
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('status, priority, created_at');

      if (tasksError) throw tasksError;

      // 2. Fetch Journal entries for streak
      const { data: journals, error: journalsError } = await supabase
        .from('journal_entries')
        .select('created_at')
        .order('created_at', { ascending: false });

      if (journalsError) throw journalsError;

      // Aggregation Logic
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.status === 'done').length;
      
      const stats: ProductivityStats = {
        totalTasks,
        completedTasks,
        completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
        tasksByPriority: {
          high: tasks.filter(t => t.priority >= 3).length,
          medium: tasks.filter(t => t.priority === 2).length,
          low: tasks.filter(t => t.priority <= 1).length,
        },
        journalStreak: journals.length > 0 ? 1 : 0, // Simplified streak for now
        recentActivity: Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          return {
            date: dateStr,
            count: tasks.filter(t => t.created_at.startsWith(dateStr)).length
          };
        }).reverse()
      };

      return stats;
    },
    enabled: !!user,
  });
};
