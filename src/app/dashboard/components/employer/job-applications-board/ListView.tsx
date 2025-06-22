import React from 'react';
import { Application } from '@/services/applicationService';
import {
  PencilSquareIcon,
  EllipsisVerticalIcon,
  EnvelopeIcon,
  ArrowDownTrayIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

interface ListViewProps {
  applications: Record<string, Application>;
  filteredAppIds: string[];
  selectedRows: string[];
  toggleSelectRow: (id: string) => void;
  allSelected: boolean;
  isIndeterminate: boolean;
  toggleSelectAll: () => void;
  clearSelection: () => void;
  setSelectedApplicationId: (id: string) => void;
  openActionMenu: string | null;
  setOpenActionMenu: (id: string | null) => void;
  columns?: { id: string; title: string; appIds: string[] }[];
  onRemarkAction?: (appId: string) => void;
}

const ListView: React.FC<ListViewProps> = ({
  applications,
  filteredAppIds,
  selectedRows,
  toggleSelectRow,
  allSelected,
  isIndeterminate,
  toggleSelectAll,
  clearSelection,
  setSelectedApplicationId,
  openActionMenu,
  setOpenActionMenu,
  columns = [
    { id: 'PENDING', title: 'Pending', appIds: [] },
    { id: 'SELECTED', title: 'Selected', appIds: [] },
    { id: 'REJECTED', title: 'Rejected', appIds: [] },
    { id: 'HIRED', title: 'Hired', appIds: [] },
  ],
  onRemarkAction,
}) => {
  function getAppStatus(appId: string) {
    const col = columns.find((c) => c.appIds.includes(appId));
    return col
      ? { id: col.id, title: col.title }
      : { id: 'all', title: 'All Applications' };
  }
  function getStatusColor(status: string) {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'SELECTED':
        return 'bg-blue-100 text-blue-700';
      case 'REJECTED':
        return 'bg-red-100 text-red-700';
      case 'HIRED':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }
  return (
    <div className='bg-white rounded-lg shadow p-4'>
      {/* Bulk actions bar is handled outside */}
      <table className='min-w-full text-sm'>
        <thead>
          <tr className='text-gray-400 text-left'>
            <th className='py-2 px-4'>
              <input
                type='checkbox'
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = isIndeterminate;
                }}
                onChange={toggleSelectAll}
              />
            </th>
            <th className='py-2 px-4'>Name</th>
            <th className='py-2 px-4'>Role</th>
            <th className='py-2 px-4'>Experience</th>
            <th className='py-2 px-4'>Education</th>
            <th className='py-2 px-4'>Applied</th>
            <th className='py-2 px-4'>Status</th>
            <th className='py-2 px-4'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppIds.map((appId) => {
            const app = applications[appId];
            const status = getAppStatus(appId);
            return (
              <tr
                key={appId}
                className='border-t hover:bg-blue-50 cursor-pointer'
                onClick={() => setSelectedApplicationId(appId)}
              >
                <td className='py-3 px-4' onClick={(e) => e.stopPropagation()}>
                  <input
                    type='checkbox'
                    checked={selectedRows.includes(appId)}
                    onChange={() => toggleSelectRow(appId)}
                  />
                </td>
                <td className='py-3 px-4 font-medium'>
                  {app.userInfo?.firstName} {app.userInfo?.lastName}
                </td>
                <td className='py-3 px-4'>{app.jobPost?.position}</td>
                <td className='py-3 px-4'>
                  {app.userInfo?.yearOfExperience || 'N/A'} years
                </td>
                <td className='py-3 px-4'>
                  {app.userInfo?.highestLevelOfEducation || 'N/A'}
                </td>
                <td className='py-3 px-4'>
                  {new Date(app.userInfo?.createdAt)?.toLocaleDateString()}
                </td>
                <td className='py-3 px-4'>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold cursor-default ${getStatusColor(app.status)}`}
                    title={app?.status}
                  >
                    {app?.status}
                  </span>
                </td>
                <td
                  className='py-3 px-4 relative'
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className='w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 border border-gray-200'
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenActionMenu(
                        openActionMenu === appId ? null : appId,
                      );
                    }}
                    aria-label='Open actions menu'
                    type='button'
                  >
                    <EllipsisVerticalIcon className='w-5 h-5' />
                  </button>
                  {openActionMenu === appId && (
                    <div className='absolute right-0 mt-2 w-44 bg-white border rounded shadow-lg z-10'>
                      <button
                        className='flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100'
                        onClick={() => {
                          setSelectedApplicationId(appId);
                          setOpenActionMenu(null);
                        }}
                      >
                        <PencilSquareIcon className='w-5 h-5 text-blue-500' />{' '}
                        View Details
                      </button>
                      <button
                        className='flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100'
                        onClick={() => {
                          /* TODO: Send email logic */
                          setOpenActionMenu(null);
                        }}
                      >
                        <EnvelopeIcon className='w-5 h-5 text-green-500' /> Send
                        Email
                      </button>
                      <button
                        className='flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100'
                        onClick={() => {
                          onRemarkAction?.(appId);
                          setOpenActionMenu(null);
                        }}
                      >
                        <ChatBubbleLeftRightIcon className='w-5 h-5 text-purple-500' />{' '}
                        Add Remark
                      </button>
                      <button
                        className='flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100'
                        onClick={() => {
                          /* TODO: Download CV logic */
                          setOpenActionMenu(null);
                        }}
                      >
                        <ArrowDownTrayIcon className='w-5 h-5 text-indigo-500' />{' '}
                        Download CV
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ListView;
