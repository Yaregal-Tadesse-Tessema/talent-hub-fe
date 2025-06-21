'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

import { cn } from '@/lib/utils';
import EmployerSelection from '@/components/EmployerSelection';
import { EmployerData, Tenant } from '@/types/employer';
import { API_BASE_URL } from '@/config/api';
import { employerService } from '@/services/employerService';
import { notificationService } from '@/services/notificationService';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

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
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
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
    logout();
  };

  // Links for home page (not logged in)
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/find-job', label: 'Find Job' },
    { href: '/find-candidates', label: 'Find Candidates' },
    { href: '/pricing', label: 'Pricing Plans' },
    { href: '/customer-supports', label: 'Support' },
  ];

  // Links for employer
  const employerNavLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/find-candidates', label: 'Find Candidates' },
    { href: '/customer-supports', label: 'Support' },
  ];

  // Links for employee
  const employeeNavLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/find-job', label: 'Find Job' },
    { href: '/find-employers', label: 'Find Employers' },
    { href: '/customer-supports', label: 'Support' },
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

      // Handle notification dropdown
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target as Node)
      ) {
        setNotificationDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      if (user) {
        try {
          const count = await notificationService.getNotificationCount();
          setNotificationCount(count);
        } catch (error) {
          setNotificationCount(0);
        }
      }
    };
    fetchNotificationCount();
  }, [user]);

  return (
    <header className='w-full border-b bg-white dark:bg-gray-900 sticky top-0 z-50'>
      <div className='flex items-center justify-between px-4 md:px-6 py-4 text-sm text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800'>
        <div className='flex-1'>
          <nav className='hidden md:flex items-center gap-6'>
            <div className='flex items-center gap-2 w-52'>
              <Link
                href='/'
                className='flex items-center gap-1 hover:opacity-80 transition-opacity'
              >
                <BriefcaseIcon />
                <span className='text-2xl text-blue-600 dark:text-blue-400 font-bold ml-1'>
                  TalentHub
                </span>
              </Link>
            </div>
            <div className='flex items-center gap-6'>
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
                    'hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-3 py-1.5 relative',
                    pathname === link.href &&
                      'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/50 dark:bg-blue-900/20 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-blue-600 before:rounded-r',
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
        <div className='flex items-center gap-4'>
          {user?.role === 'employer' && (
            <div className='hidden md:flex items-center gap-2'>
              <button
                onClick={() => setShowEmployerSelection(true)}
                className='flex items-center justify-between min-w-52 gap-2 px-3 py-1.5 border dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700 dark:text-white'
              >
                <div className='flex items-center gap-2'>
                  <div className='w-6 h-6 rounded bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-semibold'>
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

          {showAuthButtons ? (
            <>
              <Link href='/signup'>
                <button className='px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-md font-bold shadow-md hover:from-blue-600 hover:to-cyan-600 transition-all duration-200'>
                  Register
                </button>
              </Link>
              <Link href='/login'>
                <button className='px-6 py-2 border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-md font-medium bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 ml-2'>
                  Sign In
                </button>
              </Link>
            </>
          ) : user ? (
            <>
              <div className='relative flex items-center gap-3'>
                <ThemeToggle />

                <div className='relative' ref={notificationDropdownRef}>
                  <button
                    className='relative'
                    onClick={async () => {
                      setNotificationDropdownOpen((v) => !v);
                      if (!notificationDropdownOpen && user) {
                        try {
                          const newNotifications =
                            await notificationService.getNewNotifications();
                          setNotifications(newNotifications);
                        } catch (error) {
                          setNotifications([]);
                        }
                      }
                    }}
                  >
                    <BellIcon />
                    {notificationCount > 0 && (
                      <span className='absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center ring-2 ring-white dark:ring-gray-800'>
                        {notificationCount}
                      </span>
                    )}
                  </button>
                  {notificationDropdownOpen && (
                    <div className='absolute right-0 mt-2 w-80 max-w-xs bg-white dark:bg-gray-800 border dark:border-gray-600 rounded shadow-lg z-50 overflow-y-auto max-h-96'>
                      <div className='p-4 border-b dark:border-gray-600 font-semibold dark:text-white'>
                        Notifications
                      </div>
                      {notifications.length === 0 ? (
                        <div className='p-4 text-gray-500 dark:text-gray-400 text-sm'>
                          No new notifications
                        </div>
                      ) : (
                        <ul className='divide-y dark:divide-gray-600'>
                          {notifications.map((notif, idx) => (
                            <li
                              key={notif.id || idx}
                              className='p-4 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm dark:text-white'
                            >
                              {notif.message ||
                                notif.title ||
                                'New notification'}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
                {user.role === 'employer' && (
                  <Link href='/post-job'>
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
                    <div className='w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-lg font-bold text-gray-600 dark:text-gray-300'>
                      {user.firstName ? user.firstName[0] : 'U'}
                    </div>
                  )}
                </button>
                {dropdownOpen && (
                  <div className='absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded shadow-lg z-50'>
                    {user.role === 'employee' && (
                      <Link href='/profile'>
                        <button
                          className='block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sky-600 dark:text-sky-400'
                          onClick={() => setDropdownOpen(false)}
                        >
                          Profile
                        </button>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className='block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400'
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : null}

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

      {isMenuVisible && (
        <div
          className={`fixed inset-0 z-50 bg-black bg-opacity-40 md:hidden transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          } flex`}
        >
          <div
            className={`fixed right-0 top-0 h-full w-80 max-w-full bg-white dark:bg-gray-900 shadow-lg flex flex-col transform transition-transform duration-300 ease-in-out ${
              mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className='flex items-center justify-between px-4 py-4 border-b dark:border-gray-700'>
              <div className='flex items-center gap-2'>
                <BriefcaseIcon />
                <span className='text-2xl font-bold ml-2 dark:text-white'>
                  TalentHub
                </span>
              </div>
              <button
                aria-label='Close menu'
                onClick={() => setMobileMenuOpen(false)}
                className='p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700'
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
                    'py-2 px-3 relative hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors dark:text-white',
                    pathname === link.href &&
                      'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-blue-600 before:rounded-r',
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
                    <button className='w-full px-4 py-2 border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-md font-medium bg-white dark:bg-gray-800'>
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
                  className='w-full px-4 py-2 border border-red-600 dark:border-red-400 text-red-600 dark:text-red-400 rounded-md font-medium bg-white dark:bg-gray-800 mt-2'
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
