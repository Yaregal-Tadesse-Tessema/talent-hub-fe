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
    <section className='py-16 bg-gradient-to-r from-blue-50 to-indigo-50'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col lg:flex-row items-center justify-between gap-8'>
          <div className='lg:w-1/2'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
              Create Your Professional CV in Minutes
            </h2>
            <p className='text-lg text-gray-600 mb-6'>
              Stand out from the crowd with a professionally designed CV. Our CV
              builder helps you create an impressive resume that highlights your
              skills and experience.
            </p>
            <button
              onClick={handleCVBuilderClick}
              className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors'
            >
              Create Your CV Now
            </button>
          </div>
          <div className='lg:w-1/2'>
            <div className='relative w-full h-[400px]'>
              <Image
                src='/images/cv-builder-preview.png'
                alt='CV Builder Preview'
                fill
                className='object-contain'
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
