import React from 'react';
import {
  ArrowPathIcon,
  EnvelopeIcon,
  ArrowDownTrayIcon,
  PencilSquareIcon,
  TrashIcon,
  EllipsisVerticalIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { BadgeCheckIcon } from 'lucide-react';

type BulkActionType = 'move' | 'shortlist' | 'mail' | 'reject' | 'tag' | null;

interface BulkActionsBarProps {
  selectedRows: string[];
  clearSelection: () => void;
  setOpenActionMenu: (id: string | null) => void;
  openActionMenu: string | null;
  setBulkActionModal: (modal: {
    open: boolean;
    action: BulkActionType;
  }) => void;
}

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedRows,
  clearSelection,
  setBulkActionModal,
  setOpenActionMenu,
}) => {
  const handleBulkAction =
    (action: BulkActionType) => (e: React.MouseEvent) => {
      setBulkActionModal({ open: true, action });
      setOpenActionMenu(null);
    };
  return (
    <div className='flex items-center justify-between bg-blue-50 border border-blue-200 rounded px-4 py-2 mb-2'>
      <div className='text-blue-700 font-medium'>
        {selectedRows.length} selected
      </div>
      <div className='flex items-center gap-2'>
        <button
          className='flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-100 text-blue-700'
          onMouseDown={handleBulkAction('shortlist')}
        >
          <BadgeCheckIcon className='w-4 h-4' /> Shortlist
        </button>
        <button
          className='flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-100 text-red-700'
          onMouseDown={handleBulkAction('reject')}
        >
          <TrashIcon className='w-4 h-4' /> Reject
        </button>
        <button
          className='flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-100 text-blue-700'
          onMouseDown={handleBulkAction('mail')}
        >
          <EnvelopeIcon className='w-4 h-4' /> Mail
        </button>
        <button
          className='flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-100 text-blue-700'
          onMouseDown={handleBulkAction('tag')}
        >
          <PlusIcon className='w-4 h-4' /> Tag
        </button>
        <button
          className='flex items-center gap-1 px-2 py-1 rounded hover:bg-red-100 text-red-700'
          onClick={clearSelection}
        >
          <XMarkIcon className='w-4 h-4' /> Clear
        </button>
      </div>
    </div>
  );
};

export default BulkActionsBar;
