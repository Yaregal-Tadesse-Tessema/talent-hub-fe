'use client';

import React, { useState } from 'react';
import {
  FiCreditCard,
  FiDownload,
  FiEdit,
  FiEye,
  FiPlus,
  FiTrash2,
  FiCalendar,
  FiAlertTriangle,
  FiCheck,
  FiX,
  FiRefreshCw,
  FiToggleRight,
  FiBell,
  FiMail,
  FiFileText,
  FiDollarSign,
  FiUsers,
  FiTrendingUp,
  FiShield,
  FiZap,
  FiStar,
} from 'react-icons/fi';

// Mock data - in real app, this would come from API
const currentPlan = {
  name: 'Professional',
  price: 'ETB 110,000',
  billingCycle: 'monthly',
  renewalDate: '2024-02-15',
  features: [
    'Post up to 20 jobs',
    'Advanced candidate search',
    'Priority email & phone support',
    'Advanced analytics & reporting',
    'Extended job posting duration',
    'Full resume database access',
    'Custom job branding',
    'Interview scheduling tools',
  ],
  usage: {
    jobPosts: { used: 12, limit: 20 },
    cvViews: { used: 85, limit: 100 },
    candidateMessages: { used: 45, limit: 100 },
  },
  autoRenew: true,
};

const availablePlans = [
  {
    name: 'Basic',
    price: { monthly: 'ETB 55,000', yearly: 'ETB 385,000' },
    description: 'Perfect for small businesses just getting started.',
    features: [
      'Post up to 5 jobs',
      'Basic candidate search',
      'Email support',
      'Basic analytics',
      'Standard job posting duration',
      'Resume database access',
    ],
    current: false,
  },
  {
    name: 'Professional',
    price: { monthly: 'ETB 110,000', yearly: 'ETB 770,000' },
    description: 'Ideal for growing companies with active hiring needs.',
    features: [
      'Post up to 20 jobs',
      'Advanced candidate search',
      'Priority email & phone support',
      'Advanced analytics & reporting',
      'Extended job posting duration',
      'Full resume database access',
      'Custom job branding',
      'Interview scheduling tools',
    ],
    current: true,
    mostPopular: true,
  },
  {
    name: 'Enterprise',
    price: { monthly: 'ETB 275,000', yearly: 'ETB 2,750,000' },
    description: 'For large organizations with complex hiring needs.',
    features: [
      'Unlimited job postings',
      'AI-powered candidate matching',
      '24/7 dedicated support',
      'Custom analytics dashboard',
      'Permanent job postings',
      'Full resume database access',
      'Custom job branding',
      'Advanced interview tools',
      'Team collaboration features',
      'API access',
    ],
    current: false,
  },
];

const billingHistory = [
  {
    id: '1',
    date: '2024-01-15',
    plan: 'Professional',
    amount: 'ETB 110,000',
    status: 'paid',
    invoice: 'INV-2024-001',
    paymentMethod: 'Telebirr',
    paymentMethodType: 'telebirr',
  },
  {
    id: '2',
    date: '2023-12-15',
    plan: 'Professional',
    amount: 'ETB 110,000',
    status: 'paid',
    invoice: 'INV-2023-012',
    paymentMethod: 'Chapa',
    paymentMethodType: 'chapa',
  },
  {
    id: '3',
    date: '2023-11-15',
    plan: 'Basic',
    amount: 'ETB 55,000',
    status: 'paid',
    invoice: 'INV-2023-011',
    paymentMethod: 'CBE Birr',
    paymentMethodType: 'cbe_birr',
  },
];

const paymentMethods = [
  {
    id: '1',
    type: 'telebirr',
    phoneNumber: '0912345678',
    name: 'Telebirr',
    provider: 'Ethio Telecom',
    isDefault: true,
  },
  {
    id: '2',
    type: 'chapa',
    last4: '****',
    name: 'Chapa',
    provider: 'Chapa Payment Gateway',
    isDefault: false,
  },
  {
    id: '3',
    type: 'cbe_birr',
    phoneNumber: '0918765432',
    name: 'CBE Birr',
    provider: 'Commercial Bank of Ethiopia',
    isDefault: false,
  },
  {
    id: '4',
    type: 'card',
    last4: '4242',
    brand: 'Visa',
    expiryMonth: '12',
    expiryYear: '2025',
    isDefault: false,
  },
];

export default function PlansTab() {
  const [isYearly, setIsYearly] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handlePlanChange = (planName: string) => {
    setSelectedPlan(planName);
    setShowUpgradeModal(true);
  };

  const handlePaymentMethodEdit = (methodId: string) => {
    // Handle payment method edit
    console.log('Edit payment method:', methodId);
  };

  const handlePaymentMethodDelete = (methodId: string) => {
    // Handle payment method deletion
    console.log('Delete payment method:', methodId);
  };

  return (
    <div className='p-6 space-y-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            Plans & Billing
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-2'>
            Manage your subscription, payments, and usage
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <button className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'>
            <FiBell className='w-4 h-4' />
            Billing Alerts
          </button>
        </div>
      </div>

      {/* Current Plan Overview */}
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
            Current Plan
          </h2>
          <div className='flex items-center gap-2'>
            <span className='px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full'>
              {currentPlan.name}
            </span>
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              • {currentPlan.billingCycle}
            </span>
          </div>
        </div>

        <div className='grid md:grid-cols-3 gap-6'>
          {/* Plan Details */}
          <div className='md:col-span-2'>
            <div className='mb-4'>
              <div className='flex items-baseline gap-2 mb-2'>
                <span className='text-3xl font-bold text-gray-900 dark:text-white'>
                  {currentPlan.price}
                </span>
                <span className='text-gray-500 dark:text-gray-400'>
                  /{currentPlan.billingCycle}
                </span>
              </div>
              <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                <FiCalendar className='w-4 h-4' />
                <span>Renews on {currentPlan.renewalDate}</span>
                <span className='flex items-center gap-1'>
                  <FiToggleRight
                    className={`w-4 h-4 ${currentPlan.autoRenew ? 'text-green-500' : 'text-gray-400'}`}
                  />
                  Auto-renew {currentPlan.autoRenew ? 'on' : 'off'}
                </span>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-3'>
                <h4 className='font-medium text-gray-900 dark:text-white'>
                  Features Included:
                </h4>
                <ul className='space-y-2'>
                  {currentPlan.features.slice(0, 4).map((feature, index) => (
                    <li
                      key={index}
                      className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'
                    >
                      <FiCheck className='w-4 h-4 text-green-500 flex-shrink-0' />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className='space-y-3'>
                <h4 className='font-medium text-gray-900 dark:text-white'>
                  More Features:
                </h4>
                <ul className='space-y-2'>
                  {currentPlan.features.slice(4).map((feature, index) => (
                    <li
                      key={index}
                      className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'
                    >
                      <FiCheck className='w-4 h-4 text-green-500 flex-shrink-0' />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Usage Summary */}
          <div className='space-y-4'>
            <h4 className='font-medium text-gray-900 dark:text-white'>
              Usage This Month
            </h4>

            <div className='space-y-3'>
              <div>
                <div className='flex items-center justify-between text-sm mb-1'>
                  <span className='text-gray-600 dark:text-gray-400'>
                    Job Posts
                  </span>
                  <span className='font-medium text-gray-900 dark:text-white'>
                    {currentPlan.usage.jobPosts.used}/
                    {currentPlan.usage.jobPosts.limit}
                  </span>
                </div>
                <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                  <div
                    className='bg-blue-500 h-2 rounded-full transition-all duration-300'
                    style={{
                      width: `${(currentPlan.usage.jobPosts.used / currentPlan.usage.jobPosts.limit) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className='flex items-center justify-between text-sm mb-1'>
                  <span className='text-gray-600 dark:text-gray-400'>
                    CV Views
                  </span>
                  <span className='font-medium text-gray-900 dark:text-white'>
                    {currentPlan.usage.cvViews.used}/
                    {currentPlan.usage.cvViews.limit}
                  </span>
                </div>
                <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                  <div
                    className='bg-green-500 h-2 rounded-full transition-all duration-300'
                    style={{
                      width: `${(currentPlan.usage.cvViews.used / currentPlan.usage.cvViews.limit) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className='flex items-center justify-between text-sm mb-1'>
                  <span className='text-gray-600 dark:text-gray-400'>
                    Messages
                  </span>
                  <span className='font-medium text-gray-900 dark:text-white'>
                    {currentPlan.usage.candidateMessages.used}/
                    {currentPlan.usage.candidateMessages.limit}
                  </span>
                </div>
                <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                  <div
                    className='bg-purple-500 h-2 rounded-full transition-all duration-300'
                    style={{
                      width: `${(currentPlan.usage.candidateMessages.used / currentPlan.usage.candidateMessages.limit) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Usage Alerts */}
            {currentPlan.usage.jobPosts.used /
              currentPlan.usage.jobPosts.limit >
              0.8 && (
              <div className='p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg'>
                <div className='flex items-center gap-2'>
                  <FiAlertTriangle className='w-4 h-4 text-yellow-600 dark:text-yellow-400' />
                  <span className='text-sm text-yellow-700 dark:text-yellow-300'>
                    You're close to your job posting limit
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
            Available Plans
          </h2>

          {/* Billing Toggle */}
          <div className='flex items-center gap-2'>
            <span
              className={`text-sm ${!isYearly ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isYearly ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isYearly ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span
              className={`text-sm ${isYearly ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}
            >
              Yearly
            </span>
            {isYearly && (
              <span className='px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full'>
                Save 17%
              </span>
            )}
          </div>
        </div>

        <div className='grid md:grid-cols-3 gap-6'>
          {availablePlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl border-2 p-6 ${
                plan.current
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
                  : plan.mostPopular
                    ? 'border-blue-500 bg-white dark:bg-gray-800'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              }`}
            >
              {plan.mostPopular && !plan.current && (
                <div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
                  <span className='px-3 py-1 text-xs font-medium bg-blue-500 text-white rounded-full'>
                    Most Popular
                  </span>
                </div>
              )}

              {plan.current && (
                <div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
                  <span className='px-3 py-1 text-xs font-medium bg-green-500 text-white rounded-full'>
                    Current Plan
                  </span>
                </div>
              )}

              <div className='text-center mb-6'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                  {plan.name}
                </h3>
                <div className='flex items-baseline justify-center gap-1'>
                  <span className='text-3xl font-bold text-gray-900 dark:text-white'>
                    {isYearly ? plan.price.yearly : plan.price.monthly}
                  </span>
                  <span className='text-gray-500 dark:text-gray-400'>
                    /{isYearly ? 'year' : 'month'}
                  </span>
                </div>
                <p className='text-sm text-gray-600 dark:text-gray-400 mt-2'>
                  {plan.description}
                </p>
              </div>

              <ul className='space-y-3 mb-6'>
                {plan.features.map((feature, index) => (
                  <li key={index} className='flex items-start gap-2 text-sm'>
                    <FiCheck className='w-4 h-4 text-green-500 flex-shrink-0 mt-0.5' />
                    <span className='text-gray-600 dark:text-gray-400'>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => !plan.current && handlePlanChange(plan.name)}
                disabled={plan.current}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  plan.current
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : plan.mostPopular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                }`}
              >
                {plan.current
                  ? 'Current Plan'
                  : plan.name === 'Enterprise'
                    ? 'Contact Sales'
                    : 'Upgrade'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Billing & Payment History */}
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
            Billing History
          </h2>
          <div className='flex items-center gap-2'>
            <button className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'>
              <FiCalendar className='w-4 h-4' />
              Filter
            </button>
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-gray-200 dark:border-gray-700'>
                <th className='text-left py-3 px-4 font-medium text-gray-900 dark:text-white'>
                  Date
                </th>
                <th className='text-left py-3 px-4 font-medium text-gray-900 dark:text-white'>
                  Plan
                </th>
                <th className='text-left py-3 px-4 font-medium text-gray-900 dark:text-white'>
                  Amount
                </th>
                <th className='text-left py-3 px-4 font-medium text-gray-900 dark:text-white'>
                  Payment Method
                </th>
                <th className='text-left py-3 px-4 font-medium text-gray-900 dark:text-white'>
                  Status
                </th>
                <th className='text-left py-3 px-4 font-medium text-gray-900 dark:text-white'>
                  Invoice
                </th>
                <th className='text-left py-3 px-4 font-medium text-gray-900 dark:text-white'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {billingHistory.map((invoice) => (
                <tr
                  key={invoice.id}
                  className='border-b border-gray-100 dark:border-gray-700'
                >
                  <td className='py-3 px-4 text-gray-600 dark:text-gray-400'>
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className='py-3 px-4 text-gray-900 dark:text-white'>
                    {invoice.plan}
                  </td>
                  <td className='py-3 px-4 text-gray-900 dark:text-white font-medium'>
                    {invoice.amount}
                  </td>
                  <td className='py-3 px-4'>
                    <div className='flex items-center gap-2'>
                      <div
                        className={`w-6 h-4 rounded flex items-center justify-center ${
                          invoice.paymentMethodType === 'telebirr'
                            ? 'bg-green-100 dark:bg-green-900/30'
                            : invoice.paymentMethodType === 'chapa'
                              ? 'bg-blue-100 dark:bg-blue-900/30'
                              : invoice.paymentMethodType === 'cbe_birr'
                                ? 'bg-red-100 dark:bg-red-900/30'
                                : 'bg-gray-100 dark:bg-gray-700'
                        }`}
                      >
                        {invoice.paymentMethodType === 'telebirr' ? (
                          <span className='text-green-600 dark:text-green-400 font-bold text-xs'>
                            TB
                          </span>
                        ) : invoice.paymentMethodType === 'chapa' ? (
                          <span className='text-blue-600 dark:text-blue-400 font-bold text-xs'>
                            CH
                          </span>
                        ) : invoice.paymentMethodType === 'cbe_birr' ? (
                          <span className='text-red-600 dark:text-red-400 font-bold text-xs'>
                            CB
                          </span>
                        ) : (
                          <FiCreditCard className='w-3 h-3 text-gray-600 dark:text-gray-400' />
                        )}
                      </div>
                      <span className='text-gray-600 dark:text-gray-400 text-sm'>
                        {invoice.paymentMethod}
                      </span>
                    </div>
                  </td>
                  <td className='py-3 px-4'>
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        invoice.status === 'paid'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      }`}
                    >
                      <FiCheck className='w-3 h-3 mr-1' />
                      {invoice.status}
                    </span>
                  </td>
                  <td className='py-3 px-4 text-gray-600 dark:text-gray-400'>
                    {invoice.invoice}
                  </td>
                  <td className='py-3 px-4'>
                    <button className='flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors'>
                      <FiDownload className='w-4 h-4' />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Methods */}
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
              Payment Methods
            </h2>
            <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
              Manage your payment methods for subscription billing
            </p>
          </div>
          <button className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors'>
            <FiPlus className='w-4 h-4' />
            Add Payment Method
          </button>
        </div>

        {/* Available Payment Methods Info */}
        <div className='mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg'>
          <h3 className='font-medium text-blue-900 dark:text-blue-300 mb-2'>
            Supported Payment Methods
          </h3>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-6 bg-green-100 dark:bg-green-900/30 rounded flex items-center justify-center'>
                <span className='text-green-600 dark:text-green-400 font-bold text-xs'>
                  TB
                </span>
              </div>
              <div>
                <p className='text-sm font-medium text-blue-900 dark:text-blue-300'>
                  Telebirr
                </p>
                <p className='text-xs text-blue-700 dark:text-blue-400'>
                  Mobile Money
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-6 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center'>
                <span className='text-blue-600 dark:text-blue-400 font-bold text-xs'>
                  CH
                </span>
              </div>
              <div>
                <p className='text-sm font-medium text-blue-900 dark:text-blue-300'>
                  Chapa
                </p>
                <p className='text-xs text-blue-700 dark:text-blue-400'>
                  Payment Gateway
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-6 bg-red-100 dark:bg-red-900/30 rounded flex items-center justify-center'>
                <span className='text-red-600 dark:text-red-400 font-bold text-xs'>
                  CB
                </span>
              </div>
              <div>
                <p className='text-sm font-medium text-blue-900 dark:text-blue-300'>
                  CBE Birr
                </p>
                <p className='text-xs text-blue-700 dark:text-blue-400'>
                  Banking
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-6 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center'>
                <FiCreditCard className='w-4 h-4 text-gray-600 dark:text-gray-400' />
              </div>
              <div>
                <p className='text-sm font-medium text-blue-900 dark:text-blue-300'>
                  Cards
                </p>
                <p className='text-xs text-blue-700 dark:text-blue-400'>
                  Visa/Mastercard
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='space-y-4'>
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className='flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg'
            >
              <div className='flex items-center gap-4'>
                <div
                  className={`w-12 h-8 rounded flex items-center justify-center ${
                    method.type === 'telebirr'
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : method.type === 'chapa'
                        ? 'bg-blue-100 dark:bg-blue-900/30'
                        : method.type === 'cbe_birr'
                          ? 'bg-red-100 dark:bg-red-900/30'
                          : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  {method.type === 'telebirr' ? (
                    <span className='text-green-600 dark:text-green-400 font-bold text-xs'>
                      TB
                    </span>
                  ) : method.type === 'chapa' ? (
                    <span className='text-blue-600 dark:text-blue-400 font-bold text-xs'>
                      CH
                    </span>
                  ) : method.type === 'cbe_birr' ? (
                    <span className='text-red-600 dark:text-red-400 font-bold text-xs'>
                      CB
                    </span>
                  ) : (
                    <FiCreditCard className='w-5 h-5 text-gray-600 dark:text-gray-400' />
                  )}
                </div>
                <div>
                  <div className='flex items-center gap-2'>
                    <span className='font-medium text-gray-900 dark:text-white'>
                      {method.type === 'telebirr' || method.type === 'cbe_birr'
                        ? `${method.name} •••• ${method.phoneNumber?.slice(-4)}`
                        : method.type === 'chapa'
                          ? `${method.name} •••• ${method.last4}`
                          : `${method.brand} •••• ${method.last4}`}
                    </span>
                    {method.isDefault && (
                      <span className='px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full'>
                        Default
                      </span>
                    )}
                  </div>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {method.provider}
                    {method.type === 'card' &&
                      ` • Expires ${method.expiryMonth}/${method.expiryYear}`}
                    {(method.type === 'telebirr' ||
                      method.type === 'cbe_birr') &&
                      ` • Mobile Money`}
                    {method.type === 'chapa' && ` • Payment Gateway`}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => handlePaymentMethodEdit(method.id)}
                  className='p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'
                >
                  <FiEdit className='w-4 h-4' />
                </button>
                <button
                  onClick={() => handlePaymentMethodDelete(method.id)}
                  className='p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors'
                >
                  <FiTrash2 className='w-4 h-4' />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Renewal & Cancellation */}
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6'>
        <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-6'>
          Renewal & Cancellation
        </h2>

        <div className='grid md:grid-cols-2 gap-6'>
          {/* Auto-renewal Settings */}
          <div className='space-y-4'>
            <h3 className='font-medium text-gray-900 dark:text-white'>
              Auto-renewal Settings
            </h3>

            <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
              <div>
                <p className='font-medium text-gray-900 dark:text-white'>
                  Auto-renew subscription
                </p>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  Automatically renew your subscription when it expires
                </p>
              </div>
              <button
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  currentPlan.autoRenew
                    ? 'bg-blue-600'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    currentPlan.autoRenew ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Cancellation Options */}
          <div className='space-y-4'>
            <h3 className='font-medium text-gray-900 dark:text-white'>
              Cancellation Options
            </h3>

            <div className='space-y-3'>
              <button
                onClick={() => setShowCancelModal(true)}
                className='w-full p-4 text-left border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors'
              >
                <div className='flex items-center gap-3'>
                  <FiX className='w-5 h-5 text-red-600 dark:text-red-400' />
                  <div>
                    <p className='font-medium text-red-700 dark:text-red-300'>
                      Cancel subscription
                    </p>
                    <p className='text-sm text-red-600 dark:text-red-400'>
                      Cancel at the end of your billing period
                    </p>
                  </div>
                </div>
              </button>

              <button className='w-full p-4 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'>
                <div className='flex items-center gap-3'>
                  <FiRefreshCw className='w-5 h-5 text-gray-600 dark:text-gray-400' />
                  <div>
                    <p className='font-medium text-gray-900 dark:text-white'>
                      Downgrade plan
                    </p>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Switch to a lower tier plan
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications & Alerts */}
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6'>
        <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-6'>
          Notifications & Alerts
        </h2>

        <div className='space-y-4'>
          <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
            <div className='flex items-center gap-3'>
              <FiBell className='w-5 h-5 text-gray-600 dark:text-gray-400' />
              <div>
                <p className='font-medium text-gray-900 dark:text-white'>
                  Billing reminders
                </p>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  Get notified before your subscription renews
                </p>
              </div>
            </div>
            <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors'>
              <span className='inline-block h-4 w-4 transform rounded-full bg-white translate-x-6' />
            </button>
          </div>

          <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
            <div className='flex items-center gap-3'>
              <FiAlertTriangle className='w-5 h-5 text-gray-600 dark:text-gray-400' />
              <div>
                <p className='font-medium text-gray-900 dark:text-white'>
                  Usage alerts
                </p>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  Get notified when approaching usage limits
                </p>
              </div>
            </div>
            <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors'>
              <span className='inline-block h-4 w-4 transform rounded-full bg-white translate-x-6' />
            </button>
          </div>

          <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
            <div className='flex items-center gap-3'>
              <FiMail className='w-5 h-5 text-gray-600 dark:text-gray-400' />
              <div>
                <p className='font-medium text-gray-900 dark:text-white'>
                  Payment notifications
                </p>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  Get notified about payment successes and failures
                </p>
              </div>
            </div>
            <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors'>
              <span className='inline-block h-4 w-4 transform rounded-full bg-white translate-x-6' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
