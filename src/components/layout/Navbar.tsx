'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { cn } from '@/lib/utils';

// Placeholder icons (replace with Heroicons or similar in real app)
const BriefcaseIcon = () => (
  <svg
    width='32'
    height='32'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    className='text-blue-600'
  >
    <rect x='3' y='7' width='18' height='13' rx='2' strokeWidth='2' />
    <path d='M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2' strokeWidth='2' />
  </svg>
);
const SearchIcon = () => (
  <svg
    width='20'
    height='20'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
  >
    <circle cx='11' cy='11' r='7' strokeWidth='2' />
    <path d='M21 21l-4.35-4.35' strokeWidth='2' />
  </svg>
);
const BellIcon = () => (
  <svg
    width='24'
    height='24'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
  >
    <path
      d='M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9'
      strokeWidth='2'
    />
  </svg>
);
const FlagETH = () => <span className='text-xl'>🇪🇹</span>;

const FlagUS = () => <span className='text-xl'>🇺🇸</span>;

interface NavbarProps {
  page?: string;
}

export function Navbar({ page = 'home' }: NavbarProps) {
  const [country, setCountry] = useState('India');
  const [language, setLanguage] = useState('English');
  const [user, setUser] = useState<{
    role: 'employer' | 'employee';
    name?: string;
    avatar?: string;
  } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }
  }, []);

  const showAuthButtons = !user && page === 'home';

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setDropdownOpen(false);
    router.push('/login');
  };

  // Links for home page (not logged in)
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/find-job', label: 'Find Job' },
    { href: '/employers', label: 'Employers' },
    { href: '/find-candidates', label: 'Find Candidates' },
    { href: '/candidates', label: 'Candidates' },
    { href: '/pricing', label: 'Pricing Plans' },
    { href: '/customer-supports', label: 'Customer Supports' },
  ];

  // Links for employer
  const employerNavLinks = [
    { href: '/', label: 'Home' },
    { href: '/find-candidates', label: 'Find Candidates' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/my-jobs', label: 'My Jobs' },
    { href: '/applications', label: 'Applications' },
    { href: '/customer-supports', label: 'Customer Supports' },
  ];

  // Links for employee
  const employeeNavLinks = [
    { href: '/', label: 'Home' },
    { href: '/find-job', label: 'Find Job' },
    { href: '/find-employers', label: 'Find Employers' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/job-alerts', label: 'Job Alerts' },
    { href: '/customer-supports', label: 'Customer Supports' },
  ];

  return (
    <header className='w-full border-b bg-white sticky top-0 z-50'>
      <div className='flex items-center justify-between px-16 py-4 text-sm text-gray-800 bg-gray-100'>
        <nav className='flex gap-6'>
          {(user && user.role === 'employer'
            ? employerNavLinks
            : user && user.role === 'employee'
              ? employeeNavLinks
              : navLinks
          ).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'hover:text-blue-600 transition-colors',
                pathname === link.href &&
                  'text-blue-600 border-b-2 border-blue-600 pb-2',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className='flex items-center gap-4'>
          {!(user && user.role === 'employer') && (
            <>
              <span className='flex items-center gap-1'>
                <svg
                  width='18'
                  height='18'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    d='M22 16.92V19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2.08a6 6 0 0 1 2.09-4.58l5.91-5.33a2 2 0 0 1 2.58 0l5.91 5.33A6 6 0 0 1 22 16.92z'
                    strokeWidth='2'
                  />
                </svg>{' '}
                +1-202-555-0178
              </span>
              <div className='flex items-center gap-1 cursor-pointer'>
                <FlagUS />
                <span>{language}</span>
                <svg
                  width='12'
                  height='12'
                  fill='none'
                  viewBox='0 0 20 20'
                  stroke='currentColor'
                >
                  <path d='M6 8l4 4 4-4' strokeWidth='2' />
                </svg>
              </div>
            </>
          )}
        </div>
      </div>
      <div className='flex items-center justify-between px-16 py-4 bg-white'>
        <div className='flex items-center gap-2'>
          <BriefcaseIcon />
          <span className='text-2xl font-bold ml-2'>TalentHub</span>
        </div>
        {!(user && user.role === 'employer') && (
          <div className='flex items-center w-1/2 max-w-xl'>
            <div className='flex items-center border rounded-l-md px-3 py-2 bg-gray-50'>
              <FlagETH />
              <span className='ml-2'>Ethiopia</span>
              <svg
                width='12'
                height='12'
                fill='none'
                viewBox='0 0 20 20'
                stroke='currentColor'
                className='ml-1'
              >
                <path d='M6 8l4 4 4-4' strokeWidth='2' />
              </svg>
            </div>
            <input
              className='flex-1 border-t border-b border-r rounded-r-md px-4 py-2 focus:outline-none'
              placeholder='Job tittle, keyword, company'
            />
            <button className='-ml-8 z-10'>
              <SearchIcon />
            </button>
          </div>
        )}
        <div className='flex items-center gap-4'>
          {showAuthButtons ? (
            <>
              <Link href='/login'>
                <button className='px-6 py-2 border border-blue-600 text-blue-600 rounded-md font-medium bg-white hover:bg-blue-50'>
                  Sign In
                </button>
              </Link>
            </>
          ) : user ? (
            <>
              <div className='relative flex items-center gap-2'>
                <button className='relative'>
                  <BellIcon />
                  <span className='absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white'></span>
                </button>
                {user.role === 'employer' && (
                  <Link href='/post-job'>
                    <button className='px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700'>
                      Post A Job
                    </button>
                  </Link>
                )}
              </div>
              <div className='relative'>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className='focus:outline-none'
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt='avatar'
                      className='w-10 h-10 rounded-full object-cover'
                    />
                  ) : (
                    <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600'>
                      {user.name ? user.name[0] : 'U'}
                    </div>
                  )}
                </button>
                {dropdownOpen && (
                  <div className='absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50'>
                    <button
                      onClick={handleLogout}
                      className='block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600'
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
