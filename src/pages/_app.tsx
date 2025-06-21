import type { AppProps } from 'next/app';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { NavigationProvider } from '@/components/navigation/NavigationProvider';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <NavigationProvider>
            <Component {...pageProps} />
          </NavigationProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
