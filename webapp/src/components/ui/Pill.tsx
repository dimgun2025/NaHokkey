import React from 'react';
import clsx from 'clsx';
import './Pill.css';

export interface PillProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Pill({ children, className, ...props }: PillProps) {
  return (
    <div className={clsx('pill-component', className)} {...props}>
      {children}
    </div>
  );
}
