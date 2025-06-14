import { jobService } from '@/services/jobService';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface Vacancy {
  title: string;
  openPositions: string;
}

export default function PopularVacancies() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);

  useEffect(() => {
    const fetchJobStats = async () => {
      const stats = await jobService.getJobStats();
      const sortedAndLimitedStats = stats
        .sort(
          (a: Vacancy, b: Vacancy) =>
            parseInt(b.openPositions) - parseInt(a.openPositions),
        )
        .slice(0, 6);

      setVacancies(sortedAndLimitedStats);
    };
    fetchJobStats();
  }, []);

  return (
    <section className='py-12 sm:py-16 lg:py-20 bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <h2 className='text-3xl sm:text-4xl font-bold text-center mb-12'>
          Most Popular Vacancies
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {vacancies.map((vacancy, index) => (
            <div
              key={index}
              className='group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-100'
            >
              <div className='flex flex-col h-full'>
                <h3 className='text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors'>
                  {vacancy.title}
                </h3>
                <div className='mt-auto flex items-center text-blue-600'>
                  <span className='text-md'>{vacancy.openPositions}</span>
                  <span className='ml-2 text-sm text-gray-500'>
                    Open Positions
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
