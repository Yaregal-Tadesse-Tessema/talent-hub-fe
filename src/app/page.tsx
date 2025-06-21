'use client';

import * as React from 'react';
import '@/lib/env';

import FeaturedJobs from '@/components/home/FeaturedJobs';
import HeroSection from '@/components/home/HeroSection';
import HowItWorks from '@/components/home/HowItWorks';
import PopularCategory from '@/components/home/PopularCategory';
import PopularVacancies from '@/components/home/PopularVacancies';
import RegisterCards from '@/components/home/RegisterCards';
import Testimonials from '@/components/home/Testimonials';
import TopCompanies from '@/components/home/TopCompanies';
import CVBuilderSection from '@/components/home/CVBuilderSection';

export default function HomePage() {
  return (
    <main className='min-h-screen w-full overflow-x-hidden bg-white dark:bg-gray-900 transition-colors duration-300'>
      <div className='w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8'>
        <HeroSection />
        <CVBuilderSection />
        <PopularVacancies />
        <HowItWorks />
        <PopularCategory />
        <FeaturedJobs />
        <TopCompanies />
        <Testimonials />
        <RegisterCards />
      </div>
    </main>
  );
}
