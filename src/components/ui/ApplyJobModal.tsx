import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import {
  X,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Link as LinkIcon,
} from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { useRouter } from 'next/navigation';
import { applicationService } from '@/services/applicationService';
import { screeningQuestionsService } from '@/services/screeningQuestionsService';

interface ScreeningQuestion {
  jobPostId: string;
  question: string;
  type: string;
  options: string[];
  isKnockout: boolean;
  isOptional: boolean;
  weight: number;
  booleanAnswer?: boolean;
  selectedOptions?: string[];
  essayAnswer?: string;
  score?: number;
}

interface ApplyJobModalProps {
  open: boolean;
  onClose: () => void;
  jobTitle: string;
  jobId: string;
  userData?: {
    id: string;
    profile?: {
      cv?: string;
    };
    resume?: {
      path?: string;
      filename?: string;
    };
  };
}

export const ApplyJobModal: React.FC<ApplyJobModalProps> = ({
  open,
  onClose,
  jobTitle,
  jobId,
  userData,
}) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [selectedResume, setSelectedResume] = useState<string>('');
  const [newResume, setNewResume] = useState<File | null>(null);
  const [screeningQuestions, setScreeningQuestions] = useState<
    ScreeningQuestion[]
  >([]);
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, any>>(
    {},
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Set default resume if available
    if (userData?.profile?.cv || userData?.resume?.path) {
      setSelectedResume('profile');
    }

    const fetchScreeningQuestions = async () => {
      try {
        console.log('Fetching questions for jobId:', jobId);
        const response =
          await screeningQuestionsService.getQuestionsByJobId(jobId);
        console.log('Full response:', response);
        console.log('Response items:', response.items);
        console.log('Items length:', response.items?.length);

        if (response.items && response.items.length > 0) {
          console.log('Setting questions:', response.items);
          setScreeningQuestions(response.items);
          // Initialize answers state
          const initialAnswers = response.items.reduce(
            (acc: Record<string, any>, q: ScreeningQuestion) => {
              acc[q.question] =
                q.type === 'MULTIPLE_CHOICE'
                  ? []
                  : q.type === 'BOOLEAN'
                    ? null
                    : '';
              return acc;
            },
            {} as Record<string, any>,
          );
          console.log('Initial answers:', initialAnswers);
          setQuestionAnswers(initialAnswers);
        } else {
          console.log('No questions found in response');
        }
      } catch (error) {
        console.error('Error fetching screening questions:', error);
      }
    };

    if (open) {
      fetchScreeningQuestions();
    }
  }, [userData, jobId, open]);

  const handleQuestionAnswer = (question: string, answer: any) => {
    setQuestionAnswers((prev) => ({
      ...prev,
      [question]: answer,
    }));
  };

  const renderQuestion = (question: ScreeningQuestion) => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div key={question.question} className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {question.question}
              {!question.isOptional && (
                <span className='text-red-500 ml-1'>*</span>
              )}
            </label>
            <div className='space-y-2'>
              {question.options.map((option) => (
                <label key={option} className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    checked={questionAnswers[question.question]?.includes(
                      option,
                    )}
                    onChange={(e) => {
                      const currentAnswers =
                        questionAnswers[question.question] || [];
                      const newAnswers = e.target.checked
                        ? [...currentAnswers, option]
                        : currentAnswers.filter((a: string) => a !== option);
                      handleQuestionAnswer(question.question, newAnswers);
                    }}
                    className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                  />
                  <span className='text-sm text-gray-700'>{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'yes-no':
      case 'boolean':
        return (
          <div key={question.question} className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {question.question}
              {!question.isOptional && (
                <span className='text-red-500 ml-1'>*</span>
              )}
            </label>
            <div className='flex space-x-4'>
              <label className='flex items-center space-x-2'>
                <input
                  type='radio'
                  checked={questionAnswers[question.question] === true}
                  onChange={() => handleQuestionAnswer(question.question, true)}
                  className='rounded-full border-gray-300 text-blue-600 focus:ring-blue-500'
                />
                <span className='text-sm text-gray-700'>Yes</span>
              </label>
              <label className='flex items-center space-x-2'>
                <input
                  type='radio'
                  checked={questionAnswers[question.question] === false}
                  onChange={() =>
                    handleQuestionAnswer(question.question, false)
                  }
                  className='rounded-full border-gray-300 text-blue-600 focus:ring-blue-500'
                />
                <span className='text-sm text-gray-700'>No</span>
              </label>
            </div>
          </div>
        );

      case 'text':
      case 'essay':
        return (
          <div key={question.question} className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              {question.question}
              {!question.isOptional && (
                <span className='text-red-500 ml-1'>*</span>
              )}
            </label>
            <textarea
              value={questionAnswers[question.question] || ''}
              onChange={(e) =>
                handleQuestionAnswer(question.question, e.target.value)
              }
              className='w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              rows={4}
              placeholder='Type your answer here...'
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (!open) return null;

  const handleSubmitApplication = async () => {
    if (!coverLetter.trim() || (!newResume && selectedResume !== 'profile')) {
      setMessage(
        'Please provide a cover letter and select or upload a resume.',
      );
      return;
    }

    if (!userData?.id) {
      setMessage('Authentication error. Please log in again.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      let resumeFile: File;

      if (selectedResume === 'profile' && !newResume) {
        // Fetch the CV file from the profile
        const cvPath = userData?.profile?.cv || userData?.resume?.path;
        if (!cvPath) {
          throw new Error('No profile CV found');
        }
        resumeFile = await applicationService.fetchProfileCV(cvPath);
      } else if (newResume) {
        resumeFile = newResume;
      } else {
        throw new Error('No resume selected');
      }

      await applicationService.createApplication(
        jobId,
        userData.id,
        coverLetter,
        resumeFile,
      );

      showToast({
        type: 'success',
        message: 'Application submitted successfully!',
      });

      // Close modal and redirect to applications page
      onClose();
      //router.push('/applications');
    } catch (error) {
      console.error('Error submitting application:', error);
      if (
        error instanceof Error &&
        'statusCode' in error &&
        error.statusCode === 409
      ) {
        setMessage('You have already applied for this job.');
      } else {
        setMessage(
          error instanceof Error
            ? error.message
            : 'Error applying for the job. Please try again.',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setMessage('Only PDF files are allowed.');
        return;
      }
      if (file.size > 12 * 1024 * 1024) {
        // 12MB limit
        setMessage('File size exceeds 12 MB.');
        return;
      }
      setNewResume(file);
      setSelectedResume('new');
      setMessage('');
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30'>
      <div className='bg-white rounded-xl shadow-lg p-8 w-full max-w-xl relative max-h-[90vh] overflow-y-auto'>
        {/* Close Button */}
        <button
          className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl'
          onClick={onClose}
        >
          <X className='w-6 h-6' />
        </button>
        <div className='font-semibold text-lg mb-6'>Apply Job: {jobTitle}</div>

        {/* Resume Section */}
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Choose Resume
          </label>
          <select
            className='w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={selectedResume}
            onChange={(e) => setSelectedResume(e.target.value)}
          >
            <option value=''>Select...</option>
            {(userData?.profile?.cv || userData?.resume?.path) && (
              <option value='profile'>Use Profile Resume</option>
            )}
            <option value='new'>Upload New Resume</option>
          </select>
        </div>

        {selectedResume === 'new' && (
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Upload New Resume
            </label>
            <input
              type='file'
              accept='.pdf'
              onChange={handleFileChange}
              className='w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <p className='text-xs text-gray-500 mt-1'>
              Only PDF files allowed. Max size: 12MB
            </p>
          </div>
        )}

        {/* Cover Letter Section */}
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Cover Letter
          </label>
          <textarea
            className='w-full border rounded px-3 py-2 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Write down your biography here. Let the employers know who you are...'
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
        </div>

        {/* Add horizontal line here */}
        <div className='my-4 border-t border-gray-200'></div>

        {/* Screening Questions Section */}
        {screeningQuestions.length > 0 && (
          <div className='mb-6'>
            <h3 className='text-lg font-semibold mb-4'>Screening Questions</h3>
            {screeningQuestions.map(renderQuestion)}
          </div>
        )}

        {message && (
          <div className='mb-4 p-2 text-sm text-red-600 bg-red-50 rounded'>
            {message}
          </div>
        )}

        <div className='flex justify-end gap-2 mt-6'>
          <Button variant='secondary' onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmitApplication} disabled={loading}>
            {loading ? 'Submitting...' : 'Apply Now'}
          </Button>
        </div>
      </div>
    </div>
  );
};
