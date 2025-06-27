import React, { useState } from 'react';
import { FiX, FiSave } from 'react-icons/fi';

interface SaveCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (remark: string) => void;
  candidateName: string;
  isSaving?: boolean;
}

const SaveCandidateModal: React.FC<SaveCandidateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  candidateName,
  isSaving = false,
}) => {
  const [remark, setRemark] = useState('');

  const handleSave = () => {
    onSave(remark);
    setRemark('');
  };

  const handleClose = () => {
    setRemark('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
            Save Candidate
          </h3>
          <button
            onClick={handleClose}
            className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          >
            <FiX className='w-5 h-5' />
          </button>
        </div>

        <div className='mb-4'>
          <p className='text-gray-600 dark:text-gray-400 mb-4'>
            Save{' '}
            <span className='font-medium text-gray-900 dark:text-white'>
              {candidateName}
            </span>{' '}
            to your saved candidates list.
          </p>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Remark (Optional)
            </label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              rows={3}
              placeholder='Add a note about this candidate...'
            />
          </div>
        </div>

        <div className='flex justify-end gap-3'>
          <button
            onClick={handleClose}
            className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
          >
            {isSaving ? (
              <>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                Saving...
              </>
            ) : (
              <>
                <FiSave className='w-4 h-4' />
                Save Candidate
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveCandidateModal;
