import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

interface ServiceStatus {
  isSupabaseConnected: boolean;
  lastChecked: Date;
}

const ServiceStatusContext = createContext<ServiceStatus | undefined>(undefined);

export const ServiceStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<ServiceStatus>({
    isSupabaseConnected: true,
    lastChecked: new Date(),
  });

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { error } = await supabase.from('profiles').select('id').limit(1).maybeSingle();
        setStatus({
          isSupabaseConnected: !error,
          lastChecked: new Date(),
        });
      } catch {
        setStatus({
          isSupabaseConnected: false,
          lastChecked: new Date(),
        });
      }
    };

    const interval = setInterval(checkConnection, 30000); // Check every 30s
    checkConnection();

    return () => clearInterval(interval);
  }, []);

  return (
    <ServiceStatusContext.Provider value={status}>
      {children}
      {!status.isSupabaseConnected && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-orange-500 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-orange-400">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-sm font-bold">Offline: Reconnecting to Satellite...</span>
          </div>
        </div>
      )}
    </ServiceStatusContext.Provider>
  );
};

export const useServiceStatus = () => {
  const context = useContext(ServiceStatusContext);
  if (context === undefined) {
    throw new Error('useServiceStatus must be used within a ServiceStatusProvider');
  }
  return context;
};
