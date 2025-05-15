import * as React from 'react';
import cn from 'classnames';

export function Card({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn('bg-white rounded-xl shadow-sm', className)}>
      {children}
    </div>
  );
}
