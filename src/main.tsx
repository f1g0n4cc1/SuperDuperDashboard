import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ServiceStatusProvider } from './context/ServiceStatusContext'
import { Toaster } from 'sonner'
import * as Sentry from "@sentry/react";
import './index.css'
import App from './App.tsx'

// 1. Initialize Sentry for production monitoring
if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Only retry if it's a network error or a transient server error
        if (failureCount < 3) return true;
        return false;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ServiceStatusProvider>
        <App />
        <Toaster theme="dark" position="bottom-right" richColors />
      </ServiceStatusProvider>
    </QueryClientProvider>
  </StrictMode>,
)
