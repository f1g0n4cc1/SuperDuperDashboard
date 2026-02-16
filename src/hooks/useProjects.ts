import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import type { Project, ProjectWithStats, CreateProjectInput } from '../types/projects';
import type { Task } from '../types/tasks';
import { useAuth } from '../context/AuthContext';

export const useProjects = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const QUERY_KEY = ['projects'];

  const { data: projects = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      // 1. Fetch Projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: true });

      if (projectsError) throw projectsError;

      // 2. Fetch Tasks to calculate progress
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('project_id, status');

      if (tasksError) throw tasksError;

      // 3. Aggregate stats
      return (projectsData as Project[]).map(project => {
        const projectTasks = (tasksData as Task[]).filter(t => t.project_id === project.id);
        const totalTasks = projectTasks.length;
        const completedTasks = projectTasks.filter(t => t.status === 'done').length;
        const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        return {
          ...project,
          totalTasks,
          completedTasks,
          progress
        };
      }) as ProjectWithStats[];
    },
    enabled: !!user,
  });

  const createProject = useMutation({
    mutationFn: async (newProject: CreateProjectInput) => {
      const { data, error } = await supabase
        .from('projects')
        .insert([{ ...newProject, user_id: user?.id }])
        .select()
        .single();

      if (error) throw error;
      return data as Project;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  return { projects, isLoading, createProject };
};
