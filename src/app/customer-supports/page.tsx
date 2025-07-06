'use client';
import {
  ChevronDownIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { AIChatSupport } from '@/components/support/AIChatSupport';
import { SupportKnowledgeBase } from '@/components/support/SupportKnowledgeBase';

export const dynamic = 'force-static';

const faqs = [
  {
    question: 'How do I post a job?',
    answer:
      'To post a job, simply log in to your account, click on "Post a Job" in your dashboard, fill out the job details form, and submit. Your job will be reviewed and published within 24 hours.',
  },
  {
    question: 'How can I contact customer support?',
    answer:
      'You can reach our customer support team through multiple channels: email at support@talenthub.com, phone at +1-202-555-0178, or through the live chat feature on our website. We typically respond within 24 hours.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. Enterprise customers can also opt for invoice-based payments.',
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer:
      "Yes, you can change your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the new rate will apply at the start of your next billing cycle.",
  },
  {
    question: 'How do I cancel my subscription?',
    answer:
      'You can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period.',
  },
  {
    question: 'What happens to my job postings if I cancel?',
    answer:
      "Your active job postings will remain visible until their expiration date, even after cancellation. However, you won't be able to post new jobs or access premium features.",
  },
];

const supportChannels = [
  {
    name: 'Email Support',
    description: 'Get help via email',
    contact: 'support@talenthub.com',
    responseTime: 'Within 24 hours',
    icon: (
      <svg
        className='h-6 w-6'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
        />
      </svg>
    ),
  },
  {
    name: 'Phone Support',
    description: 'Speak with our team',
    contact: '+1-202-555-0178',
    responseTime: 'Mon-Fri, 9am-5pm EST',
    icon: (
      <svg
        className='h-6 w-6'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
        />
      </svg>
    ),
  },
  {
    name: 'Live Chat',
    description: 'Chat with our team',
    contact: 'Available on website',
    responseTime: 'Mon-Fri, 9am-5pm EST',
    icon: (
      <svg
        className='h-6 w-6'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
        />
      </svg>
    ),
  },
];

const resources = [
  {
    title: 'Getting Started Guide',
    description: 'Learn how to set up your account and start hiring',
    link: '/guides/getting-started',
  },
  {
    title: 'Best Practices',
    description: 'Tips and tricks for successful hiring',
    link: '/guides/best-practices',
  },
  {
    title: 'API Documentation',
    description: 'Technical documentation for developers',
    link: '/api-docs',
  },
  {
    title: 'Video Tutorials',
    description: 'Step-by-step video guides',
    link: '/tutorials',
  },
];

export default function CustomerSupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  return (
    <div className='bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800'>
      {/* Hero section */}
      <div className='relative isolate overflow-hidden'>
        <div className='absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'>
          <div className='relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-200 to-blue-400 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] dark:from-blue-400 dark:to-blue-600' />
        </div>
        <div className='mx-auto max-w-7xl px-6 pb-16 pt-8 sm:pb-24 lg:flex lg:px-8 lg:py-24'>
          <div className='mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0'>
            <div className='mt-8 sm:mt-12 lg:mt-8'>
              <a href='#' className='inline-flex space-x-6'>
                <span className='rounded-full bg-blue-600/10 dark:bg-blue-400/20 px-3 py-1 text-sm font-semibold leading-6 text-blue-600 dark:text-blue-400 ring-1 ring-inset ring-blue-600/10 dark:ring-blue-400/20'>
                  What's new
                </span>
                <span className='inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600 dark:text-gray-300'>
                  <span>Just shipped v1.0</span>
                  <ChevronDownIcon
                    className='h-5 w-5 text-gray-400 dark:text-gray-500'
                    aria-hidden='true'
                  />
                </span>
              </a>
            </div>
            <h1 className='mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl'>
              How can we help you?
            </h1>
            <p className='mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300'>
              We're here to help you make the most of TalentHub. Choose from our
              support channels below or browse our frequently asked questions.
            </p>
            <div className='mt-8'>
              <button
                onClick={() => setIsAIChatOpen(true)}
                className='inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl'
              >
                <ChatBubbleLeftRightIcon className='h-5 w-5 mr-2' />
                Chat with AI Assistant
              </button>
              <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
                Get instant answers to common questions
              </p>
            </div>
          </div>
        </div>
        <div className='absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]'>
          <div className='relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-blue-200 to-blue-400 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem] dark:from-blue-400 dark:to-blue-600' />
        </div>
      </div>

      {/* Support channels */}
      <div className='mx-auto max-w-7xl px-6 lg:px-8 py-14 sm:py-32'>
        <div className='mx-auto max-w-2xl lg:max-w-none'>
          <div className='grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3'>
            {supportChannels.map((channel) => (
              <div key={channel.name} className='group relative'>
                <div className='flex h-full flex-col justify-between rounded-2xl bg-white dark:bg-gray-800 p-8 ring-1 ring-gray-200 dark:ring-gray-700 transition-all duration-300 hover:shadow-lg hover:ring-blue-500 dark:hover:ring-blue-400'>
                  <div>
                    <div className='inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 dark:bg-blue-500 text-white transition-transform duration-300 group-hover:scale-110'>
                      {channel.icon}
                    </div>
                    <h3 className='mt-4 text-lg font-semibold leading-8 text-gray-900 dark:text-white'>
                      {channel.name}
                    </h3>
                    <p className='mt-2 text-base leading-7 text-gray-600 dark:text-gray-300'>
                      {channel.description}
                    </p>
                  </div>
                  <div className='mt-6'>
                    <p className='text-sm font-semibold text-gray-900 dark:text-white'>
                      {channel.contact}
                    </p>
                    <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
                      Response time: {channel.responseTime}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ section */}
      <div className='mx-auto max-w-7xl px-6 lg:px-8 py-14 sm:py-32'>
        <div className='mx-auto max-w-4xl divide-y divide-gray-900/10 dark:divide-gray-100/10'>
          <h2 className='text-2xl font-bold leading-10 tracking-tight text-gray-900 dark:text-white'>
            Frequently asked questions
          </h2>
          <dl className='mt-10 space-y-6 divide-y divide-gray-900/10 dark:divide-gray-100/10'>
            {faqs.map((faq, index) => (
              <div key={faq.question} className='pt-6'>
                <dt>
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className='flex w-full items-start justify-between text-left text-gray-900 dark:text-white'
                  >
                    <h3 className='text-base font-semibold leading-7'>
                      {faq.question}
                    </h3>
                    <span className='ml-6 flex h-7 items-center'>
                      <ChevronDownIcon
                        className={`h-6 w-6 transform transition-transform duration-200 ${
                          openFaq === index ? 'rotate-180' : ''
                        }`}
                        aria-hidden='true'
                      />
                    </span>
                  </button>
                </dt>
                <dd
                  className={`mt-2 pr-12 transition-all duration-200 ${
                    openFaq === index ? 'block' : 'hidden'
                  }`}
                >
                  <p className='text-base leading-7 text-gray-600 dark:text-gray-300'>
                    {faq.answer}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Resources section */}
      <div className='mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32'>
        <div className='mx-auto max-w-2xl lg:max-w-none'>
          <h2 className='text-2xl font-bold leading-10 tracking-tight text-gray-900 dark:text-white'>
            Helpful Resources
          </h2>
          <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4'>
            {resources.map((resource) => (
              <div key={resource.title} className='group relative'>
                <div className='flex h-full flex-col justify-between rounded-2xl bg-white dark:bg-gray-800 p-8 ring-1 ring-gray-200 dark:ring-gray-700 transition-all duration-300 hover:shadow-lg hover:ring-blue-500 dark:hover:ring-blue-400'>
                  <div>
                    <h3 className='text-lg font-semibold leading-8 text-gray-900 dark:text-white'>
                      {resource.title}
                    </h3>
                    <p className='mt-2 text-base leading-7 text-gray-600 dark:text-gray-300'>
                      {resource.description}
                    </p>
                  </div>
                  <div className='mt-6'>
                    <a
                      href={resource.link}
                      className='inline-flex items-center text-sm font-semibold leading-6 text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200'
                    >
                      Learn more
                      <span
                        className='ml-2 transition-transform duration-200 group-hover:translate-x-1'
                        aria-hidden='true'
                      >
                        →
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Knowledge Base Section */}
      <div className='mx-auto max-w-7xl px-6 lg:px-8 py-14 sm:py-32'>
        <div className='mx-auto max-w-4xl'>
          <SupportKnowledgeBase />
        </div>
      </div>

      {/* AI Chat Support */}
      <AIChatSupport
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
      />
    </div>
  );
}
