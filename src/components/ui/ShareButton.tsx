import React, { useState, useRef } from 'react';
import { Button } from './button';
import {
  Share2,
  Linkedin,
  Facebook,
  Instagram,
  Copy as CopyIcon,
} from 'lucide-react';

export const ShareButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);
  const url = typeof window !== 'undefined' ? window.location.href : '';

  // Close the share menu if clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Delayed close on mouse leave
  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };
  const handleMouseEnter = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen(true);
  };

  // Share handlers
  const handleShare = (platform: string) => {
    let shareUrl = '';
    const encodedUrl = encodeURIComponent(url);
    switch (platform) {
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'instagram':
        // Instagram does not support direct web sharing, so open Instagram homepage
        shareUrl = `https://www.instagram.com/`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedUrl}`;
        break;
      default:
        break;
    }
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCopy = async () => {
    try {
      // Try the modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (successful) {
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        } else {
          console.error('Failed to copy to clipboard');
        }
      }
    } catch (e) {
      console.error('Error copying to clipboard:', e);
      // Try fallback method
      try {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (successful) {
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }
      } catch (fallbackError) {
        console.error('Fallback copy method also failed:', fallbackError);
      }
    }
  };

  return (
    <div
      ref={wrapperRef}
      className='relative flex items-center'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      tabIndex={0}
    >
      <Button
        variant='outline'
        size='sm'
        className='rounded-full border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        aria-label='Share'
        type='button'
      >
        <Share2 className='w-4 h-4' />
      </Button>
      {open && (
        <div className='absolute top-full left-1/2 -translate-x-1/2 mt-2 flex gap-1 z-50 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 pointer-events-auto min-w-max'>
          <Button
            variant='outline'
            size='sm'
            className='rounded-full text-blue-700 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-600 dark:hover:bg-blue-900/30'
            aria-label='Share on LinkedIn'
            type='button'
            onClick={() => handleShare('linkedin')}
          >
            <Linkedin className='w-4 h-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            className='rounded-full text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-600 dark:hover:bg-blue-900/30'
            aria-label='Share on Facebook'
            type='button'
            onClick={() => handleShare('facebook')}
          >
            <Facebook className='w-4 h-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            className='rounded-full text-pink-500 border-pink-200 hover:bg-pink-50 dark:text-pink-400 dark:border-pink-600 dark:hover:bg-pink-900/30'
            aria-label='Share on Instagram'
            type='button'
            onClick={() => handleShare('instagram')}
          >
            <Instagram className='w-4 h-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            className='rounded-full text-blue-400 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-600 dark:hover:bg-blue-900/30'
            aria-label='Share on Telegram'
            type='button'
            onClick={() => handleShare('telegram')}
          >
            {/* Inline SVG for Telegram */}
            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M9.993 15.07l-.398 4.687c.571 0 .819-.245 1.122-.539l2.688-2.558 5.583 4.084c1.023.569 1.75.269 2.002-.949l3.626-17.043h-.001c.331-1.548-.552-2.152-1.571-1.79L.915 9.158C-.593 9.778-.576 10.63.626 10.99l5.195 1.636 12.037-7.58c.565-.36 1.08-.16.657.2L9.993 15.07z' />
            </svg>
          </Button>
          <Button
            variant='outline'
            size='sm'
            className={`rounded-full text-gray-500 border-gray-200 hover:bg-gray-100 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 ${copied ? 'bg-green-100 text-green-600 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-600' : ''}`}
            aria-label='Copy link'
            type='button'
            onClick={handleCopy}
          >
            <CopyIcon className='w-4 h-4' />
          </Button>
        </div>
      )}
    </div>
  );
};
