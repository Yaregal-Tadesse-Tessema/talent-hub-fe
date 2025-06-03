import { useEffect } from 'react';
import { EmployerData } from '@/types/employer';

export function useEmployerChange(
  onEmployerChange: (employer: EmployerData) => void,
) {
  useEffect(() => {
    const handleEmployerChange = (
      event: CustomEvent<{ employer: EmployerData }>,
    ) => {
      onEmployerChange(event.detail.employer);
    };

    // Add event listener
    window.addEventListener(
      'employerChanged',
      handleEmployerChange as EventListener,
    );

    // Cleanup
    return () => {
      window.removeEventListener(
        'employerChanged',
        handleEmployerChange as EventListener,
      );
    };
  }, [onEmployerChange]);
}
