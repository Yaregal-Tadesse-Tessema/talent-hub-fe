'use client';

import { useState, useRef, useEffect } from 'react';
import {
  PaperAirplaneIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  aiSupportService,
  AISupportResponse,
} from '../../services/aiSupportService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isLoading?: boolean;
  suggestedActions?: string[];
  relatedTopics?: string[];
  shouldEscalate?: boolean;
}

interface AIChatSupportProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIChatSupport({ isOpen, onClose }: AIChatSupportProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI assistant. I can help you with common questions about TalentHub, including job posting, candidate search, account management, and more. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const generateAIResponse = async (
    userMessage: string,
  ): Promise<AISupportResponse> => {
    try {
      return await aiSupportService.generateResponse(userMessage);
    } catch (error) {
      console.error('Error generating AI response:', error);
      return {
        answer:
          "I'm sorry, I'm having trouble processing your request right now. Please try again or contact our human support team at support@talenthub.com for immediate assistance.",
        confidence: 0,
        shouldEscalate: true,
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const aiResponse = await generateAIResponse(userMessage.text);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.answer,
        sender: 'ai',
        timestamp: new Date(),
        suggestedActions: aiResponse.suggestedActions,
        relatedTopics: aiResponse.relatedTopics,
        shouldEscalate: aiResponse.shouldEscalate,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Show escalation warning if needed
      if (aiResponse.shouldEscalate) {
        toast.error(
          'This query may require human assistance. Consider contacting our support team.',
        );
      }
    } catch (error) {
      toast.error(
        'Sorry, I encountered an error. Please try again or contact support.',
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className='fixed bottom-4 right-4 z-50 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col'
        >
          {/* Header */}
          <div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-blue-600 dark:bg-blue-700 rounded-t-lg'>
            <div className='flex items-center space-x-2'>
              <ChatBubbleLeftRightIcon className='h-6 w-6 text-white' />
              <div>
                <h3 className='text-white font-semibold'>AI Support</h3>
                <p className='text-blue-100 text-sm'>
                  Online • Usually responds instantly
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className='text-white hover:text-blue-100 transition-colors'
            >
              <XMarkIcon className='h-6 w-6' />
            </button>
          </div>

          {/* Messages */}
          <div className='flex-1 overflow-y-auto p-4 space-y-4'>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <div className='whitespace-pre-wrap text-sm'>
                    {message.text}
                  </div>

                  {/* Suggested Actions */}
                  {message.sender === 'ai' &&
                    message.suggestedActions &&
                    message.suggestedActions.length > 0 && (
                      <div className='mt-3 pt-3 border-t border-gray-200 dark:border-gray-600'>
                        <p className='text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2'>
                          Suggested Actions:
                        </p>
                        <div className='space-y-1'>
                          {message.suggestedActions.map((action, index) => (
                            <button
                              key={index}
                              className='block w-full text-left text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors'
                              onClick={() => {
                                setInputText(action);
                                inputRef.current?.focus();
                              }}
                            >
                              <ArrowRightIcon className='inline h-3 w-3 mr-1' />
                              {action}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Related Topics */}
                  {message.sender === 'ai' &&
                    message.relatedTopics &&
                    message.relatedTopics.length > 0 && (
                      <div className='mt-2'>
                        <p className='text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                          Related Topics:
                        </p>
                        <div className='flex flex-wrap gap-1'>
                          {message.relatedTopics.map((topic, index) => (
                            <span
                              key={index}
                              className='inline-block px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full'
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  <div
                    className={`text-xs mt-2 ${
                      message.sender === 'user'
                        ? 'text-blue-100'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className='flex justify-start'
              >
                <div className='bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2'>
                  <div className='flex space-x-1'>
                    <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></div>
                    <div
                      className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
            <div className='flex space-x-2'>
              <input
                ref={inputRef}
                type='text'
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='Type your message...'
                disabled={isTyping}
                className='flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50'
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                <PaperAirplaneIcon className='h-5 w-5' />
              </button>
            </div>
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
              Press Enter to send • AI responses are for general guidance only
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
