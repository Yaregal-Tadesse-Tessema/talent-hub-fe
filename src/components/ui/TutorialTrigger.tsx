'use client';

import { useEffect } from 'react';
import { useTutorialTrigger } from '@/hooks/useTutorialTrigger';

// This component doesn't render anything visible
// It just handles the tutorial triggering logic
export default function TutorialTrigger() {
  useTutorialTrigger();

  return null;
}
