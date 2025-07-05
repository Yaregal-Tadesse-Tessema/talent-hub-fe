import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface AppModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const AppModal: React.FC<AppModalProps> = ({
  open,
  onClose,
  title,
  children,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Focus trap (optional, basic)
  useEffect(() => {
    if (open && modalRef.current) {
      modalRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-2'>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black bg-opacity-50 transition-opacity'
        onClick={onClose}
      />
      {/* Modal */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className='relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 focus:outline-none flex flex-col max-h-[90vh]'
        style={{ zIndex: 60 }}
      >
        {/* Header */}
        <div className='flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
            {title}
          </h2>
          <button
            onClick={onClose}
            className='p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500'
            aria-label='Close modal'
          >
            <X size={22} />
          </button>
        </div>
        {/* Content */}
        <div className='overflow-y-auto p-6 flex-1'>{children}</div>
      </div>
    </div>
  );
};

export default AppModal;
