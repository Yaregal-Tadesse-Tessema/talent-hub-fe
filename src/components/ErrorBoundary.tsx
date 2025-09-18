'use client';

import * as React from 'react';
import { RiAlarmWarningFill } from 'react-icons/ri';

import TextButton from '@/components/buttons/TextButton';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{
    error?: Error;
    resetError: () => void;
  }>;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            resetError={this.resetError}
          />
        );
      }

      // Default fallback UI
      return (
        <div className='flex min-h-screen items-center justify-center bg-white p-4'>
          <div className='text-center'>
            <RiAlarmWarningFill
              size={60}
              className='mx-auto mb-4 animate-pulse text-red-500'
            />
            <h1 className='mb-4 text-2xl font-bold text-gray-900 md:text-4xl'>
              Something went wrong
            </h1>
            <p className='mb-6 text-gray-600'>
              We apologize for the inconvenience. Please try refreshing the
              page.
            </p>
            <div className='space-x-4'>
              <TextButton
                variant='primary'
                onClick={this.resetError}
                className='mr-2'
              >
                Try Again
              </TextButton>
              <TextButton
                variant='basic'
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </TextButton>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <details className='mt-6 text-left'>
                <summary className='cursor-pointer text-sm font-medium text-gray-700'>
                  Error Details (Development)
                </summary>
                <pre className='mt-2 overflow-auto rounded bg-gray-100 p-4 text-xs text-red-600'>
                  {this.state.error?.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export function useErrorHandler() {
  return React.useCallback((error: Error, errorInfo?: React.ErrorInfo) => {
    console.error('Unhandled error:', error, errorInfo);
    // You can integrate with error reporting services here
  }, []);
}

// Global error handler for unhandled promise rejections
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // Prevent the default browser behavior (logging to console)
    event.preventDefault();
  });

  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
  });
}

export default ErrorBoundary;
