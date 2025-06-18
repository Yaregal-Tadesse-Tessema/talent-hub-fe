import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface BulkActionModalProps {
  bulkActionModal: any;
  setBulkActionModal: (modal: any) => void;
  selectedRows: string[];
  notifyByEmail: boolean;
  setNotifyByEmail: (val: boolean) => void;
  remarkText: string;
  setRemarkText: (val: string) => void;
  mailDraft: string;
  setMailDraft: (val: string) => void;
  availableTags: string[];
  setAvailableTags: (tags: string[]) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  newTag: string;
  setNewTag: (tag: string) => void;
}

const BulkActionModal: React.FC<BulkActionModalProps> = ({
  bulkActionModal,
  setBulkActionModal,
  selectedRows,
  notifyByEmail,
  setNotifyByEmail,
  remarkText,
  setRemarkText,
  mailDraft,
  setMailDraft,
  availableTags,
  setAvailableTags,
  selectedTags,
  setSelectedTags,
  newTag,
  setNewTag,
}) => {
  if (!bulkActionModal.open) return null;
  const resetState = () => {
    setBulkActionModal({ open: false, action: null });
    setNotifyByEmail(false);
    setRemarkText('');
    setMailDraft('');
    setSelectedTags([]);
    setNewTag('');
  };
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30'>
      <div className='bg-white rounded-lg shadow-lg p-6 min-w-[340px] relative'>
        <button
          type='button'
          onClick={resetState}
          className='absolute top-2 right-2 text-gray-400 hover:text-gray-600'
        >
          <XMarkIcon className='w-5 h-5' />
        </button>
        <h2 className='text-lg font-semibold mb-4'>
          {bulkActionModal.action === 'move' && 'Move to column'}
          {bulkActionModal.action === 'shortlist' && 'Shortlist Candidates'}
          {bulkActionModal.action === 'remark' && 'Add Remark'}
          {bulkActionModal.action === 'mail' && 'Send Mail'}
          {bulkActionModal.action === 'reject' && 'Reject Candidates'}
          {bulkActionModal.action === 'tag' && 'Add Tags'}
        </h2>
        <div className='mb-4'>
          <p>
            This action will affect <b>{selectedRows.length}</b> candidate
            {selectedRows.length > 1 ? 's' : ''}.
          </p>
          {bulkActionModal.action === 'remark' && (
            <div className='mt-4'>
              <label className='block text-sm font-medium mb-1'>Remark</label>
              <textarea
                className='border rounded px-3 py-2 w-full min-h-[80px]'
                value={remarkText}
                onChange={(e) => setRemarkText(e.target.value)}
                placeholder='Enter your remark here...'
              />
            </div>
          )}
          {bulkActionModal.action === 'mail' && (
            <div className='mt-4'>
              <label className='block text-sm font-medium mb-1'>
                Draft Mail
              </label>
              <textarea
                className='border rounded px-3 py-2 w-full min-h-[120px]'
                value={mailDraft}
                onChange={(e) => setMailDraft(e.target.value)}
                placeholder='Write your email draft here...'
              />
            </div>
          )}
          {bulkActionModal.action === 'tag' && (
            <div className='mt-4'>
              <label className='block text-sm font-medium mb-1'>Add Tags</label>
              <div className='flex flex-wrap gap-2 mb-2'>
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    type='button'
                    className={`px-3 py-1 rounded-full border text-xs font-medium transition ${selectedTags.includes(tag) ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                    onClick={() => {
                      if (selectedTags.includes(tag)) {
                        setSelectedTags(selectedTags.filter((t) => t !== tag));
                      } else {
                        setSelectedTags([...selectedTags, tag]);
                      }
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newTag.trim() && !availableTags.includes(newTag.trim())) {
                    setAvailableTags([...availableTags, newTag.trim()]);
                    setSelectedTags([...selectedTags, newTag.trim()]);
                    setNewTag('');
                  }
                }}
                className='flex gap-2 mt-2'
              >
                <input
                  className='border rounded px-3 py-2 flex-1 text-sm'
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder='Create new tag'
                />
                <button
                  type='submit'
                  className='bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700'
                >
                  Add
                </button>
              </form>
            </div>
          )}
          {bulkActionModal?.action !== 'remark' &&
            bulkActionModal?.action !== 'mail' &&
            bulkActionModal?.action !== 'tag' && (
              <label className='flex items-center gap-2 mt-4'>
                <input
                  type='checkbox'
                  checked={notifyByEmail}
                  onChange={(e) => setNotifyByEmail(e.target.checked)}
                />
                <span>
                  Notify candidate{selectedRows.length > 1 ? 's' : ''} by email
                </span>
              </label>
            )}
        </div>
        <div className='flex gap-2 mt-4'>
          <button
            className='flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium'
            onClick={resetState}
          >
            Confirm
          </button>
          <button
            className='flex-1 bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 font-medium'
            onClick={resetState}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionModal;
