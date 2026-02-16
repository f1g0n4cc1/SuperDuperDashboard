import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardLayout } from './components/DashboardLayout';
import { Sidebar } from './components/Sidebar';
import { WidgetContainer } from './components/WidgetContainer';
import { TasksWidget } from './components/widgets/TasksWidget';
import { EventBanner } from './components/dashboard/EventBanner';
import { useViewStore } from './context/viewStore';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase } from './services/supabase';
import { useUserSettings } from './hooks/useUserSettings';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const queryClient = new QueryClient();

const DashboardView = () => {
  const { layout, isLoading, updateLayout } = useUserSettings();

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
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome back</h2>
        <p className="text-batcave-text-secondary italic">"The night is darkest just before the dawn."</p>
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

const LoginView = () => {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-batcave-bg text-white px-6">
      <div className="glass-panel p-10 rounded-3xl max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 tracking-tighter bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
          BATCAVE
        </h1>
        <p className="text-batcave-text-secondary mb-8">Secure Access Portal for Productivity Optimization.</p>
        <button 
          onClick={handleLogin}
          className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
        >
          Initialize Google OAuth
        </button>
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

  if (!user) return <LoginView />;

  return (
    <DashboardLayout sidebar={<Sidebar />}>
      {activeView === 'Dashboard' && <DashboardView />}
      {activeView !== 'Dashboard' && (
        <div className="animate-fade-in flex flex-col items-center justify-center h-[60vh] text-center">
          <h2 className="text-4xl font-bold text-white mb-4">{activeView}</h2>
          <p className="text-batcave-text-secondary max-w-md">
            This module is currently being initialized. Please check back shortly for full functionality.
          </p>
        </div>
      )}
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
