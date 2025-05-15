'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoggedIn = false; // Set this dynamically in a real app
  const pathname = usePathname();
  const isSignupPage = pathname === '/signup';
  const isForgotPasswordPage = pathname === '/forgot-password';
  const isLoginPage = pathname === '/login';
  const isVerifyEmailPage = pathname === '/verify-email';
  const isResetPasswordPage = pathname === '/reset-password';
  return (
    <>
      {!isSignupPage &&
        !isForgotPasswordPage &&
        !isLoginPage &&
        !isVerifyEmailPage &&
        !isResetPasswordPage && <Navbar isLoggedIn={isLoggedIn} page='home' />}
      {children}
      {!isLoggedIn &&
        !isSignupPage &&
        !isForgotPasswordPage &&
        !isLoginPage &&
        !isVerifyEmailPage &&
        !isResetPasswordPage && <Footer />}
    </>
  );
}
