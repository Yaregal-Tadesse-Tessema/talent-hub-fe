import Link from 'next/link';
import React from 'react';

const vacancies = [
  [
    { title: 'Anesthesiologists', count: '45,904' },
    { title: 'Maxillofacial Surgeons', count: '74,875' },
    { title: 'Financial Manager', count: '61,391' },
  ],
  [
    { title: 'Surgeons', count: '50,364' },
    { title: 'Software Developer', count: '43,359' },
    { title: 'Management Analysis', count: '93,046' },
  ],
  [
    { title: 'Obstetricians-Gynecologists', count: '4,339' },
    { title: 'Psychiatrists', count: '18,599' },
    { title: 'IT Manager', count: '50,963' },
  ],
  [
    { title: 'Orthodontists', count: '20,079' },
    { title: 'Data Scientist', count: '28,200', link: true },
    { title: 'Operations Research Analysis', count: '16,627' },
  ],
];

export default function PopularVacancies() {
  return (
    <section className='py-20 bg-white'>
      <div className='max-w-5xl mx-auto px-4'>
        <h2 className='text-4xl font-bold text-center mb-14'>
          Most Popular Vacancies
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-10'>
          {vacancies.map((col, i) => (
            <div key={i} className='space-y-10'>
              {col.map((job, j) => (
                <div key={j}>
                  {job.link ? (
                    <Link
                      href='#'
                      className='text-lg font-semibold text-blue-600 hover:underline'
                    >
                      {job.title}
                    </Link>
                  ) : (
                    <div className='text-lg font-semibold text-gray-900'>
                      {job.title}
                    </div>
                  )}
                  <div className='text-gray-400 text-base'>
                    {job.count} Open Positions
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
