export type GoalStatus = 'active' | 'completed' | 'archived';

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  target_date: string;
  progress: number;
  status: GoalStatus;
  created_at: string;
}

export type CreateGoalInput = Pick<Goal, 'title' | 'description' | 'target_date'>;
export type UpdateGoalInput = Partial<Pick<Goal, 'title' | 'description' | 'target_date' | 'progress' | 'status'>>;
