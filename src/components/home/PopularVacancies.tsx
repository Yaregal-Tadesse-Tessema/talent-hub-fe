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
      const stats = await jobService.getJobIndustryStats();
      console.log(stats);
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
    <section className='py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <h2 className='text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white'>
          Most Popular Vacancies
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {vacancies.map((vacancy, index) => (
            <div
              key={index}
              className='group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm dark:shadow-gray-900/20 hover:shadow-lg dark:hover:shadow-gray-900/30 transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-100 dark:hover:border-blue-500'
            >
              <div className='flex flex-col h-full'>
                <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                  {vacancy.title}
                </h3>
                <div className='mt-auto flex items-center text-blue-600 dark:text-blue-400'>
                  <span className='text-md'>{vacancy.openPositions}</span>
                  <span className='ml-2 text-sm text-gray-500 dark:text-gray-400'>
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
