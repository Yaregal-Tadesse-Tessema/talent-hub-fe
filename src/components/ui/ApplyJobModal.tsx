import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { X, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { useRouter } from 'next/navigation';
import { applicationService } from '@/services/applicationService';
import { screeningQuestionsService } from '@/services/screeningQuestionsService';

interface ScreeningQuestion {
  id?: string;
  jobPostId: string;
  question: string;
  type: string;
  options?: string[];
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { showToast } = useToast();
  const router = useRouter();

  // Check if user has a CV
  const hasProfileCV = !!(userData?.profile?.cv || userData?.resume?.path);

  useEffect(() => {
    // Set default resume if available
    if (hasProfileCV) {
      setSelectedResume('profile');
    } else {
      setSelectedResume('new');
    }

    const fetchScreeningQuestions = async () => {
      try {
        const response =
          await screeningQuestionsService.getQuestionsByJobId(jobId);

        if (response && response.length > 0) {
          setScreeningQuestions(response);
          // Initialize answers state
          const initialAnswers = response.reduce(
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
  }, [userData, jobId, open, hasProfileCV]);

  const handleQuestionAnswer = (question: string, answer: any) => {
    setQuestionAnswers((prev) => ({
      ...prev,
      [question]: answer,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate cover letter
    if (!coverLetter.trim()) {
      newErrors.coverLetter = 'Cover letter is required';
    }

    // Validate resume
    if (selectedResume === 'new' && !newResume) {
      newErrors.resume = 'Please upload a resume';
    } else if (selectedResume === 'profile' && !hasProfileCV) {
      newErrors.resume = 'No profile resume found';
    } else if (!selectedResume) {
      newErrors.resume = 'Please select a resume option';
    }

    // Validate required screening questions
    screeningQuestions.forEach((question) => {
      if (!question.isOptional) {
        const answer = questionAnswers[question.question];
        if (
          !answer ||
          (Array.isArray(answer) && answer.length === 0) ||
          (typeof answer === 'string' && !answer.trim())
        ) {
          newErrors[`question_${question.question}`] =
            'This question is required';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const renderQuestion = (question: ScreeningQuestion) => {
    const questionError = errors[`question_${question.question}`];

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
              {question.options?.map((option) => (
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
            {questionError && (
              <p className='text-red-500 text-xs mt-1'>{questionError}</p>
            )}
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
            {questionError && (
              <p className='text-red-500 text-xs mt-1'>{questionError}</p>
            )}
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
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                questionError ? 'border-red-500' : ''
              }`}
              rows={4}
              placeholder='Type your answer here...'
            />
            {questionError && (
              <p className='text-red-500 text-xs mt-1'>{questionError}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (!open) return null;

  const handleSubmitApplication = async () => {
    if (!validateForm()) {
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
        userData,
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
      // Clear resume error when file is selected
      setErrors((prev) => ({ ...prev, resume: '' }));
    }
  };

  const handleCoverLetterChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setCoverLetter(e.target.value);
    // Clear cover letter error when user starts typing
    if (e.target.value.trim()) {
      setErrors((prev) => ({ ...prev, coverLetter: '' }));
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-4'>
      <div className='bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 w-full max-w-xl relative max-h-[90vh] overflow-y-auto'>
        {/* Close Button */}
        <button
          className='absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 text-2xl z-10'
          onClick={onClose}
        >
          <X className='w-5 h-5 sm:w-6 sm:h-6' />
        </button>

        <div className='font-semibold text-base sm:text-lg mb-4 sm:mb-6 pr-8'>
          Apply Job: {jobTitle}
        </div>

        {/* Resume Section */}
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Choose Resume <span className='text-red-500'>*</span>
          </label>
          <select
            className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.resume ? 'border-red-500' : ''
            }`}
            value={selectedResume}
            onChange={(e) => {
              setSelectedResume(e.target.value);
              setErrors((prev) => ({ ...prev, resume: '' }));
            }}
          >
            <option value=''>Select...</option>
            {hasProfileCV && (
              <option value='profile'>Use Profile Resume</option>
            )}
            <option value='new'>Upload New Resume</option>
          </select>
          {errors.resume && (
            <p className='text-red-500 text-xs mt-1'>{errors.resume}</p>
          )}
        </div>

        {selectedResume === 'new' && (
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Upload New Resume <span className='text-red-500'>*</span>
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
            Cover Letter <span className='text-red-500'>*</span>
          </label>
          <textarea
            className={`w-full border rounded px-3 py-2 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.coverLetter ? 'border-red-500' : ''
            }`}
            placeholder='Write down your biography here. Let the employers know who you are...'
            value={coverLetter}
            onChange={handleCoverLetterChange}
          />
          {errors.coverLetter && (
            <p className='text-red-500 text-xs mt-1'>{errors.coverLetter}</p>
          )}
        </div>

        {/* Add horizontal line here */}
        <div className='my-4 border-t border-gray-200'></div>

        {/* Screening Questions Section */}
        {screeningQuestions.length > 0 && (
          <div className='mb-6'>
            <h3 className='text-base sm:text-lg font-semibold mb-4'>
              Screening Questions
            </h3>
            {screeningQuestions.map(renderQuestion)}
          </div>
        )}

        {message && (
          <div className='mb-4 p-2 text-sm text-red-600 bg-red-50 rounded'>
            {message}
          </div>
        )}

        <div className='flex flex-col sm:flex-row justify-end gap-2 mt-6'>
          <Button
            variant='secondary'
            onClick={onClose}
            disabled={loading}
            className='w-full sm:w-auto order-2 sm:order-1'
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitApplication}
            disabled={loading}
            className='w-full sm:w-auto order-1 sm:order-2'
          >
            {loading ? 'Submitting...' : 'Apply Now'}
          </Button>
        </div>
      </div>
    </div>
  );
};
