import * as React from 'react';
import cn from 'classnames';

type BadgeVariant = 'default' | 'destructive' | 'outline';

export function Badge({
  children,
  className,
  variant = 'default',
}: React.PropsWithChildren<{ className?: string; variant?: BadgeVariant }>) {
  const base = 'inline-block px-2 py-0.5 rounded-full text-xs font-medium';
  let color = '';
  if (variant === 'destructive') color = 'bg-pink-100 text-pink-600';
  else if (variant === 'outline') color = 'border border-gray-200';
  else color = 'bg-gray-100 text-gray-700';
  return <span className={cn(base, color, className)}>{children}</span>;
}
