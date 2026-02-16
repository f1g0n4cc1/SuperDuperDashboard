import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../api/projects';
import { tasksApi } from '../api/tasks';
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
      // 1. Fetch Projects and Tasks in parallel
      const [projectsData, tasksData] = await Promise.all([
        projectsApi.list(),
        tasksApi.list()
      ]);

      // 2. Aggregate stats
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
    mutationFn: (newProject: CreateProjectInput) => projectsApi.create(newProject),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  return { projects, isLoading, createProject };
};
