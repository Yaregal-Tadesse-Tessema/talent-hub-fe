'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import EmployerSelection from '@/components/EmployerSelection';
import { EmployerData } from '@/types/employer';

export default function EmployerSelectionPage() {
  const { user, selectEmployer } = useAuth();
  const [employers, setEmployers] = useState<EmployerData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Check if running on the client side before accessing localStorage
    if (typeof window !== 'undefined') {
      // Only show modal if user is logged in as employer and doesn't have a selected employer
      if (user?.role === 'employer' && !user.selectedEmployer) {
        // Fetch employers data from localStorage or API
        const storedEmployers = localStorage.getItem('employers');
        if (storedEmployers) {
          setEmployers(JSON.parse(storedEmployers));
          setIsModalOpen(true);
        }
      }
    }
  }, [user]);

  const handleEmployerSelect = async (employer: EmployerData) => {
    try {
      await selectEmployer(employer);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error selecting employer:', error);
      throw error; // Re-throw to let the component handle the loading state
    }
  };

  return (
    <EmployerSelection
      employers={employers}
      onSelect={handleEmployerSelect}
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    />
  );
}
