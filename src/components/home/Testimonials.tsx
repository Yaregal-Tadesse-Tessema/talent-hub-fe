import React, { useState } from 'react';

const testimonials = [
  {
    name: 'Robert Fox',
    role: 'UI/UX Designer',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    text: 'Ut ullamcorper hendrerit tempor. Aliquam in rutrum dui. Maecenas ac placerat metus, in faucibus est.',
    rating: 5,
  },
  {
    name: 'Bessie Cooper',
    role: 'Creative Director',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    text: 'Mauris eget lorem odio. Mauris convallis justo molestie metus aliquam lacinia. Suspendisse ut dui vulputate augue condimentum ornare. Morbi vitae tristique ante',
    rating: 5,
  },
  {
    name: 'Jane Cooper',
    role: 'Photographer',
    avatar: 'https://randomuser.me/api/portraits/men/43.jpg',
    text: 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Suspendisse et magna quis nibh accumsan venenatis sit amet id orci. Duis vestibulum bibendum dapibus.',
    rating: 5,
  },
];

const Star = () => (
  <svg width='20' height='20' fill='#FACC15' viewBox='0 0 24 24'>
    <path d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' />
  </svg>
);
const QuoteIcon = () => (
  <svg
    width='32'
    height='32'
    fill='none'
    viewBox='0 0 24 24'
    stroke='#E5E7EB'
    className='dark:stroke-gray-600'
  >
    <path
      d='M7 17a4 4 0 0 1 4-4V7a4 4 0 0 0-4 4v6zm10 0a4 4 0 0 1 4-4V7a4 4 0 0 0-4 4v6z'
      strokeWidth='2'
    />
  </svg>
);
const ArrowButton = ({
  left,
  onClick,
  disabled,
}: {
  left?: boolean;
  onClick: () => void;
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className='w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-700 rounded-lg shadow dark:shadow-gray-900/20 border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-600 transition disabled:opacity-50'
    aria-label={left ? 'Previous' : 'Next'}
  >
    <svg
      width='24'
      height='24'
      fill='none'
      viewBox='0 0 24 24'
      stroke='#2563eb'
      className='dark:stroke-blue-400'
      strokeWidth='2'
    >
      {left ? <path d='M15 19l-7-7 7-7' /> : <path d='M9 5l7 7-7 7' />}
    </svg>
  </button>
);

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const visible = [
    testimonials[(index + 0) % testimonials.length],
    testimonials[(index + 1) % testimonials.length],
    testimonials[(index + 2) % testimonials.length],
  ];
  return (
    <section className='py-12 sm:py-16 lg:py-20 bg-[#F6F8FA] dark:bg-gray-900'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <h2 className='text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 lg:mb-14 text-gray-900 dark:text-white'>
          Clients Testimonial
        </h2>
        <div className='flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6'>
          <div className='hidden sm:block'>
            <ArrowButton
              left
              onClick={() =>
                setIndex(
                  (i) => (i - 1 + testimonials.length) % testimonials.length,
                )
              }
            />
          </div>
          <div className='flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 w-full max-w-4xl'>
            {visible.map((t, i) => (
              <div
                key={i}
                className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/20 p-6 sm:p-8 flex-1 flex flex-col justify-between min-h-[280px] sm:min-h-[320px] relative'
              >
                <div>
                  <div className='flex gap-1 mb-4'>
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} />
                    ))}
                  </div>
                  <div className='text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-6 sm:mb-8'>
                    "{t.text}"
                  </div>
                </div>
                <div className='flex items-center gap-3 sm:gap-4 mt-auto'>
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className='w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow'
                  />
                  <div>
                    <div className='font-semibold text-gray-900 dark:text-white text-sm sm:text-base'>
                      {t.name}
                    </div>
                    <div className='text-gray-400 dark:text-gray-400 text-xs sm:text-sm'>
                      {t.role}
                    </div>
                  </div>
                  <span className='ml-auto opacity-30 hidden sm:block'>
                    <QuoteIcon />
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className='hidden sm:block'>
            <ArrowButton
              onClick={() => setIndex((i) => (i + 1) % testimonials.length)}
            />
          </div>
          <div className='flex sm:hidden gap-2 mt-4'>
            <ArrowButton
              left
              onClick={() =>
                setIndex(
                  (i) => (i - 1 + testimonials.length) % testimonials.length,
                )
              }
            />
            <ArrowButton
              onClick={() => setIndex((i) => (i + 1) % testimonials.length)}
            />
          </div>
        </div>
        <div className='flex justify-center gap-2 mt-6 sm:mt-8'>
          {testimonials.map((_, i) => (
            <span
              key={i}
              className={
                i === index
                  ? 'w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-600 dark:bg-blue-400 inline-block'
                  : 'w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-200 dark:bg-blue-900/30 inline-block'
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
