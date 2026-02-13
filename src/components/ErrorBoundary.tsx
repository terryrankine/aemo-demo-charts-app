import { Component, type ReactNode } from 'react';
import { logger } from '../lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logger.error('ErrorBoundary caught render error', {
      error: error.message,
      componentStack: info.componentStack ?? undefined,
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div style={{ padding: 32, textAlign: 'center', color: '#ef4444' }}>
          <h2>Something went wrong</h2>
          <p style={{ color: '#888', fontSize: 14 }}>
            {import.meta.env.PROD ? 'An unexpected error occurred' : (this.state.error?.message ?? 'An unexpected error occurred')}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              marginTop: 16, padding: '8px 16px', cursor: 'pointer',
              background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6,
            }}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
