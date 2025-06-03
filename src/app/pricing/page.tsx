'use client';

import { CheckIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

const tiers = [
  {
    name: 'Basic',
    id: 'tier-basic',
    price: {
      monthly: '$1,000',
      yearly: '$7,000',
    },
    description: 'Perfect for small businesses just getting started.',
    features: [
      'Post up to 5 jobs',
      'Basic candidate search',
      'Email support',
      'Basic analytics',
      'Standard job posting duration',
      'Resume database access',
    ],
    cta: 'Start with Basic',
    mostPopular: false,
  },
  {
    name: 'Professional',
    id: 'tier-professional',
    price: {
      monthly: '$2,000',
      yearly: '$14,000',
    },
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
    cta: 'Start with Professional',
    mostPopular: true,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    price: {
      monthly: '$5,000',
      yearly: '$50,000',
    },
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
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    mostPopular: false,
  },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className='bg-white py-14 sm:py-12'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-4xl text-center'>
          <h2 className='text-base font-semibold leading-7 text-blue-600'>
            Pricing
          </h2>
          <p className='mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
            Choose the right plan for&nbsp;your&nbsp;business
          </p>
        </div>
        <p className='mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600'>
          Whether you're just starting out or looking to scale your hiring
          process, we have a plan that fits your needs.
        </p>

        {/* Billing toggle */}
        <div className='mt-8 flex justify-center'>
          <div className='relative flex items-center p-1 rounded-full bg-gray-100'>
            <button
              onClick={() => setIsYearly(false)}
              className={`${
                !isYearly ? 'bg-white shadow-sm' : 'text-gray-500'
              } relative w-24 py-2 text-sm font-medium rounded-full transition-all duration-200 ease-in-out`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`${
                isYearly ? 'bg-white shadow-sm' : 'text-gray-500'
              } relative w-24 py-2 text-sm font-medium rounded-full transition-all duration-200 ease-in-out`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className='isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 gap-x-4 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3'>
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10 ${
                tier.mostPopular ? 'border-2 border-blue-600' : ''
              }`}
            >
              <div>
                <div className='flex items-center justify-between gap-x-4'>
                  <h3
                    className={`text-lg font-semibold leading-8 ${
                      tier.mostPopular ? 'text-blue-600' : 'text-gray-900'
                    }`}
                  >
                    {tier.name}
                  </h3>
                  {tier.mostPopular && (
                    <p className='rounded-full bg-blue-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-blue-600'>
                      Most popular
                    </p>
                  )}
                </div>
                <p className='mt-4 text-sm leading-6 text-gray-600'>
                  {tier.description}
                </p>
                <p className='mt-6 flex items-baseline gap-x-1'>
                  <span className='text-4xl font-bold tracking-tight text-gray-900'>
                    {isYearly ? tier.price.yearly : tier.price.monthly}
                  </span>
                  <span className='text-sm font-semibold leading-6 text-gray-600'>
                    /{isYearly ? 'year' : 'month'}
                  </span>
                </p>
                <ul
                  role='list'
                  className='mt-8 space-y-3 text-sm leading-6 text-gray-600'
                >
                  {tier.features.map((feature) => (
                    <li key={feature} className='flex gap-x-3'>
                      <CheckIcon
                        className='h-6 w-5 flex-none text-blue-600'
                        aria-hidden='true'
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href={tier.id === 'tier-enterprise' ? '/contact' : '/register'}
                className={`mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  tier.mostPopular
                    ? 'bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600'
                    : 'bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600'
                }`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
