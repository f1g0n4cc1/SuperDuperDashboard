export interface ProductivityStats {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  tasksByPriority: {
    high: number;
    medium: number;
    low: number;
  };
  journalStreak: number;
  recentActivity: {
    date: string;
    count: number;
  }[];
}
