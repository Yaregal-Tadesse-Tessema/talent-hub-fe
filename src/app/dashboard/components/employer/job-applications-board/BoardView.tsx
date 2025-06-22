import React from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import SimpleBar from 'simplebar-react';
import { Column, Application } from '@/services/applicationService';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface BoardViewProps {
  columns: Column[];
  applications: Record<string, Application>;
  filteredAppIds: string[];
  onDragEnd: (result: DropResult) => void;
  setSelectedApplicationId: (id: string) => void;
}

const BoardView: React.FC<BoardViewProps> = ({
  columns,
  applications,
  filteredAppIds,
  onDragEnd,
  setSelectedApplicationId,
}) => {
  return (
    <div className='w-full h-[calc(100vh-200px)]'>
      <SimpleBar style={{ height: '100%' }} className='simplebar-horizontal'>
        <div className='flex gap-6 pb-4 min-w-max'>
          <DragDropContext onDragEnd={onDragEnd}>
            {columns.map((col) => (
              <Droppable droppableId={col.id} key={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`bg-white rounded-lg shadow p-4 min-w-[300px] w-[300px] flex-shrink-0 transition border ${
                      snapshot.isDraggingOver
                        ? 'bg-blue-50 border-blue-400'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className='flex items-center justify-between mb-4'>
                      <div className='font-semibold'>
                        {col.title}{' '}
                        <span className='text-gray-400'>
                          (
                          {
                            col.appIds.filter((appId) =>
                              filteredAppIds.includes(appId),
                            ).length
                          }
                          )
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
                                  className={`bg-gray-50 rounded-lg p-2 shadow-sm border border-gray-200 ${
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
                                      <div
                                        className='font-semibold flex items-center gap-2 min-w-0 max-w-full'
                                        style={{ width: '100%' }}
                                      >
                                        {/* Profile Image */}
                                        <span className='inline-block w-8 h-8 rounded-full overflow-hidden border border-gray-200 bg-gray-100'>
                                          <img
                                            src={
                                              app.userInfo?.profile?.path ||
                                              'https://ui-avatars.com/api/?name=' +
                                                encodeURIComponent(
                                                  `${app.userInfo?.firstName} ${app.userInfo?.lastName}`,
                                                ) +
                                                '&background=random'
                                            }
                                            alt={`${app.userInfo?.firstName} ${app.userInfo?.lastName}`}
                                            className='w-full h-full object-cover'
                                          />
                                        </span>
                                        <h3
                                          className='text-xl truncate max-w-[110px]'
                                          title={`${app?.userInfo?.firstName} ${app?.userInfo?.lastName}`}
                                        >
                                          {`${app?.userInfo?.firstName} ${app?.userInfo?.lastName}`}
                                        </h3>
                                      </div>
                                    </div>
                                  </div>
                                  <div className='flex items-center gap-2 pb-2'>
                                    {app.userInfo?.highestLevelOfEducation && (
                                      <span className='text-gray-500 text-xs'>
                                        {app.userInfo.highestLevelOfEducation ||
                                          'N/A'}
                                      </span>
                                    )}
                                    {app.userInfo?.profileHeadLine && (
                                      <>
                                        <span
                                          className='h-4 border-l border-gray-300 mx-1'
                                          aria-hidden='true'
                                        ></span>
                                        <span
                                          className='text-gray-500 text-xs truncate max-w-[100px]'
                                          title={app.userInfo?.profileHeadLine}
                                        >
                                          {app.userInfo?.profileHeadLine}
                                        </span>
                                      </>
                                    )}
                                    {app.userInfo?.yearOfExperience && (
                                      <>
                                        <span
                                          className='h-4 border-l border-gray-300 mx-1'
                                          aria-hidden='true'
                                        ></span>
                                        <span
                                          className='bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs font-medium truncate max-w-[60px]'
                                          title={`${app.userInfo?.yearOfExperience} years experience`}
                                        >
                                          {app.userInfo?.yearOfExperience} yrs
                                        </span>
                                      </>
                                    )}
                                  </div>
                                  {/* Skills Section */}
                                  {(app.userInfo?.technicalSkills ||
                                    app.userInfo?.softSkills) && (
                                    <div className='mb-2'>
                                      <div className='flex flex-wrap gap-1'>
                                        {app.userInfo?.technicalSkills
                                          ?.slice(0, 4)
                                          .map((skill, index) => (
                                            <span
                                              key={index}
                                              className='px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs'
                                            >
                                              {skill}
                                            </span>
                                          ))}
                                      </div>
                                      <div className='flex flex-wrap gap-1 pt-1'>
                                        {app.userInfo?.softSkills
                                          ?.slice(0, 3)
                                          .map((skill, index) => (
                                            <span
                                              key={index}
                                              className='px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs'
                                            >
                                              {skill}
                                            </span>
                                          ))}
                                      </div>
                                    </div>
                                  )}
                                  {/* Social Links and CV Download */}
                                  <div className='flex items-center justify-between mt-2 pt-2 border-t border-gray-100'>
                                    <div className='flex gap-2'>
                                      {app.userInfo?.linkedinUrl && (
                                        <a
                                          href={app.userInfo?.linkedinUrl}
                                          target='_blank'
                                          rel='noopener noreferrer'
                                          className='text-gray-500 hover:text-blue-600'
                                          onClick={(e) => e.stopPropagation()}
                                          title='LinkedIn'
                                        >
                                          <svg
                                            className='w-4 h-4'
                                            fill='currentColor'
                                            viewBox='0 0 24 24'
                                          >
                                            <path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' />
                                          </svg>
                                        </a>
                                      )}
                                      {app.userInfo?.portfolioUrl && (
                                        <a
                                          href={app.userInfo?.portfolioUrl}
                                          target='_blank'
                                          rel='noopener noreferrer'
                                          className='text-gray-500 hover:text-purple-600'
                                          onClick={(e) => e.stopPropagation()}
                                          title='Portfolio'
                                        >
                                          <svg
                                            className='w-4 h-4'
                                            fill='currentColor'
                                            viewBox='0 0 24 24'
                                          >
                                            <path d='M10 2h4a2 2 0 012 2v2h3a2 2 0 012 2v2H3V8a2 2 0 012-2h3V4a2 2 0 012-2zm0 4V4h4v2h-4zM3 12h18v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8z' />
                                          </svg>
                                        </a>
                                      )}
                                      {app.userInfo?.telegramUserId && (
                                        <a
                                          href={`https://t.me/${app.userInfo?.telegramUserId}`}
                                          target='_blank'
                                          rel='noopener noreferrer'
                                          className='text-gray-500 hover:text-blue-400'
                                          onClick={(e) => e.stopPropagation()}
                                          title='Telegram'
                                        >
                                          <svg
                                            className='w-4 h-4'
                                            fill='currentColor'
                                            viewBox='0 0 24 24'
                                          >
                                            <path d='M9.993 15.07l-.398 4.687c.571 0 .819-.245 1.122-.539l2.688-2.558 5.583 4.084c1.023.569 1.75.269 2.002-.949l3.626-17.043h-.001c.331-1.548-.552-2.152-1.571-1.79L.915 9.158C-.593 9.778-.576 10.63.626 10.99l5.195 1.636 12.037-7.58c.565-.36 1.08-.16.657.2L9.993 15.07z' />
                                          </svg>
                                        </a>
                                      )}
                                    </div>
                                    <div>
                                      <button
                                        className='text-gray-500 hover:text-blue-600'
                                        onClick={() => {
                                          setSelectedApplicationId(appId);
                                        }}
                                        title='View Application Details'
                                      >
                                        <svg
                                          xmlns='http://www.w3.org/2000/svg'
                                          fill='none'
                                          viewBox='0 0 24 24'
                                          strokeWidth={1.5}
                                          stroke='currentColor'
                                          className='w-4 h-4'
                                        >
                                          <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            d='M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z'
                                          />
                                          <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            d='M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z'
                                          />
                                        </svg>
                                      </button>
                                      {(app.cv || app.userInfo?.resume) && (
                                        <button
                                          className='text-gray-500 pl-2 hover:text-blue-600'
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const cvData =
                                              app.cv || app.userInfo?.resume;
                                            if (cvData && cvData.path) {
                                              window.open(
                                                cvData.path,
                                                '_blank',
                                              );
                                            }
                                          }}
                                          title='Download CV'
                                        >
                                          <ArrowDownTrayIcon className='w-4 h-4' />
                                        </button>
                                      )}
                                    </div>
                                  </div>
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
      </SimpleBar>
    </div>
  );
};

export default BoardView;
