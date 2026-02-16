import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  title?: string;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center p-8 text-center h-full bg-red-500/5 rounded-2xl border border-red-500/20">
          <svg className="w-12 h-12 text-red-500/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-bold text-red-200 mb-2">
            {this.props.title ? `${this.props.title} Offline` : 'System Failure'}
          </h3>
          <p className="text-sm text-red-200/60 max-w-xs">
            We encountered a data synchronization issue. Please try refreshing the dashboard.
          </p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-6 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-bold rounded-lg transition-colors"
          >
            Attempt Recovery
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
