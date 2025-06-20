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

  const experienceLevelData = [
    { name: 'Entry Level', value: 30 },
    { name: 'Mid Level', value: 45 },
    { name: 'Senior Level', value: 25 },
  ];

  const educationLevelData = [
    { name: "Bachelor's", value: 40 },
    { name: "Master's", value: 35 },
    { name: 'PhD', value: 15 },
    { name: 'Other', value: 10 },
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
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]'>
      <div className='bg-white rounded-xl shadow-2xl w-full max-w-6xl mx-4 max-h-[90vh] flex flex-col'>
        {/* Header */}
        <div className='flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl'>
          <h2 className='text-2xl font-bold text-gray-900'>{job.title}</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full'
          >
            <XMarkIcon className='h-6 w-6' />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className='border-b border-gray-200'>
          <nav className='flex space-x-8 px-6' aria-label='Tabs'>
            <button
              onClick={() => setActiveTab('details')}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <DocumentTextIcon className='h-5 w-5 mr-2' />
              Job Details
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'applications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <UserGroupIcon className='h-5 w-5 mr-2' />
              Applications
              {applications.length > 0 && (
                <span className='ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs'>
                  {applications.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'statistics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ChartBarIcon className='h-5 w-5 mr-2' />
              Statistics
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className='overflow-y-auto flex-1 p-6'>
          {activeTab === 'details' ? (
            <div className='space-y-8'>
              {/* Basic Information */}
              <div className='bg-gray-50 rounded-lg p-6'>
                <h3 className='text-lg font-semibold mb-4 text-gray-900'>
                  Basic Information
                </h3>
                <div className='grid grid-cols-2 gap-6'>
                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Position</p>
                    <p className='font-medium text-gray-900'>{job.position}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Industry</p>
                    <p className='font-medium text-gray-900'>{job.industry}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500 mb-1'>
                      Employment Type
                    </p>
                    <p className='font-medium text-gray-900'>
                      {job.employmentType}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Location</p>
                    <p className='font-medium text-gray-900'>{job.location}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Salary Range</p>
                    <p className='font-medium text-gray-900'>
                      {job.salaryRange.min} - {job.salaryRange.max}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Status</p>
                    <p className='font-medium text-gray-900'>{job.status}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className='text-lg font-semibold mb-4 text-gray-900'>
                  Description
                </h3>
                <div className='prose max-w-none text-gray-700 bg-white rounded-lg p-6 border border-gray-200'>
                  <div dangerouslySetInnerHTML={{ __html: job.description }} />
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h3 className='text-lg font-semibold mb-4 text-gray-900'>
                  Requirements
                </h3>
                <div className='bg-white rounded-lg p-6 border border-gray-200'>
                  <ul className='space-y-3'>
                    {job?.jobPostRequirement?.map((req, index) => (
                      <li key={index} className='flex items-start'>
                        <span className='text-blue-600 mr-2'>•</span>
                        <span className='text-gray-700'>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className='text-lg font-semibold mb-4 text-gray-900'>
                  Required Skills
                </h3>
                <div className='flex flex-wrap gap-2 bg-white rounded-lg p-6 border border-gray-200'>
                  {job.skill.map((skill, index) => (
                    <span
                      key={index}
                      className='px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium'
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h3 className='text-lg font-semibold mb-4 text-gray-900'>
                  Benefits
                </h3>
                <div className='bg-white rounded-lg p-6 border border-gray-200'>
                  <ul className='space-y-3'>
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className='flex items-start'>
                        <span className='text-green-600 mr-2'>•</span>
                        <span className='text-gray-700'>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Responsibilities */}
              <div>
                <h3 className='text-lg font-semibold mb-4 text-gray-900'>
                  Responsibilities
                </h3>
                <div className='bg-white rounded-lg p-6 border border-gray-200'>
                  <ul className='space-y-3'>
                    {job.responsibilities.map((responsibility, index) => (
                      <li key={index} className='flex items-start'>
                        <span className='text-purple-600 mr-2'>•</span>
                        <span className='text-gray-700'>{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h3 className='text-lg font-semibold mb-4 text-gray-900'>
                  Additional Information
                </h3>
                <div className='bg-white rounded-lg p-6 border border-gray-200'>
                  <div className='grid grid-cols-2 gap-6'>
                    <div>
                      <p className='text-sm text-gray-500 mb-1'>
                        Experience Level
                      </p>
                      <p className='font-medium text-gray-900'>
                        {job.experienceLevel}
                      </p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-500 mb-1'>
                        Education Level
                      </p>
                      <p className='font-medium text-gray-900'>
                        {job.educationLevel}
                      </p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-500 mb-1'>
                        Field of Study
                      </p>
                      <p className='font-medium text-gray-900'>
                        {job.fieldOfStudy}
                      </p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-500 mb-1'>Minimum GPA</p>
                      <p className='font-medium text-gray-900'>
                        {job.minimumGPA}
                      </p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-500 mb-1'>Posted Date</p>
                      <p className='font-medium text-gray-900'>
                        {new Date(job.postedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-500 mb-1'>Deadline</p>
                      <p className='font-medium text-gray-900'>
                        {new Date(job.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Screening Questions Section */}
              <div>
                <div className='flex justify-between items-center mb-4'>
                  <h3 className='text-lg font-semibold text-gray-900'>
                    Screening Questions
                  </h3>
                  <button
                    onClick={() => {
                      setEditingQuestion(null);
                      setNewQuestion({
                        question: '',
                        type: 'multiple_choice',
                        options: [''],
                        isKnockout: false,
                        isOptional: false,
                        weight: 1,
                      });
                      setIsAddingQuestion(true);
                    }}
                    className='flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                  >
                    <PlusIcon className='h-5 w-5 mr-2' />
                    Add Question
                  </button>
                </div>

                {/* Questions List */}
                <div className='space-y-4'>
                  {isLoading ? (
                    <div className='text-center py-4 text-gray-500'>
                      Loading questions...
                    </div>
                  ) : !Array.isArray(questions) ? (
                    <div className='text-center py-4 text-gray-500'>
                      Error loading questions
                    </div>
                  ) : questions.length === 0 ? (
                    <div className='text-center py-4 text-gray-500'>
                      No screening questions added yet
                    </div>
                  ) : (
                    questions.map((q, index) => (
                      <div
                        key={index}
                        className='bg-white rounded-lg p-4 border border-gray-200'
                      >
                        <div className='flex justify-between items-start'>
                          <div className='flex-1'>
                            <p className='font-medium text-gray-900'>
                              {q.question}
                            </p>
                            <p className='text-sm text-gray-500 mt-1'>
                              Type: {q.type}
                            </p>
                            {q.options && q.options.length > 0 && (
                              <div className='mt-2'>
                                <p className='text-sm text-gray-500'>
                                  Options:
                                </p>
                                <ul className='list-disc list-inside mt-1'>
                                  {q.options.map((opt, i) => (
                                    <li
                                      key={i}
                                      className='text-sm text-gray-700'
                                    >
                                      {opt}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          <div className='flex items-center space-x-4'>
                            <div className='flex items-center space-x-2'>
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  q.isKnockout
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-green-100 text-green-800'
                                }`}
                              >
                                {q.isKnockout ? 'Knockout' : 'Non-knockout'}
                              </span>
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  q.isOptional
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {q.isOptional ? 'Optional' : 'Required'}
                              </span>
                            </div>
                            <div className='flex items-center space-x-2'>
                              <button
                                onClick={() => handleEditQuestion(q)}
                                className='p-1 text-gray-500 hover:text-blue-600 transition-colors'
                                title='Edit question'
                              >
                                <PencilIcon className='h-5 w-5' />
                              </button>
                              <button
                                onClick={() =>
                                  q.id && handleDeleteQuestion(q.id)
                                }
                                className='p-1 text-gray-500 hover:text-red-600 transition-colors'
                                title='Delete question'
                              >
                                <TrashIcon className='h-5 w-5' />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add/Edit Question Form */}
                {isAddingQuestion && (
                  <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200]'>
                    <div className='bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 p-6'>
                      <h3 className='text-xl font-bold mb-4'>
                        {editingQuestion
                          ? 'Edit Question'
                          : 'Add Screening Question'}
                      </h3>
                      <div className='space-y-4'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Question
                          </label>
                          <input
                            type='text'
                            value={newQuestion.question}
                            onChange={(e) =>
                              setNewQuestion((prev) => ({
                                ...prev,
                                question: e.target.value,
                              }))
                            }
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            placeholder='Enter your question'
                          />
                        </div>

                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Question Type
                          </label>
                          <select
                            value={newQuestion.type}
                            onChange={(e) =>
                              setNewQuestion((prev) => ({
                                ...prev,
                                type: e.target.value,
                              }))
                            }
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                          >
                            <option value='multiple_choice'>
                              Multiple Choice
                            </option>
                            <option value='boolean'>Yes/No</option>
                            <option value='essay'>Essay</option>
                          </select>
                        </div>

                        {newQuestion.type === 'multiple_choice' && (
                          <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                              Options
                            </label>
                            {newQuestion.options?.map((option, index) => (
                              <div key={index} className='flex gap-2 mb-2'>
                                <input
                                  type='text'
                                  value={option}
                                  onChange={(e) =>
                                    handleOptionChange(index, e.target.value)
                                  }
                                  className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                  placeholder={`Option ${index + 1}`}
                                />
                              </div>
                            ))}
                            <button
                              onClick={handleAddOption}
                              className='text-blue-600 hover:text-blue-700 text-sm font-medium'
                            >
                              + Add Option
                            </button>
                          </div>
                        )}

                        <div className='flex gap-4'>
                          <div className='flex items-center'>
                            <input
                              type='checkbox'
                              id='isKnockout'
                              checked={newQuestion.isKnockout}
                              onChange={(e) =>
                                setNewQuestion((prev) => ({
                                  ...prev,
                                  isKnockout: e.target.checked,
                                }))
                              }
                              className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                            />
                            <label
                              htmlFor='isKnockout'
                              className='ml-2 text-sm text-gray-700'
                            >
                              Knockout Question
                            </label>
                          </div>
                          <div className='flex items-center'>
                            <input
                              type='checkbox'
                              id='isOptional'
                              checked={newQuestion.isOptional}
                              onChange={(e) =>
                                setNewQuestion((prev) => ({
                                  ...prev,
                                  isOptional: e.target.checked,
                                }))
                              }
                              className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                            />
                            <label
                              htmlFor='isOptional'
                              className='ml-2 text-sm text-gray-700'
                            >
                              Optional
                            </label>
                          </div>
                        </div>

                        <div className='flex justify-end gap-3 mt-6'>
                          <button
                            onClick={() => {
                              setIsAddingQuestion(false);
                              setEditingQuestion(null);
                            }}
                            className='px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors'
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSubmitQuestion}
                            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                          >
                            {editingQuestion
                              ? 'Update Question'
                              : 'Add Question'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'applications' ? (
            <div className='space-y-8'>
              {/* Applications List */}
              <div>
                <div className='flex justify-between items-center mb-4'>
                  <h3 className='text-lg font-semibold text-gray-900'>
                    Applications
                  </h3>
                  {applications.length > 0 && (
                    <button
                      onClick={() => {
                        onClose();
                        window.location.href = `/dashboard?tab=myjobs&selectedJob=${job.id}`;
                      }}
                      className='flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                    >
                      <Squares2X2Icon className='h-5 w-5 mr-2' />
                      Manage Applications
                    </button>
                  )}
                </div>
                <div className='bg-white rounded-lg p-6 border border-gray-200'>
                  {isLoadingApplications ? (
                    <div className='text-center py-4 text-gray-500'>
                      Loading applications...
                    </div>
                  ) : applications.length === 0 ? (
                    <div className='text-center py-4 text-gray-500'>
                      No applications found
                    </div>
                  ) : (
                    <div className='space-y-4'>
                      {applications.map((app) => (
                        <div
                          key={app.id}
                          className='bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-500 transition-colors'
                        >
                          <div className='flex justify-between items-start'>
                            <div>
                              <h4 className='font-medium text-gray-900'>
                                {app?.userInfo?.firstName}{' '}
                                {app?.userInfo?.lastName}
                              </h4>
                              <p className='text-sm text-gray-500 mt-1'>
                                {app?.userInfo?.email}
                              </p>
                              {app?.userInfo?.phone && (
                                <p className='text-sm text-gray-500'>
                                  {app?.userInfo?.phone}
                                </p>
                              )}
                            </div>
                            <div className='flex items-center space-x-2'>
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  app?.status === 'PENDING'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : app?.status === 'SELECTED'
                                      ? 'bg-blue-100 text-blue-800'
                                      : app?.status === 'REJECTED'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-green-100 text-green-800'
                                }`}
                              >
                                {app?.status}
                              </span>
                            </div>
                          </div>
                          {app?.coverLetter && (
                            <div className='mt-3'>
                              <p className='text-sm text-gray-500'>
                                Cover Letter:
                              </p>
                              <p className='text-sm text-gray-700 mt-1 line-clamp-2'>
                                {app.coverLetter}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className='space-y-8'>
              {/* Application Overview */}
              <div>
                <h3 className='text-lg font-semibold mb-4 text-gray-900'>
                  Application Overview
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='bg-white rounded-lg p-6 border border-gray-200'>
                    <h4 className='text-sm font-medium text-gray-500 mb-4'>
                      Applications Over Time
                    </h4>
                    <div className='h-[300px]'>
                      <ResponsiveContainer width='100%' height='100%'>
                        <LineChart data={applicationsOverTimeData}>
                          <CartesianGrid strokeDasharray='3 3' />
                          <XAxis dataKey='date' />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type='monotone'
                            dataKey='applications'
                            stroke='#0088FE'
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className='bg-white rounded-lg p-6 border border-gray-200'>
                    <h4 className='text-sm font-medium text-gray-500 mb-4'>
                      Application Status
                    </h4>
                    <div className='h-[300px]'>
                      <ResponsiveContainer width='100%' height='100%'>
                        <PieChart>
                          <Pie
                            data={applicationStatusData}
                            cx='50%'
                            cy='50%'
                            labelLine={false}
                            outerRadius={80}
                            fill='#8884d8'
                            dataKey='value'
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {applicationStatusData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Applicant Demographics */}
              <div>
                <h3 className='text-lg font-semibold mb-4 text-gray-900'>
                  Applicant Demographics
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='bg-white rounded-lg p-6 border border-gray-200'>
                    <h4 className='text-sm font-medium text-gray-500 mb-4'>
                      Experience Level Distribution
                    </h4>
                    <div className='h-[300px]'>
                      <ResponsiveContainer width='100%' height='100%'>
                        <BarChart data={experienceLevelData}>
                          <CartesianGrid strokeDasharray='3 3' />
                          <XAxis dataKey='name' />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey='value' fill='#8884d8' />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className='bg-white rounded-lg p-6 border border-gray-200'>
                    <h4 className='text-sm font-medium text-gray-500 mb-4'>
                      Education Level Distribution
                    </h4>
                    <div className='h-[300px]'>
                      <ResponsiveContainer width='100%' height='100%'>
                        <PieChart>
                          <Pie
                            data={educationLevelData}
                            cx='50%'
                            cy='50%'
                            labelLine={false}
                            outerRadius={80}
                            fill='#8884d8'
                            dataKey='value'
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {educationLevelData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
