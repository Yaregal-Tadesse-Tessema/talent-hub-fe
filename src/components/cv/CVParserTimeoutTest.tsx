'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { parseCVFromText } from '@/services/cvParsingService';
import { useToast } from '@/contexts/ToastContext';
import LoadingAnimation from '@/components/ui/LoadingAnimation';

export default function CVParserTimeoutTest() {
  const [cvText, setCvText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [parseTime, setParseTime] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const { showToast } = useToast();

  const shortCV = `John Doe
Software Engineer
john.doe@email.com
+1 (555) 123-4567
New York, NY

EXPERIENCE
Software Engineer at TechCorp (2020-2023)
- Developed web applications using React and Node.js
- Led team of 3 developers

EDUCATION
BS Computer Science, University of Technology (2018)

SKILLS
JavaScript, React, Node.js, Python`;

  const longCV = `John Doe
Senior Software Engineer
john.doe@email.com | +1 (555) 123-4567 | New York, NY
LinkedIn: linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Experienced software engineer with 8+ years developing scalable web applications and leading development teams. Passionate about creating innovative solutions and mentoring junior developers.

WORK EXPERIENCE
Senior Software Engineer | TechCorp | 2020-2023
- Led development of microservices architecture serving 1M+ users
- Mentored 5 junior developers and conducted code reviews
- Implemented CI/CD pipelines reducing deployment time by 60%
- Technologies: React, Node.js, AWS, Docker, Kubernetes

Software Engineer | StartupXYZ | 2018-2020
- Built full-stack web applications using modern technologies
- Collaborated with cross-functional teams including designers and product managers
- Optimized database queries improving performance by 40%
- Technologies: JavaScript, Python, PostgreSQL, Redis

Junior Developer | WebSolutions | 2016-2018
- Developed responsive web applications for various clients
- Worked with REST APIs and third-party integrations
- Participated in agile development processes
- Technologies: HTML, CSS, JavaScript, PHP, MySQL

EDUCATION
Bachelor of Science in Computer Science | University of Technology | 2014-2018
- GPA: 3.8/4.0
- Relevant coursework: Data Structures, Algorithms, Web Development, Database Systems
- Senior Project: E-commerce platform with payment integration

CERTIFICATIONS
- AWS Certified Developer Associate
- Google Cloud Professional Developer
- MongoDB Certified Developer

SKILLS
Technical Skills: JavaScript, TypeScript, React, Node.js, Python, Java, AWS, Docker, Kubernetes, PostgreSQL, MongoDB, Redis, Git, CI/CD
Soft Skills: Leadership, Communication, Problem Solving, Teamwork, Project Management, Mentoring

PROJECTS
E-commerce Platform (2022)
- Built full-stack e-commerce solution with payment processing
- Technologies: React, Node.js, Stripe, MongoDB
- Live demo: https://demo-ecommerce.com

Task Management App (2021)
- Developed collaborative task management application
- Real-time updates using WebSockets
- Technologies: React, Socket.io, Express, PostgreSQL

LANGUAGES
English (Native), Spanish (Intermediate), French (Basic)

INTERESTS
Open source contribution, Machine Learning, Blockchain technology, Reading technical blogs

REFERENCES
Available upon request`;

  const handleTestParse = async (useLongCV = false) => {
    const textToParse = cvText || (useLongCV ? longCV : shortCV);

    setIsParsing(true);
    setShowLoadingAnimation(true);
    setError('');
    const startTime = Date.now();

    try {
      const parsed = await parseCVFromText(textToParse);
      const endTime = Date.now();
      const timeTaken = endTime - startTime;

      setParsedData(parsed);
      setParseTime(timeTaken);

      showToast({
        type: 'success',
        message: `CV parsed successfully in ${timeTaken}ms!`,
      });
    } catch (error) {
      console.error('Error parsing CV:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to parse CV';
      setError(errorMessage);
      showToast({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsParsing(false);
      setShowLoadingAnimation(false);
    }
  };

  const handleLoadingComplete = () => {
    setShowLoadingAnimation(false);
  };

  const testMalformedJSON = async () => {
    setIsParsing(true);
    setError('');
    setParsedData(null);
    setParseTime(0);

    try {
      // Test with a simple CV that might cause JSON parsing issues
      const testCV = `
        John Doe
        Software Engineer
        Email: john.doe@email.com
        Phone: +1234567890
        
        Skills: JavaScript, React, Node.js, Python, SQL
        Experience: 5 years in web development
        Education: Bachelor's in Computer Science
        
        Work History:
        - Senior Developer at Tech Corp (2020-2023)
        - Junior Developer at Startup Inc (2018-2020)
      `;

      console.log('Testing CV parsing with malformed JSON handling...');
      const parsedData = await parseCVFromText(testCV);

      setParsedData(parsedData);
      setParseTime(0);
      console.log('CV parsing successful:', parsedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('CV parsing failed:', err);
    } finally {
      setIsParsing(false);
    }
  };

  const testTimeout = async () => {
    setIsParsing(true);
    setError('');
    setParsedData(null);
    setParseTime(0);

    try {
      // Test with a very long CV to trigger timeout
      const longCV = 'This is a very long CV text. '.repeat(1000);

      console.log('Testing CV parsing timeout handling...');
      const parsedData = await parseCVFromText(longCV);

      setParsedData(parsedData);
      setParseTime(0);
      console.log('CV parsing successful (no timeout):', parsedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('CV parsing failed:', err);
    } finally {
      setIsParsing(false);
    }
  };

  const testRetry = async () => {
    setIsParsing(true);
    setError('');
    setParsedData(null);
    setParseTime(0);

    try {
      // Test with a CV that might cause temporary API issues
      const testCV = `
        Jane Smith
        Data Scientist
        Email: jane.smith@email.com
        Phone: +1987654321
        
        Skills: Python, R, SQL, Machine Learning, TensorFlow
        Experience: 3 years in data science
        Education: Master's in Statistics
      `;

      console.log('Testing CV parsing retry mechanism...');
      const parsedData = await parseCVFromText(testCV);

      setParsedData(parsedData);
      setParseTime(0);
      console.log('CV parsing successful with retry:', parsedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('CV parsing failed:', err);
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className='max-w-4xl mx-auto p-6 space-y-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
          CV Parser Test Suite
        </h1>
        <p className='text-gray-600 dark:text-gray-400'>
          Test the timeout handling and retry mechanism
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Input Section */}
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              CV Text (or use samples)
            </label>
            <Textarea
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder='Paste your CV text here or use the sample buttons...'
              rows={12}
              className='w-full'
            />
          </div>

          <div className='flex gap-2'>
            <Button
              onClick={() => handleTestParse(false)}
              disabled={isParsing}
              variant='primary'
              className='flex-1'
            >
              {isParsing ? 'Parsing...' : 'Test Short CV'}
            </Button>
            <Button
              onClick={() => handleTestParse(true)}
              disabled={isParsing}
              variant='outline'
              className='flex-1'
            >
              {isParsing ? 'Parsing...' : 'Test Long CV'}
            </Button>
          </div>

          <div className='flex gap-2'>
            <Button
              onClick={() => setCvText(shortCV)}
              variant='outline'
              size='sm'
            >
              Load Short Sample
            </Button>
            <Button
              onClick={() => setCvText(longCV)}
              variant='outline'
              size='sm'
            >
              Load Long Sample
            </Button>
          </div>

          {parseTime > 0 && (
            <div className='p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700'>
              <p className='text-green-700 dark:text-green-300 text-sm'>
                ⚡ Parse time: <strong>{parseTime}ms</strong>
                {parseTime < 5000 && ' (Excellent performance!)'}
                {parseTime >= 5000 &&
                  parseTime < 15000 &&
                  ' (Good performance)'}
                {parseTime >= 15000 && ' (Slow - may need optimization)'}
              </p>
            </div>
          )}

          {error && (
            <div className='p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700'>
              <p className='text-red-700 dark:text-red-300 text-sm'>
                ❌ Error: {error}
              </p>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className='space-y-4'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
            Parsed Results
          </h3>

          {parsedData ? (
            <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 max-h-96 overflow-y-auto'>
              <pre className='text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap'>
                {JSON.stringify(parsedData, null, 2)}
              </pre>
            </div>
          ) : (
            <div className='bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-8 text-center'>
              <p className='text-gray-500 dark:text-gray-400'>
                Parsed results will appear here
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className='bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700 p-4'>
        <h4 className='font-semibold text-blue-900 dark:text-blue-100 mb-2'>
          Test Information
        </h4>
        <ul className='text-sm text-blue-800 dark:text-blue-200 space-y-1'>
          <li>
            • <strong>Short CV:</strong> ~200 words, should parse quickly
          </li>
          <li>
            • <strong>Long CV:</strong> ~500 words, may take longer
          </li>
          <li>
            • <strong>Timeout:</strong> Set to 60 seconds with retry mechanism
          </li>
          <li>
            • <strong>Retries:</strong> Up to 2 retries for timeout/API errors
          </li>
          <li>
            • <strong>Text limit:</strong> Truncated to 2500 characters for
            speed
          </li>
        </ul>
      </div>

      {/* Loading Animation */}
      <LoadingAnimation
        isVisible={showLoadingAnimation}
        onComplete={handleLoadingComplete}
      />

      <div className='space-y-4 mt-6'>
        <Button
          onClick={testMalformedJSON}
          disabled={isParsing}
          className='w-full sm:w-auto'
        >
          {isParsing ? 'Testing...' : 'Test Malformed JSON Handling'}
        </Button>

        <Button
          onClick={testTimeout}
          disabled={isParsing}
          className='w-full sm:w-auto'
        >
          {isParsing ? 'Testing...' : 'Test Timeout Handling'}
        </Button>

        <Button
          onClick={testRetry}
          disabled={isParsing}
          className='w-full sm:w-auto'
        >
          {isParsing ? 'Testing...' : 'Test Retry Mechanism'}
        </Button>
      </div>
    </div>
  );
}
