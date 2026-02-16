import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardLayout } from './components/DashboardLayout';
import { Sidebar } from './components/Sidebar';
import { WidgetContainer } from './components/WidgetContainer';
import { useViewStore } from './context/viewStore';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase } from './services/supabase';

const queryClient = new QueryClient();

const DashboardView = () => (
  <div className="animate-fade-in">
    <header className="mb-10">
      <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome back</h2>
      <p className="text-batcave-text-secondary italic">"The night is darkest just before the dawn."</p>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <WidgetContainer title="System Status">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center p-3 bg-batcave-panel/50 rounded-xl border border-white/5">
              <div className="w-2 h-2 rounded-full bg-batcave-blue mr-3 shadow-[0_0_8px_#3b82f6]" />
              <div className="flex-1 h-2 bg-white/5 rounded-full" />
            </div>
          ))}
        </div>
      </WidgetContainer>
      
      <WidgetContainer title="Intelligence Overview">
        <div className="h-40 flex items-end justify-between gap-1">
          {[40, 70, 45, 90, 65, 80, 50, 60, 75, 55].map((h, i) => (
            <div key={i} className="w-full bg-batcave-blue/20 rounded-t-sm hover:bg-batcave-blue/50 transition-all" style={{ height: `${h}%` }} />
          ))}
        </div>
      </WidgetContainer>

      <WidgetContainer title="Quick Actions">
        <div className="text-batcave-text-secondary text-sm">
          Initialize secure database connection...
        </div>
      </WidgetContainer>
    </div>
  </div>
);

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
    <div className="h-screen w-full flex items-center justify-center bg-batcave-bg">
      <div className="w-8 h-8 border-2 border-batcave-blue border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return <LoginView />;

  return (
    <DashboardLayout sidebar={<Sidebar />}>
      {activeView === 'Dashboard' && <DashboardView />}
      {/* Add other views here */}
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
