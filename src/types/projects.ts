export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
}

export interface ProjectWithStats extends Project {
  totalTasks: number;
  completedTasks: number;
  progress: number;
}

export type CreateProjectInput = Pick<Project, 'name' | 'description'>;
