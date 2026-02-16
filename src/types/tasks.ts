export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: string;
  user_id: string;
  project_id?: string;
  title: string;
  status: TaskStatus;
  priority: number;
  category: string;
  time_spent_seconds: number;
  created_at: string;
}

export type CreateTaskInput = Pick<Task, 'title' | 'priority' | 'category' | 'project_id'>;
export type UpdateTaskInput = Partial<Pick<Task, 'title' | 'status' | 'priority' | 'category' | 'project_id'>>;
