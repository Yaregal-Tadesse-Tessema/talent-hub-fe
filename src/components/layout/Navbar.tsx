'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';
import EmployerSelection from '@/components/EmployerSelection';
import { EmployerData, Tenant } from '@/types/employer';
import { API_BASE_URL } from '@/config/api';
import { employerService } from '@/services/employerService';

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
const FlagUS = () => <span className='text-xl'>🇺🇸</span>;
const FlagET = () => <span className='text-xl'>🇪🇹</span>;

interface NavbarProps {
  page?: string;
}

export function Navbar({ page = 'home' }: NavbarProps) {
  const [country, setCountry] = useState('India');
  const [language, setLanguage] = useState('English');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<{
    role: 'employer' | 'employee';
    firstName?: string;
    avatar?: string;
    email?: string;
    selectedEmployer?: EmployerData;
    profile?: { path?: string };
  } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [showEmployerSelection, setShowEmployerSelection] = useState(false);
  const [employers, setEmployers] = useState<EmployerData[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  const languages = [
    { code: 'en', name: 'English', flag: <FlagUS /> },
    { code: 'am', name: 'አማርኛ', flag: <FlagET /> },
  ];

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setShowLanguageDropdown(false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    if (user?.role === 'employer') {
      fetchEmployers();
    }
  }, [user?.role]);

  const fetchEmployers = async () => {
    try {
      const employersData = await employerService.getTenantsByToken();
      setEmployers(employersData);
    } catch (error) {
      console.error('Error fetching employers:', error);
    }
  };

  const handleEmployerSelect = async (employer: EmployerData) => {
    try {
      const data = await employerService.regenerateToken(employer.tenant.id);
      if (user) {
        // Store user data with role as employer
        const userData = {
          ...user,
          role: user.role, // Ensure role is preserved
          selectedEmployer: employer,
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        // Store tokens
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        setShowEmployerSelection(false);

        // Dispatch a custom event to notify all components about the employer change
        const employerChangeEvent = new CustomEvent('employerChanged', {
          detail: { employer },
        });
        window.dispatchEvent(employerChangeEvent);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      setIsMenuVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsMenuVisible(false);
      }, 300); // Match this with the transition duration
      return () => clearTimeout(timer);
    }
  }, [mobileMenuOpen]);

  const showAuthButtons = !user && page === 'home';

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setDropdownOpen(false);
    router.push('/');
  };

  // Links for home page (not logged in)
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/find-job', label: 'Find Job' },
    { href: '/find-candidates', label: 'Find Candidates' },
    { href: '/pricing', label: 'Pricing Plans' },
    { href: '/customer-supports', label: 'Customer Supports' },
  ];

  // Links for employer
  const employerNavLinks = [
    { href: '/find-candidates', label: 'Find Candidates' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/my-jobs', label: 'My Jobs' },
    { href: '/applications', label: 'Applications' },
    { href: '/customer-supports', label: 'Customer Supports' },
  ];

  // Links for employee
  const employeeNavLinks = [
    { href: '/find-job', label: 'Find Job' },
    { href: '/find-employers', label: 'Find Employers' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/job-alerts', label: 'Job Alerts' },
    { href: '/customer-supports', label: 'Customer Supports' },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Handle language dropdown
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setShowLanguageDropdown(false);
      }

      // Handle profile dropdown
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className='w-full border-b bg-white sticky top-0 z-50'>
      <div className='flex items-center justify-between px-4 md:px-6 py-4 text-sm text-gray-800 bg-gray-100'>
        <div className='flex-1'>
          <nav className='gap-6 hidden md:flex'>
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
        </div>
        <div className='flex items-center gap-4'>
          {user?.role === 'employer' && (
            <div className='hidden md:flex items-center gap-2'>
              <button
                onClick={() => setShowEmployerSelection(true)}
                className='flex items-center justify-between min-w-52 gap-2 px-3 py-1.5 border rounded-md hover:bg-gray-50'
              >
                <div className='flex items-center gap-2'>
                  <div className='w-6 h-6 rounded bg-gray-200 flex items-center justify-center text-xs font-semibold'>
                    {user.selectedEmployer?.tenant.tradeName[0] || '?'}
                  </div>
                  <span className='font-medium'>
                    {user.selectedEmployer?.tenant.tradeName ||
                      'No Company Selected'}
                  </span>
                </div>
                <svg
                  width='12'
                  height='12'
                  fill='none'
                  viewBox='0 0 20 20'
                  stroke='currentColor'
                >
                  <path d='M6 8l4 4 4-4' strokeWidth='2' />
                </svg>
              </button>
            </div>
          )}
          {!(user && user.role === 'employer') && (
            <>
              <span className='hidden md:flex items-center gap-1'>
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
                +251-911-123-456
              </span>
              <div
                className='hidden md:flex items-center gap-1 relative'
                ref={languageDropdownRef}
              >
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className='flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100'
                >
                  {languages.find((lang) => lang.name === language)?.flag || (
                    <FlagUS />
                  )}
                  <span>{language}</span>
                  <svg
                    width='12'
                    height='12'
                    fill='none'
                    viewBox='0 0 20 20'
                    stroke='currentColor'
                    className={`transform transition-transform duration-200 ${
                      showLanguageDropdown ? 'rotate-180' : ''
                    }`}
                  >
                    <path d='M6 8l4 4 4-4' strokeWidth='2' />
                  </svg>
                </button>

                {showLanguageDropdown && (
                  <div className='absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200'>
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.name)}
                        className={`flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 ${
                          language === lang.name ? 'bg-gray-50' : ''
                        }`}
                      >
                        {lang.flag}
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
          <button
            className='md:hidden flex items-center'
            aria-label='Open menu'
            onClick={() => setMobileMenuOpen(true)}
          >
            <svg
              width='28'
              height='28'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path d='M4 6h16M4 12h16M4 18h16' strokeWidth='2' />
            </svg>
          </button>
        </div>
      </div>
      <div className='flex items-center justify-between px-4 md:px-6 py-4 bg-white'>
        <div className='flex items-center gap-2'>
          <BriefcaseIcon />
          <span className='text-2xl font-bold ml-2'>TalentHub</span>
        </div>
        {!(user && user.role === 'employer') && (
          <div className='hidden md:flex items-center w-1/2 max-w-xl'>
            <div className='flex items-center border rounded-l-md px-3 py-2 bg-gray-50'>
              <FlagET />
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
              <div className='relative flex items-center gap-3'>
                <button className='relative'>
                  <BellIcon />
                  <span className='absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white'></span>
                </button>
                {user.role === 'employer' && (
                  <Link href='/dashboard?tab=post-job'>
                    <button className='flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700'>
                      <svg
                        width='24'
                        height='24'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          d='M12 4v16m8-8H4'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                      Add Job
                    </button>
                  </Link>
                )}
              </div>
              <div className='relative' ref={profileDropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className='focus:outline-none'
                >
                  {user.profile?.path ? (
                    <img
                      src={user.profile.path}
                      alt='avatar'
                      className='w-10 h-10 rounded-full object-cover'
                    />
                  ) : (
                    <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600'>
                      {user.firstName ? user.firstName[0] : 'U'}
                    </div>
                  )}
                </button>
                {dropdownOpen && (
                  <div className='absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50'>
                    {user.role === 'employee' && (
                      <Link href='/profile'>
                        <button
                          className='block w-full text-left px-4 py-2 hover:bg-gray-100 text-sky-600'
                          onClick={() => setDropdownOpen(false)}
                        >
                          Profile
                        </button>
                      </Link>
                    )}
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
      {isMenuVisible && (
        <div
          className={`fixed inset-0 z-50 bg-black bg-opacity-40 md:hidden transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          } flex`}
        >
          <div
            className={`fixed right-0 top-0 h-full w-80 max-w-full bg-white shadow-lg flex flex-col transform transition-transform duration-300 ease-in-out ${
              mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className='flex items-center justify-between px-4 py-4 border-b'>
              <div className='flex items-center gap-2'>
                <BriefcaseIcon />
                <span className='text-2xl font-bold ml-2'>TalentHub</span>
              </div>
              <button
                aria-label='Close menu'
                onClick={() => setMobileMenuOpen(false)}
                className='p-2 rounded hover:bg-gray-100'
              >
                <svg
                  width='24'
                  height='24'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path d='M6 18L18 6M6 6l12 12' strokeWidth='2' />
                </svg>
              </button>
            </div>
            <nav className='flex flex-col gap-2 px-4 py-2'>
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
                    'py-2 px-2 rounded hover:bg-blue-50',
                    pathname === link.href && 'text-blue-600 font-semibold',
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className='flex flex-col gap-2 px-4 mt-4'>
              {showAuthButtons ? (
                <>
                  <Link href='/register'>
                    <button className='w-full px-4 py-2 bg-blue-600 text-white rounded-md font-medium'>
                      Create Account
                    </button>
                  </Link>
                  <Link href='/login'>
                    <button className='w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-md font-medium bg-white'>
                      Sign In
                    </button>
                  </Link>
                </>
              ) : user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className='w-full px-4 py-2 border border-red-600 text-red-600 rounded-md font-medium bg-white mt-2'
                >
                  Logout
                </button>
              ) : null}
            </div>
          </div>
          <div className='flex-1' onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
      {showEmployerSelection && (
        <EmployerSelection
          employers={employers}
          onSelect={handleEmployerSelect}
          isOpen={showEmployerSelection}
          onClose={() => setShowEmployerSelection(false)}
        />
      )}
    </header>
  );
}
