import Link from 'next/link';

export default function SignupSuccess() {
  return (
    <div className='min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 via-white to-green-100'>
      <div className='bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center max-w-md w-full'>
        <div className='mb-6'>
          <svg width='80' height='80' viewBox='0 0 80 80' fill='none'>
            <circle cx='40' cy='40' r='40' fill='#22C55E' fillOpacity='0.15' />
            <circle cx='40' cy='40' r='32' fill='#22C55E' />
            <path
              d='M28 42l10 10 14-18'
              stroke='#fff'
              strokeWidth='4'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </div>
        <h1 className='text-3xl font-bold text-green-700 mb-2 text-center'>
          Account Created!
        </h1>
        <p className='text-gray-600 text-center mb-6'>
          Your account has been successfully created.
          <br />
          <strong>Please check your email to activate your account.</strong>
          <br />
          Once you click the activation link in your email, you'll be able to
          sign in and start using Talent Hub!
        </p>
        <Link
          href='/login'
          className='inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition-colors text-lg'
        >
          Go to Sign In
        </Link>
      </div>
      <div className='mt-8 text-gray-400 text-xs'>
        &copy; {new Date().getFullYear()} Talent Hub
      </div>
    </div>
  );
}
