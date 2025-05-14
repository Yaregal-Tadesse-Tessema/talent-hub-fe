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

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <PopularVacancies />
      <HowItWorks />
      <PopularCategory />
      <FeaturedJobs />
      <Testimonials />
      <RegisterCards />
    </main>
  );
}
