import { Profile } from '@/app/cv-builder/page';
import { useState } from 'react';

interface AdditionalInfoStepProps {
  profile: Profile;
  onUpdate: (data: Partial<Profile>) => void;
}

export default function AdditionalInfoStep({
  profile,
  onUpdate,
}: AdditionalInfoStepProps) {
  const [activeTab, setActiveTab] = useState('certificates');

  const [newCertificate, setNewCertificate] = useState({
    name: '',
    issuer: '',
    date: '',
  });

  const [newPublication, setNewPublication] = useState({
    title: '',
    publisher: '',
    date: '',
    url: '',
  });

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    url: '',
  });

  const [newAward, setNewAward] = useState({
    title: '',
    issuer: '',
    date: '',
  });

  const [newInterest, setNewInterest] = useState('');

  const [newVolunteer, setNewVolunteer] = useState({
    organization: '',
    role: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const [newReference, setNewReference] = useState({
    name: '',
    position: '',
    company: '',
    email: '',
    phone: '',
  });

  const handleAddCertificate = () => {
    if (newCertificate.name && newCertificate.issuer) {
      onUpdate({
        certificates: [...profile.certificates, newCertificate],
      });
      setNewCertificate({ name: '', issuer: '', date: '' });
    }
  };

  const handleAddPublication = () => {
    if (newPublication.title && newPublication.publisher) {
      onUpdate({
        publications: [...profile.publications, newPublication],
      });
      setNewPublication({ title: '', publisher: '', date: '', url: '' });
    }
  };

  const handleAddProject = () => {
    if (newProject.name) {
      onUpdate({
        projects: [...profile.projects, newProject],
      });
      setNewProject({ name: '', description: '', url: '' });
    }
  };

  const handleAddAward = () => {
    if (newAward.title && newAward.issuer) {
      onUpdate({
        awards: [...profile.awards, newAward],
      });
      setNewAward({ title: '', issuer: '', date: '' });
    }
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !profile.interests.includes(newInterest.trim())) {
      onUpdate({
        interests: [...profile.interests, newInterest.trim()],
      });
      setNewInterest('');
    }
  };

  const handleAddVolunteer = () => {
    if (newVolunteer.organization && newVolunteer.role) {
      onUpdate({
        volunteer: [...profile.volunteer, newVolunteer],
      });
      setNewVolunteer({
        organization: '',
        role: '',
        startDate: '',
        endDate: '',
        description: '',
      });
    }
  };

  const handleAddReference = () => {
    if (newReference.name && newReference.position) {
      onUpdate({
        references: [...profile.references, newReference],
      });
      setNewReference({
        name: '',
        position: '',
        company: '',
        email: '',
        phone: '',
      });
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'certificates':
        return (
          <div className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <input
                type='text'
                value={newCertificate.name}
                onChange={(e) =>
                  setNewCertificate({ ...newCertificate, name: e.target.value })
                }
                placeholder='Certificate Name'
                className='rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              />
              <input
                type='text'
                value={newCertificate.issuer}
                onChange={(e) =>
                  setNewCertificate({
                    ...newCertificate,
                    issuer: e.target.value,
                  })
                }
                placeholder='Issuing Organization'
                className='rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              />
              <input
                type='month'
                value={newCertificate.date}
                onChange={(e) =>
                  setNewCertificate({ ...newCertificate, date: e.target.value })
                }
                className='rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              />
            </div>
            <button
              onClick={handleAddCertificate}
              className='w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700'
            >
              Add Certificate
            </button>
            <div className='space-y-2'>
              {profile.certificates.map((cert, index) => (
                <div key={index} className='bg-gray-50 p-3 rounded-md'>
                  <h4 className='font-medium'>{cert.name}</h4>
                  <p className='text-sm text-gray-600'>{cert.issuer}</p>
                  <p className='text-sm text-gray-500'>{cert.date}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'publications':
        return (
          <div className='space-y-4'>
            <div className='grid grid-cols-1 gap-4'>
              <input
                type='text'
                value={newPublication.title}
                onChange={(e) =>
                  setNewPublication({
                    ...newPublication,
                    title: e.target.value,
                  })
                }
                placeholder='Publication Title'
                className='rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              />
              <input
                type='text'
                value={newPublication.publisher}
                onChange={(e) =>
                  setNewPublication({
                    ...newPublication,
                    publisher: e.target.value,
                  })
                }
                placeholder='Publisher'
                className='rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              />
              <div className='grid grid-cols-2 gap-4'>
                <input
                  type='month'
                  value={newPublication.date}
                  onChange={(e) =>
                    setNewPublication({
                      ...newPublication,
                      date: e.target.value,
                    })
                  }
                  className='rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
                <input
                  type='url'
                  value={newPublication.url}
                  onChange={(e) =>
                    setNewPublication({
                      ...newPublication,
                      url: e.target.value,
                    })
                  }
                  placeholder='URL'
                  className='rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
              </div>
            </div>
            <button
              onClick={handleAddPublication}
              className='w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700'
            >
              Add Publication
            </button>
            <div className='space-y-2'>
              {profile.publications.map((pub, index) => (
                <div key={index} className='bg-gray-50 p-3 rounded-md'>
                  <h4 className='font-medium'>{pub.title}</h4>
                  <p className='text-sm text-gray-600'>{pub.publisher}</p>
                  <p className='text-sm text-gray-500'>{pub.date}</p>
                  {pub.url && (
                    <a
                      href={pub.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-sm text-blue-600 hover:text-blue-800'
                    >
                      View Publication
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className='space-y-4'>
            <div className='grid grid-cols-1 gap-4'>
              <input
                type='text'
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({ ...newProject, name: e.target.value })
                }
                placeholder='Project Name'
                className='rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              />
              <textarea
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
                placeholder='Project Description'
                rows={3}
                className='rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              />
              <input
                type='url'
                value={newProject.url}
                onChange={(e) =>
                  setNewProject({ ...newProject, url: e.target.value })
                }
                placeholder='Project URL'
                className='rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              />
            </div>
            <button
              onClick={handleAddProject}
              className='w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700'
            >
              Add Project
            </button>
            <div className='space-y-2'>
              {profile.projects.map((proj, index) => (
                <div key={index} className='bg-gray-50 p-3 rounded-md'>
                  <h4 className='font-medium'>{proj.name}</h4>
                  <p className='text-sm text-gray-600'>{proj.description}</p>
                  {proj.url && (
                    <a
                      href={proj.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-sm text-blue-600 hover:text-blue-800'
                    >
                      View Project
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'awards':
        return (
          <div className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <input
                type='text'
                value={newAward.title}
                onChange={(e) =>
                  setNewAward({ ...newAward, title: e.target.value })
                }
                placeholder='Award Title'
                className='rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              />
              <input
                type='text'
                value={newAward.issuer}
                onChange={(e) =>
                  setNewAward({ ...newAward, issuer: e.target.value })
                }
                placeholder='Issuing Organization'
                className='rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              />
              <input
                type='month'
                value={newAward.date}
                onChange={(e) =>
                  setNewAward({ ...newAward, date: e.target.value })
                }
                className='rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              />
            </div>
            <button
              onClick={handleAddAward}
              className='w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700'
            >
              Add Award
            </button>
            <div className='space-y-2'>
              {profile.awards.map((award, index) => (
                <div key={index} className='bg-gray-50 p-3 rounded-md'>
                  <h4 className='font-medium'>{award.title}</h4>
                  <p className='text-sm text-gray-600'>{award.issuer}</p>
                  <p className='text-sm text-gray-500'>{award.date}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'interests':
        return (
          <div className='space-y-4'>
            <div className='flex gap-2'>
              <input
                type='text'
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder='Add an interest'
                className='flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              />
              <button
                onClick={handleAddInterest}
                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
              >
                Add
              </button>
            </div>
            <div className='flex flex-wrap gap-2'>
              {profile.interests.map((interest, index) => (
                <div
                  key={index}
                  className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full'
                >
                  {interest}
                </div>
              ))}
            </div>
          </div>
        );

      case 'volunteer':
        return (
          <div className='space-y-4'>
            <div className='grid grid-cols-1 gap-4'>
              <input
                type='text'
                value={newVolunteer.organization}
                onChange={(e) =>
                  setNewVolunteer({
                    ...newVolunteer,
                    organization: e.target.value,
                  })
                }
                placeholder='Organization'
                className='rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              />
              <input
                type='text'
                value={newVolunteer.role}
                onChange={(e) =>
                  setNewVolunteer({ ...newVolunteer, role: e.target.value })
                }
                placeholder='Role'
                className='rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              />
              <div className='grid grid-cols-2 gap-4'>
                <input
                  type='month'
                  value={newVolunteer.startDate}
                  onChange={(e) =>
                    setNewVolunteer({
                      ...newVolunteer,
                      startDate: e.target.value,
                    })
                  }
                  placeholder='Start Date'
                  className='rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
                <input
                  type='month'
                  value={newVolunteer.endDate}
                  onChange={(e) =>
                    setNewVolunteer({
                      ...newVolunteer,
                      endDate: e.target.value,
                    })
                  }
                  placeholder='End Date'
                  className='rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
              </div>
              <textarea
                value={newVolunteer.description}
                onChange={(e) =>
                  setNewVolunteer({
                    ...newVolunteer,
                    description: e.target.value,
                  })
                }
                placeholder='Description'
                rows={3}
                className='rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              />
            </div>
            <button
              onClick={handleAddVolunteer}
              className='w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700'
            >
              Add Volunteer Experience
            </button>
            <div className='space-y-2'>
              {profile.volunteer.map((vol, index) => (
                <div key={index} className='bg-gray-50 p-3 rounded-md'>
                  <h4 className='font-medium'>{vol.role}</h4>
                  <p className='text-sm text-gray-600'>{vol.organization}</p>
                  <p className='text-sm text-gray-500'>
                    {vol.startDate} - {vol.endDate}
                  </p>
                  <p className='text-sm text-gray-700 mt-1'>
                    {vol.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'references':
        return (
          <div className='space-y-4'>
            <div className='grid grid-cols-1 gap-4'>
              <input
                type='text'
                value={newReference.name}
                onChange={(e) =>
                  setNewReference({ ...newReference, name: e.target.value })
                }
                placeholder='Reference Name'
                className='rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              />
              <input
                type='text'
                value={newReference.position}
                onChange={(e) =>
                  setNewReference({ ...newReference, position: e.target.value })
                }
                placeholder='Position'
                className='rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              />
              <input
                type='text'
                value={newReference.company}
                onChange={(e) =>
                  setNewReference({ ...newReference, company: e.target.value })
                }
                placeholder='Company'
                className='rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              />
              <input
                type='email'
                value={newReference.email}
                onChange={(e) =>
                  setNewReference({ ...newReference, email: e.target.value })
                }
                placeholder='Email'
                className='rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              />
              <input
                type='tel'
                value={newReference.phone}
                onChange={(e) =>
                  setNewReference({ ...newReference, phone: e.target.value })
                }
                placeholder='Phone'
                className='rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              />
            </div>
            <button
              onClick={handleAddReference}
              className='w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700'
            >
              Add Reference
            </button>
            <div className='space-y-2'>
              {profile.references.map((ref, index) => (
                <div key={index} className='bg-gray-50 p-3 rounded-md'>
                  <h4 className='font-medium'>{ref.name}</h4>
                  <p className='text-sm text-gray-600'>
                    {ref.position} at {ref.company}
                  </p>
                  <p className='text-sm text-gray-500'>{ref.email}</p>
                  <p className='text-sm text-gray-500'>{ref.phone}</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold text-gray-900'>
          Additional Information
        </h2>
        <p className='mt-1 text-sm text-gray-500'>
          Add any additional information that might strengthen your profile.
        </p>
      </div>

      {/* Tabs */}
      <div className='border-b border-gray-200'>
        <nav className='-mb-px flex space-x-8'>
          {[
            { id: 'certificates', label: 'Certificates' },
            { id: 'publications', label: 'Publications' },
            { id: 'projects', label: 'Projects' },
            { id: 'awards', label: 'Awards' },
            { id: 'interests', label: 'Interests' },
            { id: 'volunteer', label: 'Volunteer Work' },
            { id: 'references', label: 'References' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className='mt-6'>{renderTabContent()}</div>
    </div>
  );
}
