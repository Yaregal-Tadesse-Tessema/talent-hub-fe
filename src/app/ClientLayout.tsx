'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';

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
    <>
      {layoutConfig.shouldShowNavbar && <MemoizedNavbar page='home' />}
      {children}
      {layoutConfig.isHomePage && <MemoizedFooter />}
    </>
  );
}
