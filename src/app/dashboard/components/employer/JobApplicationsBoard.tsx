import React, { useState, useEffect } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import {
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  PlusIcon,
  Squares2X2Icon,
  ListBulletIcon,
  FunnelIcon,
  ArrowUpTrayIcon,
  ChevronDownIcon,
  EllipsisVerticalIcon,
  EnvelopeIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import ApplicationDetailModal, {
  ApplicationDetail,
} from './ApplicationDetailModal';
import {
  applicationService,
  Application,
  Column,
  ApplicationStatus,
} from '@/services/applicationService';
import { useToast } from '@/contexts/ToastContext';
import { useEmployerChange } from '@/hooks/useEmployerChange';

// Accept props: jobId, onBack
export default function JobApplicationsBoard({
  jobId,
  onBack,
}: {
  jobId: string;
  onBack: () => void;
}) {
  const { showToast } = useToast();
  // --- Board/List State and Logic ---
  const initialColumns: Column[] = [
    {
      id: 'PENDING' as ApplicationStatus,
      title: 'Pending',
      appIds: [] as string[],
    },
    {
      id: 'SELECTED' as ApplicationStatus,
      title: 'Selected',
      appIds: [] as string[],
    },
    {
      id: 'REJECTED' as ApplicationStatus,
      title: 'Rejected',
      appIds: [] as string[],
    },
    {
      id: 'HIRED' as ApplicationStatus,
      title: 'Hired',
      appIds: [] as string[],
    },
  ];

  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [applications, setApplications] = useState<Record<string, Application>>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'board' | 'list'>('board');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    experience: '',
    education: '',
    appliedFrom: '',
    appliedTo: '',
  });
  const [sort, setSort] = useState<'newest' | 'oldest' | 'az' | 'za'>('newest');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    string | null
  >(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      console.log(jobId);
      const response = await applicationService.getApplicationsByJobId(jobId);

      // Convert applications array to record
      const applicationsRecord: Record<string, Application> = {};
      console.log(response.items);
      response.items.forEach((app) => {
        applicationsRecord[app.id] = app;
      });

      setApplications(applicationsRecord);

      // Update columns with application IDs based on status
      const newColumns = columns.map((col) => ({
        ...col,
        appIds: [] as string[], // Reset all columns with explicit type
      }));

      // Distribute applications to appropriate columns
      response.items.forEach((app) => {
        const status = app.status?.toUpperCase() || 'PENDING';
        // If status is not one of our defined columns, put it in PENDING
        const column =
          newColumns.find((col) => col.id === status) ||
          newColumns.find((col) => col.id === 'PENDING');
        if (column) {
          column.appIds.push(app.id);
        }
      });

      setColumns(newColumns);
      setError(null);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to fetch applications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Add employer change handler
  useEmployerChange((employer) => {
    // Refresh job applications data
    fetchApplications();
  });

  // Fetch applications when component mounts or jobId changes
  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  async function onDragEnd(result: DropResult) {
    const { source, destination } = result;

    // If dropped outside a droppable area
    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Find the source and destination columns
    const sourceColumn = columns.find((col) => col.id === source.droppableId);
    const destColumn = columns.find(
      (col) => col.id === destination.droppableId,
    );

    if (!sourceColumn || !destColumn) {
      return;
    }

    // Create new arrays to avoid mutating state directly
    const sourceAppIds = Array.from(sourceColumn.appIds);
    const destAppIds =
      source.droppableId === destination.droppableId
        ? sourceAppIds
        : Array.from(destColumn.appIds);

    // Remove the item from the source
    const [removed] = sourceAppIds.splice(source.index, 1);

    // Add the item to the destination
    destAppIds.splice(destination.index, 0, removed);

    // Update the columns state
    const newColumns = columns.map((col) => {
      if (col.id === source.droppableId) {
        return {
          ...col,
          appIds: sourceAppIds,
        };
      }
      if (col.id === destination.droppableId) {
        return {
          ...col,
          appIds: destAppIds,
        };
      }
      return col;
    });

    setColumns(newColumns);

    // Update application status in the backend
    try {
      await applicationService.changeApplicationStatus({
        id: removed,
        status: destination.droppableId as ApplicationStatus,
      });

      // Show success toast
      showToast({
        type: 'success',
        message: `Application status changed to ${destColumn.title}`,
      });
    } catch (err) {
      console.error('Error updating application status:', err);
      // Revert the UI change if the API call fails
      setColumns(columns);
      // Show error toast
      showToast({
        type: 'error',
        message: 'Failed to update application status',
      });
    }
  }

  // Bulk select logic
  const allAppIds = Object.keys(applications);
  let filteredAppIds = allAppIds.filter((id) => {
    const app = applications[id];
    if (
      filters.name &&
      !`${app.userInfo.firstName} ${app.userInfo.lastName}`
        .toLowerCase()
        .includes(filters.name.toLowerCase())
    )
      return false;
    if (
      filters.experience &&
      !String(app.userInfo.yearOfExperience || '')
        .toLowerCase()
        .includes(filters.experience.toLowerCase())
    )
      return false;
    if (
      filters.education &&
      !String(app.userInfo.highestLevelOfEducation || '')
        .toLowerCase()
        .includes(filters.education.toLowerCase())
    )
      return false;
    if (
      filters.appliedFrom &&
      new Date(app.userInfo.createdAt) < new Date(filters.appliedFrom)
    )
      return false;
    if (
      filters.appliedTo &&
      new Date(app.userInfo.createdAt) > new Date(filters.appliedTo)
    )
      return false;
    return true;
  });
  filteredAppIds = filteredAppIds.sort((a, b) => {
    const appA = applications[a];
    const appB = applications[b];
    if (sort === 'newest')
      return (
        new Date(appB.userInfo.createdAt).getTime() -
        new Date(appA.userInfo.createdAt).getTime()
      );
    if (sort === 'oldest')
      return (
        new Date(appA.userInfo.createdAt).getTime() -
        new Date(appB.userInfo.createdAt).getTime()
      );
    if (sort === 'az')
      return appA.userInfo.firstName.localeCompare(appB.userInfo.firstName);
    if (sort === 'za')
      return appB.userInfo.firstName.localeCompare(appA.userInfo.firstName);
    return 0;
  });
  const allSelected =
    filteredAppIds.length > 0 && selectedRows.length === filteredAppIds.length;
  const isIndeterminate =
    selectedRows.length > 0 && selectedRows.length < filteredAppIds.length;
  function toggleSelectAll() {
    if (allSelected) setSelectedRows([]);
    else setSelectedRows(filteredAppIds);
  }
  function toggleSelectRow(id: string) {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  }
  function clearSelection() {
    setSelectedRows([]);
  }
  // Helper to get status/column for an application
  function getAppStatus(appId: string) {
    const col = columns.find((c) => c.appIds.includes(appId));
    return col
      ? { id: col.id, title: col.title }
      : { id: 'all', title: 'All Applications' };
  }
  // Helper to get color for a status/column
  function getStatusColor(colId: string) {
    switch (colId) {
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
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (openActionMenu !== null) setOpenActionMenu(null);
    }
    if (openActionMenu !== null) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [openActionMenu]);

  if (loading) {
    return (
      <div className='flex-1 p-6'>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex-1 p-6'>
        <div className='flex justify-center items-center h-64'>
          <div className='text-red-500'>{error}</div>
        </div>
      </div>
    );
  }

  // --- UI ---
  return (
    <div className='flex-1 p-6'>
      {/* Breadcrumb */}
      <nav className='text-sm text-gray-500 mb-4 flex items-center gap-1'>
        <Link href='/dashboard' className='hover:underline'>
          Dashboard
        </Link>
        <span>/</span>
        <Link href='/dashboard' className='hover:underline'>
          My Jobs
        </Link>
        <span>/</span>
        <span className='text-gray-700 font-semibold'>Applications</span>
      </nav>

      {/* Filter Modal */}
      {filterOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30'>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setFilterOpen(false);
            }}
            className='bg-white rounded-lg shadow-lg p-6 min-w-[340px] relative'
          >
            <button
              type='button'
              onClick={() => setFilterOpen(false)}
              className='absolute top-2 right-2 text-gray-400 hover:text-gray-600'
            >
              <XMarkIcon className='w-5 h-5' />
            </button>
            <h2 className='text-lg font-semibold mb-4'>Filter Applications</h2>
            <div className='mb-3'>
              <label className='block text-xs mb-1'>Name</label>
              <input
                className='border rounded px-3 py-2 w-full'
                value={filters.name}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div className='mb-3'>
              <label className='block text-xs mb-1'>Experience</label>
              <input
                className='border rounded px-3 py-2 w-full'
                value={filters.experience}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, experience: e.target.value }))
                }
              />
            </div>
            <div className='mb-3'>
              <label className='block text-xs mb-1'>Education</label>
              <input
                className='border rounded px-3 py-2 w-full'
                value={filters.education}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, education: e.target.value }))
                }
              />
            </div>
            <div className='mb-3 flex gap-2'>
              <div className='flex-1'>
                <label className='block text-xs mb-1'>Applied From</label>
                <input
                  type='date'
                  className='border rounded px-3 py-2 w-full'
                  value={filters.appliedFrom}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, appliedFrom: e.target.value }))
                  }
                />
              </div>
              <div className='flex-1'>
                <label className='block text-xs mb-1'>Applied To</label>
                <input
                  type='date'
                  className='border rounded px-3 py-2 w-full'
                  value={filters.appliedTo}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, appliedTo: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className='flex gap-2 mt-4'>
              <button
                type='submit'
                className='flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium'
              >
                Apply
              </button>
              <button
                type='button'
                className='flex-1 bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 font-medium'
                onClick={() => {
                  setFilters({
                    name: '',
                    experience: '',
                    education: '',
                    appliedFrom: '',
                    appliedTo: '',
                  });
                  setFilterOpen(false);
                }}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Sort Modal */}
      {sortOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30'>
          <div className='bg-white rounded-lg shadow-lg p-6 min-w-[240px] relative'>
            <button
              type='button'
              onClick={() => setSortOpen(false)}
              className='absolute top-2 right-2 text-gray-400 hover:text-gray-600'
            >
              <XMarkIcon className='w-5 h-5' />
            </button>
            <h2 className='text-lg font-semibold mb-4'>Sort Applications</h2>
            <div className='flex flex-col gap-2'>
              <button
                className={`text-left px-3 py-2 rounded ${sort === 'newest' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                onClick={() => {
                  setSort('newest');
                  setSortOpen(false);
                }}
              >
                Newest
              </button>
              <button
                className={`text-left px-3 py-2 rounded ${sort === 'oldest' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                onClick={() => {
                  setSort('oldest');
                  setSortOpen(false);
                }}
              >
                Oldest
              </button>
              <button
                className={`text-left px-3 py-2 rounded ${sort === 'az' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                onClick={() => {
                  setSort('az');
                  setSortOpen(false);
                }}
              >
                Name A-Z
              </button>
              <button
                className={`text-left px-3 py-2 rounded ${sort === 'za' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                onClick={() => {
                  setSort('za');
                  setSortOpen(false);
                }}
              >
                Name Z-A
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Header Row: Title left, controls right */}
      <div className='flex items-center justify-between mb-2'>
        <p className='text-sm font-bold'>
          Job ID: <span className='text-gray-500 text-sm'>{jobId}</span>
        </p>
        <div className='flex items-center gap-2'>
          <div className='flex bg-gray-100 rounded overflow-hidden border border-gray-200'>
            <button
              onClick={() => setView('board')}
              title='Board View'
              className={`flex items-center justify-center px-3 py-2 ${view === 'board' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-50'}`}
            >
              <Squares2X2Icon className='w-5 h-5' />
            </button>
            <button
              onClick={() => setView('list')}
              title='List View'
              className={`flex items-center justify-center px-3 py-2 ${view === 'list' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-50'}`}
            >
              <ListBulletIcon className='w-5 h-5' />
            </button>
          </div>
          <button
            onClick={() => setFilterOpen(true)}
            className='flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 rounded font-medium text-gray-700 hover:bg-blue-50'
            title='Filter'
          >
            <FunnelIcon className='w-5 h-5' />
          </button>
          <button
            onClick={() => setSortOpen(true)}
            className='flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 rounded font-medium text-gray-700 hover:bg-blue-50'
            title='Sort'
          >
            <ChevronDownIcon className='w-5 h-5' />
          </button>
        </div>
      </div>
      {/* Main Content: Board or List */}
      {view === 'board' ? (
        <div className='flex gap-6 overflow-x-auto'>
          <DragDropContext onDragEnd={onDragEnd}>
            {columns.map((col) => (
              <Droppable droppableId={col.id} key={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`bg-white rounded-lg shadow p-4 min-w-[300px] max-w-[320px] flex-1 transition border ${
                      snapshot.isDraggingOver
                        ? 'bg-blue-50 border-blue-400'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className='flex items-center justify-between mb-4'>
                      <div className='font-semibold'>
                        {col.title}{' '}
                        <span className='text-gray-400'>
                          ({col.appIds.length})
                        </span>
                      </div>
                    </div>
                    <div className='flex flex-col gap-4'>
                      {col.appIds
                        .filter((appId) => filteredAppIds.includes(appId))
                        .map((appId, idx) => {
                          const app = applications[appId];
                          return (
                            <Draggable
                              draggableId={appId}
                              index={idx}
                              key={appId}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200 ${
                                    snapshot.isDragging
                                      ? 'bg-blue-100 border-blue-400'
                                      : ''
                                  }`}
                                  style={{
                                    ...provided.draggableProps.style,
                                    cursor: 'grab',
                                  }}
                                >
                                  <div className='flex justify-between items-start mb-2'>
                                    <div>
                                      <div className='font-semibold'>
                                        {`${app.userInfo.firstName} ${app.userInfo.lastName}`}
                                      </div>
                                      <div className='text-xs text-gray-500'>
                                        {app.jobPost.position}
                                      </div>
                                    </div>
                                    <div className='relative'>
                                      <button
                                        className='w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 border border-gray-200'
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setOpenActionMenu(
                                            openActionMenu === appId
                                              ? null
                                              : appId,
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
                                            <EnvelopeIcon className='w-5 h-5 text-green-500' />{' '}
                                            Send Email
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
                                    </div>
                                  </div>
                                  <ul className='text-xs text-gray-600 mb-2'>
                                    <li>
                                      Experience:{' '}
                                      {app.userInfo.yearOfExperience ||
                                        'Not specified'}{' '}
                                      years
                                    </li>
                                    <li>
                                      Education:{' '}
                                      {app.userInfo.highestLevelOfEducation ||
                                        'Not specified'}
                                    </li>
                                    <li>
                                      Applied:{' '}
                                      {new Date(
                                        app.userInfo.createdAt,
                                      ).toLocaleDateString()}
                                    </li>
                                  </ul>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </DragDropContext>
        </div>
      ) : (
        <div className='bg-white rounded-lg shadow p-4'>
          {/* Bulk actions bar */}
          {selectedRows.length > 0 && (
            <div className='flex items-center gap-4 mb-4 bg-blue-50 border border-blue-200 rounded px-4 py-2'>
              <span className='font-medium text-blue-700'>
                {selectedRows.length} selected
              </span>
              {/* Placeholder for bulk actions */}
              <button
                className='text-sm text-blue-600 hover:underline'
                onClick={clearSelection}
              >
                Clear
              </button>
              <button className='text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded hover:bg-gray-200'>
                Move to column
              </button>
              <button className='text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded hover:bg-gray-200'>
                Shortlist
              </button>
              <button className='text-sm text-red-600 bg-red-50 px-3 py-1 rounded hover:bg-red-100'>
                Delete
              </button>
            </div>
          )}
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
                    <td
                      className='py-3 px-4'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type='checkbox'
                        checked={selectedRows.includes(appId)}
                        onChange={() => toggleSelectRow(appId)}
                      />
                    </td>
                    <td className='py-3 px-4 font-medium'>
                      {app.userInfo.firstName} {app.userInfo.lastName}
                    </td>
                    <td className='py-3 px-4'>{app.jobPost.position}</td>
                    <td className='py-3 px-4'>
                      {app.userInfo.yearOfExperience || 'Not specified'} years
                    </td>
                    <td className='py-3 px-4'>
                      {app.userInfo.highestLevelOfEducation || 'Not specified'}
                    </td>
                    <td className='py-3 px-4'>
                      {new Date(app.userInfo.createdAt).toLocaleDateString()}
                    </td>
                    <td className='py-3 px-4'>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold cursor-default ${getStatusColor(status.id)}`}
                        title={status.title}
                      >
                        {status.title.length > 14
                          ? status.title.slice(0, 12) + '…'
                          : status.title}
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
                            <EnvelopeIcon className='w-5 h-5 text-green-500' />{' '}
                            Send Email
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
      )}
      <ApplicationDetailModal
        open={!!selectedApplicationId}
        onClose={() => setSelectedApplicationId(null)}
        application={mockApplicationDetail}
      />
    </div>
  );
}

const mockApplicationDetail: ApplicationDetail = {
  name: 'Esther Howard',
  role: 'Website Designer (UI/UX)',
  biography: `I've been passionate about graphic design and digital art from an early age with a keen interest in Website and Mobile Application User Interfaces. I can create high-quality and aesthetically pleasing designs in a quick turnaround time. Check out the portfolio section of my profile to see samples of my work and feel free to discuss your designing needs. I mostly use Adobe Photoshop, Illustrator, XD and Figma. *Website User Experience and Interface (UI/UX) Design - for all kinds of Professional and Personal websites. *Mobile Application User Experience and Interface Design - for all kinds of IOS/Android and Hybrid Mobile Applications. *Wireframe Designs.`,
  coverLetter: `Dear Sir,\n\nI am writing to express my interest in the fourth grade instructional position that is currently available in the Fort Wayne Community School System. I learned of the opening through a notice posted on JobZone, IPFW's job database. I am confident that my academic background and curriculum development skills would be successfully utilized in this teaching position.\n\nI have just completed my Bachelor of Science degree in Elementary Education and have successfully completed Praxis I and Praxis II. During my student teaching experience, I developed and initiated a three-week curriculum sequence on animal species and earth resources. This collaborative unit involved working with three other third grade teachers within my team, and culminated in a field trip to the Indianapolis Zoo Animal Research Unit.\n\nSincerely,\nEsther Howard`,
  socialLinks: [
    { type: 'facebook', url: '#' },
    { type: 'twitter', url: '#' },
    { type: 'linkedin', url: '#' },
    { type: 'instagram', url: '#' },
    { type: 'youtube', url: '#' },
  ],
  dob: '14 June, 2021',
  nationality: 'Bangladesh',
  maritalStatus: 'Single',
  gender: 'Male',
  experience: '7 Years',
  education: 'Master Degree',
  resumeUrl: '#',
  contact: {
    website: 'www.estherhoward.com',
    location: 'Beverly Hills, California 90202',
    address: 'Zone/Block Basement 1 Unit B2, 1372 Spring Avenue, Portland,',
    phone: '+1-202-555-0141',
    phone2: '+1-202-555-0189',
    email: 'esther.howard@gmail.com',
  },
};
