import React from 'react';
import EducationForm from './EducationForm';
import { X } from 'lucide-react';
import { Education } from '@/types/profile';
import AppModal from '@/components/ui/AppModal';

interface EducationModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (edu: Education) => void;
  initial?: Partial<Education>;
}

const EducationModal: React.FC<EducationModalProps> = ({
  open,
  onClose,
  onSave,
  initial,
}) => {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={initial ? 'Edit Education' : 'Add Education'}
    >
      <EducationForm
        initial={initial}
        onSave={(edu) => {
          onSave(edu);
          onClose();
        }}
        onCancel={onClose}
      />
    </AppModal>
  );
};

export default EducationModal;
