import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardLayout } from './components/DashboardLayout';
import { Sidebar } from './components/Sidebar';
import { WidgetContainer } from './components/WidgetContainer';
import { TasksWidget } from './components/widgets/TasksWidget';
import { JournalWidget } from './components/widgets/JournalWidget';
import { GoalsWidget } from './components/widgets/GoalsWidget';
import { HabitsWidget } from './components/widgets/HabitsWidget';
import { ProjectsWidget } from './components/widgets/ProjectsWidget';
import { NotesWidget } from './components/widgets/NotesWidget';
import { CalendarWidget } from './components/widgets/CalendarWidget';
import { SettingsWidget } from './components/widgets/SettingsWidget';
import { EventBanner } from './components/dashboard/EventBanner';
import { useViewStore } from './context/viewStore';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase } from './services/supabase';
import { useUserSettings } from './hooks/useUserSettings';
import { useTasks } from './hooks/useTasks';
import { ChevronLeft, ChevronRight, Loader2, Plus } from 'lucide-react';

const queryClient = new QueryClient();

const DashboardView = () => {
  const { layout, isLoading, updateLayout } = useUserSettings();
  const { createTask } = useTasks();
  const [quickTask, setQuickTask] = useState('');

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTask.trim()) return;
    createTask.mutate({ title: quickTask, priority: 1, category: 'General' });
    setQuickTask('');
  };

  const moveWidget = (index: number, direction: 'left' | 'right') => {
    const newWidgets = [...layout.widgets];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newWidgets.length) return;
    
    [newWidgets[index], newWidgets[targetIndex]] = [newWidgets[targetIndex], newWidgets[index]];
    updateLayout.mutate({ widgets: newWidgets });
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-40">
      <Loader2 className="w-8 h-8 animate-spin text-batcave-blue" />
    </div>
  );

  return (
    <div className="animate-fade-in">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Command Center</h2>
          <p className="text-batcave-text-secondary italic">"Awareness is the first step to control."</p>
        </div>
        
        <form onSubmit={handleQuickAdd} className="w-full md:w-96 relative group">
          <input
            type="text"
            value={quickTask}
            onChange={(e) => setQuickTask(e.target.value)}
            placeholder="Initialize new objective..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 pr-12 text-sm focus:outline-none focus:border-batcave-blue focus:ring-4 focus:ring-batcave-blue/10 transition-all placeholder:text-gray-700"
          />
          <button type="submit" className="absolute right-3 top-2.5 p-1.5 bg-batcave-blue/20 text-batcave-blue rounded-xl hover:bg-batcave-blue hover:text-white transition-all">
            {createTask.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          </button>
        </form>
      </header>

      <EventBanner />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {layout.widgets.map((widget, index) => {
          const controls = (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => moveWidget(index, 'left')}
                disabled={index === 0}
                className="p-1 hover:text-white text-gray-600 disabled:opacity-20"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => moveWidget(index, 'right')}
                disabled={index === layout.widgets.length - 1}
                className="p-1 hover:text-white text-gray-600 disabled:opacity-20"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          );

          if (widget.type === 'tasks') return <TasksWidget key={widget.id} />;

          return (
            <WidgetContainer key={widget.id} title={widget.title} actions={controls}>
              <div className="flex flex-col items-center justify-center h-full py-10 border border-dashed border-white/5 rounded-2xl">
                <p className="text-xs text-batcave-text-secondary uppercase tracking-widest">{widget.type} module</p>
                <p className="text-[10px] text-gray-600 mt-2">ID: {widget.id}</p>
              </div>
            </WidgetContainer>
          );
        })}
      </div>
    </div>
  );
};

const DashboardContent = () => {
  const { user, loading } = useAuth();
  const { activeView } = useViewStore();

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-batcave-bg text-batcave-blue">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  );

  if (!user) {
    // Basic inline login for demo stability
    const handleLogin = () => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
    return (
      <div className="h-screen w-full flex items-center justify-center bg-batcave-bg text-white px-6">
        <div className="glass-panel p-10 rounded-3xl max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-4 tracking-tighter bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">BATCAVE</h1>
          <button onClick={handleLogin} className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">Sign in with Google</button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout sidebar={<Sidebar />}>
      {activeView === 'Dashboard' && <DashboardView />}
      {activeView === 'Calendar' && <CalendarWidget />}
      {activeView === 'Notes' && <NotesWidget />}
      {activeView === 'Goal' && <GoalsWidget />}
      {activeView === 'Projects' && <ProjectsWidget />}
      {activeView === 'Journal' && <JournalWidget />}
      {activeView === 'Habits' && <HabitsWidget />}
      {activeView === 'Settings' && <SettingsWidget />}
    </DashboardLayout>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DashboardContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
