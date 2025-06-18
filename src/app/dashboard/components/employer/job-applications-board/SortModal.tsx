import React from 'react';

interface SortModalProps {
  sort: 'newest' | 'oldest' | 'az' | 'za';
  setSort: (sort: 'newest' | 'oldest' | 'az' | 'za') => void;
  sortOpen: boolean;
  setSortOpen: (open: boolean) => void;
}

const SortModal: React.FC<SortModalProps> = () => {
  // TODO: Implement sort modal rendering
  return null;
};

export default SortModal;
