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
import TutorialOverlay from '@/components/ui/TutorialOverlay';
import TutorialTrigger from '@/components/ui/TutorialTrigger';
import { FloatingChatButton } from '@/components/support/FloatingChatButton';

// Memoized component to prevent unnecessary re-renders
const MemoizedNavbar = React.memo(Navbar);
const MemoizedFooter = React.memo(Footer);

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
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <TutorialProvider>
            <NavigationProvider>
              <TutorialOverlay>
                {layoutConfig.shouldShowNavbar && (
                  <MemoizedNavbar page='home' />
                )}
                {children}
                {layoutConfig.isHomePage && <MemoizedFooter />}
                <TutorialTrigger />
                {layoutConfig.shouldShowNavbar && <FloatingChatButton />}
              </TutorialOverlay>
            </NavigationProvider>
          </TutorialProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
