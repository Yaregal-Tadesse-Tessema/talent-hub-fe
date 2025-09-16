import React, { useState, useEffect } from 'react';
import { Job } from '@/types/job';
import {
  XMarkIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  DocumentTextIcon,
  Squares2X2Icon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import {
  screeningQuestionsService,
  ScreeningQuestion,
} from '@/services/screeningQuestionsService';
import { applicationService, Application } from '@/services/applicationService';
import { toast } from 'react-hot-toast';
import { messageService } from '@/services/messageService';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface JobDetailModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'details' | 'applications' | 'statistics';

export default function JobDetailModal({
  job,
  isOpen,
  onClose,
}: JobDetailModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('applications');
  const [questions, setQuestions] = useState<ScreeningQuestion[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] =
    useState<ScreeningQuestion | null>(null);
  const [newQuestion, setNewQuestion] = useState<Partial<ScreeningQuestion>>({
    question: '',
    type: 'multiple_choice',
    options: [''],
    isKnockout: false,
    isOptional: false,
    weight: 1,
  });

  useEffect(() => {
    if (isOpen) {
      loadQuestions();
      if (activeTab === 'applications') {
        loadApplications();
      }
      // Fetch chat history for the first application (if any)
      if (activeTab === 'applications' && applications.length > 0) {
        const firstAppId = applications[0].id;
        messageService.getMessagesByApplicationId(firstAppId);
      }
    }
  }, [isOpen, activeTab]);

  const loadApplications = async () => {
    try {
      setIsLoadingApplications(true);
      const response = await applicationService.getApplicationsByJobId(job.id);
      setApplications(response.items);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast.error('Failed to load applications');
      setApplications([]);
    } finally {
      setIsLoadingApplications(false);
    }
  };

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await screeningQuestionsService.getQuestionsByJobId(
        job.id,
      );

      // Ensure we have an array
      const questionsArray = Array.isArray(response) ? response : [];

      setQuestions(questionsArray);
    } catch (error) {
      console.error('Error loading questions:', error); // Debug log
      toast.error('Failed to load screening questions');
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOption = () => {
    setNewQuestion((prev) => ({
      ...prev,
      options: [...(prev.options || []), ''],
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    setNewQuestion((prev) => ({
      ...prev,
      options: prev.options?.map((opt, i) => (i === index ? value : opt)),
    }));
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      await screeningQuestionsService.deleteQuestion(questionId);
      toast.success('Question deleted successfully');
      loadQuestions();
    } catch (error) {
      toast.error('Failed to delete question');
    }
  };

  const handleEditQuestion = (question: ScreeningQuestion) => {
    setEditingQuestion(question);
    setNewQuestion({
      ...question,
      options: question.options || [''],
    });
    setIsAddingQuestion(true);
  };

  const handleSubmitQuestion = async () => {
    try {
      if (!newQuestion.question || !newQuestion.type) {
        toast.error('Please fill in all required fields');
        return;
      }

      const questionToSubmit: ScreeningQuestion = {
        jobPostId: job.id,
        question: newQuestion.question,
        type: newQuestion.type,
        options: newQuestion.options?.filter((opt) => opt.trim() !== ''),
        isKnockout: newQuestion.isKnockout || false,
        isOptional: newQuestion.isOptional || false,
        weight: newQuestion.weight || 1,
      };

      if (editingQuestion?.id) {
        await screeningQuestionsService.updateQuestion({
          ...questionToSubmit,
          id: editingQuestion.id,
        });
        toast.success('Question updated successfully');
      } else {
        await screeningQuestionsService.createQuestion(questionToSubmit);
        toast.success('Question added successfully');
      }

      setIsAddingQuestion(false);
      setEditingQuestion(null);
      setNewQuestion({
        question: '',
        type: 'multiple_choice',
        options: [''],
        isKnockout: false,
        isOptional: false,
        weight: 1,
      });
      loadQuestions();
    } catch (error) {
      toast.error(
        editingQuestion
          ? 'Failed to update question'
          : 'Failed to add question',
      );
    }
  };

  // Mock data for charts - replace with real data from your API
  const applicationStatusData = [
    {
      name: 'Pending',
      value: applications.filter((app) => app.status === 'PENDING').length,
    },
    {
      name: 'Shortlisted',
      value: applications.filter((app) => app.status === 'SELECTED').length,
    },
    {
      name: 'Rejected',
      value: applications.filter((app) => app.status === 'REJECTED').length,
    },
    {
      name: 'Hired',
      value: applications.filter((app) => app.status === 'HIRED').length,
    },
  ];

  const applicationsOverTimeData = [
    { date: '2024-01', applications: 5 },
    { date: '2024-02', applications: 8 },
    { date: '2024-03', applications: 12 },
    { date: '2024-04', applications: 15 },
    { date: '2024-05', applications: 10 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col border border-gray-200 dark:border-gray-700'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0'>
          <div className='min-w-0 flex-1'>
            <h2 className='text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate'>
              {job.title}
            </h2>
            <p className='text-gray-500 dark:text-gray-400 text-sm mt-1 truncate'>
              {job.employmentType} • {job.location}
            </p>
          </div>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0 ml-2'
          >
            <XMarkIcon className='w-5 h-5 sm:w-6 sm:h-6 text-gray-500 dark:text-gray-400' />
          </button>
        </div>

        {/* Tabs */}
        <div className='flex border-b border-gray-200 dark:border-gray-700 flex-shrink-0 overflow-x-auto'>
          {[
            { key: 'details', label: 'Job Details', icon: DocumentTextIcon },
            { key: 'applications', label: 'Applications', icon: UserGroupIcon },
            { key: 'statistics', label: 'Statistics', icon: ChartBarIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as Tab)}
                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon className='w-4 h-4 sm:w-5 sm:h-5' />
                <span className='hidden sm:inline'>{tab.label}</span>
                <span className='sm:hidden'>{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto p-4 sm:p-6 min-h-0'>
          {activeTab === 'details' && (
            <div className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4'>
                  <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    Job Information
                  </h3>
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-gray-500 dark:text-gray-400'>
                        Status:
                      </span>
                      <span
                        className={`font-medium ${
                          job.status === 'Posted'
                            ? 'text-green-600 dark:text-green-400'
                            : job.status === 'Withdrawn'
                              ? 'text-red-500 dark:text-red-400'
                              : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {job.status || 'Draft'}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-500 dark:text-gray-400'>
                        Type:
                      </span>
                      <span className='text-gray-900 dark:text-white'>
                        {job.employmentType}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-500 dark:text-gray-400'>
                        Location:
                      </span>
                      <span className='text-gray-900 dark:text-white'>
                        {job.location}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-500 dark:text-gray-400'>
                        Applications:
                      </span>
                      <span className='text-gray-900 dark:text-white'>
                        {job.applicationCount || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4'>
                  <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    Timeline
                  </h3>
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-gray-500 dark:text-gray-400'>
                        Posted:
                      </span>
                      <span className='text-gray-900 dark:text-white'>
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-500 dark:text-gray-400'>
                        Deadline:
                      </span>
                      <span className='text-gray-900 dark:text-white'>
                        {new Date(job.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  Job Description
                </h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: job?.description || 'No description available.',
                  }}
                  className='text-gray-700 dark:text-gray-300 text-sm leading-relaxed'
                />
              </div>

              {/* Screening Questions Section */}
              <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='font-semibold text-gray-900 dark:text-white'>
                    Screening Questions
                  </h3>
                  <button
                    onClick={() => setIsAddingQuestion(true)}
                    className='flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700'
                  >
                    <PlusIcon className='w-4 h-4' />
                    Add Question
                  </button>
                </div>

                {isLoading ? (
                  <div className='text-center py-4'>
                    <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-400 mx-auto'></div>
                  </div>
                ) : questions.length === 0 ? (
                  <p className='text-gray-500 dark:text-gray-400 text-sm'>
                    No screening questions added yet.
                  </p>
                ) : (
                  <div className='space-y-3'>
                    {questions.map((question, index) => (
                      <div
                        key={question.id}
                        className='bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 p-3'
                      >
                        <div className='flex items-start justify-between'>
                          <div className='flex-1'>
                            <p className='font-medium text-gray-900 dark:text-white mb-1'>
                              {index + 1}. {question.question}
                            </p>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                              Type: {question.type} • Weight: {question.weight}
                              {question.isKnockout && ' • Knockout Question'}
                              {question.isOptional && ' • Optional'}
                            </p>
                            {question.options &&
                              question.options.length > 0 && (
                                <div className='mt-2'>
                                  <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>
                                    Options:
                                  </p>
                                  <ul className='text-xs text-gray-700 dark:text-gray-300'>
                                    {question.options.map(
                                      (option, optIndex) => (
                                        <li key={optIndex}>• {option}</li>
                                      ),
                                    )}
                                  </ul>
                                </div>
                              )}
                          </div>
                          <div className='flex gap-2 ml-4'>
                            <button
                              onClick={() => handleEditQuestion(question)}
                              className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                            >
                              <PencilIcon className='w-4 h-4 text-gray-500 dark:text-gray-400' />
                            </button>
                            <button
                              onClick={() =>
                                question.id && handleDeleteQuestion(question.id)
                              }
                              className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                            >
                              <TrashIcon className='w-4 h-4 text-red-500 dark:text-red-400' />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className='space-y-4'>
              {isLoadingApplications ? (
                <div className='text-center py-8'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto'></div>
                </div>
              ) : applications.length === 0 ? (
                <div className='text-center py-8'>
                  <p className='text-gray-500 dark:text-gray-400'>
                    No applications received yet.
                  </p>
                </div>
              ) : (
                <div className='space-y-3'>
                  {applications.map((application) => (
                    <div
                      key={application.id}
                      className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600'
                    >
                      <div className='flex items-center justify-between'>
                        <div>
                          <h4 className='font-medium text-gray-900 dark:text-white'>
                            {application.userInfo?.firstName}{' '}
                            {application.userInfo?.lastName}
                          </h4>
                          <p className='text-sm text-gray-500 dark:text-gray-400'>
                            {application.userInfo?.email}
                          </p>
                          <p className='text-xs text-gray-400 dark:text-gray-500'>
                            Applied on{' '}
                            {application.createdAt
                              ? new Date(
                                  application.createdAt,
                                ).toLocaleDateString()
                              : 'N/A'}
                          </p>
                        </div>
                        <div className='text-right'>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              application.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                : application.status === 'Accepted'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                  : application.status === 'Rejected'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {application.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'statistics' && (
            <div className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4'>
                  <h3 className='font-semibold text-gray-900 dark:text-white mb-4'>
                    Application Status
                  </h3>
                  <ResponsiveContainer width='100%' height={200}>
                    <PieChart>
                      <Pie
                        data={applicationStatusData}
                        cx='50%'
                        cy='50%'
                        outerRadius={60}
                        fill='#8884d8'
                        dataKey='value'
                      >
                        {applicationStatusData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4'>
                  <h3 className='font-semibold text-gray-900 dark:text-white mb-4'>
                    Applications Over Time
                  </h3>
                  <ResponsiveContainer width='100%' height={200}>
                    <LineChart data={applicationsOverTimeData}>
                      <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
                      <XAxis dataKey='date' stroke='#6b7280' />
                      <YAxis stroke='#6b7280' />
                      <Tooltip />
                      <Line
                        type='monotone'
                        dataKey='applications'
                        stroke='#3b82f6'
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add/Edit Question Modal */}
        {isAddingQuestion && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-2 sm:p-4'>
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col border border-gray-200 dark:border-gray-700'>
              <div className='flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                  {editingQuestion ? 'Edit Question' : 'Add Question'}
                </h3>
                <button
                  onClick={() => {
                    setIsAddingQuestion(false);
                    setEditingQuestion(null);
                    setNewQuestion({
                      question: '',
                      type: 'multiple_choice',
                      options: [''],
                      isKnockout: false,
                      isOptional: false,
                      weight: 1,
                    });
                  }}
                  className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
                >
                  <XMarkIcon className='w-5 h-5 text-gray-500 dark:text-gray-400' />
                </button>
              </div>

              <div className='flex-1 overflow-y-auto p-4 sm:p-6 min-h-0'>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Question
                    </label>
                    <textarea
                      value={newQuestion.question}
                      onChange={(e) =>
                        setNewQuestion({
                          ...newQuestion,
                          question: e.target.value,
                        })
                      }
                      className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
                      rows={3}
                      placeholder='Enter your question...'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Type
                    </label>
                    <select
                      value={newQuestion.type}
                      onChange={(e) =>
                        setNewQuestion({
                          ...newQuestion,
                          type: e.target.value as any,
                        })
                      }
                      className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
                    >
                      <option value='multiple_choice'>Multiple Choice</option>
                      <option value='text'>Text</option>
                      <option value='number'>Number</option>
                    </select>
                  </div>

                  {newQuestion.type === 'multiple_choice' && (
                    <div>
                      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Options
                      </label>
                      <div className='space-y-2'>
                        {newQuestion.options?.map((option, index) => (
                          <input
                            key={index}
                            type='text'
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(index, e.target.value)
                            }
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
                            placeholder={`Option ${index + 1}`}
                          />
                        ))}
                        <button
                          onClick={handleAddOption}
                          className='text-blue-600 dark:text-blue-400 text-sm hover:underline'
                        >
                          + Add Option
                        </button>
                      </div>
                    </div>
                  )}

                  <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        checked={newQuestion.isKnockout}
                        onChange={(e) =>
                          setNewQuestion({
                            ...newQuestion,
                            isKnockout: e.target.checked,
                          })
                        }
                        className='mr-2'
                      />
                      <span className='text-sm text-gray-700 dark:text-gray-300'>
                        Knockout Question
                      </span>
                    </label>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        checked={newQuestion.isOptional}
                        onChange={(e) =>
                          setNewQuestion({
                            ...newQuestion,
                            isOptional: e.target.checked,
                          })
                        }
                        className='mr-2'
                      />
                      <span className='text-sm text-gray-700 dark:text-gray-300'>
                        Optional
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                      Weight
                    </label>
                    <input
                      type='number'
                      value={newQuestion.weight}
                      onChange={(e) =>
                        setNewQuestion({
                          ...newQuestion,
                          weight: parseInt(e.target.value),
                        })
                      }
                      className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
                      min='1'
                      max='10'
                    />
                  </div>
                </div>
              </div>

              <div className='flex justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0'>
                <button
                  onClick={() => {
                    setIsAddingQuestion(false);
                    setEditingQuestion(null);
                    setNewQuestion({
                      question: '',
                      type: 'multiple_choice',
                      options: [''],
                      isKnockout: false,
                      isOptional: false,
                      weight: 1,
                    });
                  }}
                  className='px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitQuestion}
                  className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                >
                  {editingQuestion ? 'Update' : 'Add'} Question
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
