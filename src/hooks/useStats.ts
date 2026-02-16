import { useQuery } from '@tanstack/react-query';
import { statsApi } from '../api/stats';
import { QUERY_KEYS } from '../lib/queryKeys';
import type { ProductivityStats } from '../types/stats';
import { useAuth } from '../context/AuthContext';

export const useStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: QUERY_KEYS.stats,
    queryFn: async () => {
      const { tasks, journals } = await statsApi.getRawData();

      // Aggregation Logic (To be moved to server in Phase 2)
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((t: any) => t.status === 'done').length;
      
      const stats: ProductivityStats = {
        totalTasks,
        completedTasks,
        completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
        tasksByPriority: {
          high: tasks.filter((t: any) => t.priority >= 3).length,
          medium: tasks.filter((t: any) => t.priority === 2).length,
          low: tasks.filter((t: any) => t.priority <= 1).length,
        },
        journalStreak: journals.length > 0 ? 1 : 0, // Simplified streak for now
        recentActivity: Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          return {
            date: dateStr,
            count: tasks.filter((t: any) => t.created_at.startsWith(dateStr)).length
          };
        }).reverse()
      };

      return stats;
    },
    enabled: !!user,
  });
};
