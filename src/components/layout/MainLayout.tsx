'use client';

import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { FloatingChatButton } from '../support/FloatingChatButton';

interface MainLayoutProps {
  children: ReactNode;
  page?: string;
  showChat?: boolean;
}

export function MainLayout({
  children,
  page = 'home',
  showChat = true,
}: MainLayoutProps) {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar page={page} />
      <main className='flex-1'>{children}</main>
      <Footer />
      {showChat && <FloatingChatButton />}
    </div>
  );
}
