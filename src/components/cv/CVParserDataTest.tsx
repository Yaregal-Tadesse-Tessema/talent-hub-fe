import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import {
  parseCVFromText,
  mapParsedDataToUserProfile,
} from '@/services/cvParsingService';
import { ParsedCVData, UserProfile } from '@/types/profile';

export default function CVParserDataTest() {
  const [cvText, setCvText] = useState('');
  const [parsedData, setParsedData] = useState<ParsedCVData | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testCV = `John Doe
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

  const handleTest = async () => {
    setIsLoading(true);
    try {
      const textToParse = cvText || testCV;
      console.log('Testing with CV text:', textToParse);

      // Parse CV
      const parsed = await parseCVFromText(textToParse);
      console.log('Parsed CV data:', parsed);
      setParsedData(parsed);

      // Map to UserProfile
      const profile = mapParsedDataToUserProfile(parsed, 'test-user-id');
      console.log('Mapped UserProfile:', profile);
      setUserProfile(profile);
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg'>
      <h2 className='text-2xl font-bold mb-6 text-gray-900 dark:text-white'>
        CV Parser Data Structure Test
      </h2>

      <div className='space-y-4 mb-6'>
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            CV Text (or use default test CV)
          </label>
          <Textarea
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            placeholder='Paste CV text here or leave empty to use test CV'
            rows={8}
            className='w-full'
          />
        </div>

        <Button onClick={handleTest} disabled={isLoading} className='w-full'>
          {isLoading ? 'Testing...' : 'Test Data Structure'}
        </Button>
      </div>

      {parsedData && (
        <div className='space-y-6'>
          <div className='bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4'>
            <h3 className='text-green-800 dark:text-green-200 font-medium mb-2'>
              Parsed CV Data
            </h3>
            <pre className='text-green-700 dark:text-green-300 text-sm overflow-auto max-h-64'>
              {JSON.stringify(parsedData, null, 2)}
            </pre>
          </div>

          <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
            <h3 className='text-blue-800 dark:text-blue-200 font-medium mb-2'>
              Key Fields Check
            </h3>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <strong>firstName:</strong> {parsedData.firstName}
              </div>
              <div>
                <strong>lastName:</strong> {parsedData.lastName}
              </div>
              <div>
                <strong>email:</strong> {parsedData.email}
              </div>
              <div>
                <strong>phone:</strong> {parsedData.phone}
              </div>
              <div>
                <strong>address:</strong> {JSON.stringify(parsedData.address)}
              </div>
              <div>
                <strong>technicalSkills:</strong>{' '}
                {JSON.stringify(parsedData.technicalSkills)}
              </div>
            </div>
          </div>
        </div>
      )}

      {userProfile && (
        <div className='bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mt-6'>
          <h3 className='text-purple-800 dark:text-purple-200 font-medium mb-2'>
            Mapped UserProfile
          </h3>
          <pre className='text-purple-700 dark:text-purple-300 text-sm overflow-auto max-h-64'>
            {JSON.stringify(userProfile, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
