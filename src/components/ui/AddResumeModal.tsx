import React, { useRef, useState } from 'react';

interface AddResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, file: File) => void;
  loading?: boolean;
}

const MAX_SIZE_MB = 12;

const AddResumeModal: React.FC<AddResumeModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  loading,
}) => {
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== 'application/pdf') {
      setError('Only PDF files are allowed.');
      setFile(null);
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setError('File size exceeds 12 MB.');
      setFile(null);
      return;
    }
    setFile(f);
    setError('');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    if (f.type !== 'application/pdf') {
      setError('Only PDF files are allowed.');
      setFile(null);
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setError('File size exceeds 12 MB.');
      setFile(null);
      return;
    }
    setFile(f);
    setError('');
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleAdd = () => {
    if (name && file && !error) {
      onAdd(name, file);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30'>
      <div className='bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative'>
        {/* Close Button */}
        <button
          className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl'
          onClick={onClose}
          aria-label='Close'
        >
          &times;
        </button>
        <div className='font-semibold text-lg mb-4'>Add Cv/Resume</div>
        <div className='mb-4'>
          <div className='mb-2 text-sm font-medium'>Cv/Resume Name</div>
          <input
            className='w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200'
            placeholder='Enter resume name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className='mb-4'>
          <div className='mb-2 text-sm font-medium'>Upload your Cv/Resume</div>
          <div
            className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center p-6 cursor-pointer transition-colors ${error ? 'border-red-400' : 'border-gray-200 hover:border-blue-400'}`}
            onClick={handleBrowseClick}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <input
              ref={fileInputRef}
              type='file'
              accept='application/pdf'
              className='hidden'
              onChange={handleFileChange}
              disabled={loading}
            />
            <div className='text-3xl mb-2 text-gray-400'>
              <svg
                width='40'
                height='40'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  d='M12 16v-4m0 0V8m0 4h4m-4 0H8'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <circle cx='12' cy='12' r='10' strokeWidth='2' />
              </svg>
            </div>
            <div className='font-medium text-gray-600'>
              {file ? file.name : 'Browse File'}{' '}
              <span className='text-gray-400'>or drop here</span>
            </div>
            <div className='text-xs mt-2'>
              Only PDF format available. Max file size 12 MB.
            </div>
            {error && <div className='text-xs text-red-500 mt-2'>{error}</div>}
          </div>
        </div>
        <div className='flex justify-end gap-2 mt-6'>
          <button
            className='px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-medium'
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded bg-blue-600 text-white font-medium transition ${!name || !file || !!error || loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            onClick={handleAdd}
            disabled={!name || !file || !!error || loading}
          >
            {loading ? 'Adding...' : 'Add Cv/Resume'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddResumeModal;
