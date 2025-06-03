import Link from 'next/link';

const BriefcaseIcon = () => (
  <svg
    width='32'
    height='32'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    className='text-white'
  >
    <rect x='3' y='7' width='18' height='13' rx='2' strokeWidth='2' />
    <path d='M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2' strokeWidth='2' />
  </svg>
);
const ArrowRight = () => (
  <svg
    width='18'
    height='18'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
  >
    <path d='M9 5l7 7-7 7' strokeWidth='2' />
  </svg>
);
const SocialIcon = ({ children }: { children: React.ReactNode }) => (
  <span className='inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors'>
    {children}
  </span>
);

export function Footer() {
  return (
    <footer className='bg-gray-900 text-gray-300 pt-16 pb-8 px-4 md:px-0'>
      <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 pb-8 border-b border-gray-800'>
        <div className='col-span-1 flex flex-col gap-4'>
          <div className='flex items-center gap-2 mb-2'>
            <BriefcaseIcon />
            <span className='text-2xl font-bold text-white ml-2'>
              TalentHub
            </span>
          </div>
          <div>
            <span className='text-gray-400'>Call now:</span>{' '}
            <span className='text-white font-semibold'>(+251) 965-123-456</span>
          </div>
          <div className='text-gray-400 text-sm'>
            Bole, Addis Ababa, Ethiopia
          </div>
        </div>
        <div>
          <h4 className='text-white font-semibold mb-4'>Quick Link</h4>
          <ul className='space-y-2'>
            <li>
              <Link href='/about'>About</Link>
            </li>
            <li className='flex items-center gap-1 text-white font-semibold'>
              <ArrowRight /> Contact
            </li>
            <li>
              <Link href='/pricing'>Pricing</Link>
            </li>
            <li>
              <Link href='/blog'>Blog</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className='text-white font-semibold mb-4'>Candidate</h4>
          <ul className='space-y-2'>
            <li>
              <Link href='/jobs'>Browse Jobs</Link>
            </li>
            <li>
              <Link href='/employers'>Browse Employers</Link>
            </li>
            <li>
              <Link href='/candidate-dashboard'>Candidate Dashboard</Link>
            </li>
            <li>
              <Link href='/saved-jobs'>Saved Jobs</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className='text-white font-semibold mb-4'>Employers</h4>
          <ul className='space-y-2'>
            <li>
              <Link href='/post-job'>Post a Job</Link>
            </li>
            <li>
              <Link href='/candidates'>Browse Candidates</Link>
            </li>
            <li>
              <Link href='/employers-dashboard'>Employers Dashboard</Link>
            </li>
            <li>
              <Link href='/applications'>Applications</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className='text-white font-semibold mb-4'>Support</h4>
          <ul className='space-y-2'>
            <li>
              <Link href='/faqs'>Faqs</Link>
            </li>
            <li>
              <Link href='/privacy-policy'>Privacy Policy</Link>
            </li>
            <li>
              <Link href='/terms'>Terms & Conditions</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className='max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-6 text-gray-500 text-sm gap-4'>
        <div>@ 2025 Talent hub. All rights reserved</div>
        <div className='flex gap-4'>
          <SocialIcon>
            <svg width='20' height='20' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M18 2h-3a5 5 0 0 0-5 5v3H6v4h4v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' />
            </svg>
          </SocialIcon>
          <SocialIcon>
            <svg width='20' height='20' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.4.36a9.09 9.09 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.11 0c-2.5 0-4.52 2.02-4.52 4.52 0 .35.04.7.11 1.03A12.94 12.94 0 0 1 3.1.67a4.52 4.52 0 0 0-.61 2.28c0 1.57.8 2.96 2.02 3.77A4.48 4.48 0 0 1 2 6.13v.06c0 2.2 1.56 4.03 3.64 4.45a4.52 4.52 0 0 1-2.04.08c.57 1.78 2.23 3.08 4.2 3.12A9.06 9.06 0 0 1 0 19.54a12.8 12.8 0 0 0 6.95 2.04c8.34 0 12.9-6.91 12.9-12.9 0-.2 0-.39-.01-.58A9.22 9.22 0 0 0 24 4.59a9.1 9.1 0 0 1-2.6.71z' />
            </svg>
          </SocialIcon>
          <SocialIcon>
            <svg width='20' height='20' fill='currentColor' viewBox='0 0 24 24'>
              <circle cx='12' cy='12' r='10' />
              <rect x='9' y='9' width='6' height='6' rx='1' />
              <circle cx='15.5' cy='8.5' r='1.5' />
            </svg>
          </SocialIcon>
          <SocialIcon>
            <svg width='20' height='20' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M22.46 6c-.77.35-1.6.59-2.46.7a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99A12.13 12.13 0 0 1 3.1 5.1a4.29 4.29 0 0 0-.58 2.16c0 1.49.76 2.8 1.92 3.57a4.28 4.28 0 0 1-1.94-.54v.05c0 2.08 1.48 3.81 3.44 4.2a4.3 4.3 0 0 1-1.93.07c.54 1.68 2.1 2.9 3.95 2.93A8.6 8.6 0 0 1 2 19.13a12.13 12.13 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.38-.01-.57A8.72 8.72 0 0 0 24 4.59a8.59 8.59 0 0 1-2.54.7z' />
            </svg>
          </SocialIcon>
        </div>
      </div>
    </footer>
  );
}
