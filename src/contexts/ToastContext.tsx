'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '@/components/ui/Toast';

interface ToastContextType {
  showToast: (options: { type: 'success' | 'error'; message: string }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
    visible: boolean;
  } | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const showToast = useCallback(
    ({ type, message }: { type: 'success' | 'error'; message: string }) => {
      if (timeoutId) clearTimeout(timeoutId);
      setToast({ type, message, visible: true });
      const id = setTimeout(() => {
        setToast((prev) => (prev ? { ...prev, visible: false } : null));
      }, 3500);
      setTimeoutId(id);
    },
    [timeoutId],
  );

  const handleClose = () => {
    setToast((prev) => (prev ? { ...prev, visible: false } : null));
    if (timeoutId) clearTimeout(timeoutId);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && toast.visible && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={handleClose}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
