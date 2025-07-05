import React from 'react';
import ExperienceForm from './ExperienceForm';
import AppModal from '@/components/ui/AppModal';
import { Experience } from '@/types/profile';

interface ExperienceModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (exp: Experience) => void;
  initial?: Partial<Experience>;
}

const ExperienceModal: React.FC<ExperienceModalProps> = ({
  open,
  onClose,
  onSave,
  initial,
}) => {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={initial ? 'Edit Experience' : 'Add Experience'}
    >
      <ExperienceForm
        initial={initial}
        onSave={(exp) => {
          onSave(exp);
          onClose();
        }}
        onCancel={onClose}
      />
    </AppModal>
  );
};

export default ExperienceModal;
