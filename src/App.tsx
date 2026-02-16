import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardLayout } from './components/DashboardLayout';
import { Sidebar } from './components/Sidebar';
import { WidgetContainer } from './components/WidgetContainer';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardLayout sidebar={<Sidebar />}>
        <header className="mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome back, Bruce</h2>
          <p className="text-gray-500">Your systems are operational and synchronized.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <WidgetContainer title="Tasks">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors cursor-pointer group/item">
                  <div className="w-5 h-5 rounded border border-white/20 mr-3 group-hover/item:border-white/40 transition-colors" />
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white/20 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </WidgetContainer>

          <WidgetContainer title="Activity Log">
            <div className="h-40 flex items-end justify-between gap-1 px-2">
              {[40, 70, 45, 90, 65, 80, 50, 60, 75, 55].map((h, i) => (
                <div 
                  key={i} 
                  className="w-full bg-white/10 rounded-t-sm hover:bg-white/30 transition-all cursor-help" 
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </WidgetContainer>

          <WidgetContainer title="Notes">
            <div className="text-gray-400 text-sm italic">
              "The night is darkest just before the dawn. And I promise you, the dawn is coming."
              <br /><br />
              Standardizing the Widget API as per Phase 2.
            </div>
          </WidgetContainer>
        </div>
      </DashboardLayout>
    </QueryClientProvider>
  );
}

export default App;
