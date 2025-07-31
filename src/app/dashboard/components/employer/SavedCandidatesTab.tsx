'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  savedCandidatesService,
  SavedCandidate,
  User,
} from '@/services/savedCandidates.service';
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiBookmark,
  FiX,
} from 'react-icons/fi';
import CandidateDetailModal from '../../../find-candidates/CandidateDetailModal';

export default function SavedCandidatesTab() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [savedCandidates, setSavedCandidates] = useState<SavedCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<User | null>(null);
  const [editingCandidate, setEditingCandidate] =
    useState<SavedCandidate | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ notes: '', tags: '' });

  // Get user from localStorage directly
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        setLoading(false);
      }
    }
  }, []);

  const fetchSavedCandidates = useCallback(async () => {
    if (!user?.id) {
      console.log('No user ID found, skipping fetch');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await savedCandidatesService.getSavedCandidates();
      setSavedCandidates(response.items || []);
      console.log('response.items', response.items);
    } catch (error) {
      setError('Failed to load saved candidates. Please try again.');
      setSavedCandidates([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchSavedCandidates();
    }
  }, [user, fetchSavedCandidates]);

  const handleSearch = async () => {
    if (!user?.id || !searchQuery.trim()) {
      await fetchSavedCandidates();
      return;
    }

    setLoading(true);
    try {
      const response = await savedCandidatesService.searchSavedCandidates(
        user.id,
        searchQuery,
      );
      setSavedCandidates(response.items || []);
    } catch (error) {
      console.error('Error searching saved candidates:', error);
      setSavedCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCandidateClick = (candidate: User) => {
    setSelectedCandidate(candidate);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCandidate(null);
  };

  const handleEdit = (savedCandidate: SavedCandidate) => {
    setEditingCandidate(savedCandidate);
    setEditForm({
      notes: savedCandidate.notes || '',
      tags: savedCandidate.tags?.join(', ') || '',
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!editingCandidate) return;

    try {
      const updatedData = {
        notes: editForm.notes,
        tags: editForm.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      };

      await savedCandidatesService.updateSavedCandidate(
        editingCandidate.id,
        updatedData,
      );

      // Update local state
      setSavedCandidates((prev) =>
        prev.map((sc) =>
          sc.id === editingCandidate.id ? { ...sc, ...updatedData } : sc,
        ),
      );

      setShowEditModal(false);
      setEditingCandidate(null);
      setEditForm({ notes: '', tags: '' });
    } catch (error) {
      console.error('Error updating saved candidate:', error);
    }
  };

  const handleDelete = async (savedCandidate: SavedCandidate) => {
    if (
      !confirm(
        'Are you sure you want to remove this candidate from your saved list?',
      )
    ) {
      return;
    }

    try {
      await savedCandidatesService.deleteSavedCandidate(savedCandidate.id);
      setSavedCandidates((prev) =>
        prev.filter((sc) => sc.id !== savedCandidate.id),
      );
    } catch (error) {
      console.error('Error deleting saved candidate:', error);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingCandidate(null);
    setEditForm({ notes: '', tags: '' });
  };

  return (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Saved Candidates
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-1'>
            Manage your saved candidate profiles
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search saved candidates...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className='pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
            <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
          </div>
          <button
            onClick={handleSearch}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            Search
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className='flex justify-center items-center py-12'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
          <span className='ml-2 text-gray-600 dark:text-gray-400'>
            Loading saved candidates...
          </span>
        </div>
      ) : error ? (
        <div className='text-center py-12'>
          <div className='text-red-500 dark:text-red-400 mb-4'>
            <svg
              className='mx-auto h-12 w-12'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
          <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
            Error Loading Saved Candidates
          </h3>
          <p className='text-gray-500 dark:text-gray-400 mb-4'>{error}</p>
          <button
            onClick={fetchSavedCandidates}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            Try Again
          </button>
        </div>
      ) : savedCandidates.length === 0 ? (
        <div className='text-center py-12'>
          <div className='text-gray-500 dark:text-gray-400 mb-4'>
            <FiBookmark className='mx-auto h-12 w-12' />
          </div>
          <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
            No saved candidates yet
          </h3>
          <p className='text-gray-500 dark:text-gray-400'>
            Start saving candidates from the Find Candidates page to see them
            here.
          </p>
        </div>
      ) : (
        <div className='space-y-4'>
          {savedCandidates
            .filter((savedCandidate) => savedCandidate?.candidate)
            .map((savedCandidate) => (
              <div
                key={savedCandidate.id}
                className='flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm px-6 py-4 justify-between hover:ring-2 hover:ring-blue-500 dark:hover:ring-blue-400'
              >
                <div className='flex items-center gap-4'>
                  <div className='w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
                    {/* Profile image placeholder */}
                    <svg width='32' height='32' fill='none' viewBox='0 0 32 32'>
                      <rect
                        width='32'
                        height='32'
                        rx='8'
                        fill='#E5E7EB'
                        className='dark:fill-gray-600'
                      />
                      <path
                        d='M16 18c-3.314 0-6 2.239-6 5v1h12v-1c0-2.761-2.686-5-6-5z'
                        fill='#D1D5DB'
                        className='dark:fill-gray-500'
                      />
                      <circle
                        cx='16'
                        cy='12'
                        r='5'
                        fill='#D1D5DB'
                        className='dark:fill-gray-500'
                      />
                    </svg>
                  </div>
                  <div className='flex-1'>
                    <div
                      className='font-semibold text-base text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:cursor-pointer'
                      onClick={() =>
                        handleCandidateClick(savedCandidate.candidate)
                      }
                    >
                      {savedCandidate?.candidate?.firstName &&
                      savedCandidate?.candidate?.lastName
                        ? `${savedCandidate.candidate?.firstName} ${savedCandidate.candidate.middleName ? savedCandidate.candidate.middleName + ' ' : ''}${savedCandidate.candidate.lastName}`
                        : savedCandidate?.candidate.email ||
                          'Unknown Candidate'}
                    </div>
                    <div className='text-gray-500 dark:text-gray-400 text-sm'>
                      {savedCandidate.candidate.profileHeadLine ||
                        'No title specified'}
                    </div>
                    <div className='flex items-center gap-2 text-gray-400 dark:text-gray-500 text-xs mt-1'>
                      <svg
                        width='16'
                        height='16'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z'
                          strokeWidth='2'
                        />
                      </svg>
                      {savedCandidate.candidate.preferredJobLocation
                        ? savedCandidate.candidate.preferredJobLocation
                        : savedCandidate.candidate.address?.city ||
                          savedCandidate.candidate.address?.region ||
                          'Location not specified'}
                      {savedCandidate.candidate.yearOfExperience !==
                        undefined &&
                        savedCandidate.candidate.yearOfExperience !== null && (
                          <>
                            <span>•</span>
                            {savedCandidate.candidate.yearOfExperience}{' '}
                            {savedCandidate.candidate.yearOfExperience === 1
                              ? 'year'
                              : 'years'}{' '}
                            experience
                          </>
                        )}
                    </div>
                    <div className='flex items-center gap-2 text-gray-400 dark:text-gray-500 text-xs mt-1'>
                      {savedCandidate.candidate.highestLevelOfEducation && (
                        <>
                          <svg
                            width='16'
                            height='16'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path d='M12 14l9-5-9-5-9 5 9 5z' strokeWidth='2' />
                            <path
                              d='M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z'
                              strokeWidth='2'
                            />
                          </svg>
                          {savedCandidate.candidate.highestLevelOfEducation}
                        </>
                      )}
                      {savedCandidate.candidate.salaryExpectations && (
                        <>
                          <span>•</span>$
                          {savedCandidate.candidate.salaryExpectations.toLocaleString()}
                          /year
                        </>
                      )}
                    </div>

                    {/* Notes and Tags */}
                    {(savedCandidate.notes || savedCandidate.tags?.length) && (
                      <div className='mt-2 space-y-1'>
                        {savedCandidate.notes && (
                          <div className='text-xs text-gray-600 dark:text-gray-400'>
                            <span className='font-medium'>Notes:</span>{' '}
                            {savedCandidate.notes}
                          </div>
                        )}
                        {savedCandidate.tags &&
                          savedCandidate.tags.length > 0 && (
                            <div className='flex flex-wrap gap-1'>
                              {savedCandidate.tags.map((tag, tagIdx) => (
                                <span
                                  key={tagIdx}
                                  className='px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full'
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                      </div>
                    )}

                    {savedCandidate.candidate.technicalSkills &&
                      savedCandidate.candidate.technicalSkills.length > 0 && (
                        <div className='flex flex-wrap gap-1 mt-2'>
                          {savedCandidate.candidate.technicalSkills
                            .slice(0, 3)
                            .map((skill: string, skillIdx: number) => (
                              <span
                                key={skillIdx}
                                className='px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full'
                              >
                                {skill}
                              </span>
                            ))}
                          {savedCandidate.candidate.technicalSkills.length >
                            3 && (
                            <span className='px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full'>
                              +
                              {savedCandidate.candidate.technicalSkills.length -
                                3}{' '}
                              more
                            </span>
                          )}
                        </div>
                      )}
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() =>
                      handleCandidateClick(savedCandidate.candidate)
                    }
                    className='px-4 py-2 rounded-md font-semibold flex items-center gap-2 transition hover:bg-blue-600 hover:text-white bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  >
                    <FiEye className='w-4 h-4' />
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(savedCandidate)}
                    className='p-2 border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  >
                    <FiEdit2 className='w-4 h-4' />
                  </button>
                  <button
                    onClick={() => handleDelete(savedCandidate)}
                    className='p-2 border border-gray-200 dark:border-gray-600 rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                  >
                    <FiTrash2 className='w-4 h-4' />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingCandidate && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                Edit Saved Candidate
              </h3>
              <button
                onClick={handleCloseEditModal}
                className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              >
                <FiX className='w-5 h-5' />
              </button>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Notes
                </label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  rows={3}
                  placeholder='Add notes about this candidate...'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Tags (comma-separated)
                </label>
                <input
                  type='text'
                  value={editForm.tags}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, tags: e.target.value }))
                  }
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder='e.g., frontend, react, senior'
                />
              </div>
            </div>

            <div className='flex justify-end gap-3 mt-6'>
              <button
                onClick={handleCloseEditModal}
                className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Detail Modal */}
      {showModal && selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
