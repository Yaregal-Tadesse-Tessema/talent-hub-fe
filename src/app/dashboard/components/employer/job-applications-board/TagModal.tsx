import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Application } from '@/services/applicationService';

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
  onSave: (appId: string, tags: string[]) => Promise<void>;
  availableTags: string[];
  setAvailableTags: (tags: string[]) => void;
}

const TagModal: React.FC<TagModalProps> = ({
  isOpen,
  onClose,
  application,
  onSave,
  availableTags,
  setAvailableTags,
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (application) {
      setSelectedTags(application.tags || []);
    }
  }, [application]);

  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleAddTag = () => {
    const tag = newTag.trim();
    if (!tag) return;
    if (!availableTags.includes(tag)) {
      setAvailableTags([...availableTags, tag]);
    }
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setNewTag('');
  };

  const handleSave = async () => {
    if (!application) return;
    setIsLoading(true);
    try {
      await onSave(application.id, selectedTags);
      onClose();
    } catch (error) {
      console.error('Error saving tags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  if (!application) {
    return (
      <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
        <div className='bg-white rounded-lg shadow-xl max-w-md w-full mx-4'>
          <div className='p-6 text-center'>
            <p className='text-gray-500'>Loading application...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-md w-full mx-4'>
        <div className='flex items-center justify-between p-6 border-b'>
          <h2 className='text-lg font-semibold text-gray-900'>Add Tags</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600'
            disabled={isLoading}
          >
            <XMarkIcon className='w-6 h-6' />
          </button>
        </div>
        <div className='p-6'>
          <div className='flex flex-wrap gap-2 mb-4'>
            {availableTags.map((tag) => (
              <button
                key={tag}
                type='button'
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors focus:outline-none ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                }`}
                onClick={() => handleTagClick(tag)}
                disabled={isLoading}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className='flex gap-2 mb-6'>
            <input
              type='text'
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder='Create new tag'
              className='flex-1 border border-gray-300 rounded px-3 py-2 text-gray-700'
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddTag();
              }}
            />
            <button
              type='button'
              onClick={handleAddTag}
              className='px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors'
              disabled={isLoading || !newTag.trim()}
            >
              Add
            </button>
          </div>
          <div className='flex gap-4 mt-8'>
            <button
              className='flex-1 bg-blue-600 text-white py-3 rounded text-lg font-semibold hover:bg-blue-700 transition-colors'
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Confirm'}
            </button>
            <button
              className='flex-1 bg-gray-100 text-gray-700 py-3 rounded text-lg font-semibold hover:bg-gray-200 transition-colors'
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagModal;
