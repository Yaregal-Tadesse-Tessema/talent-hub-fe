import React, { useState, useEffect, useMemo } from 'react';
import { DropResult } from '@hello-pangea/dnd';
import {
  Squares2X2Icon,
  ListBulletIcon,
  FunnelIcon,
  ChevronDownIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import ApplicationDetailModal, {
  ApplicationDetail,
} from './ApplicationDetailModal';
import {
  applicationService,
  Application,
  Column,
  ApplicationStatus,
  ApplicationFilters,
} from '@/services/applicationService';
import { useToast } from '@/contexts/ToastContext';
import { useEmployerChange } from '@/hooks/useEmployerChange';
import { jobService } from '@/services/jobService';
import { Job } from '@/types/job';
import BoardView from './job-applications-board/BoardView';
import ListView from './job-applications-board/ListView';
import FilterModal from './job-applications-board/FilterModal';
import SortModal from './job-applications-board/SortModal';
import BulkActionsBar from './job-applications-board/BulkActionsBar';
import BulkActionModal from './job-applications-board/BulkActionModal';
import Breadcrumb from './job-applications-board/Breadcrumb';
import TagModal from './job-applications-board/TagModal';

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
  const [view, setView] = useState<'board' | 'list'>('list');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [filters, setFilters] = useState<ApplicationFilters>({
    // Basic Info
    name: '',
    email: '',
    phone: '',

    // Status & Application
    status: '',
    hasCV: null,
    hasCoverLetter: null,
    isViewed: null,
    hasRemark: null,

    // Experience & Education
    experienceMin: '',
    experienceMax: '',
    education: '',
    gpaMin: '',
    gpaMax: '',

    // Skills & Industry
    technicalSkills: [],
    softSkills: [],
    industry: '',

    // Location & Preferences
    location: '',
    salaryExpectations: '',

    // Application Date
    appliedFrom: '',
    appliedTo: '',

    // Score & Assessment
    questionaryScoreMin: '',
    questionaryScoreMax: '',
    aiJobFitScoreMin: '',
    aiJobFitScoreMax: '',
  });
  const [sort, setSort] = useState<'newest' | 'oldest' | 'az' | 'za'>('newest');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    string | null
  >(null);
  const [job, setJob] = useState<Job | null>(null);
  const [bulkActionModal, setBulkActionModal] = useState<{
    open: boolean;
    action: null | 'move' | 'shortlist' | 'mail' | 'reject' | 'tag';
  }>({ open: false, action: null });
  const [notifyByEmail, setNotifyByEmail] = useState(false);
  const [mailDraft, setMailDraft] = useState('');
  const [availableTags, setAvailableTags] = useState([
    'Top Talent',
    'Needs Review',
    'Interviewed',
    'Follow Up',
    'Potential Fit',
  ]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [remarkModal, setRemarkModal] = useState<{
    open: boolean;
    appId: string | null;
    remarkText: string;
  }>({ open: false, appId: null, remarkText: '' });
  const [tagModal, setTagModal] = useState<{
    open: boolean;
    application: Application | null;
  }>({ open: false, application: null });

  // Check if there are active filters
  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(
      (value) =>
        value !== '' &&
        value !== null &&
        (Array.isArray(value) ? value.length > 0 : true),
    );
  }, [filters]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(
      (value) =>
        value !== '' &&
        value !== null &&
        (Array.isArray(value) ? value.length > 0 : true),
    ).length;
  }, [filters]);

  // Filter applications based on current filters
  const filteredAppIds = useMemo(() => {
    // If there are no active filters, show all applications
    if (!hasActiveFilters) {
      return Object.keys(applications);
    }

    // If there are active filters, the backend already returned filtered results
    // So we just return all the applications we have (they're already filtered)
    return Object.keys(applications);
  }, [applications, hasActiveFilters]);

  const allSelected =
    filteredAppIds.length > 0 && selectedRows.length === filteredAppIds.length;
  const isIndeterminate =
    selectedRows.length > 0 && selectedRows.length < filteredAppIds.length;

  // Move useEffect to the top to avoid conditional hook calls
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      // Check if the click target is within a dropdown menu
      const target = e.target as Element;
      const isDropdownButton = target.closest(
        '[aria-label="Open actions menu"]',
      );
      const isDropdownMenu = target.closest('.dropdown-menu');

      if (!isDropdownButton && !isDropdownMenu && openActionMenu !== null) {
        setOpenActionMenu(null);
      }
    }
    if (openActionMenu !== null) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [openActionMenu]);

  const fetchApplications = async (filters?: ApplicationFilters) => {
    try {
      setLoading(true);

      let response;

      // Check if the provided filters have any active values
      const hasActiveFilterValues =
        filters &&
        Object.values(filters).some(
          (value) =>
            value !== '' &&
            value !== null &&
            (Array.isArray(value) ? value.length > 0 : true),
        );

      if (filters && hasActiveFilterValues) {
        // Use searchApplications for filtered results
        response = await applicationService.searchApplications(jobId, filters);
      } else {
        // Use regular getApplicationsByJobId for unfiltered results
        response = await applicationService.getApplicationsByJobId(jobId);
      }

      // Convert applications array to record
      const applicationsRecord: Record<string, Application> = {};

      response.items.forEach((app) => {
        applicationsRecord[app.id] = app;
      });

      setApplications(applicationsRecord);
      console.log('applicationsRecord', applicationsRecord);

      const job = await jobService.getJobById(jobId);
      setJob(job);

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

  // Function to handle filter application
  const handleApplyFilters = async (newFilters: ApplicationFilters) => {
    setFilters(newFilters);
    await fetchApplications(newFilters);
  };

  // Function to clear filters and refetch
  const handleClearFilters = async () => {
    const emptyFilters: ApplicationFilters = {
      name: '',
      email: '',
      phone: '',
      status: '',
      hasCV: null,
      hasCoverLetter: null,
      isViewed: null,
      hasRemark: null,
      experienceMin: '',
      experienceMax: '',
      education: '',
      gpaMin: '',
      gpaMax: '',
      salaryExpectations: '',
      technicalSkills: [],
      softSkills: [],
      industry: '',
      location: '',
      appliedFrom: '',
      appliedTo: '',
      questionaryScoreMin: '',
      questionaryScoreMax: '',
      aiJobFitScoreMin: '',
      aiJobFitScoreMax: '',
    };

    setFilters(emptyFilters);
    await fetchApplications();
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

  // Check if there are no applications at all (only after loading is complete)
  if (allAppIds.length === 0) {
    return (
      <div className='flex-1 p-6'>
        <div className='flex flex-col items-center justify-center h-64 text-center'>
          <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
            <svg
              className='w-12 h-12 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
              />
            </svg>
          </div>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            No Applications Yet
          </h3>
          <p className='text-gray-500 max-w-md'>
            This job posting hasn't received any applications yet. Applications
            will appear here once candidates start applying.
          </p>
        </div>
      </div>
    );
  }

  // Check if there are applications but filters result in no matches
  if (allAppIds.length > 0 && filteredAppIds.length === 0 && hasActiveFilters) {
    return (
      <div className='flex-1 p-6'>
        <div className='flex flex-col items-center justify-center h-64 text-center'>
          <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
            <svg
              className='w-12 h-12 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
          </div>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            No Matching Applications
          </h3>
          <p className='text-gray-500 max-w-md'>
            No applications match your current filters. Try adjusting your
            search criteria or clear the filters to see all applications.
          </p>
          <button
            onClick={() =>
              setFilters({
                name: '',
                email: '',
                phone: '',
                status: '',
                hasCV: null,
                hasCoverLetter: null,
                isViewed: null,
                hasRemark: null,
                experienceMin: '',
                experienceMax: '',
                education: '',
                gpaMin: '',
                gpaMax: '',
                technicalSkills: [],
                softSkills: [],
                industry: '',
                location: '',
                salaryExpectations: '',
                appliedFrom: '',
                appliedTo: '',
                questionaryScoreMin: '',
                questionaryScoreMax: '',
                aiJobFitScoreMin: '',
                aiJobFitScoreMax: '',
              })
            }
            className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
          >
            Clear Filters
          </button>
        </div>
      </div>
    );
  }

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

  function openBulkModal(
    action: 'move' | 'shortlist' | 'mail' | 'reject' | 'tag',
  ) {
    setBulkActionModal({ open: true, action });
    console.log('openBulkModal', bulkActionModal);
    setOpenActionMenu(null);
  }

  // Handle individual remark action
  const handleRemarkAction = (appId: string) => {
    setRemarkModal({ open: true, appId, remarkText: '' });
  };

  const handleTagAction = (appId: string) => {
    const application = applications[appId];
    if (application) {
      // Merge application's tags into availableTags
      const newTags = (application.tags || []).filter(
        (tag) => !availableTags.includes(tag),
      );
      if (newTags.length > 0) {
        setAvailableTags([...availableTags, ...newTags]);
      }
      setTagModal({ open: true, application });
    }
  };

  // Process bulk actions
  const handleBulkAction = async (action: string, data?: any) => {
    try {
      switch (action) {
        case 'shortlist':
          await updateBulkApplicationStatus('SELECTED');
          break;
        case 'reject':
          await updateBulkApplicationStatus('REJECTED');
          break;
        case 'move':
          // This would need a target column selection - for now, default to SELECTED
          await updateBulkApplicationStatus('SELECTED');
          break;
        case 'mail':
          // Handle bulk email sending
          await sendBulkEmail(data?.mailDraft);
          break;
        case 'tag':
          // Handle bulk tagging
          await addBulkTags(data?.selectedTags);
          break;
        default:
          throw new Error(`Unknown action: ${action}`);
      }

      showToast({
        type: 'success',
        message: `Successfully processed ${action} for ${selectedRows.length} application(s)`,
      });

      // Refresh applications after bulk action
      await fetchApplications();
      clearSelection();
    } catch (error) {
      console.error('Error processing bulk action:', error);
      showToast({
        type: 'error',
        message: `Failed to process ${action} action`,
      });
      throw error;
    }
  };

  // Update application status for multiple applications
  const updateBulkApplicationStatus = async (status: ApplicationStatus) => {
    const promises = selectedRows.map((appId) =>
      applicationService.changeApplicationStatus({
        id: appId,
        status,
      }),
    );

    await Promise.all(promises);
  };

  // Send bulk email (placeholder implementation)
  const sendBulkEmail = async (mailDraft: string) => {
    // TODO: Implement bulk email sending
    console.log('Sending bulk email:', mailDraft);
    // This would typically call an email service
  };

  // Add bulk tags (placeholder implementation)
  const addBulkTags = async (tags: string[]) => {
    // TODO: Implement bulk tagging
    console.log('Adding bulk tags:', tags);
    // This would typically update application metadata
  };

  // Handle individual remark submission
  const handleRemarkSubmit = async () => {
    if (!remarkModal.appId || !remarkModal.remarkText.trim()) return;

    try {
      await applicationService.updateApplicationRemark(
        remarkModal.appId,
        remarkModal.remarkText,
      );

      showToast({
        type: 'success',
        message: 'Remark added successfully',
      });

      setRemarkModal({ open: false, appId: null, remarkText: '' });
      await fetchApplications();
    } catch (error) {
      console.error('Error adding remark:', error);
      showToast({
        type: 'error',
        message: 'Failed to add remark',
      });
    }
  };

  // Handle individual tag submission
  const handleTagSave = async (appId: string, tags: string[]) => {
    try {
      const application = applications[appId];
      console.log('application', application);
      if (!application) {
        throw new Error('Application not found');
      }

      // Create a new object without the jobPost property
      const { jobPost, ...applicationWithoutJobPost } = application;
      const updatedApplication = {
        ...applicationWithoutJobPost,
        tags,
      };

      await applicationService.updateApplicationTags(updatedApplication as any);

      showToast({
        type: 'success',
        message: 'Tags updated successfully',
      });

      setTagModal({ open: false, application: null });
      await fetchApplications();
    } catch (error) {
      console.error('Error updating tags:', error);
      showToast({
        type: 'error',
        message: 'Failed to update tags',
      });
    }
  };

  // Helper to get status/column for an application
  function getAppStatus(appId: string) {
    const col = columns.find((c) => c.appIds.includes(appId));
    return col
      ? { id: col.id, title: col.title }
      : { id: 'all', title: 'All Applications' };
  }

  // --- UI ---
  return (
    <div className='flex-1'>
      {/* Header: Breadcrumb left, toggler/filter/sort right */}
      <div className='flex items-center justify-between mb-2'>
        <Breadcrumb job={job} onBack={onBack} />
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
            className='flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 rounded font-medium text-gray-700 hover:bg-blue-50 relative'
            title='Filter'
          >
            <FunnelIcon className='w-5 h-5' />
            {hasActiveFilters && (
              <span className='absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                {activeFilterCount}
              </span>
            )}
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
      {/* Filter Modal */}
      <FilterModal
        filters={filters}
        setFilters={setFilters}
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />
      {/* Sort Modal */}
      <SortModal
        sort={sort}
        setSort={setSort}
        sortOpen={sortOpen}
        setSortOpen={setSortOpen}
      />
      {/* Main Content: Board or List */}
      {view === 'board' ? (
        <BoardView
          columns={columns}
          applications={applications}
          filteredAppIds={filteredAppIds}
          onDragEnd={onDragEnd}
          setSelectedApplicationId={setSelectedApplicationId}
        />
      ) : (
        <>
          {selectedRows.length > 0 && (
            <BulkActionsBar
              selectedRows={selectedRows}
              clearSelection={clearSelection}
              openActionMenu={openActionMenu}
              setOpenActionMenu={setOpenActionMenu}
              setBulkActionModal={setBulkActionModal}
            />
          )}
          {bulkActionModal.open && (
            <BulkActionModal
              bulkActionModal={bulkActionModal}
              setBulkActionModal={setBulkActionModal}
              selectedRows={selectedRows}
              notifyByEmail={notifyByEmail}
              setNotifyByEmail={setNotifyByEmail}
              mailDraft={mailDraft}
              setMailDraft={setMailDraft}
              availableTags={availableTags}
              setAvailableTags={setAvailableTags}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              newTag={newTag}
              setNewTag={setNewTag}
              onConfirmAction={handleBulkAction}
            />
          )}
          <ListView
            applications={applications}
            filteredAppIds={filteredAppIds}
            selectedRows={selectedRows}
            toggleSelectRow={toggleSelectRow}
            allSelected={allSelected}
            isIndeterminate={isIndeterminate}
            toggleSelectAll={toggleSelectAll}
            clearSelection={clearSelection}
            setSelectedApplicationId={setSelectedApplicationId}
            openActionMenu={openActionMenu}
            setOpenActionMenu={setOpenActionMenu}
            onRemarkAction={handleRemarkAction}
            onTagAction={handleTagAction}
          />
        </>
      )}
      <ApplicationDetailModal
        open={!!selectedApplicationId}
        onClose={() => setSelectedApplicationId(null)}
        applicationId={selectedApplicationId}
        application={
          selectedApplicationId
            ? mapApplicationToDetail(applications[selectedApplicationId])
            : mockApplicationDetail
        }
      />
      {/* Remark Modal */}
      {remarkModal.open && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30'>
          <div className='bg-white rounded-lg shadow-lg p-6 min-w-[400px] relative'>
            <button
              type='button'
              onClick={() =>
                setRemarkModal({ open: false, appId: null, remarkText: '' })
              }
              className='absolute top-2 right-2 text-gray-400 hover:text-gray-600'
            >
              <XMarkIcon className='w-5 h-5' />
            </button>
            <h2 className='text-lg font-semibold mb-4'>Add Remark</h2>
            <div className='mb-4'>
              <label className='block text-sm font-medium mb-1'>Remark</label>
              <textarea
                className='border rounded px-3 py-2 w-full min-h-[120px]'
                value={remarkModal.remarkText}
                onChange={(e) =>
                  setRemarkModal((prev) => ({
                    ...prev,
                    remarkText: e.target.value,
                  }))
                }
                placeholder='Enter your remark here...'
              />
            </div>
            <div className='flex gap-2 mt-4'>
              <button
                className='flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium'
                onClick={handleRemarkSubmit}
                disabled={!remarkModal.remarkText.trim()}
              >
                Add Remark
              </button>
              <button
                className='flex-1 bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 font-medium'
                onClick={() =>
                  setRemarkModal({ open: false, appId: null, remarkText: '' })
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Tag Modal */}
      <TagModal
        isOpen={tagModal.open}
        onClose={() => setTagModal({ open: false, application: null })}
        application={tagModal.application}
        onSave={handleTagSave}
        availableTags={availableTags}
        setAvailableTags={setAvailableTags}
      />
    </div>
  );
}

const mockApplicationDetail: ApplicationDetail = {
  name: 'Esther Howard',
  role: 'Website Designer (UI/UX)',
  userId: 'mock-user-id',
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

// Helper to map Application to ApplicationDetail
function mapApplicationToDetail(app?: Application): ApplicationDetail {
  if (!app) {
    return mockApplicationDetail;
  }
  const user = app.userInfo;
  return {
    name: `${user.firstName} ${user.lastName}`,
    role: app.jobPost?.title || '',
    userId: app.userId || '',
    avatarUrl: user.profile?.path || undefined,
    biography: user.professionalSummery || '',
    coverLetter: app.coverLetter || '',
    socialLinks: [
      ...(user.linkedinUrl
        ? [{ type: 'linkedin', url: user.linkedinUrl }]
        : []),
      ...(user.portfolioUrl
        ? [{ type: 'portfolio', url: user.portfolioUrl }]
        : []),
      ...(user.telegramUserId
        ? [{ type: 'telegram', url: `https://t.me/${user.telegramUserId}` }]
        : []),
    ],
    dob: user.birthDate ? new Date(user.birthDate).toLocaleDateString() : '',
    nationality: '',
    maritalStatus: '',
    gender: user.gender || '',
    experience: user.yearOfExperience ? `${user.yearOfExperience} Years` : '',
    education: user.highestLevelOfEducation || '',
    resumeUrl: user.resume?.path || '',
    contact: {
      website: user.portfolioUrl || '',
      location: user.preferredJobLocation || '',
      address: '',
      phone: user.phone || '',
      phone2: '',
      email: user.email || '',
    },
  };
}
