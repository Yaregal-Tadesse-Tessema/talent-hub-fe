'use client';

import { useState } from 'react';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
}

const KNOWLEDGE_BASE: KnowledgeItem[] = [
  {
    id: 'job-posting-guide',
    title: 'How to Post a Job',
    content: `Posting a job on TalentHub is simple and effective:

1. Log in to your employer account
2. Click "Post a Job" in your dashboard
3. Fill out the job details form
4. Review and submit

Your job will be reviewed and published within 24 hours.`,
    category: 'Job Posting',
    tags: ['job posting', 'recruitment', 'hiring'],
  },
  {
    id: 'candidate-search',
    title: 'Finding the Right Candidates',
    content: `TalentHub offers powerful tools to help you find the perfect candidates:

- Use keyword search for specific skills
- Apply advanced filters for experience and location
- Save searches for quick access
- Contact candidates directly through the platform`,
    category: 'Candidate Search',
    tags: ['candidate search', 'talent acquisition'],
  },
  {
    id: 'account-management',
    title: 'Managing Your Account',
    content: `Keep your TalentHub account up to date and secure:

- Update your profile information
- Change password and security settings
- Configure notification preferences
- Manage billing and subscription`,
    category: 'Account Management',
    tags: ['account settings', 'profile', 'security'],
  },
  {
    id: 'pricing-plans',
    title: 'Pricing Plans and Billing',
    content: `TalentHub offers flexible pricing plans:

Free Plan: Basic job posting and candidate search
Professional Plan: $29/month - Advanced features
Enterprise Plan: Custom pricing - Full platform access

Payment methods: Credit cards, PayPal, bank transfers`,
    category: 'Billing & Pricing',
    tags: ['pricing', 'billing', 'subscription'],
  },
];

const CATEGORIES = [
  'All',
  'Job Posting',
  'Candidate Search',
  'Account Management',
  'Billing & Pricing',
];

export function SupportKnowledgeBase() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const filteredItems = KNOWLEDGE_BASE.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
          Knowledge Base
        </h2>

        <div className='mb-4'>
          <div className='relative'>
            <MagnifyingGlassIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
            <input
              type='text'
              placeholder='Search knowledge base...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className='flex flex-wrap gap-2 mb-4'>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Knowledge Items */}
      <div className='space-y-4'>
        {filteredItems.length === 0 ? (
          <div className='text-center py-8'>
            <p className='text-gray-500 dark:text-gray-400'>
              No articles found matching your search criteria.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className='border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden'
            >
              <button
                onClick={() => toggleExpanded(item.id)}
                className='w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between'
              >
                <div className='flex-1'>
                  <h3 className='font-semibold text-gray-900 dark:text-white'>
                    {item.title}
                  </h3>
                  <span className='text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded mt-1 inline-block'>
                    {item.category}
                  </span>
                </div>
                {expandedItems.has(item.id) ? (
                  <ChevronDownIcon className='h-5 w-5 text-gray-400' />
                ) : (
                  <ChevronRightIcon className='h-5 w-5 text-gray-400' />
                )}
              </button>

              <AnimatePresence>
                {expandedItems.has(item.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className='border-t border-gray-200 dark:border-gray-700'
                  >
                    <div className='p-4 bg-gray-50 dark:bg-gray-900'>
                      <div className='whitespace-pre-wrap text-gray-700 dark:text-gray-300'>
                        {item.content}
                      </div>

                      {/* Tags */}
                      <div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
                        <div className='flex flex-wrap gap-1'>
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className='inline-block px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded'
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
