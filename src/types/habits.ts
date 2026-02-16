export interface Habit {
  id: string;
  user_id: string;
  name: string;
  color: string;
  frequency: string;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  completed_at: string; // ISO Date string (YYYY-MM-DD)
  created_at: string;
}

export interface HabitWithLogs extends Habit {
  logs: HabitLog[];
}

export type CreateHabitInput = Pick<Habit, 'name' | 'color' | 'frequency'>;
