import { DashboardLayout } from './components/DashboardLayout';
import { Sidebar } from './components/Sidebar';
import { JournalWidget } from './components/widgets/JournalWidget';
import { GoalsWidget } from './components/widgets/GoalsWidget';
import { HabitsWidget } from './components/widgets/HabitsWidget';
import { ProjectsWidget } from './components/widgets/ProjectsWidget';
import { NotesWidget } from './components/widgets/NotesWidget';
import { CalendarWidget } from './components/widgets/CalendarWidget';
import { SettingsWidget } from './components/widgets/SettingsWidget';
import { EventBanner } from './components/dashboard/EventBanner';
import { QuickAdd } from './components/dashboard/QuickAdd';
import { WidgetGrid } from './components/dashboard/WidgetGrid';
import { useViewStore } from './context/viewStore';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase } from './services/supabase';
import { useUserSettings } from './hooks/useUserSettings';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';

const SafeModeLayout = () => (
  <div className="h-screen w-full flex items-center justify-center bg-batcave-bg text-white px-6">
    <div className="glass-panel p-10 rounded-3xl max-w-lg w-full text-center border border-red-500/20">
      <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-6" />
      <h1 className="text-2xl font-bold mb-2">System Instability Detected</h1>
      <p className="text-batcave-text-secondary text-sm mb-8">
        We're having trouble loading your custom workspace. Your data is safe, but the dashboard layout is currently unavailable.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => window.location.reload()} 
          className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
        <button 
          onClick={() => window.location.href = 'mailto:support@superduper.com'} 
          className="py-3 bg-red-500/20 text-red-200 font-bold rounded-2xl hover:bg-red-500/30 transition-all"
        >
          Report Issue
        </button>
      </div>
    </div>
  </div>
);

const DashboardView = () => {
  const { layout, isLoading, updateLayout } = useUserSettings();

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
        
        <QuickAdd />
      </header>

      <EventBanner />

      <WidgetGrid 
        layout={layout} 
        updateLayout={(newLayout) => updateLayout.mutate(newLayout)} 
      />
    </div>
  );
};

const DashboardContent = () => {
  const { user, loading, timedOut } = useAuth();
  const { activeView } = useViewStore();

  if (loading && !timedOut) return (
    <div className="h-screen w-full flex items-center justify-center bg-batcave-bg text-batcave-blue">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  );

  if (timedOut) return (
    <div className="h-screen w-full flex items-center justify-center bg-batcave-bg text-white px-6">
      <div className="glass-panel p-10 rounded-3xl max-w-md w-full text-center">
        <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-6" />
        <h1 className="text-xl font-bold mb-2">Connection Latency</h1>
        <p className="text-batcave-text-secondary text-sm mb-8">The secure uplink is taking longer than expected. Check your network or the satellite status.</p>
        <button onClick={() => window.location.reload()} className="w-full py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4" /> Restart Uplink
        </button>
      </div>
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
    <AuthProvider>
      <ErrorBoundary fallback={<SafeModeLayout />}>
        <DashboardContent />
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
