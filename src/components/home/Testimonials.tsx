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
  <svg width='32' height='32' fill='none' viewBox='0 0 24 24' stroke='#E5E7EB'>
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
    className='w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow border border-gray-200 hover:bg-blue-50 transition disabled:opacity-50'
    aria-label={left ? 'Previous' : 'Next'}
  >
    <svg
      width='24'
      height='24'
      fill='none'
      viewBox='0 0 24 24'
      stroke='#2563eb'
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
    <section className='py-20 bg-[#F6F8FA]'>
      <div className='max-w-7xl mx-auto px-4'>
        <h2 className='text-4xl font-bold text-center mb-14'>
          Clients Testimonial
        </h2>
        <div className='flex items-center justify-center gap-4'>
          <ArrowButton
            left
            onClick={() =>
              setIndex(
                (i) => (i - 1 + testimonials.length) % testimonials.length,
              )
            }
          />
          <div className='flex gap-8 w-full max-w-4xl'>
            {visible.map((t, i) => (
              <div
                key={i}
                className='bg-white rounded-2xl shadow-lg p-8 flex-1 flex flex-col justify-between min-h-[320px] relative'
              >
                <div>
                  <div className='flex gap-1 mb-4'>
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} />
                    ))}
                  </div>
                  <div className='text-gray-600 text-lg mb-8'>“{t.text}”</div>
                </div>
                <div className='flex items-center gap-4 mt-auto'>
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className='w-12 h-12 rounded-full object-cover border-2 border-white shadow'
                  />
                  <div>
                    <div className='font-semibold text-gray-900'>{t.name}</div>
                    <div className='text-gray-400 text-sm'>{t.role}</div>
                  </div>
                  <span className='ml-auto opacity-30'>
                    <QuoteIcon />
                  </span>
                </div>
              </div>
            ))}
          </div>
          <ArrowButton
            onClick={() => setIndex((i) => (i + 1) % testimonials.length)}
          />
        </div>
        <div className='flex justify-center gap-2 mt-8'>
          {testimonials.map((_, i) => (
            <span
              key={i}
              className={
                i === index
                  ? 'w-4 h-4 rounded-full bg-blue-600 inline-block'
                  : 'w-3 h-3 rounded-full bg-blue-200 inline-block'
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
