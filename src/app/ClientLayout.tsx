'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { NavigationProvider } from '@/components/navigation/NavigationProvider';
import { TutorialProvider } from '@/contexts/TutorialContext';
import { PostHogProvider, usePageTracking } from '@/contexts/PostHogContext';
import TutorialOverlay from '@/components/ui/TutorialOverlay';
import TutorialTrigger from '@/components/ui/TutorialTrigger';
import { FloatingChatButton } from '@/components/support/FloatingChatButton';
import ErrorBoundary from '@/components/ErrorBoundary';

// Memoized component to prevent unnecessary re-renders
const MemoizedNavbar = React.memo(Navbar);
const MemoizedFooter = React.memo(Footer);

// Component to handle page tracking
function PageTrackingWrapper({ children }: { children: React.ReactNode }) {
  usePageTracking();
  return <>{children}</>;
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Memoize pathname checks to prevent unnecessary re-renders
  const layoutConfig = React.useMemo(() => {
    const isSignupPage = pathname === '/signup';
    const isForgotPasswordPage = pathname === '/forgot-password';
    const isLoginPage = pathname === '/login';
    const isVerifyEmailPage = pathname === '/verify-email';
    const isResetPasswordPage = pathname === '/reset-password';
    const isHomePage = pathname === '/';

    const shouldShowNavbar =
      !isSignupPage &&
      !isForgotPasswordPage &&
      !isLoginPage &&
      !isVerifyEmailPage &&
      !isResetPasswordPage;

    return {
      shouldShowNavbar,
      isHomePage,
    };
  }, [pathname]);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <PostHogProvider>
              <TutorialProvider>
                <NavigationProvider>
                  <TutorialOverlay>
                    <PageTrackingWrapper>
                      {layoutConfig.shouldShowNavbar && (
                        <MemoizedNavbar page='home' />
                      )}
                      {children}
                      {layoutConfig.isHomePage && <MemoizedFooter />}
                      {/* <TutorialTrigger /> */}
                      {layoutConfig.shouldShowNavbar && <FloatingChatButton />}
                    </PageTrackingWrapper>
                  </TutorialOverlay>
                </NavigationProvider>
              </TutorialProvider>
            </PostHogProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
