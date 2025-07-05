'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { parseCVFromText } from '@/services/cvParsingService';
import { useToast } from '@/contexts/ToastContext';
import LoadingAnimation from '@/components/ui/LoadingAnimation';

export default function CVParserTest() {
  const [cvText, setCvText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [parseTime, setParseTime] = useState<number>(0);
  const { showToast } = useToast();

  const sampleCV = `John Doe
Software Engineer
john.doe@email.com | +1 (555) 123-4567 | New York, NY
LinkedIn: linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years developing web applications using React, Node.js, and Python. Passionate about creating scalable solutions and leading development teams.

WORK EXPERIENCE
Senior Software Engineer | TechCorp | 2020-2023
- Led development of microservices architecture
- Mentored junior developers
- Technologies: React, Node.js, AWS

Software Engineer | StartupXYZ | 2018-2020
- Built full-stack web applications
- Collaborated with cross-functional teams
- Technologies: JavaScript, Python, PostgreSQL

EDUCATION
Bachelor of Science in Computer Science | University of Technology | 2014-2018
- GPA: 3.8/4.0
- Relevant coursework: Data Structures, Algorithms, Web Development

SKILLS
Technical: JavaScript, React, Node.js, Python, AWS, Docker, Git
Soft Skills: Leadership, Communication, Problem Solving, Teamwork

LANGUAGES
English (Native), Spanish (Intermediate)`;

  const handleTestParse = async () => {
    const textToParse = cvText || sampleCV;

    setIsParsing(true);
    setShowLoadingAnimation(true);
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
      showToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to parse CV',
      });
    } finally {
      setIsParsing(false);
      setShowLoadingAnimation(false);
    }
  };

  const handleLoadingComplete = () => {
    setShowLoadingAnimation(false);
  };

  return (
    <div className='max-w-4xl mx-auto p-6 space-y-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
          CV Parser Performance Test
        </h1>
        <p className='text-gray-600 dark:text-gray-400'>
          Test the optimized CV parsing performance
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Input Section */}
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              CV Text (or use sample)
            </label>
            <Textarea
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder='Paste your CV text here or leave empty to use sample...'
              rows={15}
              className='w-full'
            />
          </div>

          <div className='flex gap-4'>
            <Button
              onClick={handleTestParse}
              disabled={isParsing}
              variant='primary'
              className='flex-1'
            >
              {isParsing ? 'Parsing...' : 'Test Parse'}
            </Button>
            <Button onClick={() => setCvText(sampleCV)} variant='outline'>
              Load Sample
            </Button>
          </div>

          {parseTime > 0 && (
            <div className='p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700'>
              <p className='text-green-700 dark:text-green-300 text-sm'>
                ⚡ Parse time: <strong>{parseTime}ms</strong>
                {parseTime < 5000 && ' (Excellent performance!)'}
                {parseTime >= 5000 &&
                  parseTime < 10000 &&
                  ' (Good performance)'}
                {parseTime >= 10000 && ' (Could be optimized further)'}
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

      {/* Loading Animation */}
      <LoadingAnimation
        isVisible={showLoadingAnimation}
        onComplete={handleLoadingComplete}
      />
    </div>
  );
}
