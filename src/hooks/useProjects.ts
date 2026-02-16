import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../api/projects';
import { tasksApi } from '../api/tasks';
import type { Project, ProjectWithStats, CreateProjectInput } from '../types/projects';
import type { Task } from '../types/tasks';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export const useProjects = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const QUERY_KEY = ['projects'];

  const { data: projects = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => projectsApi.list(),
    enabled: !!user,
  });

  const createProject = useMutation({
    mutationFn: (newProject: CreateProjectInput) => projectsApi.create(newProject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Project deployed');
    },
    onError: () => toast.error('Failed to deploy project')
  });

  return { projects, isLoading, createProject };
};
