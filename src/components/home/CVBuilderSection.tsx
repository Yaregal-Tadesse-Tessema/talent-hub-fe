import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function CVBuilderSection() {
  const { user } = useAuth();
  const router = useRouter();

  const handleCVBuilderClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      // Store the return URL in localStorage with a specific key for CV builder
      localStorage.setItem('returnToCVBuilder', '/cv-builder');
      router.push('/login');
    } else {
      router.push('/cv-builder');
    }
  };

  return (
    <section className='py-8 sm:py-12 lg:py-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-12'>
          {/* Content Section */}
          <div className='w-full lg:w-1/2 text-center lg:text-left'>
            <h2 className='text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 lg:mb-6 leading-tight'>
              Create Your Professional CV in Minutes
            </h2>
            <p className='text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 lg:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0'>
              Stand out from the crowd with a professionally designed CV. Our CV
              builder helps you create an impressive resume that highlights your
              skills and experience.
            </p>
            <div className='flex justify-center lg:justify-start'>
              <button
                onClick={handleCVBuilderClick}
                className='inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border border-transparent text-sm sm:text-base font-medium rounded-lg text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              >
                <svg
                  className='w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                  />
                </svg>
                Create Your CV Now
              </button>
            </div>

            {/* Features List */}
            <div className='mt-6 sm:mt-8 lg:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto lg:mx-0'>
              <div className='flex items-center justify-center lg:justify-start'>
                <div className='w-2 h-2 bg-blue-500 rounded-full mr-3'></div>
                <span className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>
                  Professional Templates
                </span>
              </div>
              <div className='flex items-center justify-center lg:justify-start'>
                <div className='w-2 h-2 bg-blue-500 rounded-full mr-3'></div>
                <span className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>
                  Easy to Customize
                </span>
              </div>
              <div className='flex items-center justify-center lg:justify-start'>
                <div className='w-2 h-2 bg-blue-500 rounded-full mr-3'></div>
                <span className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>
                  ATS-Friendly Format
                </span>
              </div>
              <div className='flex items-center justify-center lg:justify-start'>
                <div className='w-2 h-2 bg-blue-500 rounded-full mr-3'></div>
                <span className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>
                  Instant Download
                </span>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className='w-full lg:w-1/2 flex justify-center lg:justify-end'>
            <div className='relative w-full max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-2xl'>
              <div className='relative w-full h-[250px] sm:h-[300px] lg:h-[350px] xl:h-[400px]'>
                <Image
                  src='/images/cv-builder-preview.png'
                  alt='CV Builder Preview'
                  fill
                  className='object-contain drop-shadow-2xl'
                  priority
                  sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw'
                />
              </div>

              {/* Floating Elements */}
              <div className='absolute -top-4 -right-4 sm:-top-6 sm:-right-6 lg:-top-8 lg:-right-8 hidden sm:block'>
                <div className='bg-white dark:bg-gray-800 rounded-full p-2 sm:p-3 shadow-lg'>
                  <svg
                    className='w-4 h-4 sm:w-5 sm:h-5 text-green-500'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
              </div>

              <div className='absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 lg:-bottom-8 lg:-left-8 hidden sm:block'>
                <div className='bg-white dark:bg-gray-800 rounded-full p-2 sm:p-3 shadow-lg'>
                  <svg
                    className='w-4 h-4 sm:w-5 sm:h-5 text-blue-500'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 10V3L4 14h7v7l9-11h-7z'
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
