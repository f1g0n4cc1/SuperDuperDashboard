import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../api/projects';
import { projectSchema } from '../lib/validation';
import type { CreateProjectInput } from '../types/projects';
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
    mutationFn: (newProject: CreateProjectInput) => {
      const validated = projectSchema.safeParse(newProject);
      if (!validated.success) {
        throw new Error(validated.error.issues[0].message);
      }
      return projectsApi.create({
        ...validated.data,
        description: validated.data.description ?? undefined
      } as CreateProjectInput);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Project deployed');
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to deploy project')
  });

  const deleteProject = useMutation({
    mutationFn: (id: string) => projectsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Project terminated');
    },
    onError: () => toast.error('Failed to terminate project')
  });

  return { projects, isLoading, createProject, deleteProject };
};
