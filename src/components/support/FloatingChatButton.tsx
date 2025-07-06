'use client';

import { useState } from 'react';
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { AIChatSupport } from './AIChatSupport';

export function FloatingChatButton() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={toggleChat}
        className='fixed bottom-4 right-4 z-40 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center'
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <AnimatePresence mode='wait'>
          {isChatOpen ? (
            <motion.div
              key='close'
              initial={{ rotate: 0 }}
              animate={{ rotate: 180 }}
              exit={{ rotate: 0 }}
              transition={{ duration: 0.2 }}
            >
              <XMarkIcon className='h-6 w-6' />
            </motion.div>
          ) : (
            <motion.div
              key='chat'
              initial={{ rotate: 0 }}
              animate={{ rotate: 0 }}
              exit={{ rotate: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChatBubbleLeftRightIcon className='h-6 w-6' />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* AI Chat Support */}
      <AIChatSupport isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
