import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '../api/settings';
import { QUERY_KEYS } from '../lib/queryKeys';
import { type UserSettings, type DashboardLayout } from '../types/settings';
import { useAuth } from '../context/AuthContext';

const DEFAULT_LAYOUT: DashboardLayout = {
  widgets: [
    { id: 'tasks-1', type: 'tasks', title: 'Mission Objectives' },
    { id: 'entries-1', type: 'entries', title: 'Tactical Agenda' },
    { id: 'ideas-1', type: 'ideas', title: 'Quick Notes' },
  ],
};

export const useUserSettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 1. Fetch Settings
  const { data: settings, isLoading } = useQuery({
    queryKey: QUERY_KEYS.settings,
    queryFn: async () => {
      const data = await settingsApi.get();
      
      // If no settings exist yet, return default
      if (!data) return { dashboard_layout: DEFAULT_LAYOUT } as UserSettings;
      
      return data as UserSettings;
    },
    enabled: !!user,
  });

  // 2. Update Layout Mutation
  const updateLayout = useMutation({
    mutationFn: (newLayout: DashboardLayout) => settingsApi.update(newLayout),
    onMutate: async (newLayout) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.settings });
      const previousSettings = queryClient.getQueryData<UserSettings>(QUERY_KEYS.settings);

      queryClient.setQueryData<UserSettings>(QUERY_KEYS.settings, (old) => ({
        ...old!,
        dashboard_layout: newLayout,
      }));

      return { previousSettings };
    },
    onError: (_err, _newLayout, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(QUERY_KEYS.settings, context.previousSettings);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.settings });
    },
  });

  return {
    layout: settings?.dashboard_layout || DEFAULT_LAYOUT,
    isLoading,
    updateLayout,
  };
};
