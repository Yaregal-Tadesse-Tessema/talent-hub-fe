import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface BulkActionModalProps {
  bulkActionModal: any;
  setBulkActionModal: (modal: any) => void;
  selectedRows: string[];
  notifyByEmail: boolean;
  setNotifyByEmail: (val: boolean) => void;
  mailDraft: string;
  setMailDraft: (val: string) => void;
  availableTags: string[];
  setAvailableTags: (tags: string[]) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  newTag: string;
  setNewTag: (tag: string) => void;
  onConfirmAction: (action: string, data?: any) => Promise<void>;
}

const BulkActionModal: React.FC<BulkActionModalProps> = ({
  bulkActionModal,
  setBulkActionModal,
  selectedRows,
  notifyByEmail,
  setNotifyByEmail,
  mailDraft,
  setMailDraft,
  availableTags,
  setAvailableTags,
  selectedTags,
  setSelectedTags,
  newTag,
  setNewTag,
  onConfirmAction,
}) => {
  const [isProcessing, setIsProcessing] = React.useState(false);

  if (!bulkActionModal.open) return null;

  const resetState = () => {
    setBulkActionModal({ open: false, action: null });
    setNotifyByEmail(false);
    setMailDraft('');
    setSelectedTags([]);
    setNewTag('');
    setIsProcessing(false);
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      let actionData = {};

      if (bulkActionModal.action === 'mail') {
        actionData = { mailDraft };
      } else if (bulkActionModal.action === 'tag') {
        actionData = { selectedTags };
      }

      await onConfirmAction(bulkActionModal.action, actionData);
      resetState();
    } catch (error) {
      console.error('Error processing bulk action:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30'>
      <div className='bg-white rounded-lg shadow-lg p-6 min-w-[340px] relative'>
        <button
          type='button'
          onClick={resetState}
          className='absolute top-2 right-2 text-gray-400 hover:text-gray-600'
          disabled={isProcessing}
        >
          <XMarkIcon className='w-5 h-5' />
        </button>
        <h2 className='text-lg font-semibold mb-4'>
          {bulkActionModal.action === 'move' && 'Move to column'}
          {bulkActionModal.action === 'shortlist' && 'Shortlist Candidates'}
          {bulkActionModal.action === 'mail' && 'Send Mail'}
          {bulkActionModal.action === 'reject' && 'Reject Candidates'}
          {bulkActionModal.action === 'tag' && 'Add Tags'}
        </h2>
        <div className='mb-4'>
          <p>
            This action will affect <b>{selectedRows.length}</b> candidate
            {selectedRows.length > 1 ? 's' : ''}.
          </p>
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
                disabled={isProcessing}
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
                    disabled={isProcessing}
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
                  disabled={isProcessing}
                />
                <button
                  type='submit'
                  className='bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50'
                  disabled={isProcessing}
                >
                  Add
                </button>
              </form>
            </div>
          )}
          {bulkActionModal?.action !== 'mail' &&
            bulkActionModal?.action !== 'tag' && (
              <label className='flex items-center gap-2 mt-4'>
                <input
                  type='checkbox'
                  checked={notifyByEmail}
                  onChange={(e) => setNotifyByEmail(e.target.checked)}
                  disabled={isProcessing}
                />
                <span>
                  Notify candidate{selectedRows.length > 1 ? 's' : ''} by email
                </span>
              </label>
            )}
        </div>
        <div className='flex gap-2 mt-4'>
          <button
            className='flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed'
            onClick={handleConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Confirm'}
          </button>
          <button
            className='flex-1 bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 font-medium disabled:opacity-50'
            onClick={resetState}
            disabled={isProcessing}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionModal;
